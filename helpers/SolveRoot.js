import { valueToKatex } from './matrixHelper';

function removeBracks(val, brack) {
  if (!val) return;
  val = val.toString();
  if (brack == '(' || brack == ')') return val.replace(/[(|)]/g, '');
  else if (brack == '{' || brack == '}') return val.replace(/[{|}]/g, '');
  return val.replace(/[\{\}\(\)]/g, '');
}

function isRoot(val) {
  if (!val) return;
  val = val.toString();
  return val.indexOf('\\sqrt') >= 0;
}

function valueInRoot(val) {
  if (!val) return;
  val = val.toString();
  if (isRoot(val)) {
    let match = val.match(/\\sqrt{?(\d+)}?/);
    if (!!match) return removeBracks(match[1]);
    return '1';
  }
  return removeBracks(val);
}

function getCoffecient(val) {
  if (!val) return;
  val = val.toString();
  let regex = /(\d+?)\\sqrt{?(\d+)}?/;
  let match = val.match(regex);
  if (match) return removeBracks(match[1]);
  return 1;
}

function splitValues(val) {
  if (!val) return;
  val = val.toString().replaceAll('(', '{').replaceAll(')', '}');
  let len = val.split('\\above{1pt}');
  if (len.length > 1) return len;
  else return [val, '1'];
}

function checkDecimal(n) {
  var isDecimal = n?.toString().indexOf('.') > 0;
  return isDecimal;
}
function decimalToFraction(val) {
  if (!val) return;
  val = val.toString();
  if (checkDecimal(val)) {
    val = val.slice(0, val.indexOf('.') + 2);
    let num1 = Number(val?.replace('.', ''));
    let num2 = 10 ** val.split('.')[1].length;
    [num1, num2] = fraction(num1, num2);
    return `{${num1}}\\above{1pt}{${num2}}`;
  }
  return val.toString();
}
function KatexObj(val) {
  if (!val) return {};
  let vals = splitValues(val);
  let isMinus = isNegative(vals[0]) ^ isNegative(vals[1]);
  vals = vals.map((itm) => itm.replace('-', ''));
  let numR = valueInRoot(vals[0]) || 1;
  let denumR = valueInRoot(vals[1]) || 1;
  let isNumRoot = isRoot(vals[0]);
  let isDenumRoot = isRoot(vals[1]);
  let numCfcnt = getCoffecient(vals[0]) || 1;
  let denumCfcnt = getCoffecient(vals[1]) || 1;
  return {
    numR,
    numCfcnt,
    denumR,
    denumCfcnt,
    isNumRoot,
    isDenumRoot,
    isMinus,
  };
}

function isNegative(val) {
  if (!val) return;
  val = val.toString();
  return val.indexOf('-') >= 0;
}

function multiplyKatex(val1, val2, divide = false) {
  if (!val1 || !val2) return;
  let obj1 = KatexObj(val1);
  let obj2 = KatexObj(val2);
  if (!obj1 || !obj2) return;
  if (divide) {
    const temp = { ...obj2 };
    obj2.numR = temp.denumR;
    obj2.denumCfcnt = temp.numCfcnt;
    obj2.denumR = temp.numR;
    obj2.numCfcnt = temp.denumCfcnt;
    obj2.isDenumRoot = temp.isNumRoot;
    obj2.isNumRoot = temp.isDenumRoot;
  }

  let result = { ...obj1 };
  if (!obj1.isNumRoot && !obj2.isNumRoot) {
    result.numCfcnt *= obj2.numR * result.numR * obj2.numCfcnt;
    result.numR = 1;
  } else if (obj1.isNumRoot && obj2.isNumRoot) {
    result.numR *= obj2.numR;
  } else if (obj1.isNumRoot && !obj2.isNumRoot) {
    result.numCfcnt *= obj2.numR;
  } else if (!obj1.isNumRoot && obj2.isNumRoot) {
    result.numCfcnt *= result.numR * obj2.numCfcnt;
    result.numR = obj2.numR;
    result.isNumRoot = true;
  }

  if (obj2.numCfcnt < 0) obj1.numCfcnt *= obj2.numCfcnt;

  if (!obj1.isDenumRoot && !obj2.isDenumRoot) {
    result.denumCfcnt *= obj2.denumR * result.denumR * obj2.denumCfcnt;
    result.denumR = 1;
  } else if (obj1.isDenumRoot && obj2.isDenumRoot) {
    result.denumR *= obj2.denumR;
  } else if (obj1.isDenumRoot && !obj2.isDenumRoot) {
    result.denumCfcnt *= obj2.denumR;
  } else if (!obj1.isDenumRoot && obj2.isDenumRoot) {
    result.denumCfcnt *= result.denumR * obj2.denumCfcnt;
    result.denumR = obj2.denumR;
    result.isDenumRoot = true;
  }
  result.isMinus = result.isMinus ^ obj2.isMinus;
  return result;
}

export function convertToKatex(val1, val2, divide = false) {
  if ((val1 != 0 && !val1) || (val2 != 0 && !val2)) return;
  if (divide) {
    if (val2 == 0) return `${val1}\\above{1pt}0`;
    else if (val1 == 0) return 0;
  } else {
    if (val1 == 0 || val2 == 0) return 0;
  }
  if (checkDecimal(val1)) {
    val1 = decimalToFraction(val1);
  }
  if (checkDecimal(val2)) {
    val2 = decimalToFraction(val2);
  }
  let toConvert = multiplyKatex(val1, val2, divide);
  if (!toConvert || typeof toConvert != 'object') return;

  let { numCfcnt, denumCfcnt, numR, denumR, isNumRoot, isDenumRoot, isMinus } =
    toConvert;

  if (isNumRoot) {
    if (Math.sqrt(numR).toString().indexOf('.') < 0) {
      numCfcnt *= Math.sqrt(numR);
      numR = 1;
      isNumRoot = false;
    } else {
      let values = getRoot(numR);
      numR = values[1];
      numCfcnt *= values[0];
    }
  }

  if (isDenumRoot) {
    if (Math.sqrt(denumR).toString().indexOf('.') < 0) {
      denumCfcnt *= Math.sqrt(denumR);
      denumR = 1;
      isDenumRoot = false;
    } else {
      let values = getRoot(denumR);
      denumR = values[1];
      denumCfcnt *= values[0];
    }
  }

  if (!isNumRoot && isDenumRoot) {
    if (numCfcnt % denumR == 0) {
      numCfcnt = numCfcnt / denumR;
      numR = denumR;
      denumR = 1;
      isNumRoot = true;
      isDenumRoot = false;
    }
  }
  [numCfcnt, denumCfcnt] = fraction(numCfcnt, denumCfcnt);

  if (isNumRoot && isDenumRoot) {
    [numR, denumR] = fraction(numR, denumR);
  }
  let numerator =
    numCfcnt == 1 && numR == 1
      ? `${isMinus ? '-' : ''}1`
      : `${isMinus ? '-' : ''}${numCfcnt == 1 ? '' : numCfcnt}${
          numR != 1 ? (isNumRoot ? `\\sqrt({${numR}})` : numR) : ''
        }`;
  let denomerator = `${denumCfcnt == 1 ? '' : denumCfcnt}${
    denumR != 1 ? (isDenumRoot ? `\\sqrt({${denumR}})` : denumR) : ''
  }`;
  let final = `{${numerator}}${
    denumR == 1 && denumCfcnt == 1 ? '' : `\\above{1pt}{${denomerator}}`
  }`;

  return final;
}

export function fraction(numR, denumR) {
  if (!numR || !denumR) return [];
  let max = Math.abs(numR) > Math.abs(denumR) ? numR : denumR;
  for (let i = Math.abs(max); i >= 2; i--) {
    if (numR % i == 0 && denumR % i == 0) {
      numR = numR / i;
      denumR = denumR / i;

      return [numR, denumR];
    }
  }
  return [numR, denumR];
}

function getRoot(num) {
  if (!num) return;
  if (Math.sqrt(num)?.toString().indexOf('.') >= 0)
    for (let i = 2; i < num / 2; i++) {
      var rem = num / i ** 2;
      if (rem.toString().indexOf('.') < 0 && isPrime(rem)) return [i, rem];
    }
  return [1, num];
}
function isPrime(num) {
  if (!num) return;
  for (let i = 2; i < num; i++) {
    if (num % i == 0) return false;
  }
  return true;
}

export function convertToLowestRootForm(num) {
  if (!num) return;
  if (Math.sqrt(num)?.toString().indexOf('.') < 0) return Math.sqrt(num);
  else {
    for (let i = 2; i < num / 2; i++) {
      var rem = num / i ** 2;
      if (rem.toString().indexOf('.') < 0 && isPrime(rem))
        return `${i}\\sqrt${rem}`;
    }
  }
  return `\\sqrt${num}`;
}
export const solveWithLeastRoots = (
  value = '',
  upRoot = true,
  downRoot = true
) => {
  const [num, denum = 1] = value.split('/') || [value, 1];
  if (!upRoot && !downRoot) return value;
  let upper = upRoot ? `\\sqrt${valueToKatex(num)}` : valueToKatex(num);
  let lower = downRoot ? `\\sqrt${valueToKatex(denum)}` : valueToKatex(denum);
  let final = convertToKatex(upper, lower, true)?.replace(/[()]/g, '');
  return final;
};

// export default {
//   convertToKatex,
//   convertToLowestRootForm,
//   decimalToFraction,
//   fraction,
//   solveWithLeastRoots,
// };
