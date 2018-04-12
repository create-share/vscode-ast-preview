import { File } from 'babel-types';
import { parse } from 'babylon';
import { Parser } from './Parser';

export default class BabylonParser extends Parser<File> {
  public parse(code: string): File {
    return parse(code);
  }

  public getNodeName(node: any): string {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object':
        return `Token (${node.type.label})`;
    }
  }
}
