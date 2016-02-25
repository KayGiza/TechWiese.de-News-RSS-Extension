import * as vscode from "vscode";
import {Uri, Event} from "vscode";
import {Feed, getFeed} from "./api";
import * as fs from "fs";
import {join as joinp} from "path";

interface FeedService {
    address: string;
    lastUpdate: Date;
    loaded: Feed[];
}

interface FeedViewedDB {
    [name: string]: number;
}

export interface FeedSource {
    [name: string]: string;
}

export class FeedDocumentContentProvider implements vscode.TextDocumentContentProvider {
    
    private _soucres: { [name: string]: FeedService } = {};
    private _expire: number = 30*60*1000;
    private _onDidChange = new vscode.EventEmitter<Uri>();
    private _lastViewedFile: string;
    private _lastViewedDB: FeedViewedDB = {};
    
    public get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }
    
    public constructor(feedSource: FeedSource, expireMilliSeconds?:number) {
        if(expireMilliSeconds) 
            this._expire = expireMilliSeconds;
            
        for(let name in feedSource) {
            this._soucres[name] = {
                address: feedSource[name],
                lastUpdate: null,
                loaded: null
            };
        }
    }
    
    public provideTextDocumentContent(uri: Uri, token: vscode.CancellationToken): Promise<string> {
        let source = this._soucres[uri.authority];
        
        let feeds = source.loaded;
        if(feeds) {
            if((Date.now() - source.lastUpdate.valueOf()) > this._expire) {
                // expired
                source.lastUpdate = source.loaded = null;
            }else{
                let lastView = this._lastViewedDB[uri.authority]
                                || 0;
                this._lastViewedDB[uri.authority] = Date.now();
                return this.writeLastViewedDB()
                    .then(written => this.renderFeeds(feeds, written? lastView : null));
            }
        }
        
        // start loding feeds 
        let loading = Promise.resolve("<h1>Loading...</h1>");
        loading.then(() => getFeed(source.address)
            .then(feeds => {
                source.loaded = feeds;
                source.lastUpdate = new Date();
                this._onDidChange.fire(uri);
            }));
        return loading;
    }
    
    public renderFeeds(feeds: Feed[], lastView?:number): string {
        let source = "";
        for (let feed of feeds) {
            source += this.renderFeed(feed, lastView);
        }
        return source;
    }
    
    public renderFeed(feed: Feed, lastView?:number): string {
        let isNew = lastView == null? false : feed.pubdate.valueOf() > lastView;
        
        let title = `<h1><a target="_blank" href="${feed.link}">${feed.title}</a></h1>`;
        let subtitle = `<span style="font-size: 80%;">${feed.date.toLocaleString()} [${feed.categories.toString()}]</span>`
        let content = `<p>${feed.summary}<p>`;
        return `<table border="0">
                    <tr>
                        <td style="${isNew? "background-color: rgba(127, 186, 0, 0.6); " : ""}width: 2px;">
                        </td>
                        <td>
                            ${title + subtitle + content}
                        </td>
                    </tr>
                </table>`;
    }
    
    public register(ctx: vscode.ExtensionContext, scheme: string) {
        let disposable = vscode.workspace.registerTextDocumentContentProvider(scheme, this);
        ctx.subscriptions.push(disposable);
        
        this._lastViewedFile = joinp(ctx.extensionPath, "techwiese-lastview.json")
        this.readLastViewedDB();
    }
    
    public async writeLastViewedDB(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.writeFile(this._lastViewedFile, JSON.stringify(this._lastViewedDB, null, 2), (err) => {
                resolve(err == null);
            });
        });
    }
    
    public readLastViewedDB() {
        if(fs.existsSync(this._lastViewedFile))
            this._lastViewedDB = JSON.parse(fs.readFileSync(this._lastViewedFile, "utf8"));
    }
}