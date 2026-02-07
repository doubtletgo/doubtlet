'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import MathInput from 'react-math-keyboard';
import { addSymbol, parseNumber, withSymbol } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { abs } from 'mathjs';
import { create, all } from 'mathjs';
import { getVals, removeSymbol } from '../../helpers/RootSolver';
import { putSpace } from '../../helpers/general';
import { isInputInvalid } from '../../helpers/Validations';
import {
  evalInDecimals,
  evalExpression,
  convertFromLatex,
  valueToKatex,
} from '../../helpers/matrixHelper';

const config = {};
const math = create(all, config);

const CartesianToPolarCoordinates = () => {
  const [latex, setLatex] = useState('5');
  const [r, setR] = useState('3');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [xInvalid, setXInvalid] = useState(true);
  const [yInvalid, setYInvalid] = useState(true);
  const mf1 = useRef();
  const mf2 = useRef();

  const tempLatex = convertFromLatex(latex);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Polar form of the Complex Number = (\\bold{{${
              r || 'a'
            }} ${addSymbol(evalInDecimals(tempLatex))} {${removeSymbol(
              latex || 'b'
            )}}i})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [r, latex]);
  function evalLatex(expression) {
    try {
      const parsedExpression = math.parse(expression);
      const evaluatedResult = parsedExpression.evaluate();
      return evaluatedResult;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const isInvalid = [r, latex]?.some((i) => isInputInvalid(i));

    //Root Expression solving Functions ends here
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Complex Number Z: \\bigg< \\bold{{${r || 'a'}} ${addSymbol(
              evalInDecimals(tempLatex)
            )} {${removeSymbol(latex || 'b')}}i} \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    if (!r || !latex) return;
    const regSqr = new RegExp(/(sqrt)/);
    var lat = latex?.split('\\pi');
    var reg = new RegExp(/\d/);
    var noNum = reg.test(lat[0]);
    var simpleExp = latex
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    //Return if expression is invalid
    if (simpleExp.split('/').some((x) => x.match(regSqr)?.length > 1))
      setYInvalid(true);
    else setYInvalid(false);
    simpleExp = noNum
      ? simpleExp.replace('\\pi', '')
      : simpleExp.replace('\\pi', '1');
    //Return if expression is invalid

    var latR = r.split('\\pi');
    var noNumR = reg.test(latR[0]);
    var simpleExpR = r
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    //Return if expression is invalid
    if (simpleExpR.split('/').some((x) => x.match(regSqr)?.length > 1))
      setXInvalid(true);
    else setXInvalid(false);
    simpleExpR = noNumR
      ? simpleExpR.replace('\\pi', '')
      : simpleExpR.replace('\\pi', '1');
    //Return if expression is invalid

    try {
      math.simplify(simpleExp);
    } catch {
      return;
    }
    if (isInvalid || xInvalid || yInvalid) return;

    const xValue = evalLatex(simpleExpR)?.toString();
    const yValue = evalLatex(simpleExp)?.toString();

    const sqrX = evalExpression(`(${xValue})^2`);
    const sqrY = evalExpression(`(${yValue})^2`);
    const sumOfSqr = evalExpression(`(${sqrX})+(${sqrY})`);

    const root = evalExpression(`sqrt(${sumOfSqr})`);
    const xDivedY = evalExpression(`(${yValue})/(${xValue})`);
    const tanInRadian = evalExpression(`atan(${xDivedY})`);

    const tanIndegree = evalExpression(`((${tanInRadian})* ((180 * 7) / 22))`);

    if (!xValue || !yValue) return;
    // perimeter calculation

    //Functions
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
    function radToDeg(radians) {
      var pi = Math.PI;
      return Math.round(radians * (180 / pi));
    }
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
    function simpleValue(arr) {
      var first = arr[0];
      var second = arr[1];
      var symbol = first < 0 ? addSymbol(first) : '';
      return first == 0
        ? '0'
        : `{${symbol}{${withSymbol(abs(first), '\\pi')}${
            second == 1 ? '' : `\\above{1pt}${second}`
          }}}`;
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

    var strToPass = simpleExp
      .replace('/', '\\above{1pt}')
      .replaceAll('sqrt', '\\sqrt');
    var tanInv = getVals(
      strToPass,
      simpleExpR.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      true
    );
    if (tanInv !== 0 && !tanInv) return;
    var valToCalc = tanInv
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var result = evalLatex(valToCalc)?.toString();
    var radian = parseNumber(Math.atan(result), {}, 3);
    const degToRad = fraction(radToDeg(radian), 180);
    const radianWithPi = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    var n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);

    const bothZero = xValue == 0 && yValue == 0;
    var piValue;

    if (xValue > 0 && yValue > 0) {
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    } else if (xValue < 0 && yValue > 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
    } else if (xValue < 0 && yValue < 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
    } else if (xValue > 0 && yValue < 0) {
      piValue = `2\\pi +`;
      n1 = getSubtraction([2, degToRad[0]], [1, degToRad[1]]);
    } else if (xValue == 0 && yValue > 0) {
      piValue = ``;
      tanInv = `\\infty`;
      n1 = getSubtraction([0, 1], [1, 2]);
    } else if (xValue == 0 && yValue < 0) {
      piValue = ``;
      n1 = getSubtraction([1, 1], [1, 2]);
      tanInv = `\\infty`;
    } else if (xValue > 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 0], [1, 1]);
    } else if (xValue < 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 1], [1, 1]);
    } else if (xValue == 0 && yValue == 0) {
      piValue = ``;
    }
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);

    tanInv = tanInv?.toString().replaceAll('(', '').replaceAll(')', '');

    const finalAnswer = [
      {
        value: putSpace(
          `The polar form of the Complex Number (\\bold{{${
            r || 'a'
          }} ${addSymbol(evalInDecimals(tempLatex))} {${removeSymbol(
            latex || 'b'
          )}}i}) is`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          ` = \\sqrt{{${valueToKatex(
            sumOfSqr
          )}}} (cos(tan^{-1} \\bigg({{${latex}} \\above{1pt}{${r}}}\\bigg))) + i sin((tan^{-1} \\bigg({{${latex}} \\above{1pt}{${r}}}\\bigg))) =  \\sqrt{{${valueToKatex(
            root
          )}}}  (cos(\\bold{${evalInDecimals(
            tanIndegree
          )}}^\\degree) + sin({\\bold{${evalInDecimals(
            tanIndegree
          )}}}^\\degree))`
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
        value: putSpace(`We know that the Polar form of the Complex Number`),
        type: 'equation',
      },

      {
        value: putSpace(
          `z = (a + ib) is given by \\bold{r (cos \\theta + i sin \\theta)} where, `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `r = \\sqrt{(a^2 +b^2)} \\& \\theta = tan^{-1} \\bigg({b\\above{1pt}a} \\bigg)`
        ),
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given  Input `,
        type: 'span',
      },
      {
        value: putSpace(
          `a = {${valueToKatex(xValue)}},   b = {${valueToKatex(yValue)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `then by putting these values in the above given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `r = \\sqrt{ \\bigg({${valueToKatex(
            xValue
          )}}\\bigg)^2+\\bigg({${valueToKatex(
            yValue
          )}}\\bigg)^2} = \\sqrt{{${valueToKatex(sqrX)}} + {${valueToKatex(
            sqrY
          )}} } = \\sqrt{{${valueToKatex(sumOfSqr)}}} `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/modulus-of-a-complex-number/?l=${sqrX},${sqrY}" target="_blank">to see the Steps for modulus of complex calculation, click here</a>`,
        type: `span`,
      },

      {
        value: putSpace(
          `\\theta ={${piValue}} tan^{-1} {({ ${latex}}) \\above{1pt} ({ ${r}} )} = ${
            bothZero
              ? 'Not Defined'
              : `{${piValue}} tan^{-1}({${tanInv}})  {${
                  xValue == 0
                    ? ''
                    : `={${piValue}}(${simpleValue(radianWithPi)})`
                }} ={${simpleValue(n1)}} radian or ${deg1}\\degree`
          }`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/argument-of-a-complex-number-calculator/?a=${tanInv}" target="_blank">to see the Steps for Argument of a complex  calculation, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: `<a href = "/calculator/tan-inverse-calculator/?a=${tanInv}" target="_blank">to see the Steps for tan inverse calculation, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we can write the polar as`,
        type: 'span',
      },

      {
        value: putSpace(
          `{${valueToKatex(xValue)}} + {${valueToKatex(
            yValue
          )}}   i = \\sqrt{{${valueToKatex(
            sumOfSqr
          )}}} (cos(tan^{-1} \\bigg({{${latex}} \\above{1pt}{${r}}}\\bigg))) + i sin((tan^{-1} \\bigg({{${latex}} \\above{1pt}{${r}}}\\bigg)))`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`or`),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${valueToKatex(xValue)}} + {${valueToKatex(
            yValue
          )}}   i =  \\sqrt{{${valueToKatex(
            root
          )}}}  (cos(\\bold{${evalInDecimals(
            tanIndegree
          )}}^\\degree) + sin({\\bold{${evalInDecimals(
            tanIndegree
          )}}}^\\degree))`
        ),
        type: 'equation',
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
  }, [r, latex, showSteps, xInvalid, yInvalid]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    setLatex('');
    setR('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const bothVals = false;
  const hasValue = r && latex && !bothVals;
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
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="d-flex mb-2 align-items-center">
            <div className="col-4   text-left">Complex Number (Z):</div>
            <div className={`col-4 me-2  `}>
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setR}
                initialLatex={r}
                allowAlphabeticKeyboard={false}
                style={{ width: '95%' }}
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
            <div className={`col-4 `}>
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setLatex}
                initialLatex={latex}
                allowAlphabeticKeyboard={false}
                style={{ width: '95%' }}
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
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />{' '}
      <div className="mt-3 mb-2">
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

export default CartesianToPolarCoordinates;
