import * as vscode from "vscode";

export class FeedContentProvider implements vscode.TextDocumentContentProvider {
    
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
        return "<h1>test</h1><button type='button' value='test'/>";
    }
}