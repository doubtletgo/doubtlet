import { abs } from 'mathjs';

export const sineData: Record<number, string> = {
  0: '0',
  15: '{\\sqrt{3} - 1 \\above{1pt} 2 \\sqrt{2}}',
  18: '{\\sqrt{5} - 1 \\above{1pt} 4}',
  22.5: '{\\sqrt{2 - \\sqrt{2}} \\above{1pt} 2}',
  30: '{1 \\above{1pt} 2}',
  37: '{3 \\above{1pt} 5}',
  45: '{1 \\above{1pt} \\sqrt{2} }',
  53: '{4 \\above{1pt} 5}',
  60: '{\\sqrt{3} \\above{1pt} 2 }',
  75: '{1 + \\sqrt{3} \\above{1pt}2\\sqrt{2}}',
  90: '1',
};

export const FindSineData = (value: number) => {
  console.log('hi');
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const high = abs(value) > 90;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg = isAngleNeg([1, 2], value);
  const matchedData = high
    ? sineData[nDivide90Remainder]
    : sineData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

export const cosineData: Record<number, string> = {
  0: '1',
  15: '{\\sqrt{3} + 1 \\above{1pt} 2 \\sqrt{2}}',
  18: '{\\sqrt{5 + \\sqrt{5}} \\above{1pt} 2 \\sqrt{2}}',
  22.5: '{\\sqrt{2 - \\sqrt{2}} \\above{1pt} 2}',
  30: '{\\sqrt{3} \\above{1pt} 2}',
  36: '{\\sqrt{5} + 1 \\above{1pt} 4}',
  45: '{1 \\above{1pt} \\sqrt{2} }',
  60: '{1 \\above{1pt} 2 }',
  75: '{\\sqrt{3} - 1 \\above{1pt} 2 \\sqrt{2}}',
  90: '0',
};

export const FindCosineData = (value: number) => {
  if (value != Math.floor(value)) return null;
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const high = abs(value) > 90;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg = value == 90 ? '' : isAngleNeg([1, 4], abs(value));
  const matchedData = high
    ? cosineData[nDivide90Remainder]
    : cosineData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

export const tanData: Record<number, string> = {
  0: '0',
  15: '{\\sqrt{3} - 1 \\above{1pt} \\sqrt{3} + 1} \\space or \\space 2-\\sqrt{3}',
  18: '{\\sqrt{5} - 2 \\sqrt{5} \\above{1pt} \\sqrt{5}}',
  22.5: '{\\sqrt{2} - 1}',
  30: '{1 \\above{1pt} \\sqrt{3}}',
  36: '{\\sqrt{5 - 2 \\sqrt{5}}}',
  45: '{1}',
  53: '{4 \\above{1pt} 5}',
  60: '{\\sqrt{3} }',
  75: '{( \\sqrt{3} + 1) \\above{1pt}(\\sqrt{3} - 1)} \\space or \\space 2 + \\sqrt{3}',
  90: '\\infty',
};

export const FindTanData = (value: number) => {
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg =
    value == 0 || (value / 90) % 2 != 0 ? '' : isAngleNeg([1, 3], value);
  const matchedData = value ? tanData[nDivide90Remainder] : tanData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

export const cotData: Record<number, string> = {
  0: '\\infty',
  15: '{\\sqrt{3} + 1 \\above{1pt} \\sqrt{3} - 1} \\space or \\space 2 + \\sqrt{3}',
  18: '{\\sqrt{5 + 2\\sqrt{5}} }',
  22.5: '{\\sqrt{2}+ 1}',
  30: '{\\sqrt{3} }',
  36: '{\\sqrt{5+ 2\\sqrt{5}} \\above{1pt} \\sqrt{5}}',
  45: '{1}',
  60: '{1 \\above{1pt} \\sqrt{3} }',
  75: '{\\sqrt{3} - 1 \\above{1pt} \\sqrt{3} + 1} \\space or \\space 2 - \\sqrt{3}',
  90: '0',
};

export const FindCotData = (value: number) => {
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const high = abs(value) > 90;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg =
    value == 0 || (value / 90) % 2 != 0 ? '' : isAngleNeg([1, 3], value);
  const matchedData = high ? cotData[nDivide90Remainder] : cotData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

export const cosecData: Record<number, string> = {
  0: '\\infty',
  15: '{2 \\sqrt{2} \\above{1pt} \\sqrt{3} - 1}',
  18: '{\\sqrt{5} + 1 }',
  22.5: '{2 \\above{1pt} 2 - \\sqrt{2}}',
  30: '{2}',
  36: '{2 \\sqrt{2} \\above{1pt} \\sqrt{5 - \\sqrt{5}}}',
  45: '{\\sqrt{2}}',
  60: '{2 \\above{1pt} \\sqrt{3} }',
  75: '{2 \\sqrt{2}  \\above{1pt} \\sqrt{3} + 1} ',
  90: '1',
};

export const FindCosecData = (value: number) => {
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const high = abs(value) > 90;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg = (value / 90) % 2 == 0 ? '' : isAngleNeg([1, 2], value);
  const matchedData = high
    ? cosecData[nDivide90Remainder]
    : cosecData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

export const secData: Record<number, string> = {
  0: '1',
  15: '{2\\sqrt{2} \\above{1pt} \\sqrt{3} + 1}',
  18: '{2 \\sqrt{2} \\above{1pt} \\sqrt{5 + \\sqrt{5}}}',
  22.5: '{2 \\above{1pt} \\sqrt{2 + \\sqrt{2}}}',
  30: '{2 \\above{1pt} \\sqrt{3}}',
  36: '{\\sqrt{5} - 1 }',
  45: '{\\sqrt{2} }',
  60: '{ 2 }',
  75: '{ 2 \\sqrt{2} \\above{1pt} \\sqrt{3} - 1}',
  90: '\\infty',
};

export const FindSecData = (value: number) => {
  const nDivide90 = abs(Math.trunc(value / 90));
  const isEven = nDivide90 % 2 == 0;
  const high = abs(value) > 90;
  const nDivide90Remainder = isEven ? abs(value % 90) : 90 - abs(value % 90);
  const neg = (value / 90) % 2 != 0 ? '' : isAngleNeg([1, 4], abs(value));
  const matchedData = high ? secData[nDivide90Remainder] : secData[abs(value)];
  return matchedData ? neg + matchedData : '';
};

const isAngleNeg = (range: number[], angle: number) => {
  const nDivide90 = abs(Math.trunc(angle / 90));
  const isNegative = Number(angle) < 0;
  const quadrant = isNegative ? 3 - (nDivide90 % 4) + 1 : (nDivide90 % 4) + 1;
  const neg = !range.includes(quadrant);
  return neg ? '-' : '';
};
