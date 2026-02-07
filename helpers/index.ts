import Algebrite from 'algebrite';

export const toTitleCase = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

type PolynomialDivisionResult = {
  quotient: string;
  remainder: string;
};

function getDegree(equation: string): number {
  equation = equation.replace(/\s/g, '');
  const terms = equation.split(/[+\-]/);
  let maxDegree = 0;
  for (const term of terms) {
    if (term === '') continue;
    if (term.includes('x')) {
      const match = term.match(/x\^(\d+)/);
      if (match?.length) {
        const degree = parseInt(match[1]);
        if (degree > maxDegree) maxDegree = degree;
      } else {
        maxDegree = Math.max(maxDegree, 1);
      }
    }
  }
  return maxDegree;
}

function formatPolynomial(polynomial: string[]): string {
  return polynomial
    .join(' ')
    .replace(/\+ -/g, '- ')
    .replace(/- -/g, '+ ')
    .replace(/^\+ /, '')
    .trim();
}

function findHighestPowerTerm(expression: string): string {
  const terms = expression.match(/[+-]?[^+-]+/g) || [];
  let highestPower = 0;
  let highestPowerTerm = '';
  for (const term of terms) {
    if (!term.trim()) continue;
    let exponent = 0;
    if (term.includes('x')) {
      const match = term.match(/x\^(\d+)/);
      exponent = match ? parseInt(match[1]) : 1;
    }
    if (exponent > highestPower) {
      highestPower = exponent;
      highestPowerTerm = term;
    }
  }
  return highestPowerTerm;
}

export function polynomialDivide(
  dividend: string,
  divisor: string
): PolynomialDivisionResult {
  let degreeOfDivisor = getDegree(divisor);
  let degreeOfDividend = getDegree(dividend);
  let quotient: string[] = [];
  let remainder = dividend;

  if (degreeOfDivisor > degreeOfDividend) {
    return { quotient: '0', remainder };
  }
  let iteration = 0;
  const MAX_ITERATIONS = 20;

  try {
    while (iteration < MAX_ITERATIONS) {
      let termOfDividend = findHighestPowerTerm(remainder);
      let termOfDivisor = findHighestPowerTerm(divisor);
      if (!termOfDividend || !termOfDivisor) break;

      let divide = Algebrite?.eval(
        `(${termOfDividend})/ (${termOfDivisor})`
      )?.toString();
      let multiply = Algebrite?.eval(`(${divide})*(${divisor})`).toString();
      let subtraction = Algebrite?.eval(
        `(${remainder})-(${multiply})`
      ).toString();

      quotient.push(divide);
      remainder = Algebrite.expand(subtraction).toString();

      if (getDegree(remainder) < degreeOfDivisor) break;
      iteration++;
    }
  } catch {
    return { quotient: '', remainder: '' };
  }

  return {
    quotient: formatPolynomial(quotient),
    remainder: remainder || '0',
  };
}
