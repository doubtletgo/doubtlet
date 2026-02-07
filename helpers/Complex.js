import nerdamer from 'nerdamer';
import { addSymbol } from './decimal';
import { convertIntoLatex, evalInDecimals, removeSymbol } from './matrixHelper';

import algebrite from 'algebrite';

class Complex {
  complex;
  real;
  imaginary;
  constructor(real = '', imaginary = '') {
    this.real = real;
    this.imaginary = imaginary;
    this.complex = `${real}${addSymbol(
      evalInDecimals(imaginary)
    )}${removeSymbol(imaginary)}i`;
  }
  toString() {
    return this.complex;
  }
  toLatex() {
    return convertIntoLatex(this.complex);
  }

  toPloar() {
    return nerdamer(`polarform(${this.complex})`).toString();
  }
  add(z2) {
    try {
      if (z2 instanceof Complex) {
        let r = algebrite.simplify(`${this.real}+(${z2.real})`).toString();
        let i = algebrite
          .simplify(`${this.imaginary}+(${z2.imaginary})`)
          .toString();
        return new Complex(r, i);
      } else {
        throw "Can't add to this number";
      }
    } catch {
      return new Complex('', '');
    }
  }
  subtract(z2) {
    try {
      if (z2 instanceof Complex) {
        let r = algebrite.simplify(`${this.real}-${z2.real})`).toString();
        let i = algebrite
          .simplify(`${this.imaginary}-(${z2.imaginary})`)
          .toString();
        return new Complex(r, i);
      } else {
        throw "Can't add to this number";
      }
    } catch {
      return new Complex('', '');
    }
  }
}

export default Complex;
