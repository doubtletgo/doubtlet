import nerdamer, { convertToLaTeX } from 'nerdamer-prime';
import { parseNumber, minusSymbol, addSymbol, abs } from './decimal';
import { simplifyLatex } from './general';
import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);
export function evalExpression(exp) {
  try {
    let val = '';
    if (!!exp && exp.indexOf('/') < 0) {
      val = math.evaluate(`${exp}`).toString();
      val = parseNumber(val, {}, 1);
      return decimalToFraction(val);
    } else {
      return math.simplify(`${exp}`)?.toString();
    }
  } catch (err) {
    console.log(err.message);
    return;
  }
}
function isPrime(num) {
  if (!num && num != '0') return;
  let number = parseInt(num);
  for (let i = 2; i < number; i++) {
    if (number % i == 0) return false;
  }
  return true;
}
export function lowestForm(num) {
  if (!num && num != '0') return;
  let number = parseInt(num);
  if (Math.sqrt(number)?.toString().indexOf('.') < 0) return Math.sqrt(number);
  else {
    for (let i = 2; i < number / 2; i++) {
      var rem = number / i ** 2;
      if (rem.toString().indexOf('.') < 0 && isPrime(rem.toString()))
        return `${i}\\sqrt{${rem}}`;
    }
  }
  return `\\sqrt{${num}}`;
}
function decimalToFraction(val) {
  val = val?.toString();
  if (!val && val != '0') return;
  if (checkDecimal(val)) {
    let values = fraction(
      +val.replace('.', ''),
      10 ** val.split('.')[1]?.length
    );
    return values.join('/');
  }
  return val;
}
function fraction(numR, denumR) {
  let max = abs(numR) > abs(denumR) ? numR : denumR;
  for (let i = abs(max); i >= 2; i--) {
    if (numR % i == 0 && denumR % i == 0) {
      numR = numR / i;
      denumR = denumR / i;

      return [numR, denumR];
    }
  }
  return [numR, denumR];
}
//To convert sqrt value in decimals
function convertToNormal(value) {
  try {
    if (!value && value != '0') return;
    value = value.toString();
    if (value.indexOf('sqrt') > 0) {
      let temp = value.replace('\\sqrt', '').replace(/[{}()]/g, '');
      return parseNumber(Math.sqrt(+temp), {}, 1);
    } else return value;
  } catch {
    return;
  }
}
//Convert all katex values of arr to simple values
export function katexArrToSimpleArr(arr) {
  let tempArr = arr?.map((itm) => {
    return itm.map((i) => decimalToKatexFraction(convertToNormal(i)));
  });
  return tempArr?.map((itm) =>
    itm.map((i) =>
      simplifyLatex(i?.replace('\\above{1pt}', '/'))
        .replace(/[(|)]/g, '')
        .replaceAll('\\', '')
    )
  );
}
//Convert all simple values of arr to katex values
export function simpleArrToKatexArr(arr) {
  return arr?.map((itm) => itm.map((i) => convertIntoLatex(i)));
}
//Create matrix by joining all cells and rows
function createMatrix(arr) {
  return arr?.map((itm) => itm.join(' & ')).join('\\\\ \\\\') || 0;
}
//print matrix in katex equation format
export function printMatrix(mat) {
  return `\\begin{bmatrix}` + createMatrix(mat) + `\\end{bmatrix}`;
}
export function printCurlyMatrix(mat) {
  return `\\begin{Bmatrix}` + createMatrix(mat) + `\\end{Bmatrix}`;
}
export function printDeterminant(mat) {
  return `\\begin{vmatrix}` + createMatrix(mat) + `\\end{vmatrix}`;
}
//conver single value to katex
export function valueToKatex(value = '') {
  if (!value && value != '0') return;
  value = value.toString();
  value = parseNumber(value).toString();
  return (
    '{' +
    value
      .replaceAll('sqrt', '\\sqrt')
      .replaceAll('(', '{')
      .replaceAll(')', '}')
      .replaceAll('/', '\\above{1pt}')
      .replace(/\s/g, '')
      .replaceAll('*', '') +
    '}'
  );
}
//print power
export function printPower(value, power) {
  return power == 1 ? value : `${value}^{${power}}`;
}
function checkDecimal(n) {
  var isDecimal = n.toString().indexOf('.') > 0;
  return isDecimal;
}
export function decimalToKatexFraction(val) {
  if (!val && val != '0') return;
  val = val.toString();
  if (checkDecimal(+val)) {
    return `\\frac{${val.replace('.', '')}}{${
      10 ** val.split('.')[1]?.length
    }}`;
  }
  return val;
}
//convert each cell value of matrix to possible decimal value
export function matrixInDecimals(mat) {
  try {
    mat = mat.map((itm) => itm.map((el) => convertFromLatex(el)));
    return mat?.map((itm) =>
      itm.map((i) => {
        return parseNumber(math.evaluate(`${i}`), {}, 3)?.toString();
      })
    );
  } catch {
    return;
  }
}
//Find cofactor matrix of a matrix
export function cofactorOfMatrix(arr) {
  try {
    return arr?.map((el, j) =>
      el.map((itm, i) => {
        let matrixAns =
          decimalToKatexFraction(
            parseNumber(determinant(coFactor(j, i, arr)), {}, 2)
          ) || 0;
        return math
          .simplify(
            `${
              i + j > 0 ? ((i + j) % 2 != 0 ? '-' : '') : ''
            }(${matrixAns?.toString()})`
          )
          .toString()
          .replace('/', '\\above{1pt}');
      })
    );
  } catch {
    return;
  }
}
//Find transpose of a matrix
export function transposeOfMatrix(arr) {
  try {
    return arr?.reduce(
      (prev, next) => next.map((el, i) => (prev[i] || []).concat(next[i])),
      []
    );
  } catch (error) {
    console.log(error.message);
    return [[0]];
  }
}
//Get cofactor in arr format
export function coFactor(rowNum, columNum, matrix) {
  if (![rowNum, columNum].every((i) => !isNaN(i) || i >= 0)) return [];
  let arr = [];
  let val = matrix?.[rowNum]?.[columNum];
  if (!val) return [];
  for (let i = 0; i < matrix.length; i++) {
    if (i == rowNum) continue;
    const row = matrix[i];
    const newRow = [];

    for (let j = 0; j < row.length; j++) {
      if (j == columNum) continue;
      newRow.push(row[j]);
    }
    arr.push(newRow);
  }
  return arr;
}
//multiply two matrices
export function multiplyMatrices(m1, m2) {
  try {
    m1 = katexArrToSimpleArr(m1);
    m2 = katexArrToSimpleArr(m2);
    if (m1?.[0]?.length !== m2?.length) {
      return [];
    }
    const product = [];
    for (let i = 0; i < m1.length; i++) {
      product.push([]);
      for (let j = 0; j < m2[0].length; j++) {
        product[i].push(0);
      }
    }
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        for (let k = 0; k < m1[0].length; k++) {
          product[i][j] = math
            .simplify(`${product[i][j]} +(${m1[i][k]}) * (${m2[k][j]})`)
            .toString();
        }
      }
    }
    return product;
  } catch {
    return;
  }
}
export function determenenantValue(arr) {
  try {
    let result = math.simplify(`${arr.join(' ')}`).toString();
    return '{' + result.replace('/', '\\above{1pt}') + '}';
  } catch {
    return;
  }
}
export function cofactorsOfARow(arr) {
  try {
    let row = arr[0];
    return row.map((itm, i) => {
      itm = decimalToKatexFraction(itm);
      let c = coFactor(0, i, arr);
      let d = determinant(c);
      let dtrmnt = simplifyLatex(decimalToKatexFraction(d));
      itm = simplifyLatex(decimalToKatexFraction(itm)).replace(/[()]/g, '');
      let str = `(${itm}) * (${dtrmnt})`;
      let itmValue = math.simplify(str).toString();

      let absValue = itmValue;
      if (absValue[0] == '-') absValue = absValue.replace('-', '');
      if (i != 0) itmValue = math.evaluate(`${itmValue}`).toString();
      absValue = parseNumber(absValue, {}, 2);
      return `${
        i == 0
          ? itmValue
          : i % 2 != 0
          ? `${minusSymbol(itmValue)} ${absValue}`
          : `${addSymbol(itmValue)}${absValue}`
      } `;
    });
  } catch {
    return [];
  }
}
export function determinant(m) {
  try {
    const n = m.length;
    m = katexArrToSimpleArr(m);
    if (n === 1) {
      return m[0][0];
    } else if (n === 2) {
      return math
        .simplify(`(${m[0][0]}) * (${m[1][1]}) - (${m[0][1]}) * (${m[1][0]})`)
        .toString();
    } else {
      let det = 0;

      for (let i = 0; i < n; i++) {
        let term = m[0][i];
        let nextArr = m.slice(1).map((c) => c.filter((_, j) => i !== j));
        term = math
          .simplify(
            `(${term}) *(${i % 2 == 0 ? 1 : -1}) * (${determinant(nextArr)})`
          )
          .toString();

        det = math.simplify(`(${det}) + (${term})`).toString();
      }
      return det;
    }
  } catch {
    return;
  }
}

export function katexSimplifiedValue(value, useFull = false) {
  let latexValue = simplifyLatex(value);
  if (!latexValue) return '';
  return latexValue
    ?.toString()
    .replaceAll('\\pi', '(22/7)')
    .replaceAll('\\infty', '1/0')
    .replaceAll('e', useFull ? '(2.71828)' : '(2.7)')
    .replace(/\\ln\(?(\w+)\)?/, 'log($1)')
    .replace(/\\log\(?(\w+)\)?/, 'log($1,10)')
    .replace(/\\pi/g, '3.14')
    .replace(/\\sin\(?(\w+)\)?/g, 'sin($1)')
    .replace(/\\cos\(?(\w+)\)?/, 'cos($1)')
    .replace(/\\tan\(?(\w+)\)?/g, 'tan($1)');
}

export const showVal = (a, b, val) => {
  if (!a && a != '0') return '';
  let tempA = simplifyLatex(a).replace(/[()]/g, '');
  if (tempA == b?.toString().replace(/[()\s]/g, '') || !b)
    return `${valueToKatex(a)}`;
  return `\\bold{${valueToKatex(tempA)} \\space ${
    val ?? 'or'
  } \\space ${valueToKatex(b)}}`;
};

export const removeSymbol = (val) => {
  if (!val && val != '0') return '';
  val = val?.toString();
  let temp = val?.replace(/[{}()]/g, '');
  if (temp?.toString()[0] == '-') return val.replace('-', '');
  return val;
};

export const withSign = (val, symbol) => {
  if (!val && val != '0') return '';
  let temp = val.toString().replace(/[{}()]/gi, '');
  return val ? `${temp == 1 ? '' : temp == -1 ? '-' : val}${symbol}` : val || 0;
};
export const evalInDecimals = (exp) => {
  try {
    let val = math.evaluate(`${exp}`).toString().replace(/\*/g, '');
    return parseNumber(val, {}, 2);
  } catch {
    return '';
  }
};

export const evalToDecimals = (exp, num) => {
  try {
    let val = math.evaluate(`${exp}`).toString().replace(/\*/g, '');
    return parseNumber(val, {}, num);
  } catch {
    return '';
  }
};

export const findRowEchelonForm = (mat) => {
  try {
    const matrix = JSON.parse(JSON.stringify(mat));
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;
    for (let row = 0; row < numRows; row++) {
      if (lead >= numCols) {
        return matrix;
      }

      let i = row; //0
      while (matrix[i][lead] == 0) {
        i++;
        if (i == numRows) {
          i = row;
          lead++;
          if (lead == numCols) {
            return matrix;
          }
        }
      }

      [matrix[i], matrix[row]] = [matrix[row], matrix[i]];

      let leadingCoefficient = matrix[row][lead];
      for (let k = 0; k < numRows; k++) {
        if (k !== row && k > row) {
          const factor = matrix[k][lead];
          for (let j = lead; j < numCols; j++) {
            let res = math
              .simplify(
                `${matrix[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            matrix[k][j] = math
              .simplify(`${matrix[k][j]} - (${res})`)
              .toString();
          }
        }
      }
      lead++;
    }
    return matrix;
  } catch {
    return [];
  }
};
export function makePivotElementsOne(mat) {
  let matrix = JSON.parse(JSON.stringify(mat));
  const numRows = matrix.length;
  try {
    const numCols = matrix[0].length;
    let row = 0;
    if (matrix[0][0] == '1') row = 1;
    for (row; row < numRows; row++) {
      let pivotFound = false;
      for (let col = 0; col < numCols; col++) {
        if (matrix[row][col] != 0) {
          if (matrix[row][col] == 1) pivotFound = true;
          if (!pivotFound) {
            const pivotValue = matrix[row][col];
            // Make the first non-zero element in the row the pivot

            for (let j = 0; j < numCols; j++) {
              matrix[row][j] = math
                .simplify(`${matrix[row][j]}/ (${pivotValue})`)
                .toString();
            }
            pivotFound = true;
          }
        }
      }
    }
    return matrix;
  } catch {
    console.log(err.message);
    return [];
  }
}

export function makeUpperTriangularZero(mat) {
  const matrix = JSON.parse(JSON.stringify(mat));
  const numRows = matrix.length;
  try {
    const numCols = matrix[0]?.length;
    for (let row = 0; row < numRows; row++) {
      for (let col = row + 1; col < numCols; col++) {
        if (matrix[row][col] != 0) {
          // Find the first non-zero element in column 'col' below the current element
          let nonZeroRow = -1;
          for (let i = row + 1; i < numRows; i++) {
            if (matrix[i][col] == 1) {
              let leftZero = true;
              for (let j = 0; j < col; j++) {
                if (matrix[i][j] != 0) {
                  leftZero = false;
                  break;
                }
              }
              if (leftZero) {
                nonZeroRow = i;
                break;
              }
            }
          }

          if (nonZeroRow != -1) {
            // Subtract a multiple of the row 'nonZeroRow' from the current row to make the element zero

            const lead = matrix[row][col];
            for (let j = col; j < numCols; j++) {
              let subtract = math.simplify(
                `${lead} * (${matrix[nonZeroRow][j]})`
              );
              matrix[row][j] = math
                .simplify(`${matrix[row][j]} -1*(${subtract})`)
                .toString();
            }
          }
        }
      }
    }
    return matrix;
  } catch {
    console.log(err.message);
    return [];
  }
}
export function convertFromLatex(value) {
  if (!value && value != 0) return '';
  value = value
    .toString()
    .replace(/\s+/g, '')
    .replace(/\\ln\\left\((.*?)\\right\)/g, 'log($1)')
    .replace(/\\ln\((.*?)\)/g, 'log($1)')
    .replace(/\\ln(\w+)/g, 'log($1)')
    .replace(/\\log\\left\((.*?)\\right\)/g, (_, match) =>
      match.includes(',') ? `log(${match})` : `log(${match},10)`
    )
    .replace(/\\log\((.*?)\)/g, (_, match) =>
      match.includes(',') ? `log(${match})` : `log(${match},10)`
    )
    .replace(/\\log(\w+)/g, 'log($1,10)')
    .replaceAll('\\times', '\\cdot')
    .replaceAll('\\text', '');
  try {
    return nerdamer.convertFromLaTeX(`${value}`).toString();
  } catch {
    return '';
  }
}

export function convertIntoLatex(value, shouldEval = true) {
  if (!value) return '';
  if (value == '|') return value;
  value = value.toString();
  const temp = ['/', 'sqrt', 'sin', 'cos', 'tan', 'log', 'e'];
  try {
    if (temp.every((itm) => value.indexOf(itm) < 0) && shouldEval) {
      return math.evaluate(`${value}`).toString();
    }
    return nerdamer(`${value}`)
      .toTeX()
      .replace(/\s+/g, '')
      .replaceAll('\\cdot', '\\cdot ')
      .replaceAll('w', '\\lambda');
  } catch (err) {
    try {
      console.log(err.message, value, value == '|');
      let vals = value.split('λ');
      return convertToLaTeX(vals[0]) + ' \\lambda ' + convertToLaTeX(vals[1]);
    } catch (error) {
      console.log(error, value);
      return '';
    }
  }
}
