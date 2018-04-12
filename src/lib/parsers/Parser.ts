export abstract class Parser<AstRoot> {
  public abstract parse(code: string): AstRoot;

  public getNodeName(node: any): string {
    return node.type;
  }
}
