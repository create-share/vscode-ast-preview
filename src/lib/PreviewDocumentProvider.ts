import * as vscode from 'vscode';
import {
  TextDocumentContentProvider,
  ExtensionContext,
  EventEmitter,
  Uri,
  CancellationToken
} from 'vscode';
import { readFileSync } from 'fs';
import ParserFactory, { ParserType } from './ParserFactory';
import SSVisualizationTree from './SSVisualizationTree';

export default class PreviewDocumentProvider implements TextDocumentContentProvider {
  private parserFactory: ParserFactory = new ParserFactory();

  constructor(private context: ExtensionContext) { }

  private _onDidChange = new EventEmitter<Uri>();

  get onDidChange() {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }

  public provideTextDocumentContent(uri: Uri, token: CancellationToken): vscode.ProviderResult<string> {
    return this.displayHtml();
  }

  private displayHtml(): vscode.ProviderResult<string> {
    const editor = vscode.window.activeTextEditor;
    if (editor.document.languageId === 'javascript') {
      return this.createVisualizationTreeHtml(editor.document.getText());
    }
    return vscode.window.showErrorMessage('Only support js');
  }

  private createVisualizationTreeHtml(text: string): string {
    let body;
    try {
      const config = vscode.workspace.getConfiguration('astpreview.extension');
      const parserType = config.get<ParserType>('parser');
      const parser = this.parserFactory.createParser(parserType);
      const vtree = new SSVisualizationTree(parser);
      body = `<div class="tree-visualization">${vtree.display(text)}</div>`;
    } catch (error) {
      body = `<div class="error-message">${error.message}</div>`;
    }
    const style = readFileSync(this.getAbsolutePath('assets/style.css'));
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${style}</style>
      </head>
      <body>
        ${body}
      </body>
      </html>`;
    return html;
  }

  private getAbsolutePath(file: string): string {
    return this.context.asAbsolutePath(file);
  }
}
