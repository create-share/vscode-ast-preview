'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import PreviewDocumentProvider from './lib/PreviewDocumentProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-ast-preview" is now active!');

  const previewUri = vscode.Uri.parse('astpreview://ast-preview');

  const provider = new PreviewDocumentProvider(context);
  const registration = vscode.workspace.registerTextDocumentContentProvider('astpreview', provider);

  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    if (e.document === vscode.window.activeTextEditor.document) {
      provider.update(previewUri);
    }
  });

  vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
    if (e.textEditor === vscode.window.activeTextEditor) {
      provider.update(previewUri);
    }
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('astpreview.extension.preview', () => {
    // The code you place here will be executed every time your command is executed
    return vscode.commands.executeCommand(
      'vscode.previewHtml',
      previewUri,
      vscode.ViewColumn.Two,
      'Ast Preview'
    ).then((success) => { }, (reason) => {
      vscode.window.showErrorMessage(reason);
    });
  });

  context.subscriptions.push(disposable, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
