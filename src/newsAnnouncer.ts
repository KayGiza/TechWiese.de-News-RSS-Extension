import * as vscode from "vscode";
import {FeedDocumentContentProvider} from "./feedDocumentContentProvider";


const DefaultText = `Developer News von TechWiese.de`;
export class NewsAnnouncer {
    private _sbItem: vscode.StatusBarItem = null;

    public constructor(
            private _feedProvider: FeedDocumentContentProvider,
            private _feedName: string,
            cmd: string
        ) {
        this._sbItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this._sbItem.tooltip = `Open TechWiese News & Infos`;
        this._sbItem.command = cmd;
        this._sbItem.text = DefaultText;
        this._sbItem.show();
    }

    public async update() {
        let n = await this._feedProvider.getNewFeedItems(this._feedName);

        let text = DefaultText;
        if (n > 0) {
            text = `${n} ` + text;
        }
        this._sbItem.text = text;
        this._sbItem.show();
    }
}