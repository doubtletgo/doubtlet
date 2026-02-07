'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import MathInput from 'react-math-keyboard';
import { addSymbol, parseNumber, withSymbol } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { abs } from 'mathjs';
import { create, all } from 'mathjs';
import {
  getVals,
  getRoot,
  removeAllBrac,
  removeSymbol,
} from '../../helpers/RootSolver';
import { putSpace, refValue } from '../../helpers/general';

const config = {};
const math = create(all, config);

const CartesianToSphericalCoordinates = () => {
  const [latex, setLatex] = useState('5');
  const [latexX, setLatexX] = useState('7');
  const [latexZ, setLatexZ] = useState('3');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [xInvalid, setXInvalid] = useState(false);
  const [yInvalid, setYInvalid] = useState(false);
  const [zInvalid, setZInvalid] = useState(false);
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
            } }, ${latex || 'y'}, {${latexZ || 'z'}}) to spherical coordinate.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [latex, latexX, latexZ]);

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
    const isInvalid = [latex, latexX, latexZ].some(
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
          }}, \\space {${latex || 'y'}} , {${latexZ || 'z'}}\\bigg>`,
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
    simpleExpX = noNumX
      ? simpleExpX.replace('\\pi', '')
      : simpleExpX.replace('\\pi', '1');
    if (simpleExpX.split('/').some((x) => x.match(regSqr)?.length > 1))
      setXInvalid(true);
    else setXInvalid(false);
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
    simpleExp = noNum
      ? simpleExp.replace('\\pi', '')
      : simpleExp.replace('\\pi', '1');
    //Return if expression is invalid
    if (simpleExp.split('/').some((x) => x.match(regSqr)?.length > 1))
      setYInvalid(true);
    else setYInvalid(false);
    const latexSqr = getSquare(simpleExp).map((i) => removeSymbol(i));
    const noAbove = latexSqr[1] == 1;
    //function for solving values of z
    var latZ = latexZ.split('\\pi');
    var regZ = new RegExp(/\d/);
    var noNumZ = regZ.test(latZ[0]);
    var simpleExpZ = latexZ
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    simpleExpZ = noNumZ
      ? simpleExpZ.replace('\\pi', '')
      : simpleExpZ.replace('\\pi', '1');
    //Return if expression is invalid
    if (simpleExpZ.split('/').some((x) => x.match(regSqr)?.length > 1))
      setZInvalid(true);
    else setZInvalid(false);
    const latexZSqr = getSquare(simpleExpZ).map((i) => removeSymbol(i));
    const noAboveZ = latexZSqr[1] == 1;
    if (isInvalid || xInvalid || yInvalid || zInvalid) return;
    var tanAnswer = getVals(
      simpleExp.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      simpleExpX.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      true
    );

    const upperVal = [latexXSqr[0], latexSqr[0], latexZSqr[0]].map(
      (i) => removeSymbol(i) || 0
    );
    const lowerVal = [latexXSqr[1], latexSqr[1], latexZSqr[1]].map(
      (i) => removeSymbol(i) || 0
    );
    const upVal = [latexXSqr[0], latexSqr[0]].map((i) => removeSymbol(i) || 1);
    const lowVal = [latexXSqr[1], latexSqr[1]].map((i) => removeSymbol(i) || 1);

    // //Functions
    function fraction(numR, denumR = 1) {
      if (isNaN(numR) || isNaN(denumR)) return [undefined, undefined];
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

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const answer = lowerVal.reduce(lcm);
    const answerOf2 = lowVal.reduce(lcm);
    const multiple = upperVal.map(
      (item, index) => (item * answer) / lowerVal[index]
    );
    const multipleOf2 = upVal.map(
      (item, index) => (item * answer) / lowerVal[index]
    );
    const sumOfAll = multiple.reduce((acc, curr) => {
      return acc + curr;
    });
    const sumOf2 = multipleOf2.reduce((acc, curr) => {
      return acc + curr;
    });
    const [numR, denumR] = fraction(sumOfAll, answer);
    const [numR2, denumR2] = fraction(sumOf2, answerOf2);
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

    const radianWithPi = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    var n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
    tanAnswer = tanAnswer?.toString().replaceAll('(', '').replaceAll(')', '');
    var valToPass = `\\sqrt${numR2}${
      denumR2 ? `\\above{1pt}${denumR2 == 1 ? '' : '\\sqrt'}${denumR2}` : ''
    }`;
    var inverseVal = getVals(
      valToPass,
      simpleExpZ.replace('/', '\\above{1pt}').replaceAll('sqrt', '\\sqrt'),
      true
    );
    if (inverseVal != 0 && !inverseVal) return;
    var valOfZToCalc = inverseVal
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var resultTanZ = evalLatex(valOfZToCalc)?.toString();
    const radianZ = parseNumber(Math.atan(resultTanZ), {}, 3);
    const degToRadZ = fraction(radToDeg(radianZ || 1), 180);
    var n2 = getSubtraction([0, degToRadZ[0]], [1, degToRadZ[1]]);
    const radianWithZPi = getSubtraction([0, degToRadZ[0]], [1, degToRadZ[1]]);
    var valsOfInv = inverseVal?.toString().split('\\above{1pt}');
    var xAnswer =
      (numR == '1') & (denumR == '1')
        ? `1`
        : `{${parseNumber(getRoot(numR, false))} ${
            denumR == '1'
              ? ``
              : `\\above{1pt} ${parseNumber(getRoot(denumR, false))}`
          }}`;
    inverseVal = inverseVal?.toString().replaceAll('(', '').replaceAll(')', '');
    var xAns = evalLatex(
      xAnswer
        .replaceAll('\\sqrt', 'sqrt')
        .replace('\\above{1pt}', '/')
        .replaceAll('{', '(')
        .replaceAll('}', ')')
    )?.toString();
    xAnswer = xAnswer.replaceAll('(', '').replaceAll(')', '');

    const xValue = evalLatex(simpleExpX)?.toString();
    const yValue = evalLatex(simpleExp)?.toString();
    const zValue = evalLatex(simpleExpZ)?.toString();

    //Quadrant Condition
    const bothZero = xValue == 0 && yValue == 0;

    var piValue;
    var qudarantText;

    if (xValue > 0 && yValue > 0) {
      piValue = ``;
      n1 = getSubtraction([0, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x>0 and y>0} (Point lies in \\bold{1^{st}} quadrant)`;
    } else if (xValue < 0 && yValue > 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x<0 and y>0} (Point lies in \\bold{2^{nd}} quadrant)`;
    } else if (xValue < 0 && yValue < 0) {
      piValue = `\\pi +`;
      n1 = getSubtraction([1, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x<0 and y<0} (Point lies in \\bold{3^{rd}} quadrant)`;
    } else if (xValue > 0 && yValue < 0) {
      piValue = `2\\pi +`;
      n1 = getSubtraction([2, degToRad[0]], [1, degToRad[1]]);
      qudarantText = `Since \\bold{x>0 and y<0} (Point lies in \\bold{4^{th}} quadrant)`;
    } else if (xValue == 0 && yValue > 0) {
      piValue = ``;
      tanAnswer = `\\infty`;
      n1 = getSubtraction([0, 1], [1, 2]);
      qudarantText = `Since \\bold{x=0 and y>0} (Point lies on \\bold{positive Y - axis})`;
    } else if (xValue == 0 && yValue < 0) {
      piValue = ``;
      n1 = getSubtraction([1, 1], [1, 2]);
      tanAnswer = `\\infty`;
      qudarantText = `Since \\bold{x=0 and y<0} (Point lies on \\bold{negative Y - axis})`;
    } else if (xValue > 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 0], [1, 1]);
      qudarantText = `Since \\bold{x>0 and y=0} (Point lies on \\bold{positive X - axis})`;
    } else if (xValue < 0 && yValue == 0) {
      piValue = ``;
      n1 = getSubtraction([0, 1], [1, 1]);
      qudarantText = `Since \\bold{x<0 and y=0} (Point lies on \\bold{negative X - axis})`;
    } else if (xValue == 0 && yValue == 0) {
      piValue = ``;
      qudarantText = `Since \\bold{x=0 and y=0} (Point lies on \\bold{Origin})`;
    }
    var deg1 = parseNumber((n1[0] * 180) / n1[1], {}, 3);
    //step
    var step = ``;
    var descrptn = ``;
    var angle;
    var showAngle = '';
    var degAngle = ``;
    if (zValue > 0) {
      step = `Since <b>z > 0</b> then (Point lies in <b>upper half</b> segment above xy - plane toward + <b>z axis)</b>`;
      descrptn = `Azimuthal Angle = φ = tan^{-1} \\bigg({\\sqrt{x^2 + y^2}\\above{1pt}z}\\bigg)`;
    } else if (zValue < 0) {
      step = `Since <b>z < 0</b> then (Point lies in <b>lower half</b> segment below xy - plane toward <b>- z axis)</b>`;
      n2 = getSubtraction([1, degToRadZ[0]], [1, degToRadZ[1]]);
      descrptn = `Azimuthal Angle = φ = π + tan^{-1}\\bigg({\\sqrt{x^2 + y^2}\\above{1pt}z}\\bigg)`;
    } else if (zValue == 0 && xValue == 0 && yValue == 0) {
      step = `Since <b>x, y, z = 0</b> then (Point lies on <b>the</b> origin)`;
      descrptn = `Azimuthal Angle = φ = Does not exist`;
      angle = `0\\above{1pt}0`;
      showAngle = `Does not exist`;
    } else if (zValue == 0) {
      step = `Since <b>z = 0</b> then (Point lies in <b>the xy </b>- plane)`;
      descrptn = `Azimuthal Angle = φ =  {\\pi\\above{1pt}2}radian or 90 \\degree`;
      angle = `\\infty`;
      showAngle = `{\\pi\\above{1pt}2}`;
      degAngle = ` 90\\degree`;
    }
    var deg2 = parseNumber((n2[0] * 180) / n2[1], {}, 3);

    const finalAnswer = [
      {
        value: putSpace(
          `The value of the cartesian coordinates (x, y, z) = ({${latexX}}, {${latex}}, {${latexZ}}) to Spherical coordinates is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bold{(ρ, θ, φ) = ({${xAnswer}}, {${
            bothZero ? 'Not Defined' : simpleValue(n1)
          }},{${
            zValue == 0
              ? showAngle
              : `${zValue < 0 ? '\\pi +' : ''}  tan^{-1}({${removeAllBrac(
                  getRoot(valsOfInv[0], true)
                )}${
                  !!valsOfInv[1]
                    ? `\\above{1pt}${removeAllBrac(
                        getRoot(valsOfInv[1], true)
                      )}`
                    : ''
                }})`
          }}) or (${parseNumber(xAns, {}, 3)}, {${
            bothZero ? 'Not Defined' : `${deg1}\\degree`
          }},{${zValue == 0 ? degAngle || showAngle : `${deg2}\\degree`}})
          }`
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
        value:
          putSpace(`The position of any point in 3-D in the Spherical coordinate system can be represented as (ρ, θ, φ)
        `),
        type: 'equation',
      },
      {
        value: putSpace(
          `where ρ represents the radial distance of the fixed-point origin and θ represents the polar descrptn measured`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `from a fixed zenith direction and φ represents the azimuthal descrptn of its orthogonal projection on a `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `reference plane that passes through the origin and is orthogonal to the`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`zenith, measured from a fixed</br>
          reference direction on that plane..`),
        type: 'equation',
      },

      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given \\space Input \\space `,
        type: 'equation',
      },
      {
        value: putSpace(`x= ${latexX} `),
        type: 'equation',
      },
      {
        value: `y = ${latex} `,
        type: 'equation',
      },
      {
        value: `z= ${latexZ}`,
        type: 'equation',
      },
      {
        value: `To convert the above given cartesian coordinate to Spherical we will use the formula as`,
        type: 'span',
      },
      {
        value: putSpace(`Radial distance = ρ = \\sqrt{(x^2 + y^2 + z^2)}`),
        type: 'equation',
      },

      {
        value: putSpace(
          `Polar descrptn =  \\theta = tan^{-1}({y\\above{1pt}x})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Azimuthal Angle = φ = tan^{-1} \\bigg({\\sqrt{x^2 + y^2}\\above{1pt}z}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: `
        Now, by putting the above values in the above-given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `ρ = \\sqrt{(${latexX})^2 + (${latex})^2 + (${latexZ})^2}= \\sqrt{({${
            noAboveX ? latexXSqr[0] : latexXSqr.join('\\above{1pt}')
          }}) + ({${
            noAbove ? latexSqr[0] : latexSqr.join('\\above{1pt}')
          }}) +(${
            noAboveZ ? latexZSqr[0] : latexZSqr.join('\\above{1pt}')
          })} =  ${
            (numR == '1') & (denumR == '1') ? `` : `\\sqrt`
          }{${parseNumber(numR)} ${
            denumR == '1' ? `` : `\\above{1pt} ${parseNumber(denumR)}`
          }} =  ${
            (numR == '1') & (denumR == '1')
              ? `1`
              : `{${removeAllBrac(getRoot(numR, false))} ${
                  denumR == '1'
                    ? ``
                    : `\\above{1pt} ${removeAllBrac(getRoot(denumR, false))}`
                }}`
          }`
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
                }} ={${simpleValue(n1)}} radian or ${deg1}\\degree`
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
        value: step,
        type: 'span',
      },
      {
        value: putSpace(descrptn),
        type: 'equation',
      },
      {
        value: putSpace(
          `φ =${
            zValue < 0 ? '\\pi +' : ''
          } tan^{-1} {\\sqrt{({${latexX}})^2 + ({${latex}})^2} \\above{1pt} {${latexZ}}} = ${
            zValue < 0 ? '\\pi +' : ''
          }  tan^{-1} {\\sqrt{({${
            noAboveX ? latexXSqr[0] : latexXSqr.join('\\above{1pt}')
          }}) + ({${
            noAbove ? latexSqr[0] : latexSqr.join('\\above{1pt}')
          }})} \\above{1pt} {${latexZ}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= ${zValue < 0 ? '\\pi +' : ''}  tan^{-1} ({${
            (numR2 == '1') & (denumR2 == '1') ? `` : `\\sqrt`
          }{${parseNumber(numR2)} ${
            denumR2 == '1' ? `` : `\\above{1pt} ${parseNumber(denumR2)}`
          }} \\above{1pt} {${latexZ}}}) = ${
            zValue < 0 ? '\\pi +' : ''
          }  tan^{-1}({${zValue == 0 ? angle : getRoot(valsOfInv[0], true)}${
            !!valsOfInv[1] ? `\\above{1pt}${getRoot(valsOfInv[1], true)}` : ''
          }}) = ${
            zValue == 0
              ? showAngle
              : `${zValue < 0 ? '\\pi +' : ''}{(${simpleValue(
                  radianWithZPi
                )})} = {${simpleValue(n2)}} radian or ${deg2}\\degree`
          } ${degAngle ? `or ${degAngle}` : ''}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/Tan-Inverse/?a=${refValue(
          inverseVal
        )}" target="_blank">to see Steps click here</a>`,
        type: 'h6',
        className: 'text-decoration-underline',
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
  }, [latex, latexX, latexZ, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setLatex('');
    setLatexX('');
    setLatexZ('');
    setShowResult(false);
  }, [setShowResult]);

  const bothVals = latex.indexOf('°') > 0 && latex.indexOf('\\pi') >= 0;
  const hasValue =
    latexZ &&
    latexX &&
    latex &&
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
                setValue={setLatexZ}
                numericToolbarKeys={[]}
                allowAlphabeticKeyboard={false}
                initialLatex={latexZ}
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

export default CartesianToSphericalCoordinates;
