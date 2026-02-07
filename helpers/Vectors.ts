import { convertIntoLatex, printMatrix } from './matrixHelper';

import Algebrite from 'algebrite';

const evaluate = (value = '') => {
  try {
    return Algebrite.simplify(`${value}`).toString().replaceAll('...', '');
  } catch {
    return '0';
  }
};
class Vector {
  _components: string[];
  constructor(components: string[] = []) {
    this._components = components;
  }

  display() {
    return `<${this._components
      .map((itm) => convertIntoLatex(itm).replaceAll('\\cdot', ''))
      .join(', ')}>`;
  }

  magnitude() {
    const squaredSum = this._components
      .map((itm) => evaluate(`(${itm})^2`))
      .reduce((a, b) => evaluate(`${a}+(${b})`));
    return evaluate(`(${squaredSum})^(1/2)`);
  }

  unitVector() {
    const mag = this.magnitude();
    return new Vector(
      this._components.map((itm) => evaluate(`${itm}/(${mag})`))
    );
  }

  add(otherVector: Vector) {
    if (otherVector instanceof Vector) {
      const arr = otherVector._components.map((_, i) =>
        evaluate(`${_} + (${this._components[i]})`)
      );
      return new Vector(arr);
    }
  }

  subtract(otherVector: Vector) {
    if (otherVector instanceof Vector) {
      const arr = otherVector._components.map((_, i) =>
        evaluate(`(${this._components[i]}) - (${_})`)
      );
      return new Vector(arr);
    }
  }
  dotProduct(otherVector: Vector) {
    if (otherVector instanceof Vector) {
      return this._components
        .map((itm, i) => evaluate(`(${itm}) * (${otherVector._components[i]})`))
        .reduce((a, b) => evaluate(`(${a}) + (${b})`));
    }
  }

  crossProduct(otherVector: Vector) {
    if (otherVector instanceof Vector) {
      // Assuming 3D vectors for cross product
      if (
        this._components.length !== 3 ||
        otherVector._components.length !== 3
      ) {
        throw new Error('Cross product is defined for 3D vectors only.');
      }

      const [i, j, k] = this._components;
      const [x, y, z] = otherVector._components;

      const resultComponents = [
        evaluate(`(${j}) * (${z}) - (${k}) * (${y})`),
        evaluate(`(${k}) * (${x}) - (${i}) * (${z})`),
        evaluate(`(${i}) * (${y}) - (${j}) * (${x})`),
      ];

      return new Vector(resultComponents);
    }
  }

  projection(otherVector: Vector) {
    if (otherVector instanceof Vector) {
      const dotProduct = this.dotProduct(otherVector);
      const magnitude = otherVector.magnitude();
      const magnitudeSquared = evaluate(`(${magnitude})^ 2`);

      const scaleFactor = evaluate(`(${dotProduct}) / (${magnitudeSquared})`);

      const arr = otherVector._components.map((itm) =>
        evaluate(`(${scaleFactor}) * (${itm})`)
      );

      return new Vector(arr);
    }
  }
  scalarMultiplication(scalar: Vector) {
    const arr = this._components.map((itm) => evaluate(`(${itm})*(${scalar})`));
    return new Vector(arr);
  }

  toArray() {
    return printMatrix(this._components.map((itm) => [convertIntoLatex(itm)]));
  }
}

export default Vector;
