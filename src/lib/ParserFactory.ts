import { Parser } from './parsers/Parser';
import BabylonParser from './parsers/Babylon';

export type ParserType = 'babylon';

export default class ParserFactory {
  createParser(parserType: ParserType): Parser<any> {
    switch (parserType) {
      case 'babylon':
        return new BabylonParser();
      default:
        throw new Error(`Can not find parser "${parserType}"`);
    }
  }
}
