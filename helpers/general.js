const plurals = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  11: 'th',
  12: 'th',
  13: 'th',
  default: 'th',
};

export const pluralise = (num) => {
  if (!Number.isInteger(num)) return num;
  const n1 = num % 10;
  const n2 = num % 100;
  const sup = plurals[n2] || plurals[n1] || plurals.default;
  return `${num}^{${sup}}`;
};

export const getSearchParams = (numberOnly = true) => {
  if (typeof window !== 'undefined') {
    const search = new URLSearchParams(window.location.search);
    return [...search.keys()].reduce((acc, key) => {
      if (search.has(key)) {
        const value = search.get(key);

        if (value && (!numberOnly || !isNaN(value))) {
          acc[key] = search.get(key);
        }
      }
      return acc;
    }, {});
  }
  return {};
};

export const refValue = (value = '') => {
  if (!value) return '';
  value = value.toString();
  if (value.indexOf('above{1pt}') > -1) {
    const regex = /\{?(\d+)\\above{1pt}(\d+)\}?/g;
    return value.replace(regex, '\\frac{$1}{$3}');
  } else if (value.indexOf('/') > 0) {
    const elems = value.split('/');
    return `\\frac{${elems[0]}}{${elems[1]}}`;
  }
  return value;
};

export const putSpace = (val) => {
  return val
    ?.toString()
    .replaceAll('\\space', '')
    .split(' ')
    .join(' \\space ')
    .replaceAll('\\cdot', '\\cdot ');
};

export const simplifyLatex = (latexValue) => {
  if (!latexValue) return '';
  return (
    latexValue
      ?.toString()
      ?.replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '') || ''
  );
};
export const simplifyKatex = (latexValue) => {
  if (!latexValue) return '';
  return latexValue
    ?.toString()
    .replaceAll('\\sqrt', 'sqrt')
    .replace('\\above{1pt}', '/')
    .replaceAll('{', '(')
    .replaceAll('}', ')');
};

export function addSpace(value, both) {
  if (!value) return;
  value = value.toString();
  let mins = false;
  return value.replaceAll(' ', '').replace(/[+|-]/gi, function (x) {
    if (value[0] == x && !mins) {
      mins = true;
      return x;
    }
    if (value[value.indexOf(this) - 1] == '*') return x;
    return ' ' + x + (both ? ' ' : '');
  });
}
