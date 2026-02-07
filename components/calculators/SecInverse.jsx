'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import MathInput from 'react-math-keyboard';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { abs, addSymbol, parseNumber, withSymbol } from '../../helpers/decimal';
import { create, all } from 'mathjs';
import { putSpace } from '../../helpers/general';

const config = {};
const math = create(all, config);

const SecInvers = () => {
  const [latex, setLatex] = useState('7');
  const [n, setN] = useState('');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [degree, setDegree] = useState('Degree');
  const [input, setInput] = useState();
  const mf1 = useRef();

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
    } catch {
      // Handle any parsing or evaluation errors
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
      .replaceAll('\\right)', '')
      .replaceAll('^', '');
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
            `Calculate the value of Sec^{-1} {${latex
              .replace('\\frac', '')
              .split('}{')
              .join('\\above{1pt}')}}`
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
          value: `θ:\\space \\bigg<{${latex
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
    function getSubtraction(up, down, isAdd) {
      const gcd = (a, b) => (a ? gcd(b % a, a) : b);
      const lcm = (a, b) => (a * b) / gcd(a, b);
      const answer = down.reduce(lcm);

      const multiple = up.map((item, index) => (item * answer) / down[index]);

      const sumOfAll = multiple.reduce((acc, curr) => {
        return isAdd ? acc + curr : acc - curr;
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
      val = val.replaceAll('}', '').replaceAll('{', '');
      if (
        val.toString()[0] == '-' ||
        (val.toString()[0] == '(' && val.toString()[1] == '-')
      )
        return val.slice(1, val.length);
      return val;
    };

    let fracVals = splitVals(decimalToFraction(n));
    [p, q] = checkDecimal(n) ? fraction(fracVals[0], fracVals[1]) : [p, q];
    const isNeg = Number(input) < 0 ? '-' : '';
    const radian = parseNumber(Math.acos(1 / input), {}, 3);
    const radian2 = parseNumber(Math.acos(abs(1 / input)), {}, 3);
    const degToRad2 = fraction(radToDeg(radian2), 180);
    const degToRad = fraction(radToDeg(radian), 180);

    setDegree(radToDeg(radian));
    const valueWithPI =
      withSymbol(abs(degToRad[0]), '\\pi') + '\\above{1pt}' + degToRad[1];

    const valueWithPI2 =
      withSymbol(abs(degToRad2[0]), '\\pi') + '\\above{1pt}' + degToRad2[1];
    //Radian values for n
    var n1 = getSubtraction([2, degToRad[0]], [1, degToRad[1]], false);
    var minusN1 = getSubtraction([-2, degToRad[0]], [1, degToRad[1]], false);
    var n2 = getSubtraction([4, degToRad[0]], [1, degToRad[1]], false);
    var minusN2 = getSubtraction([-4, degToRad[0]], [1, degToRad[1]], false);
    var n0 = getSubtraction([0, degToRad[0]], [1, degToRad[1]], false);
    var n1Plus = getSubtraction([2, degToRad[0]], [1, degToRad[1]], true);
    var minusN1Plus = getSubtraction([-2, degToRad[0]], [1, degToRad[1]], true);
    var n2Plus = getSubtraction([4, degToRad[0]], [1, degToRad[1]], true);
    var minusN2Plus = getSubtraction([-4, degToRad[0]], [1, degToRad[1]], true);
    var n0Plus = getSubtraction([0, degToRad[0]], [1, degToRad[1]], true);
    //Degree values for n
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);
    var deg2 = parseNumber((n2[0] * 180) / n2[1], {}, 3);
    var deg0 = parseNumber((n0[0] * 180) / n0[1], {}, 3);
    var degMinus1 = parseNumber((minusN1[0] * 180) / minusN1[1], {}, 3);
    var degMinus2 = parseNumber((minusN2[0] * 180) / minusN2[1], {}, 3);
    var deg1Plus = parseNumber((n1Plus[0] * 180) / n1Plus[1], {}, 3);
    var deg2Plus = parseNumber((n2Plus[0] * 180) / n2Plus[1], {}, 3);
    var deg0Plus = parseNumber((n0Plus[0] * 180) / n0Plus[1], {}, 3);
    var degMinus1Plus = parseNumber(
      (minusN1Plus[0] * 180) / minusN1Plus[1],
      {},
      3
    );
    var degMinus2Plus = parseNumber(
      (minusN2Plus[0] * 180) / minusN2Plus[1],
      {},
      3
    );

    const finalAnswer = [
      {
        value: putSpace(
          `The principal value of sec^{-1}({${valueToShow}}) is \\bold{${radToDeg(
            radian
          )}^{o}} or \\bold{${
            p == 1 ? '0' : valueWithPI
          }} or \\bold{${radian}radian}.`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `\\& General Solution is sec^{-1}({${valueToShow}}) = \\bold{2n\\pi  ±({${
            p == 1 ? '0' : valueWithPI
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
        value: `The inverse of the sec of the given value is represented as 
        `,
        type: 'span',
      },
      {
        value: putSpace(
          `y = sec^{-1}(x) or y = arcsec(x) or y = asec(x) \\& defined by a function such that x = sec(y)`
        ),
        type: 'equation',
      },
      {
        value: `The domain of the sec inverse x is
        [-∞, -1] U [1, +∞).`,
        type: 'span',
      },
      {
        value: putSpace(
          `The range of the function is [(0, {\\pi\\above{1pt}2}) U ({\\pi\\above{1pt}2}, \\pi)].`
        ),
        type: 'equation',
      },
      {
        value: `Here we will get <b>two</b> types of solutions for this function`,
        type: 'span',
      },
      {
        value: putSpace(
          `Principal Solution:- Which will lie under the range of the function i.e. [(0, {\\pi\\above{1pt}2}) U ({\\pi\\above{1pt}2}, \\pi)]. `
        ),
        type: 'equation',
      },
      {
        value: `General Solution:- it will have values from – ∞ to + ∞ so the general solution of this function will be as below.`,
        type: 'span',
      },
      {
        value: `\\bold{y = (2n\\pi ± sec^{-1}(x)) }`,
        type: 'equation',
      },
      {
        value: `where n is an integer & sec<sup>-1</sup>(x) represents the principal values of the function only.`,
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
              `Using the following property: sec^{-1}(-x) = \\pi -sec^{-1}(x)`
            )
          : '',
        type: isNeg ? 'equation' : 'span',
      },
      {
        value: `then after putting the value of x`,
        type: 'span',
      },
      {
        value: `
          ${isNeg ? `sec^{-1}(${valueToShow}) =` : ' '} ${
          isNeg ? `\\pi -` : ''
        }sec^{-1}({${removeSymbol(valueToShow)}}) =  ${
          isNeg ? `\\pi - {${valueWithPI2}} =` : ''
        }({${
          p == 1 ? '0' : valueWithPI
        }}) \\space radian \\space or \\space ${radToDeg(
          radian
        )} \\space degree`,
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
        From the table of the Sec values, we can determine the angle such that`,
        type: 'span',
      },
      {
        value: putSpace(
          `Principal Solution is sec^{-1}({${valueToShow}}) =({${
            p == 1 ? '0' : valueWithPI
          }}) radian or ${radToDeg(radian)} degrees`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `General Solution is sec^{-1}({${valueToShow}}) = 2n\\pi ± ({${
            p == 1 ? '0' : valueWithPI
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
          `Angle in Radian ={${simpleValue(minusN2, true)}} \\& {${simpleValue(
            minusN2Plus,
            true
          )}} \\& Angle in Degrees = ${degMinus2} \\& ${degMinus2Plus}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= -1</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(minusN1, true)}} \\& {${simpleValue(
            minusN1Plus,
            true
          )}} \\& Angle in Degrees = ${degMinus1} \\& ${degMinus1Plus}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 0</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(n0, true)}} \\& {${simpleValue(
            n0Plus,
            true
          )}} \\& Angle in Degrees = ${deg0} \\& ${deg0Plus}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 1</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(n1, true)}} \\& {${simpleValue(
            n1Plus,
            true
          )}} \\& Angle in Degrees = ${deg1} \\& ${deg1Plus}`
        ),
        type: 'equation',
      },
      {
        value: `Putting <b>n= 2</b> we get`,
        type: 'span',
      },
      {
        value: putSpace(
          `Angle in Radian ={${simpleValue(n2, true)}} \\& {${simpleValue(
            n2Plus,
            true
          )}} \\& Angle in Degrees = ${deg2} \\& ${deg2Plus}`
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
    setInput('');
    setShowResult(false);
    if (mf1.current) mf1?.current.latex('');
  }, [setShowResult]);

  const hasValue =
    [input].some((v) => (!!v && !isNaN(v)) || v != 0) &&
    (input >= 1 || input <= -1);

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
              setMathfieldRef={(ref) => (mf1.current = ref)}
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
              allowAlphabeticKeyboard={false}
              initialLatex={latex}
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

export default SecInvers;
