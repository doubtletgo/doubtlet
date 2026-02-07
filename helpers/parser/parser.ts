import { convertFromLaTeX } from 'nerdamer-prime';
import { convertFromLatex, convertIntoLatex } from '../matrixHelper';
import Algebrite from 'algebrite';

class Parser {
  _expression: string;
  _parsed: string;

  constructor(expression: string) {
    this._expression = expression;
    try {
      this._parsed = String(convertFromLaTeX(expression));
    } catch (error) {
      try {
        this._parsed = convertFromLatex(expression);
      } catch (error) {
        console.log(error, 'Error while parsing expression');
      }
    }
  }

  toTex() {
    return this._parsed;
  }

  toAdvanceTex() {
    return convertIntoLatex(this._expression);
  }

  toParsed() {
    return this._parsed;
  }

  toSimplified() {
    try {
      return Algebrite.expand(this._parsed).toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}

export default Parser;
