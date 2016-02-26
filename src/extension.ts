import * as vscode from 'vscode';
import {getFeed} from './api';
import {FeedDocumentContentProvider, FeedSource} from './FeedDocumentContentProvider';
import {NewsAnnouncer} from './newsAnnouncer';


const feedList: FeedSource = {
    techwiese: "https://www.microsoft.com/germany/msdn/rss/aktuell.xml"
};

var feedProvider = new FeedDocumentContentProvider(feedList);
var newsAnnouncer = new NewsAnnouncer(feedProvider, "techwiese", "techwiese.show");

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "TechWiese.de-News-RSS" is now active!'); 

	let disposable = vscode.commands.registerCommand('techwiese.show', cmdShow);
	context.subscriptions.push(disposable);
    
    feedProvider.register(context, "feed");
    
    setTimeout(startStartusBarItem, 1000);
}

async function cmdShow() {
    await vscode.commands.executeCommand("vscode.previewHtml", vscode.Uri.parse("feed://techwiese/News & Infos für Entwickler – TechWiese.de – ein deutschsprachiges Online-Angebot für Entwickler von Microsoft"));
    await newsAnnouncer.update();
}

async function startStartusBarItem() {
    await newsAnnouncer.update();
}