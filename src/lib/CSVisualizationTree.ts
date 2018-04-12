// Render tree by client side for further feature

import { Parser } from './parsers/Parser';
import VirtualNodeTree, { VNode } from './VirtualNodeTree';

export default class CSVisualizationTree<AstRoot, T extends Parser<AstRoot>>
  extends VirtualNodeTree<AstRoot, T, HTMLElement> {

  constructor(parser: T, public container: HTMLElement) {
    super(parser);
  }

  public display(code: string): HTMLElement {
    this.container.innerHTML = '';
    const that = this;
    const ast = this.parser.parse(code);
    const vnode = this.toVirtualNode(ast);
    return dfs(vnode, this.container);

    function dfs(node: VNode, parentEl: HTMLElement) {
      const el = that.createElement(node);
      parentEl.appendChild(el);
      if (node.children) {
        node.children.forEach((child) => {
          dfs(child, el);
        });
      }
      return el;
    }
  }

  private createElement(node: VNode): HTMLElement {
    const el = document.createElement(node.type)
    if (typeof node.innerText !== 'undefined') {
      el.appendChild(document.createTextNode(node.innerText));
    }
    if (node.classList) {
      node.classList.forEach(className => {
        el.classList.add(className);
      })
    }
    return el
  }
}
