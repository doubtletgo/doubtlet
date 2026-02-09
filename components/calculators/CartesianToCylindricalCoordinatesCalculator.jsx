'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import MathInput from 'react-math-keyboard';
import { addSymbol, parseNumber, withSymbol } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { abs } from 'mathjs';
import { create, all } from 'mathjs';
import { getRoot, removeSymbol } from '../../helpers/RootSolver';
import { putSpace, refValue } from '../../helpers/general';
import {
  convertToKatex,
  convertToLowestRootForm,
} from '../../helpers/SolveRoot';

const config = {};
const math = create(all, config);

const CartesianToCylindricalCoordinates = () => {
  const [latexX, setLatexX] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_latexX', '7');
  const [latex, setLatex] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_latex', '2');
  const [z, setZ] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_z', '5');
  const [equation, setEquation] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_solution', '');
  const [result, setResult] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_note', undefined);
  const [xInvalid, setXInvalid] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_xInvalid', false);
  const [yInvalid, setYInvalid] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_yInvalid', false);
  const [zInvalid, setZInvalid] = useLocalStorage('CartesianToCylindricalCoordinatesCalculator_zInvalid', false);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

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
            `Convert the cartesian coordinate (x, y, z) = ({${
              latexX || 'x'
            } }, ${latex || 'y'}, {${z || 'z'}}) to cylindrical coordinate.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [latex, latexX, z]);

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
    const isInvalid = [latex, latexX, z].some(
      (i) => (i != 0 && !i) || i == '-'
    );
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
          type: `span`,
        },
        'br',
        {
          value: `Point \\space P \\space(x, \\space y ,\\space z):\\space \\bigg< {${
            latexX || 'x'
          }}, \\space {${latex || 'y'}} , {${z || 'z'}}\\bigg>`,
          type: 'equation',
        },
      ])
    );

    const regSqr = new RegExp(/(sqrt)/);
    //function for solving values of X
    var latX = latexX.split('\\pi');
    var regX = new RegExp(/\d/);
    var noNumX = regX.test(latX[0]);
    var simpleExpX = latexX
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    //Return if expression is invalid
    if (simpleExpX.split('/').some((x) => x.match(regSqr)?.length > 1))
      setXInvalid(true);
    else setXInvalid(false);
    simpleExpX = noNumX
      ? simpleExpX.replace('\\pi', '')
      : simpleExpX.replace('\\pi', '1');
    //Return if expression is invalid
    const latexXSqr = getSquare(simpleExpX).map((i) => removeSymbol(i));
    const noAboveX = latexXSqr[1] == 1;

    try {
      math.simplify(simpleExpX);
    } catch {
      return;
    }

    //function for solving values of Y
    var lat = latex.split('\\pi');
    var noNum = regX.test(lat[0]);
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
    const latexSqr = getSquare(simpleExp).map((i) => removeSymbol(i));
    const noAbove = latexSqr[1] == 1;

    // //Return if expression is invalid
    //function for solving values of X
    var latZ = z.split('\\pi');
    var noNumZ = regX.test(latZ[0]);
    var simpleExpZ = z
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    if (simpleExpZ.split('/').some((x) => x.match(regSqr)?.length > 1))
      setZInvalid(true);
    else setZInvalid(false);
    simpleExpZ = noNumZ
      ? simpleExpZ.replace('\\pi', '')
      : simpleExpZ.replace('\\pi', '1');
    //Return if expression is invalid

    if (isInvalid || xInvalid || yInvalid || zInvalid) return;
    try {
      math.simplify(simpleExpX);
    } catch {
      return;
    }
    const upperVal = [latexXSqr[0], latexSqr[0]].map(
      (i) => removeSymbol(i) || 0
    );
    const lowerVal = [latexXSqr[1], latexSqr[1]].map(
      (i) => removeSymbol(i) || 0
    );

    // //Functions
    function fraction(numR, denumR = 1) {
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

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);

    function getSubtraction(up, down) {
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

    const answer = lowerVal.reduce(lcm);
    const multiple = upperVal.map(
      (item, index) => (item * answer) / lowerVal[index]
    );
    const sumOfAll = multiple.reduce((acc, curr) => {
      return acc + curr;
    });
    const [numR, denumR] = fraction(sumOfAll, answer);

    var tanAnswer = convertToKatex(
      simpleExp.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      simpleExpX.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      true
    );
    if (tanAnswer != 0 && !tanAnswer) return;
    var valToCalc = tanAnswer
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var result = evalLatex(valToCalc)?.toString();
    const radian = parseNumber(Math.atan(result), {}, 3);
    if (radian != 0 && !radian) return;
    const degToRad = fraction(radToDeg(radian), 180);
    var n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);
    tanAnswer = tanAnswer?.toString().replaceAll('(', '').replaceAll(')', '');
    var xAnswer =
      (numR == '1') & (denumR == '1')
        ? `1`
        : `{${parseNumber(getRoot(numR, false))} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${parseNumber(getRoot(denumR, false))}`
          }}`;
    var xAns = evalLatex(
      xAnswer
        .replaceAll('\\sqrt', 'sqrt')
        .replace('\\above{1pt}', '/')
        .replaceAll('{', '(')
        .replaceAll('}', ')')
    )?.toString();
    xAnswer = xAnswer.replaceAll('(', '').replaceAll(')', '');

    const radianWithPi = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    const xValue = evalLatex(simpleExpX)?.toString();
    const yValue = evalLatex(simpleExp)?.toString();
    //Quadrant Condition
    const bothZero = xValue == 0 && yValue == 0;
    var piValue;
    var qudarantText;
    if (xValue > 0 && yValue > 0) {
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since  \\bold{(x>0)  \\&  (y>0)}  (Point lies in \\bold{1^{st}} quadrant)`;
    } else if (xValue < 0 && yValue > 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{(x<0) \\& (y>0)} (Point lies in \\bold{2^{nd}} quadrant)`;
    } else if (xValue < 0 && yValue < 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{(x<0)  \\& (y<0)} (Point lies in \\bold{3^{rd}} quadrant)`;
    } else if (xValue > 0 && yValue < 0) {
      piValue = `2\\pi +`;
      n1 = getSubtraction([2, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{(x>0)  \\& (y<0)} (Point lies in \\bold{4^{th}} quadrant)`;
    } else if (xValue == 0 && yValue > 0) {
      piValue = ``;
      tanAnswer = `\\infty`;
      n1 = getSubtraction([0, 1], [1, 2]);
      qudarantText = `Since \\bold{(x=0)  \\& (y>0)} (Point lies on \\bold{positive Y - axis})`;
    } else if (xValue == 0 && yValue < 0) {
      piValue = ``;
      n1 = getSubtraction([1, 1], [1, 2]);
      tanAnswer = `\\infty`;
      qudarantText = `Since \\bold{(x=0)  \\& (y<0)} (Point lies on \\bold{negative Y - axis})`;
    } else if (xValue > 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 0], [1, 1]);
      qudarantText = `Since \\bold{(x>0)  \\& (y=0)} (Point lies on \\bold{positive X - axis})`;
    } else if (xValue < 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 1], [1, 1]);
      qudarantText = `Since \\bold{(x<0)  \\& (y=0)} (Point lies on \\bold{negative X - axis})`;
    } else if (xValue == 0 && yValue == 0) {
      piValue = ``;
      qudarantText = `Since \\bold{(x=0) \\& (y=0)} (Point lies on \\bold{Origin})`;
    }
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);

    const finalAnswer = [
      {
        value: putSpace(
          `The value of the cartesian coordinates (x,y ,z) = ({${latexX}}, {${latex}}, {${z}}) to cylindrical coordinates is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bold{(r, θ, z) = ( ${
            numR == '1' && denumR == '1' ? `` : `\\sqrt`
          }{${parseNumber(numR)} ${
            denumR == '1' ? `` : `\\above{1pt} ${parseNumber(denumR)}`
          }} , {${simpleValue(n1)}}^c, {${z}}) or( {${convertToLowestRootForm(
            numR
          )} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${convertToLowestRootForm(denumR)}`
          }},{${deg1}\\degree}, {${z}})}`
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
        value: `The position of any point in 3-D in the Cylindrical coordinate system can be
        `,
        type: 'span',
      },
      {
        value: putSpace(
          `represented as (r, θ, z) where r represents the radial distance of the point from `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `from the origin and θ represents the azimuthal angle made by the line joining the point P`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `to origin with the positive direction of x-axis and z represents`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`the height of the point from the plane.`),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given \\space Input`,
        type: 'equation',
      },
      {
        value: `x= ${latexX}`,
        type: 'equation',
      },
      {
        value: `y = ${latex} `,
        type: 'equation',
      },
      {
        value: `z= ${z}`,
        type: 'equation',
      },
      {
        value: `To convert the above given cartesian coordinate to Cylindrical we will use the formula as`,
        type: 'span',
      },
      {
        value: `r = \\sqrt{(x^2 + y^2 )}`,
        type: 'equation',
      },
      {
        value: `\\theta = tan^{-1}({y \\above{1pt}x})`,
        type: 'equation',
      },
      {
        value: `z = z`,
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Now, by putting the above values in the above-given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `r = \\sqrt{(${latexX})^2 + (${latex})^2 }= \\sqrt{({${
            noAboveX ? latexXSqr[0] : latexXSqr.join('\\above{1pt}')
          }}) + ({${
            noAbove ? latexSqr[0] : latexSqr.join('\\above{1pt}')
          }})} = {${convertToLowestRootForm(numR)} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${convertToLowestRootForm(denumR)}`
          }} = ${parseNumber(xAns, {}, 3)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(qudarantText),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\theta ={${piValue}} tan^{-1} {({ ${latex}}) \\above{1pt} ({ ${latexX}} )} = ${
            bothZero
              ? 'Not Defined'
              : `{${piValue}} tan^{-1}({${tanAnswer}})  {${
                  xValue == 0
                    ? ''
                    : `={${piValue}}(${simpleValue(radianWithPi)})`
                }} ={${simpleValue(n1)}}^c or ${deg1}\\degree`
          }`
        ),
        type: 'equation',
      },

      {
        value: `<a href = "/calculator/Tan-Inverse/?a=${refValue(
          tanAnswer
        )}" target="_blank">to see Steps click here</a>`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `z = {${z}}`,
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
  }, [latex, z, latexX, showSteps]);

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
    mf3?.current.latex('');

    setLatex('');
    setLatexX('');
    setZ('');
    setShowResult(false);
  }, [setShowResult]);

  const bothVals = latex.indexOf('°') > 0 && latex.indexOf('\\pi') >= 0;
  const hasValue =
    [z, latex, latexX].every((r) => !!r) &&
    !bothVals &&
    !xInvalid &&
    !yInvalid &&
    !zInvalid;
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
            Your input can be in form of an Integer, Fraction, Decimal, or any
            real number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">Point X</div>
            <div className={`col-9 ${xInvalid ? 'invalid' : ''}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setLatexX}
                numericToolbarKeys={[]}
                allowAlphabeticKeyboard={false}
                initialLatex={latexX}
              />
            </div>
          </div>{' '}
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">Point Y</div>
            <div className={`col-9 ${yInvalid ? 'invalid' : ''}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setLatex}
                numericToolbarKeys={[]}
                allowAlphabeticKeyboard={false}
                initialLatex={latex}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">Point Z</div>
            <div className={`col-9 ${zInvalid ? 'invalid' : ''}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setZ}
                numericToolbarKeys={[]}
                allowAlphabeticKeyboard={false}
                initialLatex={z}
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
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default CartesianToCylindricalCoordinates;
