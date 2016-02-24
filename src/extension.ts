import * as vscode from 'vscode';
//import {getFeed} from './api';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "code-techwiese-rss" is now active!'); 

	var disposable = vscode.commands.registerCommand('techwiese.show', cmdShow);
	
	context.subscriptions.push(disposable);
}

async function cmdShow() {
    //let feed = await getFeed("https://www.microsoft.com/germany/msdn/rss/aktuell.xml");
    
    console.log(null);
}