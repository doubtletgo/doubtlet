'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import MathInput from 'react-math-keyboard';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSpace, putSpace, simplifyLatex } from '../../helpers/general';

import algebrite from 'algebrite';

function putInBrackets(val) {
  if (!val) return;
  val = val.toString();
  return addSpace(val?.toString(), true)
    .split(' ')
    .map(
      (itm) =>
        '{' + swap(itm).replace('/', '\\above{1pt}').replaceAll('*', '') + '}'
    )
    .join(' ');
}
//FUNCTIONS....
const withSymbol = (val, symbol) =>
  val
    ? `${val == -1 ? '-' : ''}${Math.abs(val) == 1 ? '' : val}${symbol}`
    : val || 0;
//Put variable values in numerator

//Add Space to values
function swap(expression) {
  if (!expression) return '';
  let components = expression.split('/');
  let expr = [components.shift(), components.join('/')];
  let reg = /[a-zA-Z]/;
  let brackReg = /\/\(\d?\w?\^?\d?\)/;
  if (!!expression.match(brackReg)?.[0]) {
    return expression;
  } else if (!!expression.match(/\/[a-z]/i)?.[0]) {
    return expression;
  }
  if (expr[1]?.match(reg)?.length > 0) {
    let numericVal = expr[1]?.match(/^\d*\/?\d*/)?.[0] || '';
    let varValue = expr[1]?.replace(numericVal, '').replace('*', '');
    expr[0] = withSymbol(expr[0], varValue);
    expr[1] = numericVal;
    return expr.join('/');
  }
  return expression;
}
const AlgebraicPolynomialsLongDivision = () => {
  const [dividend, setDividend] = useLocalStorage('AlgebraicPolynomialsLongDivision_dividend', '2x^4 + 3x^3 + x^2 + 5x + 7');
  const [divisor, setDivisor] = useLocalStorage('AlgebraicPolynomialsLongDivision_divisor', '3x + 4');
  const [equation, setEquation] = useLocalStorage('AlgebraicPolynomialsLongDivision_equation', '');
  const [solution, setSolution] = useLocalStorage('AlgebraicPolynomialsLongDivision_solution', '');
  const [result, setResult] = useLocalStorage('AlgebraicPolynomialsLongDivision_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AlgebraicPolynomialsLongDivision_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('AlgebraicPolynomialsLongDivision_showSteps', true);
  const [note, setNote] = useLocalStorage('AlgebraicPolynomialsLongDivision_note', undefined);

  function solve(expression) {
    if (!expression) return '';
    let expr = expression.toString();
    expr = expr
      .replace(/([a-z])/gi, '*$1')
      .toString()
      .replace(/\s/, '')
      .replaceAll('-*', '*-')
      .replaceAll('+*', '+')
      .replace(/\/\*/g, '/');
    if (expr?.indexOf('*') == 0 || expr?.indexOf('-') == 0)
      expr = expr.replace('*', '');
    if (expr.endsWith('*')) expr = expr.replace('*', '');
    expr = expr.replace(/([a-z]\^[-]?\d)/gi, '($1)');
    return expr;
  }

  //Add Katex Brackets to values

  //Find highest Power function
  function getDegree(equation) {
    equation = equation.replace(/\s/g, '');
    const terms = equation.split(/[+\-]/);
    let divisorDegree = 0;
    for (const term of terms) {
      if (term === '') continue;
      if (term.includes('x')) {
        const match = term.match(/x\^(\d+)/);
        if (match?.length > 0) {
          const degree = parseInt(match[1]);
          if (degree > divisorDegree) {
            divisorDegree = degree;
          }
        } else {
          if (divisorDegree < 1) {
            divisorDegree = 1;
          }
        }
      }
    }
    return divisorDegree;
  }
  //Highest Power Term function
  function findHighestPowerTerm(dividend) {
    const terms = addSpace(dividend, false).toString().split(' ');
    let highestPower = 0;
    let highestPowerTerm = '';
    for (let i = 0; i < terms.length; i++) {
      if (!terms[i]) continue;
      const term = terms[i].trim();
      let exponent;
      if (term.indexOf('x') != -1) {
        if (term.indexOf('x^') >= 0) {
          exponent = term.substring(term.indexOf('x^') + 1).match(/\d+/)?.[0];
        }
        if (!exponent) exponent = 1;
      } else exponent = 0;
      if (exponent > highestPower) {
        highestPower = exponent;
        highestPowerTerm = term;
      }
    }
    return highestPowerTerm;
  }

  useEffect(() => {
    dividend.replaceAll('text', '').replaceAll('\\time', '');
    divisor.replaceAll('text', '').replaceAll('\\time', '');

    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the step wise result of the division of  (\\bold{${
              dividend || 'Dividend'
            }}) by (\\bold{${divisor || 'Divisor'}}) `
          ),
          type: 'equation',
        },
      ])
    );
  }, [divisor, dividend]);

  useEffect(() => {
    const isInvalid = [divisor, dividend].some(
      (i) =>
        (i != 0 && !i) ||
        i == '-' ||
        i.endsWith('+') ||
        i.endsWith('-') ||
        i.endsWith('*') ||
        i.endsWith('/')
    );
    if (isInvalid) return;
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Divide (Dividend): -<\\bold{${dividend || 'Dividend'}}>`,
          type: 'equation',
        },
        {
          value: `By (Divisor): -<\\bold{${divisor || 'Divisor'}}>`,
          type: 'equation',
        },
      ])
    );

    let simpleDivisor = simplifyLatex(divisor)
      .replaceAll('(', '')
      .replaceAll(')', '')
      ?.toString()
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '');
    let simpleDividend = simplifyLatex(dividend)
      .replaceAll('(', '')
      .replaceAll(')', '')
      ?.toString()
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '');
    let degreeOfDivisor = getDegree(simpleDivisor);
    let degreeOfDividend = getDegree(simpleDividend);
    const arr = [];
    let ans = [];
    let i = 1;
    let divide, multiply, subtraction;
    let remainder = '';
    let lastStep = false;
    try {
      while (i < 10) {
        let termOfDividend = findHighestPowerTerm(simpleDividend).replaceAll(
          '*',
          ''
        );
        let termOfdivisor = findHighestPowerTerm(simpleDivisor).replaceAll(
          '*',
          ''
        );
        if (!termOfDividend || !termOfdivisor) return;
        divide = algebrite
          ?.eval(`(${termOfDividend})/ (${termOfdivisor})`)
          ?.toString()
          .replaceAll('*', '');
        multiply = algebrite
          ?.eval(`(${divide})*(${simpleDivisor})`)
          .toString()
          .replaceAll('*', '');
        subtraction = algebrite
          ?.eval(`(${simpleDividend})-(${multiply})`)
          .toString()
          .replaceAll('*', '');
        let divideSimple = putInBrackets(
          algebrite.expand(`${solve(divide)}`).toString()
        );
        let multiplySimple = putInBrackets(
          algebrite.expand(`${solve(multiply)}`).toString()
        )
          .replaceAll('(', '')
          .replaceAll(')', '');
        let subtractionSimple = putInBrackets(
          `${algebrite
            .expand(solve(subtraction))
            .toString()
            .replaceAll('(', '')
            .replaceAll(')', '')}`
        );

        termOfDividend =
          '{' +
          swap(termOfDividend)?.toString().replace('/', '\\above{1pt}') +
          '}';
        termOfdivisor =
          '{' +
          swap(termOfdivisor)?.toString().replace('/', '\\above{1pt}') +
          '}';
        simpleDividend = putInBrackets(simpleDividend);
        ans.push(divideSimple);
        if (
          !subtractionSimple
            .toString()
            .replace('\\above{1pt}', '')
            ?.match(/[a-z]/gi)?.[0]
        ) {
          if (subtraction != '0' && subtractionSimple != '{0}')
            ans.push(`{{${subtractionSimple}}\\above{1pt}{${divisor}}}`);
          lastStep = true;
        }

        let step = [
          {
            value: `<b>Step-${i}</b>`,
            type: 'span',
          },
          {
            value:
              i > 1
                ? putSpace(
                    `Highest power term of the remainder in Step ${i} =${termOfDividend.replace(
                      '+',
                      ''
                    )}`
                  )
                : '',
            type: `${i > 1 ? 'equation' : 'span'}`,
          },
          {
            value: `Divide the highest power term of the dividend by the highest power term of the divisor:`,
            type: 'span',
          },
          'br',
          {
            value: `{${termOfDividend.replace(
              '+',
              ''
            )}\\above{1pt}${termOfdivisor}}=${divideSimple}`,
            type: 'equation',
          },
          {
            value: lastStep
              ? `<a href="/calculator/ExponetDivision/"  target="_blank">to see steps for above exponent division, click here </a>`
              : '',
            type: lastStep ? 'span' : 'span',
          },
          {
            value: `Multiply the above result by the divisor term: `,
            type: 'span',
          },

          {
            value: `(${divideSimple})(${divisor})=${multiplySimple}`,
            type: 'equation',
          },
          {
            value: lastStep
              ? `<a href="/calculator/algebraic-polynomials-multiplication/"  target="_blank">to see steps of above multiplication, click here</a>`
              : '',
            type: lastStep ? 'span' : 'span',
          },
          {
            value: `Subtract the above obtained result from the dividend term: `,
            type: 'span',
          },

          {
            value: `( ${simpleDividend})-(${multiplySimple}) = {${subtractionSimple}}`,
            type: 'equation',
          },
          {
            value: lastStep
              ? `<a href="/calculator/algebraic-polynomials-addition-subtraction/"  target="_blank">to see steps of above polynomial subtraction, click here </a>`
              : '',
            type: lastStep ? 'span' : 'span',
          },
          {
            value: putSpace(
              `So, remainder obtained in Step ${i} ={${subtractionSimple}}`
            ),
            type: 'equation',
          },
        ];
        arr.push(...step);
        remainder = subtractionSimple;
        simpleDividend = algebrite.expand(solve(subtraction)).toString();
        if (lastStep || getDegree(subtraction) < degreeOfDivisor) break;
        i++;
      }
    } catch {
      return;
    }
    ans = ans
      .map((itm, i) => {
        if (i == 0) return itm;
        else if (i == ans.length - 1) return '+' + itm;
        if (itm.replace(/\{/g, '').replace(/\}/g, '').indexOf('-') == 0)
          return '-' + itm.replace('-', '') + '';
        else return '+ ' + itm + '';
      })
      .join(' ')
      .replaceAll('*', '');

    const finalAnswer = [
      {
        value: putSpace(
          degreeOfDividend < degreeOfDivisor
            ? `The degree of the dividend is less than the degree of the divisor, so the polynomial division can't be performed.`
            : `The result of the divison of above given polynomials (${dividend}) and (${divisor}) is `
        ),
        type: 'equation',
      },
      {
        value: `Quotient = ${ans}`,
        type: 'equation',
      },
      {
        value: `Remainder = ${remainder}`,
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(equations);
    setResult(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `We will write the expressions of both dividend & divisor in special format of missing `,
        type: 'span',
      },
      'br',
      {
        value: `terms should be written with zero coefficients from highest power term to lowest. `,
        type: 'span',
      },
      'br',
      {
        value: `Arrange the dividend and divisor in specific format (Highest power to lowest)`,
        type: 'span',
      },
      {
        value: `\\bold{${divisor || 'Divisor'}} \\bigg) \\bold{${
          dividend || 'Dividend'
        }} \\bigg( `,
        type: 'equation',
      },
      {
        value: `Degree of the dividend  =${degreeOfDividend}`,
        type: 'span',
      },
      'br',
      {
        value: `Degree of the divisor =${degreeOfDivisor}`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `Since degree of dividend ${
          degreeOfDividend > degreeOfDivisor ? '>' : '<'
        } degree of divisor.`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Highest power term of the dividend =${findHighestPowerTerm(
            dividend
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Highest power term of the divisor =${findHighestPowerTerm(divisor)}`
        ),
        type: 'equation',
      },
      ...arr,
      {
        value: `Degree of the remainder = ${getDegree(remainder)}`,
        type: 'span',
      },
      'br',
      {
        value: `Since degree of remainder < degree of divisor.`,
        type: 'span',
      },
      'br',
      {
        value: `Hence division can’t be performed ${
          degreeOfDividend < degreeOfDivisor ? '' : 'further'
        } & we are done.`,
        type: 'span',
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];
    const solution = renderSteps(steps);

    setSolution(solution);
  }, [divisor, dividend, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setDividend('');
    setDivisor('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = divisor && dividend;
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Integer or any Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Divide (Dividend): -</div>
            <div className={`col-8`}>
              <MathInput
                initialLatex={dividend}
                setValue={setDividend}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
              />
            </div>
          </div>{' '}
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">By (divisor): - </div>
            <div className={`col-8 `}>
              <MathInput
                initialLatex={divisor}
                setValue={setDivisor}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
                // initialLatex={"2x-1"}
              />
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />{' '}
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger  mt-3"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasValue && showResult && !showSteps && (
        <>
          <hr />
          <span>
            <Equation equation={result} className="mt-3" />
          </span>
          <br />
          <button
            className="default-btn mt-3 rounded-pill px-5 btn-blue"
            onClick={toggleSteps}
          >
            Show Steps
          </button>
        </>
      )}
      {hasValue && showSteps && (
        <>
          <Equation
            className="mt-4 mb-5 solution-container"
            print
            equation={solution}
          />
          <div className="bottom-note">
            <strong>Note :-</strong> If you find any computational or Logical
            error in this calculator, then you can write your suggestion by
            clicking the below button or in the comment box.
          </div>
          <Link href="#commentbox" style={{ scrollBehavior: 'smooth' }}>
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default AlgebraicPolynomialsLongDivision;
