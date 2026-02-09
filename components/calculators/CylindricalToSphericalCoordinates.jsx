'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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

const CylindricalToSphericalCoordinate = () => {
  const [theta, setTheta] = useLocalStorage('CylindricalToSphericalCoordinates_theta', '');
  const [latexR, setLatexR] = useLocalStorage('CylindricalToSphericalCoordinates_latexR', '');
  const [latexZ, setLatexZ] = useLocalStorage('CylindricalToSphericalCoordinates_latexZ', '');
  const [equation, setEquation] = useLocalStorage('CylindricalToSphericalCoordinates_equation', '');
  const [solution, setSolution] = useLocalStorage('CylindricalToSphericalCoordinates_solution', '');
  const [result, setResult] = useLocalStorage('CylindricalToSphericalCoordinates_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('CylindricalToSphericalCoordinates_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('CylindricalToSphericalCoordinates_showSteps', true);
  const [note, setNote] = useLocalStorage('CylindricalToSphericalCoordinates_note', undefined);
  const [rInvalid, setRInvalid] = useLocalStorage('CylindricalToSphericalCoordinates_rInvalid', false);
  const [thetaInvalid, setThetaInvalid] = useLocalStorage('CylindricalToSphericalCoordinates_thetaInvalid', false);
  const [zInvalid, setZInvalid] = useLocalStorage('CylindricalToSphericalCoordinates_zInvalid', false);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `convert the cylindrical coordinate (r, θ, z) = ({${
              latexR || 'r'
            } }, ${theta || 'θ'}, {${latexZ || 'z'}}) to Spherical coordinates.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [theta, latexR, latexZ]);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `convert the cylindrical coordinate (r, θ, z) = ({${
              latexR || 'r'
            } }, ${theta || 'θ'}, {${latexZ || 'z'}}) to Spherical coordinates.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [theta, latexR, latexZ]);

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
    const isInvalid = [theta, latexR, latexZ].some((i) => !i || i == '-');
    const hasPI = theta.indexOf('pi') != -1;
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
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Point P (r, θ, z):\\space \\bigg< {${
            latexR || 'r'
          }}, \\space {${theta || 'θ'}} , {${latexZ || 'z'}}\\bigg>`,
          type: 'equation',
        },
      ])
    );
    //solving values of X
    if (hasPI && latexR.indexOf('°') > 0) return;
    var latX = latexR.split('\\pi');
    var regX = new RegExp(/\d/);
    const regSqr = new RegExp(/(sqrt)/);
    var noNumX = regX.test(latX[0]);
    var simpleExpR = latexR
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    simpleExpR = noNumX
      ? simpleExpR.replace('\\pi', '')
      : simpleExpR.replace('\\pi', '1');
    if (simpleExpR.split('/').some((x) => x.match(regSqr)?.length > 1))
      setRInvalid(true);
    else setRInvalid(false);
    //solving values of Z
    var simpleExpZ = latexZ
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
    simpleExpZ = noNumX
      ? simpleExpZ.replace('\\pi', '')
      : simpleExpZ.replace('\\pi', '1');

    //function for solving values of Y
    if (hasPI && theta.indexOf('°') > 0) return;
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
    simpleTheta = noNum
      ? simpleTheta.replace('\\pi', '')
      : simpleTheta.replace('\\pi', '1');
    if (simpleTheta.split('/').some((x) => x.match(regSqr)?.length > 1))
      setThetaInvalid(true);
    else setThetaInvalid(false);

    // //Return if expression is invalid
    var tanAnswer = convertToKatex(
      simpleExpR.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      simpleExpZ.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      true
    );
    //function for solving values of X
    if (hasPI && latexR.indexOf('°') > 0) return;
    var latX = latexR.split('\\pi');
    var regX = new RegExp(/\d/);
    var noNumX = regX.test(latX[0]);

    //Return if expression is invalid
    if (isInvalid || rInvalid || thetaInvalid || zInvalid) return;
    try {
      math.simplify(simpleExpR);
    } catch {
      return;
    }
    const latexXSqr = getSquare(latexR);
    const latexSqrZ = getSquare(latexZ);
    const upperVal = [latexXSqr[0], latexSqrZ[0]].map(
      (i) => removeSymbol(i) || 0
    );
    const lowerVal = [latexXSqr[1], latexSqrZ[1]].map(
      (i) => removeSymbol(i) || 0
    );

    //Functions
    function fraction(numR, denumR = 1) {
      if (isNaN(numR) || isNaN(denumR)) return [1, 1];
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
    //this is final value of roh.
    var rohAnswer =
      (numR == '1') & (denumR == '1')
        ? `1`
        : `{${parseNumber(getRoot(numR, false))} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${parseNumber(getRoot(denumR, false))}`
          }}`;
    var rohAns = evalLatex(
      rohAnswer
        .replaceAll('\\sqrt', 'sqrt')
        .replace('\\above{1pt}', '/')
        .replaceAll('{', '(')
        .replaceAll('}', ')')
    )?.toString();
    rohAnswer = rohAnswer.replaceAll('(', '').replaceAll(')', '');
    if (!tanAnswer) return;

    var valToCalc = tanAnswer
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var result = evalLatex(valToCalc)?.toString();
    const radian = parseNumber(Math.atan(result), {}, 3) || 0;
    if (!radian) return;
    const degToRad = fraction(radToDeg(radian), 180);
    var n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);
    tanAnswer = tanAnswer?.toString().replaceAll('(', '').replaceAll(')', '');
    const radianWithPi = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    const xValue = evalLatex(simpleExpR)?.toString();
    const yValue = evalLatex(simpleTheta)?.toString();
    const zValue = evalLatex(simpleExpZ)?.toString();
    //Quadrant Condition
    const bothZero = xValue == 0 && yValue == 0;
    var piValue;
    var qudarantText;

    if (zValue > 0) {
      qudarantText = `Since  \\bold{(z > 0)}  (Point lies in \\bold{upper half} segment above xy - plane toward + z axis)`;
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    } else if (zValue < 0) {
      qudarantText = `Since \\bold{(z < 0)} then (Point lies in \\bold{lower half} segment below xy - plane toward - z axis)`;
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
    } else if (xValue == 0 && zValue == 0) {
      qudarantText = `Since \\bold{r, z = 0} then (Point lies on the origin)`;
      piValue = ``;
      n1 = `Does not exist`;
    } else if (zValue == 0) {
      qudarantText = `Since \\space\\bold{z = 0}then (Point lies in \\bold{the xy} - plane)`;
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    }

    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);

    const finalAnswer = [
      {
        value: putSpace(
          `The value of the cylindrical coordinates (r, θ, z) = (${latexR}, ${theta}, ${latexZ} ) to Spherical coordinate  `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{(ρ, θ, φ)} =\\bigg(${
            (numR == '1') & (denumR == '1') ? `` : `\\sqrt`
          }{${parseNumber(numR)} ${
            denumR == '1' ? `` : `\\above{1pt} ${parseNumber(denumR)}`
          }}, ${theta},tan^{-1}({${tanAnswer}})  \\bigg) or (${parseNumber(
            rohAns,
            {},
            4
          )}, ${theta}, {${simpleValue(n1)}} radian or ${deg1}\\degree)}`
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
        value: `The position of any point in 3-D in the Spherical coordinate system can be represented as <br><b>(ρ, θ, φ)</b>where<b> ρ </b> represents the radial distance of the fixed-point origin and θ represents <br>the polar angle measured from a fixed zenith direction and <b>φ</b> represents the azimuthal<br> angle of its orthogonal projection on a reference plane that passes through the origin<br> and is orthogonal to the zenith,measured from a fixed reference direction on that plane.
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
        value: `Given \\space Input`,
        type: 'equation',
      },
      {
        value: `r= \\bold{${latexR}}`,
        type: 'equation',
      },
      {
        value: putSpace(`\\theta = \\bold{${theta}} `),
        type: 'equation',
      },
      {
        value: `z=\\bold{${latexZ}}`,
        type: 'equation',
      },
      {
        value: `To convert the above given cylindrical coordinate to Spherical form we will use the formula`,
        type: 'span',
      },
      {
        value: `
       \\bold{ ρ =  \\sqrt{(r^2 + z^2)}}`,
        type: 'equation',
      },

      {
        value: `\\bold{\\theta = \\theta}`,
        type: 'equation',
      },
      {
        value: `
      \\bold{  φ = tan^{-1}({r \\above{1pt}z})} `,
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
        value: putSpace(
          `ρ = \\sqrt{(${latexR})^2+(${latexZ})^2}=  \\sqrt{({${
            noAboveX ? latexXSqr[0] : latexXSqr.join('\\above{1pt}')
          }})+({${
            noAboveZ ? latexSqrZ[0] : latexSqrZ.join('\\above{1pt}')
          }})}={${convertToLowestRootForm(numR)} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${convertToLowestRootForm(denumR)}`
          }} = ${parseNumber(rohAns, {}, 4)}`
        ),
        type: 'equation',
      },
      {
        value: `\\theta = ${theta}`,
        type: 'equation',
      },
      {
        value: putSpace(qudarantText),
        type: 'equation',
      },
      {
        value: putSpace(
          `φ  = ${
            bothZero
              ? 'Not Defined'
              : `{${piValue}} tan^{-1}({${tanAnswer}})  {${
                  xValue == 0
                    ? ''
                    : `={${piValue}}(${simpleValue(radianWithPi)})`
                }} ={${simpleValue(n1)}} radian or ${deg1}\\degree`
          }`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/Tan-Inverse/?a=${refValue(
          tanAnswer
        )}" target="_blank">to see the steps for tan inverse calculation, click here</a>`,
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
  }, [theta, latexZ, latexR, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setTheta('');
    setLatexR('');
    setLatexZ('');
    setShowResult(false);
  }, [setShowResult]);

  const bothVals = theta.indexOf('°') > 0 && theta.indexOf('\\pi') >= 0;
  const hasValue =
    !!(latexZ && latexR && theta) &&
    !bothVals &&
    !rInvalid &&
    !thetaInvalid &&
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
            <div className="col-3 text-left">r :-</div>
            <div className={`col-9 ${rInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setLatexR}
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
                initialLatex={latexR}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">θ :-</div>
            <div className={`col-9 ${thetaInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setTheta}
                numericToolbarKeys={['pi', '°']}
                allowAlphabeticKeyboard={false}
                initialLatex={theta}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">z :-</div>
            <div className={`col-9 ${zInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setLatexZ}
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
                initialLatex={latexZ}
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

export default CylindricalToSphericalCoordinate;
