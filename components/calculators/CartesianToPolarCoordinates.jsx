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
import { getVals, getRoot } from '../../helpers/RootSolver';
import { putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isInputInvalid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const CartesianToPolarCoordinates = () => {
  const [latex, setLatex] = useState('8');
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

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Convert the cartesian coordinates (x, y) =({${r || 'x'}}, {${
              latex || 'y'
            }}) to polar coordinates.`
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
    const getSquare = (val) => {
      val = val.replaceAll('(', '').replaceAll(')', '');
      var values = val.split('/');
      if (values[0].indexOf('sqrt') >= 0) {
        let sqrVals = values[0].split('sqrt');
        values[0] = (sqrVals[0] ** 2 || 1) * sqrVals[1];
      } else {
        values[0] = values[0] ** 2;
      }
      if (values[1]?.indexOf('sqrt') >= 0) {
        let sqrVals = values[0].split('sqrt');
        values[1] = (sqrVals[0] ** 2 || 1) * sqrVals[1];
      } else values[1] = values[1] ** 2;
      if (!values[1]) return [values[0], 1];
      else return values;
    };
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
            `Point P(x, y): \\bigg<{${r || 'x'}}, ${latex || 'y'} \\bigg>`
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
    const latexSqr = getSquare(simpleExp);
    const noAbove = latexSqr[1] == 1;

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
    const rSqr = getSquare(simpleExpR);

    try {
      math.simplify(simpleExp);
    } catch {
      return;
    }
    if (isInvalid || xInvalid || yInvalid) return;

    const xValue = evalLatex(simpleExpR)?.toString();
    const yValue = evalLatex(simpleExp)?.toString();

    if (!xValue || !yValue) return;
    // perimeter calculation
    const upperVal = [rSqr[0], latexSqr[0]];
    const lowerVal = [rSqr[1], latexSqr[1]];

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
    //Functions

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const answer = lowerVal.reduce(lcm);

    const multiple = upperVal.map(
      (item, index) => (item * answer) / lowerVal[index]
    );

    const sumOfAll = multiple.reduce((acc, curr) => {
      return acc + curr;
    });
    const [numR, denumR] = fraction(sumOfAll, answer);
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
    var polarAngle;
    var piValue;
    var qudarantText;

    if (xValue > 0 && yValue > 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})}`;
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x>0 and y>0} (Point lies in \\bold{1^{st}} quadrant)`;
    } else if (xValue < 0 && yValue > 0) {
      polarAngle = `\\pi + tan^{-1}({y \\above{1pt}x})}`;
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x<0 and y>0} (Point lies in \\bold{2^{nd}} quadrant)`;
    } else if (xValue < 0 && yValue < 0) {
      polarAngle = `\\pi + tan^{-1}({y \\above{1pt}x})}`;
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x<0 and y<0} (Point lies in \\bold{3^{rd}} quadrant)`;
    } else if (xValue > 0 && yValue < 0) {
      polarAngle = `2\\pi + tan^{-1}({y \\above{1pt}x})}`;
      piValue = `2\\pi +`;
      n1 = getSubtraction([2, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x>0 and y<0} (Point lies in \\bold{4^{th}} quadrant)`;
    } else if (xValue == 0 && yValue > 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})} = {\\pi\\above{1pt}2}radian or 90 Degrees`;
      piValue = ``;
      tanInv = `\\infty`;
      n1 = getSubtraction([0, 1], [1, 2]);
      qudarantText = `Since \\bold{x=0 and y>0} (Point lies on \\bold{positive Y - axis})`;
    } else if (xValue == 0 && yValue < 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})} = {3\\pi\\above{1pt}2}radian or 270 Degrees`;
      piValue = ``;
      n1 = getSubtraction([1, 1], [1, 2]);
      tanInv = `\\infty`;
      qudarantText = `Since \\bold{x=0 and y<0} (Point lies on \\bold{negative Y - axis})`;
    } else if (xValue > 0 && yValue == 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})} = 0 radian or 0 Degrees`;
      piValue = ``;
      n1 = getSubtraction([0, 0], [1, 1]);
      qudarantText = `Since \\bold{x>0 and y=0} (Point lies on \\bold{positive X - axis})`;
    } else if (xValue < 0 && yValue == 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})} = {\\pi} radian or 180 Degrees`;
      piValue = ``;
      n1 = getSubtraction([0, 1], [1, 1]);
      qudarantText = `Since \\bold{x<0 and y=0} (Point lies on \\bold{negative X - axis})`;
    } else if (xValue == 0 && yValue == 0) {
      polarAngle = `tan^{-1}({y \\above{1pt}x})} = Not Defined`;
      piValue = ``;
      qudarantText = `Since \\bold{x=0 and y=0} (Point lies on \\bold{Origin})`;
    }
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);

    var rAns = `${
      (numR == '1') & (denumR == '1')
        ? `1`
        : `{${parseNumber(getRoot(numR, false))} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${parseNumber(getRoot(denumR, false))}`
          }}`
    }`;
    rAns = rAns.replaceAll('(', '').replaceAll(')', '');
    tanInv = tanInv?.toString().replaceAll('(', '').replaceAll(')', '');

    const finalAnswer = [
      {
        value: putSpace(
          `The value of the cartesian coordinates (x,y) = ({${r.replace(
            '/',
            '\\above{1pt}'
          )}},{${latex}}) to`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`polar coordinates is`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(r,\\theta) = \\bigg({${rAns}},{${
            bothZero ? 'Not Defined' : simpleValue(n1)
          }}\\bigg) or \\bigg({${rAns}},{${
            bothZero ? 'Not Defined' : deg1
          }}°\\bigg)`
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
        value: `The position of any point P in the Argand plane can be represented<br>  by the cartesian or rectangular 
         form of coordinates as (x, y)<br> where x represents the perpendicular distance of the point from <br>the y-axis and
         y represents the perpendicular distance <br>of the point from the x-axis.
        `,
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
        value: `Given  Input `,
        type: 'span',
      },
      {
        value: `x={${r}}`,
        type: 'equation',
      },
      {
        value: `{y = ${latex}} `,
        type: 'equation',
      },
      {
        value: `To convert the above given cartesian coordinate to polar<br> we will use the formula as`,
        type: 'span',
      },
      {
        value: `\\bold{Radial \\space distance = r = \\sqrt{(x^2 + y^2)}},`,
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Polar angle = \\theta = ${polarAngle}`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `
        Now, by putting the above values in the above-given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `r = \\sqrt{[({${r}})^2 + (${latex})^2]}= \\sqrt{[({${parseNumber(
            rSqr[0]
          )} ${rSqr[1] == '1' ? `` : `\\above{1pt} ${rSqr[1]}`}}) + ({${
            noAbove ? latexSqr[0] : latexSqr.join('\\above{1pt}')
          }})]} = ${
            (numR == '1') & (denumR == '1') ? `` : `\\sqrt`
          }{${parseNumber(numR)} ${
            denumR == '1' ? `` : `\\above{1pt} ${parseNumber(denumR)}`
          } } = {${rAns}}
          `
        ),
        type: 'equation',
      },
      {
        value: putSpace(qudarantText),
        type: 'equation',
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
        value: `<a href = "/calculator/tan-inverse-calculator/?a=${tanInv}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
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
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of any real number
          </div>

          <div className="d-flex mb-2 align-items-center">
            <div className="col-4   text-left">Point P(x, y):</div>
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
