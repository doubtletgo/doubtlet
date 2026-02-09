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
import { getVals } from '../../helpers/RootSolver';
import { putSpace } from '../../helpers/general';
import {
  FindCosineData,
  FindSineData,
} from '../../utils/constants/Angle-table';

const config = {};
const math = create(all, config);
const PolartoCartesianCoordinates = () => {
  const [note, setNote] = useLocalStorage('PolartoCartesianCoordinates_note', undefined);
  const [latexR, setLatexR] = useLocalStorage('PolartoCartesianCoordinates_latexR', '3');
  const [theta, setTheta] = useLocalStorage('PolartoCartesianCoordinates_theta', '6');
  const [equation, setEquation] = useLocalStorage('PolartoCartesianCoordinates_equation', '');
  const [solution, setSolution] = useLocalStorage('PolartoCartesianCoordinates_solution', '');
  const [result, setResult] = useLocalStorage('PolartoCartesianCoordinates_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PolartoCartesianCoordinates_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PolartoCartesianCoordinates_showSteps', true);
  const [rInvalid, setRInvalid] = useLocalStorage('PolartoCartesianCoordinates_rInvalid', false);
  const [thetaInvalid, setThetaInvalid] = useLocalStorage('PolartoCartesianCoordinates_thetaInvalid', false);
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
            `Convert the polar coordinate (r, \\theta) =(\\bold{${
              latexR || 'r'
            },${theta || '\\theta'}}) to cartesian coordinate.`
          ),
          type: 'equation',
        },
        'br',
      ])
    );
  }, [theta, latexR]);

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
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Point P(r, θ): \\bigg<\\bold{${latexR || 'r'}, ${
              theta || '\\theta'
            }} \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [latexR, theta].some((i) => !i || i == '-');
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
      setRInvalid(true);
    else setRInvalid(false);
    var simpleTheta = theta
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    if (simpleTheta.split('/').some((x) => x.match(regSqr)?.length > 1))
      setThetaInvalid(true);
    else setThetaInvalid(false);
    if (isInvalid || rInvalid || thetaInvalid) return;
    const inputVal = evalLatex(
      simpleTheta.replace('°', '').replace('\\pi', '*180')
    )?.toString();
    const hasData = isDegree || hasPI ? FindCosineData(inputVal) : false;
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
    var sinAnswer = getVals(
      simpleR.replaceAll('sqrt', '\\sqrt'),
      hasData ? sinData : sinRadian,
      false
    );
    var cosAnswer = getVals(
      simpleR.replaceAll('sqrt', '\\sqrt'),
      hasData ? cosData : cosRadian,
      false
    );
    const sinToCalc = sinAnswer
      ?.toString()
      .replace('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');

    const cosToCalc = cosAnswer
      ?.toString()
      .replace('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    const sinResult = evalLatex(sinToCalc)?.toString();
    const cosResult = evalLatex(cosToCalc)?.toString();
    sinAnswer = sinAnswer?.toString().replaceAll(')', '').replaceAll('(', '');
    cosAnswer = cosAnswer?.toString().replaceAll(')', '').replaceAll('(', '');
    simpleTheta = simpleTheta
      ?.toString()
      .replaceAll(')', '')
      .replaceAll('(', '');

    const finalAnswer = [
      {
        value: putSpace(
          `The value of the polar coordinates (r,\\theta) = ({${latexR}},{${theta}}) to cartesian coordinate is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x, y) = (\\bold{{${cosAnswer}},{${sinAnswer}}}) or (\\bold{{${parseNumber(
            cosResult,
            {},
            2
          )}},{${parseNumber(sinResult, {}, 2)}})}`
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
        value: putSpace(
          `The position of any point in the Argand plane can be represented by the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` polar form of coordinates as (r, θ) where r represents the shortest`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` distance of the point from the origin and θ represents the angle made by`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` the line joining that point to origin with the positive direction of the x-axis.`
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
        value: `Given Input`,
        type: 'span',
      },
      {
        value: `r={${latexR}}`,
        type: 'equation',
      },
      {
        value: putSpace(`\\theta ={ ${theta}}${isDegree ? '' : ' radian'} `),
        type: 'equation',
      },
      {
        value: `To convert the above given polar coordinates to cartesian we will use the formula as`,
        type: 'span',
      },
      {
        value: putSpace(`\\bold{x = r. cos(θ)}`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{y = r. sin(θ)}`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, by putting the above values in the above-given formula`,
        type: 'span',
      },
      {
        value: `x = {${latexR}}.cos \\space ({${theta}${
          isDegree ? '' : ' rad'
        }}) =
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
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `y = {${latexR}}.sin \\space ({${theta}${
          isDegree ? '' : ' rad'
        }}) =
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
  }, [theta, latexR, showSteps]);

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
    setLatexR('');
    setTheta('');
    setShowSteps(false);
    setShowResult(false);
  }, [setShowResult, setShowSteps]);

  const bothVals = theta.indexOf('\\pi') > 0 && theta.indexOf('°') > 0;
  const hasValue = theta && latexR && !bothVals && !rInvalid && !thetaInvalid;
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
            <div className="col-4 text-left">Point P (r, θ)</div>
            <div className={`col-4 ${rInvalid ? 'invalid' : ''}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setLatexR}
                initialLatex={latexR}
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
              />
            </div>
            <div className={`col-4 ${thetaInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setTheta}
                initialLatex={theta}
                setMathfieldRef={(ref) => (mf1.current = ref)}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={['pi', '°']}
              />
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
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

export default PolartoCartesianCoordinates;
