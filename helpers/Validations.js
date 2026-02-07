const startsWithSpecialRegex = /^[!@#$%^&*),.?":}|<>]/;
const endsWithSpecialRegex = /[!@#$%^&*(,.?":{|<>]$/;
const specialsRegex = /[!@#$%^&*,.?":|<>]/g;
// const fracRegex = /\\frac\{[^}]*\}\{[^}]*\}/;

export const isInputInvalid = (input = '') => {
  if (!input) return true;
  input = input.toString().replace(/\s+/g, '');
  if (/{}/.test(input)) return true;
  input = input.replace(/[{}()]/g, '');
  if (startsWithSpecialRegex.test(input)) return true;
  if (endsWithSpecialRegex.test(input)) return true;
  if (input.startsWith('\\times') || input.startsWith('\\cdot')) return true;

  input = input.toString().replace(specialsRegex, '').replaceAll('\\right', '');
  if (!input) return true;
  let arr = [
    '\\log',
    '\\ln',
    '\\cos',
    '\\sin',
    '\\tan',
    '\\frac',
    '+',
    '-',
    '/',
    '*',
    '\\left',
    '\\cdot',
    '^',
  ];
  return !arr.every((itm) => !input.endsWith(itm) && input != itm);
};

export function isMatValid(matr = []) {
  if (!matr || matr.length <= 0) return false;
  return matr.flat().every((val) => !isInputInvalid(val) || val == '0');
}
