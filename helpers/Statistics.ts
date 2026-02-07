import { isInteger } from 'mathjs';
import { evalExpression, evalToDecimals } from './matrixHelper';

class Statistics {
  _values = [];
  _sorted = [];

  constructor(values: string[]) {
    this._values = values;
    this._sorted = this.sort(values);
  }

  private sort(vals: string[]) {
    return vals.toSorted((a, b) => evalToDecimals(a) - evalToDecimals(b));
  }

  maximum() {
    return this._sorted[this._sorted.length - 1];
  }
  minimum() {
    return this._sorted[0];
  }

  median() {
    const count = this._values.length;
    const isEven = count % 2 == 0;
    const n = isEven ? count / 2 : (count + 1) / 2;
    const nth = this._sorted[n - 1];
    if (!isEven) {
      return nth;
    }
    const next = this._sorted[n];
    return evalToDecimals(`(${nth}+(${next}))/2`);
  }

  mode() {
    const count: Record<string, number> = {};

    const newVals = this._sorted.map(evalToDecimals);
    for (let i = 0; i < newVals.length; i++) {
      const val = newVals[i];
      const c = count[val];
      if (count[val]) {
        count[val] = c + 1;
      } else {
        count[val] = 1;
      }
    }

    const maxCount = Math.max(...Object.values(count));
    const mode = Object.keys(count).filter((key) => count[key] === maxCount);
    return mode;
  }

  lowerQuartile() {
    return this.percentile(25);
  }

  upperQuartile() {
    return this.percentile(75);
  }

  private percentile(p: number) {
    const pIn2N = evalExpression(`(${p}/100)*(${this._values.length})`);
    const pValue = evalToDecimals(pIn2N);
    const roundedP = Math.ceil(pValue);
    const isPInteger = isInteger(+pValue);
    if (!isPInteger) {
      return this._sorted[roundedP - 1];
    }
    const num = this._sorted[roundedP - 1];
    const next = this._sorted[roundedP];
    return evalToDecimals(`(${num}+(${next}))/2`);
  }

  interQuartile() {
    return evalExpression(
      `${this.upperQuartile()} - (${this.lowerQuartile()})`
    );
  }

  range() {
    let max = this.maximum();
    let min = this.minimum();
    return evalExpression(`${max} - (${min})`);
  }
  calculateMean = (values: string[]) => {
    const nums = values.map(Number); // Convert string values to numbers
    const sum = nums.reduce((acc, num) => acc + num, 0); // Sum of all numbers
    return sum / nums.length; // Mean = Sum / Count
  };
}

export default Statistics;
