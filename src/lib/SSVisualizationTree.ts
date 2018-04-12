import { Parser } from './parsers/Parser';
import VirtualNodeTree, { VNode } from './VirtualNodeTree';

export default class SSVisualizationTree<AstRoot, T extends Parser<AstRoot>>
  extends VirtualNodeTree<AstRoot, T, string> {

  public display(code: string): string {
    const ast = this.parser.parse(code);
    const vnode = this.toVirtualNode(ast);
    return dfs(vnode, '');

    function dfs(node: VNode, html: string): string {
      const classAttr = node.classList ? ` class="${node.classList.join(' ')}" ` : '';
      const openTag = '<' + node.type + classAttr + '>';
      const closedTag = '</' + node.type + '>';

      html += openTag;
      if (typeof node.innerText !== 'undefined') {
        html += node.innerText;
      }
      if (node.children) {
        html = node.children.reduce((acc, child) => dfs(child, acc), html)
      }
      html += closedTag;

      return html;
    }
  }
}
