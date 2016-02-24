import * as vscode from 'vscode';
import {getFeed} from './api';
import {FeedContentProvider} from './feedContentProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "code-techwiese-rss" is now active!'); 

	let disposable = vscode.commands.registerCommand('techwiese.show', cmdShow);
	context.subscriptions.push(disposable);
    
    disposable = vscode.workspace.registerTextDocumentContentProvider("techwiese", new FeedContentProvider());
	context.subscriptions.push(disposable);
    
	
}

async function cmdShow() {
    //let feeds = await getFeed("https://www.microsoft.com/germany/msdn/rss/aktuell.xml");
    
    //console.log(null);
    await vscode.commands.executeCommand("vscode.previewHtml", vscode.Uri.parse("techwiese://test"));
}