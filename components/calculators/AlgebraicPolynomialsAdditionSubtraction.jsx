'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import MathInput from 'react-math-keyboard';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSpace, putSpace, simplifyLatex } from '../../helpers/general';
import { abs, withSymbol } from '../../helpers/decimal';

import algebrite from 'algebrite';

function swap(expression) {
  if (!expression) return;
  let components = expression.split('/');
  let expr = [components.shift(), components.join('/')];
  let reg = /[a-zA-Z]/;
  if (expr[1]?.match(reg)?.length > 0) {
    let numericVal = expr[1]?.match(/^\d*\/?\d*/)?.[0] || '';
    let varValue = expr[1]?.replace(numericVal, '').replace('*', '');
    expr[0] = withSymbol(expr[0], varValue);
    expr[1] = numericVal;
    return expr.join('/');
  }
  return expression;
}

function toAbove(expr) {
  if (!expr) return;
  expr = expr.toString();
  return (
    '{' +
    expr
      .replaceAll('/', '\\above{1pt}')
      .replaceAll('(', '{')
      .replaceAll(')', '}') +
    '}'
  );
}
function checkDecimal(n) {
  if (!n) return false;
  var isDecimal = n.toString().indexOf('.') > 0;
  return isDecimal;
}
function decimalToFraction(val) {
  val = val?.toString().replaceAll('(', '').replaceAll(')', '');
  if (!val) return;
  if (checkDecimal(val)) {
    let vals = fraction(val.replace('.', ''), 10 ** val.split('.')[1]?.length);
    return vals.join('/');
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

const AlgebraicPolynomialsAdditionSubtraction = () => {
  const [firstPoly, setFirstPoly] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_firstPoly', '');
  const [secondPoly, setSecondPoly] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_secondPoly', '');
  const [equation, setEquation] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_equation', '');
  const [solution, setSolution] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_solution', '');
  const [result, setResult] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_showSteps', true);
  const [note, setNote] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_note', undefined);
  const [firstInvalid, setFirstInvalid] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_firstInvalid', false);
  const [secondInvalid, setSecondInvalid] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_secondInvalid', false);
  const [order, setOrder] = useLocalStorage('AlgebraicPolynomialsAdditionSubtraction_order', 'Addition');

  const isAddition = order === 'Addition';

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Find the step wise result of the \\bold{${
              isAddition ? `addition` : `subtraction`
            }} of ${firstPoly || `First Polynomial`}`
          ),
          type: 'equation',
        },
        {
          value: `and \\space ${secondPoly || `Second \\space Polynomial`}`,
          type: 'equation',
        },
      ])
    );
  }, [secondPoly, firstPoly, isAddition]);

  useEffect(() => {
    const isInvalid = [secondPoly, firstPoly].some(
      (i) =>
        (i != 0 && !i) ||
        i == '-' ||
        i.endsWith('+') ||
        i.endsWith('-') ||
        i.endsWith('*') ||
        i.indexOf('sqrt') != -1
    );
    if (firstPoly.indexOf('sqrt') != -1) setFirstInvalid(true);
    else setFirstInvalid(false);
    if (secondPoly.indexOf('sqrt') != -1) setSecondInvalid(true);
    else setSecondInvalid(false);
    if (isInvalid) return;
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        {
          value: `First \\space Polynomial: ${
            firstPoly || `First \\space Polynomial`
          }`,
          type: 'equation',
        },
        {
          value: `Second \\space Polynomial: ${
            secondPoly || `Second \\space Polynomial`
          }`,
          type: 'equation',
        },
      ])
    );
    let simpleOne = simplifyLatex(
      firstPoly.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2')
    )
      .replaceAll(')/(', '/')
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '');
    let simpleTwo = simplifyLatex(
      secondPoly.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2')
    )
      .replaceAll(')/(', '/')
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '');
    const firstValues = addSpace(simpleOne)?.split(' ');
    const secondValues = addSpace(simpleTwo)?.split(' ');
    const frst = {};
    const scnd = {};
    const result = {};

    let answer = '';
    try {
      firstValues?.map((itm) => {
        let sign = '';
        if (itm[0] == '-') {
          sign = itm[0];
          itm = itm.slice(1, itm.length);
        } else if (itm[0] == '+') itm = itm.slice(1, itm.length);
        let numericVal = itm.match(/^\d*\/?\.?\d*/)?.[0] || '';
        let varExp = itm.replace(numericVal, '').replace('*', '');
        if (!numericVal) numericVal = 1;
        if (!varExp) varExp = '^0';
        if (!/[a-z]/i.test(varExp)) {
          if (!!frst[0]) frst[0] += `{${!!sign ? sign : '+'}` + itm + '}';
          else frst[0] = '{' + itm + '}';
          return;
        }
        let powerX =
          varExp.split('^')?.[1] || varExp.match(/[a-z]/gi)?.length || 1;
        powerX = decimalToFraction(powerX);
        if (eval(powerX).toString().indexOf('.') < 0) {
          powerX = eval(powerX);
        }
        itm = swap(itm)
          .replace('*', '')
          .replaceAll('(', '{')
          .replaceAll(')', '}');
        if (!!frst[powerX])
          frst[powerX] += `{${!!sign ? sign : '+'}` + itm + '}';
        else frst[powerX] = `{${!!sign ? sign : ''}` + itm + '}';
      });
      secondValues?.map((itm) => {
        let sign = '';
        if (itm[0] == '-') {
          sign = itm[0];
          itm = itm.slice(1, itm.length);
        } else if (itm[0] == '+') itm = itm.slice(1, itm.length);
        let numericVal = itm.match(/^\d*\/?\.?\d*/)?.[0] || '';
        let varExp = itm.replace(numericVal, '').replace('*', '');
        if (!numericVal) numericVal = 1;
        if (!varExp) varExp = '^0';
        if (!/[a-z]/i.test(varExp)) {
          if (!!scnd[0]) scnd[0] += `{${!!sign ? sign : '+'}` + itm + '}';
          else scnd[0] = `{${!!sign ? sign : ''}` + itm + '}';
          return;
        }
        let powerX =
          varExp.split('^')?.[1] || varExp.match(/[a-z]/gi)?.length || 1;
        powerX = decimalToFraction(powerX);
        if (eval(powerX).toString().indexOf('.') < 0) {
          powerX = eval(powerX);
        }
        itm = swap(itm)
          .replace('*', '')
          .replaceAll('(', '{')
          .replaceAll(')', '}');
        if (!!scnd[powerX])
          scnd[powerX] += `{${!!sign ? sign : '+'}` + itm + '}';
        else scnd[powerX] = `{${!!sign ? sign : ''}` + itm + '}';
      });
      let str = `${simpleOne}${isAddition ? '+' : '-'}(${simpleTwo})`;
      answer = algebrite.expand(algebrite.simplify(str).toString()).toString();
      let answerValues = addSpace(answer).split(' ');
      answerValues.map((itm) => {
        let sign = '';
        if (itm[0] == '-') {
          sign = itm[0];
          itm = itm.slice(1, itm.length);
        } else if (itm[0] == '+') itm = itm.slice(1, itm.length);
        let numericVal = itm.match(/^\d*\/?\.?\d*/)?.[0] || '';
        let varExp = itm.replace(numericVal, '').replace('*', '');
        if (!numericVal) numericVal = 1;
        if (!varExp) varExp = '^0';
        itm = swap(itm)
          .replace('*', '')
          .replaceAll('(', '{')
          .replaceAll(')', '}')
          .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`);
        if (!/[a-z]/i.test(varExp)) {
          if (!!result[0]) result[0] += `{${!!sign ? sign : '+'}` + itm + '}';
          else result[0] = `${!!sign ? sign : ''}{` + itm + '}';
          return;
        }
        let powerX =
          varExp.split('^')?.[1] || varExp.match(/[a-z]/gi)?.length || 1;
        powerX = decimalToFraction(powerX);
        if (eval(powerX).toString().indexOf('.') < 0) {
          powerX = eval(powerX);
        }
        if (!!result[powerX])
          result[powerX] += `{${!!sign ? sign : '+'}` + itm + '}';
        else result[powerX] = `{${!!sign ? sign : ''}` + itm + '}';
      });
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>', error);
      return;
    }
    answer = addSpace(answer, true);
    const keyArray = [...Object.keys(frst), ...Object.keys(scnd)]
      .filter(function (v, i, self) {
        return i == self.indexOf(v);
      })
      .sort()
      .reverse();
    let eachValues = answer
      .split(' ')
      .map(
        (itm) =>
          '{' +
          swap(itm)
            .replaceAll('/', '\\above{1pt}')
            .replace('*', '')
            .replaceAll('(', '{')
            .replaceAll(')', '}') +
          '}'
      );
    const finalAnswer = [
      {
        value: putSpace(
          `The result of the ${
            isAddition ? `addition` : `subtraction`
          } of (${firstPoly}) and (${secondPoly}) is`
        ),
        type: 'equation',
      },
      {
        value: eachValues
          .join(' \\space ')
          .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`),
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
        value: `We can ${
          isAddition ? `<b>add</b>` : `<b>subtract</b>`
        } any number of polynomials by just adding the similar terms of same powers.`,
        type: 'span',
      },

      ...keyArray.map((itm) => {
        let term = itm
          .replace('(', '{')
          .replace(')', '}')
          .replace('/', '\\above{1pt}');

        let frstValue = !!frst[itm] ? `(${toAbove(frst[itm])})` : '';
        let scndValue = `{${toAbove(scnd[itm]) || ''}}`;

        let text =
          itm == 0
            ? `Adding the constant terms`
            : `Adding terms of power  {${term}}`;
        return {
          value: putSpace(
            `${text} ={${frstValue}}${
              isAddition
                ? !!frst[itm] && !!scnd[itm]
                  ? '+'
                  : ''
                : !!scnd[itm]
                ? '-'
                : ''
            }${!!scnd[itm] ? `(${scndValue})` : ''}={${
              toAbove(result[itm]) || 0
            } }`
          ),
          type: 'equation',
        };
      }),
      {
        value: `<a href="/calculator/fraction-addition-substraction" target="_blank">to access fractional addition/subtraction calculator, click here</a>`,
        type: `span`,
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
  }, [secondPoly, firstPoly, showSteps, isAddition]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    setFirstPoly('');
    setSecondPoly('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = ![secondPoly, firstPoly].some(
    (i) =>
      (i != 0 && !i) ||
      i == '-' ||
      i.endsWith('+') ||
      i.endsWith('-') ||
      i.endsWith('*') ||
      i.indexOf('sqrt') != -1
  );
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
            <div className="col-4 text-left">Operation</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Addition">Addition</option>
                <option value="Subtraction">Subtraction</option>
              </select>
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">I</div>
            <div className={`col-8 ${firstInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setFirstPoly}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={'5x^3 +7x -2xy +3'}
              />
            </div>
          </div>{' '}
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">II</div>
            <div className={`col-8 ${secondInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setSecondPoly}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={'3x^2 -xyz+ 7'}
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

export default AlgebraicPolynomialsAdditionSubtraction;
