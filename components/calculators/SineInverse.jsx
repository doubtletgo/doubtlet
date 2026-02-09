'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import MathInput from 'react-math-keyboard';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { abs, addSymbol, parseNumber, withSymbol } from '../../helpers/decimal';
import { create, all } from 'mathjs';
import { putSpace } from '../../helpers/general';

const config = {};
const math = create(all, config);

const SineInverse = () => {
  const [latex, setLatex] = useLocalStorage('SineInverse_latex', '-1');
  const [n, setN] = useLocalStorage('SineInverse_n', '');
  const [equation, setEquation] = useLocalStorage('SineInverse_equation', '');
  const [solution, setSolution] = useLocalStorage('SineInverse_solution', '');
  const [result, setResult] = useLocalStorage('SineInverse_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SineInverse_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SineInverse_showSteps', true);
  const [note, setNote] = useLocalStorage('SineInverse_note', undefined);
  const [degree, setDegree] = useLocalStorage('SineInverse_degree', 'Degree');
  const [input, setInput] = useLocalStorage('SineInverse_input', undefined);

  function radToDeg(radians) {
    var pi = Math.PI;
    return Math.round(radians * (180 / pi));
  }
  function splitVals(val) {
    return val?.split('\\above{1pt}');
  }
  function simpleValue(arr, pi) {
    var first = arr[0];
    var second = arr[1];
    var symbol = first < 0 ? addSymbol(first) : '';
    return first == 0
      ? '0'
      : pi
      ? `{${symbol}{${withSymbol(abs(first), '\\pi')}${
          second == 1 ? '' : `\\above{1pt}${second}`
        }}}`
      : `{${symbol}{${abs(first)}${
          second == 1 ? '' : `\\above{1pt}${second}`
        }}}`;
  }

  function evalLatex(expression) {
    try {
      // Parse the LaTeX expression
      const parsedExpression = math.parse(expression);

      // Evaluate the parsed expression
      const evaluatedResult = parsedExpression.evaluate();

      // Return the evaluated result
      return evaluatedResult;
    } catch (error) {
      // Handle any parsing or evaluation errors
      console.error('Error evaluating LaTeX expression:', error);
      return null;
    }
  }

  let [p, q = 1] = n?.split('/');

  useEffect(() => {
    var expr = latex
      .replaceAll('\\frac', '')
      .replaceAll('}{', '/')
      .replaceAll('}', '')
      .replaceAll('{', '')
      .replaceAll('\\sqrt', '√');
    var expr2 = latex
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');

    setInput(evalLatex(expr2)?.toString());
    setN(expr.replace('√', ''));

    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the value of Sin^{-1} ({${latex
              .replace('\\frac', '')
              .split('}{')
              .join('\\above{1pt}')}})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [n, latex, degree]);

  useEffect(() => {
    const isInvalid = [input].some((x) => !x);
    const valueToShow = !checkDecimal(latex)
      ? latex.replace('\\frac', '').split('}{').join('\\above{1pt}')
      : fraction(
          splitVals(decimalToFraction(latex))[0],
          splitVals(decimalToFraction(latex))[1]
        ).join('\\above{1pt}');
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Sin \\space Inverse \\space Value:\\space \\bigg<{${latex
            .replace('\\frac', '')
            .split('}{')
            .join('\\above{1pt}')}}\\bigg>`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    //perimeter calculation
    function checkDecimal(n) {
      var isDecimal = n?.toString().indexOf('.') > 0;

      return isDecimal;
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
    // Function to subtract Fractional Values
    function getSubtraction(up, down) {
      const gcd = (a, b) => (a ? gcd(b % a, a) : b);
      const lcm = (a, b) => (a * b) / gcd(a, b);
      const answer = down.reduce(lcm);

      const multiple = up.map((item, index) => (item * answer) / down[index]);

      const sumOfAll = multiple.reduce((acc, curr) => {
        return acc + curr;
      });
      return [sumOfAll, answer];
    }
    function decimalToFraction(val) {
      val = val?.toString();
      if (!val) return;
      if (checkDecimal(val)) {
        return (
          val.replace('.', '') +
          `\\above{1pt}` +
          10 ** val.split('.')[1]?.length
        );
      }
      return val + `\\above{1pt}` + 1;
    }
    const removeSymbol = (val) => {
      if (val.toString()[0] == '-') return val.slice(1, val.length);
      return val;
    };

    let fracVals = splitVals(decimalToFraction(n));
    [p, q] = checkDecimal(n) ? fraction(fracVals[0], fracVals[1]) : [p, q];
    const isNeg = Number(input) < 0 ? '-' : '';
    const radian = parseNumber(Math.asin(input), {}, 3);
    const degToRad = fraction(radToDeg(radian), 180);
    setDegree(radToDeg(radian));
    const valueWithPI =
      withSymbol(abs(degToRad[0]), '\\pi') + '\\above{1pt}' + degToRad[1];

    //Radian values for n
    var n1 = getSubtraction([1, -degToRad[0]], [1, degToRad[1]]);
    var minusN1 = getSubtraction([-1, -degToRad[0]], [1, degToRad[1]]);
    var n2 = getSubtraction([2, degToRad[0]], [1, degToRad[1]]);
    var minusN2 = getSubtraction([-2, degToRad[0]], [1, degToRad[1]]);
    var n0 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    //Degree values for n
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);
    var deg2 = parseNumber((n2[0] * 180) / n2[1], {}, 3);
    var deg0 = parseNumber((n0[0] * 180) / n0[1], {}, 3);
    var degMinus1 = parseNumber((minusN1[0] * 180) / minusN1[1], {}, 3);
    var degMinus2 = parseNumber((minusN2[0] * 180) / minusN2[1], {}, 3);

    const finalAnswer = [
      {
        value: putSpace(
          `The principal value of sin^{-1}({${valueToShow}}) is \\bold{${radToDeg(
            radian
          )}^{o}} or \\bold{${isNeg}}\\bold{${
            p == 0 ? '0' : valueWithPI
          }} or \\bold{${radian}radian}.`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `\\& General Solution is sin^{-1}({${valueToShow}}) = \\bold{n\\pi + (-1)^{n}(${isNeg}{${
            p == 0 ? '0' : valueWithPI
          }})}`
        ),
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
        value: `The inverse of the sin of the given value is represented as 
        `,
        type: 'span',
      },
      {
        value: putSpace(
          `y = sin^{-1}(x) or y = arcsin(x) or y = asin(x) \\& defined by a function such that x = sin(y)`
        ),
        type: 'equation',
      },
      {
        value: `The domain of the sin inverse x is [-1, 1].`,
        type: 'span',
      },
      {
        value: putSpace(
          `The range of the function is [-{\\pi \\above{1pt}2}, {\\pi \\above{1pt}2}].`
        ),
        type: 'equation',
      },
      {
        value: `Here we will get two types of solutions for this function`,
        type: 'span',
      },
      {
        value: putSpace(
          `Principal Solution:- Which will lie under the range of the function i.e. [-{\\pi \\above{1pt}2}, {\\pi \\above{1pt}2}]. `
        ),
        type: 'equation',
      },
      {
        value: `General Solution: - it will have values from – ∞ to + ∞ so the general solution of this function will be as below.`,
        type: 'span',
      },
      {
        value: `\\bold{y = (n\\pi + (-1)^{n} sin^{-1}(x)) }`,
        type: 'equation',
      },
      {
        value: `where n is an integer & sin<sup>-1</sup>(x) represents the principal values of the function only.`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Given value x =${checkDecimal(n) ? `${n} or` : ''} {${valueToShow}} `
        ),
        type: 'equation',
      },
      {
        value: isNeg
          ? putSpace(
              `Using the following property: sin^{-1}(-x) = -sin^{-1}(x)`
            )
          : '',
        type: isNeg ? 'equation' : 'span',
      },
      {
        value: `then after putting the value of x `,
        type: 'span',
      },
      {
        value: putSpace(`
          ${
            isNeg ? `sin^{-1}(${valueToShow}) =` : ' '
          } ${isNeg}sin^{-1}({${removeSymbol(valueToShow)}}) = ${isNeg}({${
          p == 0 ? '0' : valueWithPI
        }}) radian or ${radToDeg(radian)} degree`),
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `
        From the table of the sin values, we can determine the angle such that`,
        type: 'span',
      },
      {
        value: putSpace(
          `Principal Solution is sin^{-1}({${valueToShow}}) = ${isNeg}({${
            p == 0 ? '0' : valueWithPI
          }}) radian or ${radToDeg(radian)} degrees`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `General Solution is sin^{-1}({${valueToShow}}) = n\\pi + (-1)^{n}(${isNeg}{${
            p == 0 ? '0' : valueWithPI
          }})`
        ),
        type: 'equation',
      },
      {
        value: `Where n = 0, ±1, ±2, ±3, …… ∞`,
        type: 'span',
      },
      'br',
      {
        value: `Putting <b>n= -2</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(
            minusN2,
            true
          )}} \\& Angle in Degrees = ${degMinus2}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= -1</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(
            minusN1,
            true
          )}} \\& Angle in Degrees = ${degMinus1}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 0</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(
            n0,
            true
          )}} \\& Angle in Degrees = ${deg0}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 1</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(
            n1,
            true
          )}} \\& Angle in Degrees = ${deg1}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 2</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(
            n2,
            true
          )}} \\& Angle in Degrees = ${deg2}`
        ),
        type: 'equation',
      },
      {
        value: `We can take other integral values of n to obtain other values of the angle as per our requirement.`,
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
  }, [n, latex, showSteps, degree]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setLatex('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    [input].some((v) => (!!v && !isNaN(v)) || v === 0) &&
    input >= -1 &&
    input <= 1;

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in form of any real number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Enter Value</div>
            <MathInput
              setValue={setLatex}
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
              initialLatex={latex}
              allowAlphabeticKeyboard={false}
            />
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

export default SineInverse;
