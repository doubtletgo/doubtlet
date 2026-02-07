export const parseNumber = (res, replaceSpecial = {}, maxChars = 10) => {
  if (Number.isInteger(res) || isNaN(res) || res === '') return res;

  const len = (parseFloat(res - parseInt(res)) + '').length;

  let decimals = len - 2;

  decimals = Math.min(Math.max(decimals, 0), maxChars);
  res = parseFloat(res)?.toFixed(decimals);
  if (!(res - parseInt(res))) res = parseInt(res);

  const resp = parseFloat(res);

  return replaceSpecial?.[resp] ?? resp;
};

export const parseNegNumber = (res, replaceSpecial = {}) => {
  const num = parseNumber(res, replaceSpecial);

  if (isNaN(res) || res === '') return res;

  return `${num < 0 ? '' : '-'}${Math.abs(num)}`;
};

export const addSymbol = (num) => (num < 0 ? '-' : '+');

export const newAddSymbol = (num) => {
  if (num.toString().indexOf('/') > 0 && !isNaN(num.toString()[num.length]))
    return eval(num) < 0 ? '-' : '+';
  else return num < 0 ? '-' : '+';
};
export const minusSymbol = (num) => (num >= 0 ? '-' : '+');
export const abs = (num) => num && Math.abs(num);
export const negative = (num) => num * -1;

export const numberWithAlternate = (num, alt) => {
  num = parseNumber(num);
  return num || (num === 0 ? num : alt);
};

export const withSymbol = (val, symbol) =>
  val ? `${val == 1 ? '' : val}${symbol}` : val || 0;
