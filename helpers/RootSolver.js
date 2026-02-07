import { abs } from './decimal';

export const removeSymbol = (val) => {
  val = val?.toString();
  if (val?.toString()[0] == '-') return val.slice(1, val.length);
  return val;
};

function checkDecimal(n) {
  var isDecimal = n?.toString().indexOf('.') > 0;
  return isDecimal;
}
function decimalToFraction(val) {
  if (!val) return;
  if (checkDecimal(val)) {
    return (
      `${Number(val?.replace('.', ''))}` + '/' + 10 ** val.split('.')[1].length
    );
  }
  return val + '/' + 1;
}
//Solve Root Expressions Functions
//Root expressions
export const getVals = (a, b, isDivide) => {
  var reg = new RegExp(/\d/);
  if (!a || !b || !reg.test(a) || !reg.test(b)) return 0;
  var strA = a?.toString().trim();
  var strB = b?.toString().trim();
  if (checkDecimal(strA)) strA = decimalToFraction(strA);
  if (checkDecimal(strB)) strB = decimalToFraction(strB);
  //Check for zero values in a or b
  if (strA == 0 || strB == 0) return 0;
  var [strA1, strA2] =
    strA.indexOf('\\above{1pt}') > 0
      ? strA.split('\\above{1pt}')
      : strA.split('/');
  if ([strA1, strA2].includes('0')) return 0;

  if (strA == 1) {
    return isDivide ? `1\\above{1pt}${strB}` : strB;
  }
  //Check for zero values in string b
  // if (strB == 1) return strA.replace("/", "\\above{1pt}");
  if ((strB[0] == '{' || strB[1] == '{') && strB[strB.length - 1] == '}') {
    strB = strB.replace('{', '');
    var arr = [...strB];
    arr.pop();
    strB = arr.join('');
  }
  var [strB1, strB2] =
    strB.indexOf('\\above{1pt}') > 0
      ? strB.split('\\above{1pt}')
      : strB.split('/');
  if ([strB1, strB2].includes(0)) return 0;
  //Remove brackets {} if found
  if (removeSymbol(strB1).indexOf('-') >= 1 || strB1.indexOf('+') >= 1) {
    var values = strB2.split('\\sqrt');
    if (strA % values[0] == 0)
      return `${isMinus(strB1) ? '-' : ''}${
        strA / values[0] == 1 ? '' : strA / values[0]
      }(${removeSymbol(strB1)})\\above{1pt}\\sqrt${values[1]}`;
    else {
      return `{${strA}(${strB1})\\above{1pt}${strB2}}`;
    }
  }
  var b1Root = checkRoot(strB1);
  var b2Root = checkRoot(strB2);
  var a1Root = checkRoot(strA1);
  var a2Root = checkRoot(strA2);
  strA1 = removeBrackets(strA1);
  strA2 = removeBrackets(strA2);
  strB1 = removeBrackets(strB1);
  strB2 = removeBrackets(strB2);
  strB1 = b1Root
    ? removeRoot(strB1)
    : strB1?.toString().replaceAll('{', '').replaceAll('}', '');
  strB2 = b2Root
    ? removeRoot(strB2)
    : strB2?.toString().replaceAll('{', '').replaceAll('}', '');
  strA1 = a1Root
    ? removeRoot(strA1)
    : strA1?.toString().replaceAll('{', '').replaceAll('}', '');
  strA2 = a2Root
    ? removeRoot(strA2)
    : strA2?.toString().replaceAll('{', '').replaceAll('}', '');
  // if (!strB2) {
  //   if (!strA2) {
  //     return b1Root
  //       ? `${abs(strA) == 1 ? (strA < 0 ? "-" : "") : strA}\\sqrt(${strB1})`
  //       : strA * strB1;
  //   } else {
  //     if (b1Root) return getDivisionUp(`${strA1}/${strA2}`, strB1);
  //     else if (strB1 % strA2 == 0) return `${strA1 * (strB1 / strA2)}`;
  //     else {
  //       return `${strA1 * strB1}\\above{1pt}${strA2}`;
  //     }
  //   }
  // }

  strA1 = removeAllBrac(strA1);
  strA2 = removeAllBrac(strA2);
  strB1 = removeAllBrac(strB1);
  strB2 = removeAllBrac(strB2);
  return rootMultiply(
    strA1,
    strA2,
    isDivide ? strB2 : strB1,
    isDivide ? strB1 : strB2,
    a1Root,
    a2Root,
    isDivide ? b2Root : b1Root,
    isDivide ? b1Root : b2Root
  );
  //Remove () from values
};
const solveRoot = (a, b) => {
  var strA = a?.toString().trim();
  var strB = b?.toString().trim();
  var [strB1, strB2] = strB.split('\\above{1pt}');
  if (!strB2) strB2 = '1';
  var [strA1, strA2] =
    strA.indexOf('\\above{1pt}') > 0
      ? strA.split('\\above{1pt}')
      : strA.split('/');
  strA1 = removeBrackets(strA1);
  strA2 = removeBrackets(strA2);
  strB1 = removeBrackets(strB1);
  strB2 = removeBrackets(strB2);
  //Check for root values in upper B and lower B
  var b1Root = checkRoot(strB1);
  var b2Root = checkRoot(strB2);
  //Check for values in form of (\\sqrt(a) + b)/ c
  if (removeSymbol(strB1).indexOf('-') >= 1 || strB1.indexOf('+') >= 1) {
    var values = strB2.split('\\sqrt');
    if (strA % values[0] == 0)
      return `${isMinus(strB1) ? '-' : ''}${
        strA / values[0] == 1 ? '' : strA / values[0]
      }(${removeSymbol(strB1)})\\above{1pt}\\sqrt(${values[1]})`;
    else {
      return `{${strA}(${strB1})\\above{1pt}${strB2}}`;
    }
  }
  strB1 = b1Root
    ? removeRoot(strB1)
    : strB1?.replaceAll('{', '').replaceAll('}', '');
  strB2 = b2Root
    ? removeRoot(strB2)
    : strB2?.replaceAll('{', '').replaceAll('}', '');
  //If there is root in the numerator
  if (b1Root && b2Root) {
    return getDivisionBoth(
      `${strA1}/${strA2 || 1}`,
      `${strB1}\\above{1pt}${strB2}`
    );
  } else if (b1Root) {
    //If r value is divisible by denumerator
    console.log(`${strA1}/${strB2 * strA2 || strB2}`, strB1);
    return getDivisionUp(`${strA1}/${strB2 * strA2 || strB2}`, strB1);
  }
  //IF there is root in the denumerator
  else if (b2Root) {
    return getDivision(`${strA1 * strB1}${strA2 ? `/${strA2}` : ''}`, strB2);
  }
  //If there is no root in numerator and denumerator
  else {
    //If r is divisible by denumerator
    if (strA2) {
      if (strA1 % strB2 == 0)
        return `${(strA1 / strB2) * strB1}\\above{1pt}${strA2}`;
      else {
        return `${strA1 * strB1}\\above{1pt}${strB2 * strA2}`;
      }
    } else {
      if (strA % strB2 == 0) return `${(strA / strB2) * strB1}`;
      //If r is not divisible by denumerator
      else {
        var vals = fraction(strA * strB1, strB2);
        return `${vals[0]}\\above{1pt}${vals[1]}`;
      }
    }
  }
};
export const checkRoot = (val) => {
  return val?.toString().indexOf('sqrt') >= 0;
};
export const isMinus = (val) => {
  return val?.toString()[0] == '-';
};
export const removeRoot = (val) => {
  val = val?.toString().replaceAll('{', '').replaceAll('}', '');
  return val?.replaceAll('\\sqrt', '');
};
export const removeAllBrac = (val) => {
  val = val?.toString();
  return val?.replaceAll('(', '').replaceAll(')', '');
};
export const removeBrackets = (val) => {
  if (val?.startsWith('(') && val?.endsWith(')')) {
    val = val.trim().replace('(', '');
    var arr = [...val];
    arr.pop();
    val = arr.join('');
  }
  return val?.toString();
};
const getDivisionBoth = (val, divisor) => {
  var values = val.toString().split('/') || [val, 1];
  var divisor = divisor.split('\\above{1pt}');
  values = fraction(values[0], values[1]);
  divisor = fraction(divisor[0], divisor[1]);
  if (values[1] && !isNaN(values[1])) {
    if (values[0] >= divisor[1] && values[0] % divisor[1] == 0) {
      var frst = values[0] / divisor[1];
      return `${
        frst == 1 ? '' : frst == -1 ? '-' : values[0] / divisor[1]
      }\\sqrt${divisor[1] * divisor[0]}${
        values[1] == 1 ? '' : `\\above{1pt}${values[1]}`
      }`;
    } else if (values[1] >= divisor[0] && values[1] % divisor[0] == 0) {
      return `${values[0]}\\above{1pt}${
        values[1] / divisor[0] == 1 ? '' : values[1] / divisor[0]
      }\\sqrt(${divisor[0] * divisor[1]})`;
    } else {
      return `${
        values[0] == 1 ? '' : values[0] == -1 ? '-' : values[0]
      }\\sqrt(${divisor[0]})\\above{1pt}${
        values[1] == 1 ? '' : values[1]
      }\\sqrt(${divisor[1]})`;
    }
  } else {
    if (values[0] >= divisor[1] && values[0] % divisor[1] == 0) {
      var frst = values[0] / divisor[1];
      return `${frst == 1 ? '' : frst == -1 ? '-' : frst}\\sqrt${
        divisor[1] * divisor[0]
      }`;
    } else {
      return `${
        values[0] == 1 ? '' : values[0] == -1 ? '-' : values[0]
      }\\sqrt(${divisor[0]})\\above{1pt}\\sqrt(${divisor[1]})`;
    }
  }
};
const getDivision = (val, divisor) => {
  var values = val.toString().split('/');
  var newDiv = divisor;
  values = fraction(values[0], values[1]);
  if (values[1] && !isNaN(values[1])) {
    var frst = values[0] / newDiv;
    if (values[0] % newDiv == 0)
      return `${frst == 1 ? '' : frst == -1 ? '-' : frst}${
        isMinus(newDiv) ? '-' : ''
      }\\sqrt({${removeSymbol(newDiv)}})${
        values[1] == 1 ? '' : `\\above{1pt}${values[1]}`
      }`;
    else {
      return `${values[0]}\\above{1pt}${values[1]}\\sqrt(${newDiv})`;
    }
  } else {
    if (val % newDiv == 0)
      return `${val / newDiv == 1 ? '' : val / newDiv}${
        isMinus(newDiv) ? '-' : ''
      }\\sqrt(${removeSymbol(newDiv)})`;
    else {
      return `${val}\\above{1pt}\\sqrt(${newDiv})`;
    }
  }
};

const getDivisionUp = (val, divisor) => {
  var values = val.toString().split('/');
  values = fraction(values[0], values[1]);
  var newDiv = divisor.replaceAll('(', '').replaceAll(')', '');
  if (values[1] != 1) {
    if (values[1] % newDiv == 0) {
      return `${values[0]}\\above{1pt}${
        values[1] / newDiv == 1 ? '' : values[1] / newDiv
      }${isMinus(newDiv) ? '-' : ''}\\sqrt({${removeSymbol(newDiv)}})`;
    } else {
      return `${values[0] == 1 ? '' : values[0] == -1 ? '-' : values[0]}${
        newDiv == 1 ? newDiv : `\\sqrt(${newDiv})`
      }\\above{1pt}${values[1]}`;
    }
  } else {
    return `${
      values[0] == 1 ? '' : values[0] == -1 ? '-' : values[0]
    }\\sqrt(${divisor})`;
  }
};

const rootMultiply = (
  valA,
  valB = 1,
  valC = 1,
  valD = 1,
  rootA,
  rootB,
  rootC,
  rootD
) => {
  let str1;
  let str2;
  var fracs;
  var minus =
    [valA, valB, valC, valD].filter((v) => isMinus(v)).length % 2 == 0
      ? ' '
      : '-';
  valA = removeSymbol(valA);
  valB = removeSymbol(valB);
  valC = removeSymbol(valC);
  valD = removeSymbol(valD);
  if ([valA, valB, valC, valD].every((i) => i == 1)) return minus + '1';
  if (rootA && rootB && rootC && rootD) {
    fracs = fraction(valA * valC, valB * valD);
    str1 = minus + `1`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (rootA && rootB && rootC && !rootD) {
    fracs = fraction(valA * valC, valB);
    str1 = `${minus}1/${valD}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (rootA && rootB && !rootC && rootD) {
    fracs = fraction(valA, valB * valD);
    str1 = minus + valC;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (rootA && rootB && !rootC && !rootD) {
    fracs = fraction(valA, valB);
    str1 = `${minus}${valC}/${valD}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (rootA && !rootB && rootC && rootD) {
    fracs = fraction(valA * valC, valD);
    str1 = `${minus}1/${valB}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${valD}`
    }`;
  } else if (rootA && !rootB && rootC && !rootD) {
    str1 = `${minus}1/${valB}`;
    str2 = `${
      valA * valC == 1 ? '1' : `\\sqrt${valA * valC}`
    }\\above{1pt}${valD}`;
  } else if (rootA && !rootB && !rootC && rootD) {
    fracs = fraction(valA, valD);
    str1 = `${minus}${valC}/${valB}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (rootA && !rootB && !rootC && !rootD) {
    str1 = minus + valC;
    str2 = `${valA == 1 ? '1' : `\\sqrt(${valA})`}\\above{1pt}${valB * valD}`;
  } else if (!rootA && rootB && rootC && rootD) {
    fracs = fraction(valC, valB * valD);
    str1 = minus + valA;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (!rootA && rootB && rootC && !rootD) {
    fracs = fraction(valC, valB);
    str1 = `${minus}${valA}/${valD}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (!rootA && rootB && !rootC && rootD) {
    str1 = minus + valA;
    str2 = `${valC}\\above{1pt}\\sqrt${valB * valD}`;
  } else if (!rootA && rootB && !rootC && !rootD) {
    str1 = `${minus}${valA}/${valD}`;
    str2 = `${valC}\\above{1pt}\\sqrt${valB}`;
  } else if (!rootA && !rootB && rootC && rootD) {
    fracs = fraction(valC, valD);
    str1 = `${minus}${valA}/${valB}`;
    str2 = `${fracs[0] == 1 ? '1' : `\\sqrt${fracs[0]}`}${
      fracs[1] == 1 ? '' : `\\above{1pt}\\sqrt${fracs[1]}`
    }`;
  } else if (!rootA && !rootB && rootC && !rootD) {
    str1 = `${minus}${valA}/${valB}`;
    str2 = `\\sqrt${valC}\\above{1pt}${valD}`;
  } else if (!rootA && !rootB && !rootC && rootD) {
    str1 = `${minus}${valA}/${valB}`;
    str2 = `{${valC}}\\above{1pt}\\sqrt${valD}`;
  } else if (!rootA && !rootB && !rootC && !rootD) {
    str1 = `${minus}${valA * valC}`;
    str2 = `1\\above{1pt}${valB * valD}`;
  }
  return solveRoot(str1, str2);
};
export const getRoot = (num, isStr) => {
  var sign = isMinus(num) ? '-' : '';
  if (isStr) {
    if (num?.toString().indexOf('\\sqrt') < 0) return num;
    num = num
      ?.toString()
      .replace('\\sqrt', '')
      .replaceAll('{', '')
      .replaceAll('}', '');
    num = removeAllBrac(num);
  }
  num = removeSymbol(num);
  if (Math.sqrt(num)?.toString().indexOf('.') < 0) return sign + Math.sqrt(num);
  else {
    for (let i = 2; i < num / 2; i++) {
      var rem = num / i ** 2;
      if (!checkDecimal(rem) && isPrime(rem))
        return `${sign}${i}\\sqrt(${rem})`;
    }
  }
  return `${sign}\\sqrt(${num})`;
};
const isPrime = (num) => {
  for (let i = 2; i < num; i++) {
    if (num % i == 0) return false;
  }
  return true;
};

function fraction(numR, denumR) {
  if (isNaN(numR) || isNaN(denumR)) return;
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
