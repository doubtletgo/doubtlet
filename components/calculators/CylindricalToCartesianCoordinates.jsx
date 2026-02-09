'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import MathInput from 'react-math-keyboard';
import { parseNumber } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { create, all } from 'mathjs';
import { putSpace } from '../../helpers/general';
import {
  FindCosineData,
  FindSineData,
} from '../../utils/constants/Angle-table';
import { convertToKatex } from '../../helpers/SolveRoot';

const config = {};
const math = create(all, config);

const CylindricalToCartesianCoordinates = () => {
  const [latexR, setLatexR] = useLocalStorage('CylindricalToCartesianCoordinates_latexR', '5');
  const [theta, setTheta] = useLocalStorage('CylindricalToCartesianCoordinates_theta', '3');
  const [z, setZ] = useLocalStorage('CylindricalToCartesianCoordinates_z', '4');
  const [equation, setEquation] = useLocalStorage('CylindricalToCartesianCoordinates_equation', '');
  const [solution, setSolution] = useLocalStorage('CylindricalToCartesianCoordinates_solution', '');
  const [result, setResult] = useLocalStorage('CylindricalToCartesianCoordinates_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('CylindricalToCartesianCoordinates_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('CylindricalToCartesianCoordinates_showSteps', true);
  const [note, setNote] = useLocalStorage('CylindricalToCartesianCoordinates_note', undefined);
  const [xInvalid, setXInvalid] = useLocalStorage('CylindricalToCartesianCoordinates_xInvalid', false);
  const [yInvalid, setYInvalid] = useLocalStorage('CylindricalToCartesianCoordinates_yInvalid', false);
  const [zInvalid, setZInvalid] = useLocalStorage('CylindricalToCartesianCoordinates_zInvalid', false);
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
            `Convert the cylindrical coordinate (r, θ, z) = \\bigg(\\bold{${
              latexR || 'r'
            }, ${theta || 'θ'}, ${z || 'z'}}\\bigg) to cartesian coordinates.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [theta, latexR, z]);

  function evalLatex(expression) {
    try {
      const parsedExpression = math.parse(expression);
      const evaluatedResult = parsedExpression.evaluate();
      return evaluatedResult;
    } catch {
      return null;
    }
  }
  const degOrRad = (val, isDeg) => {
    var num = Number(val);
    return isDeg ? (3.14 * num) / 180 : num;
  };

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: putSpace(
            `Point P (r, θ, z): - \\bigg<\\bold{{${latexR || 'r'}},{ ${
              theta || 'θ'
            }}, {${z || 'z'}}}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [latexR, theta, z].some((i) => !i || i == '-');
    const hasPI = theta.indexOf('pi') != -1;
    const regSqr = new RegExp(/(sqrt)/);
    const isDegree = theta.indexOf('°') != -1;
    var simpleR = latexR
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    if (simpleR.split('/').some((x) => x.match(regSqr)?.length > 1))
      setXInvalid(true);
    else setXInvalid(false);

    var lat = theta.split('\\pi');
    var reg = new RegExp(/\d/);
    var noNum = reg.test(lat[0]);
    var simpleTheta = theta
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');

    simpleTheta = noNum ? simpleTheta : simpleTheta.replace('\\pi', '1\\pi');
    if (simpleTheta.split('/').some((x) => x.match(regSqr)?.length > 1))
      setYInvalid(true);
    else setYInvalid(false);
    var simpleZ = z
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    if (simpleZ.split('/').some((x) => x.match(regSqr)?.length > 1))
      setZInvalid(true);
    else setZInvalid(false);
    if (isInvalid || xInvalid || yInvalid || zInvalid) return;
    const inputVal = evalLatex(
      simpleTheta.replace('°', '').replace('\\pi', '*180')
    )?.toString();
    const hasData = isDegree || hasPI ? !!FindCosineData(inputVal) : false;
    const sinData = FindSineData(Number(inputVal));
    const sinRadian = parseNumber(
      Math.sin(degOrRad(inputVal, isDegree)),
      {},
      2
    );
    const cosRadian = parseNumber(
      Math.cos(degOrRad(inputVal, isDegree)),
      {},
      2
    );

    const cosData = FindCosineData(Number(inputVal));
    var sinAnswer = convertToKatex(
      simpleR.replace(`/`, `\\above{1pt}`).replaceAll('sqrt', '\\sqrt'),
      hasData ? sinData : sinRadian,
      false
    );
    var cosAnswer = convertToKatex(
      simpleR.replace(`/`, `\\above{1pt}`).replaceAll('sqrt', '\\sqrt'),
      hasData ? cosData : cosRadian,
      false
    );
    const sinToCalc = sinAnswer
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    //Return if expression is invalid
    const cosToCalc = cosAnswer
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    //Return if expression is invalid
    const sinResult = evalLatex(sinToCalc)?.toString();
    const cosResult = evalLatex(cosToCalc)?.toString();
    sinAnswer = sinAnswer?.toString().replaceAll(')', '').replaceAll('(', '');
    cosAnswer = cosAnswer?.toString().replaceAll(')', '').replaceAll('(', '');
    simpleTheta = simpleTheta
      ?.toString()
      .replaceAll(')', '')
      .replaceAll('(', '');

    //Return if expression is invalid
    const finalAnswer = [
      {
        value: putSpace(
          `The value of the cylindrical coordinates (r, θ, z) = ({${latexR}}, {${theta}}, {${z}}) `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `to cartesian coordinate is (x, y, z) =(\\bold{{${cosAnswer}}, {${sinAnswer}}, {${z}}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `  or (\\bold{{${parseNumber(cosResult, {}, 2)}}, {{${parseNumber(
            sinResult,
            {},
            2
          )}}, {${parseNumber(z)}}})}`
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
        value: `The position of any point in 3-D in the Cartesian coordinate<br> system can be represented as (x, y, z) where x, y, z represents<br> the distance of points from the x, y, z coordinate axes respectively.
        `,
        type: 'span',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given Input`,
        type: 'span',
      },
      {
        value: putSpace(`r =\\bold{{${latexR}}}`),
        type: 'equation',
      },

      {
        value: putSpace(`θ =\\bold{{${theta}}}${isDegree ? '' : ' rad'}`),
        type: 'equation',
      },

      {
        value: putSpace(`z =\\bold{{${z}}}`),
        type: 'equation',
      },

      {
        value: putSpace(
          `To convert the above given cylindrical coordinate to Cartesian `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`form we will use the formula`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{x=r cos θ, y=r sin θ, z=z}`),
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
        value: `x = {(${latexR})}.cos \\space ({${theta}}) =
          ({${latexR}})({${
          hasData ? cosData : cosRadian
        }})=\\bold{{${cosAnswer}}} `,
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/cosine/?a=${simpleTheta
          .replace('\\pi', '')
          .replace('°', '')}&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${hasPI ? 1 : 0}`
        }" target="_blank">to see Steps for Cos click here</a>`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `y = {(${latexR})}.sin \\space ({${theta}}) =
          ({${latexR}})({${
          hasData ? sinData : sinRadian
        }})= \\bold{{${sinAnswer}}} `,
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/sine/?a=${simpleTheta
          .replace('\\pi', '')
          .replace('°', '')}&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${hasPI ? 1 : 0}`
        }" target="_blank">to see Steps for Sine click here</a>`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `z = \\bold{${z}}`,
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
  }, [theta, z, latexR, showSteps]);

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
    setTheta('');
    setLatexR('');
    setZ('');
    setShowResult(false);
  }, [setShowResult]);

  const bothVals = theta.indexOf('°') > 0 && theta.indexOf('\\pi') >= 0;
  // const hasValue = z && latexR && theta && !bothVals;
  const hasValue =
    z && latexR && theta && !bothVals && !xInvalid && !yInvalid && !zInvalid;
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
            <div className="col-3 text-left">r:</div>
            <div className={`col-9 ${xInvalid ? 'invalid' : ''}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setLatexR}
                numericToolbarKeys={[]}
                allowAlphabeticKeyboard={false}
                initialLatex={latexR}
              />
            </div>
          </div>{' '}
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">θ:</div>
            <div className={`col-9 ${yInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setTheta}
                setMathfieldRef={(ref) => (mf2.current = ref)}
                numericToolbarKeys={['pi', '°']}
                allowAlphabeticKeyboard={false}
                initialLatex={theta}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">z:</div>
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

export default CylindricalToCartesianCoordinates;
