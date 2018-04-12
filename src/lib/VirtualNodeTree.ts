import { Parser } from './parsers/Parser';

export interface VNode {
  type: string,
  classList?: Array<string>;
  children?: Array<VNode>;
  innerText?: string;
}

function typeOf(x: any) {
  return Object.prototype.toString.call(x).replace(/^\[object\s(\w+)\]/, '$1');
}

export default abstract class VirtualNodeTree<AstRoot, T extends Parser<AstRoot>, Displayed> {
  constructor(public parser: T) { }

  public abstract display(code: string): Displayed;

  protected toVirtualNode(node: AstRoot): VNode {
    return {
      type: 'ul',
      classList: ['body'],
      children: [this.convertObject(node)]
    }
  }

  private convertObject(node: any, key?: string): VNode {
    const headers: Array<VNode> = [];
    if (key) {
      headers.push({
        type: 'span',
        classList: ['key'],
        children: [
          { type: 'span', classList: ['name'], innerText: key },
          { type: 'span', classList: ['colon'], innerText: ':' }
        ]
      });
    }
    const nodeName = this.parser.getNodeName(node);
    if (nodeName) {
      headers.push({
        type: 'span',
        classList: ['value'],
        children: [
          { type: 'span', classList: ['token-name'], innerText: nodeName }
        ]
      })
    }
    headers.push({ type: 'span', classList: ['prefix'], innerText: '{' })
    const bodyChildren = Object.keys(node).map((key) => {
      return this.convertProperty(node[key], key);
    });
    return {
      type: 'li',
      classList: ['togglable', 'open'],
      children: [
        { type: 'div', children: headers },
        {
          type: 'ul',
          classList: ['body'],
          children: bodyChildren
        },
        {
          type: 'div', children: [
            { type: 'span', classList: ['suffix'], innerText: '}' }]
        }
      ]
    }
  }
  private convertArray(node: any, key?: string): VNode {
    return {
      type: 'li',
      classList: ['togglable', 'open'],
      children: [
        {
          type: 'div',
          children: [
            {
              type: 'span',
              classList: ['key'],
              children: [
                { type: 'span', classList: ['name'], innerText: key },
                { type: 'span', classList: ['colon'], innerText: ':' }
              ]
            },
            { type: 'span', classList: ['prefix'], innerText: '[' },
          ]
        },
        {
          type: 'ul',
          classList: ['body'],
          children: node.map((item: VNode) => this.convertProperty(item))
        },
        {
          type: 'div', children: [
            { type: 'span', classList: ['suffix'], innerText: ']' }]
        }
      ]
    }
  }
  private convertPrimitive(node: any, key?: string): VNode {
    let innerText;
    switch (typeOf(node)) {
      case 'Null':
        innerText = 'null'
        break;
      case 'String':
        innerText = '"' + node + '"'
        break;
      default:
        innerText = node;
        break;
    }
    return {
      type: 'li',
      children: [
        {
          type: 'span',
          children: [
            { type: 'span', classList: ['name'], innerText: key },
            { type: 'span', classList: ['colon'], innerText: ':' },
          ]
        },
        {
          type: 'span',
          children: [
            {
              type: 'span',
              classList: ['literal'],
              innerText: innerText
            },
          ]
        }
      ]
    }
  }
  private convertProperty(node: any, key?: string): VNode {
    switch (typeOf(node)) {
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Null':
      case 'Undefined':
        return this.convertPrimitive(node, key);
      case 'Object':
        return this.convertObject(node, key);
      case 'Array':
        return this.convertArray(node, key);
      default:
        throw new Error('No such type');
    }
  }
}
