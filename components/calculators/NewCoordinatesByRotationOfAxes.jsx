'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import {
  abs,
  addSymbol,
  minusSymbol,
  parseNumber,
  withSymbol,
} from '../../helpers/decimal';
import {
  FindCosineData,
  FindSineData,
} from '../../utils/constants/Angle-table';
import { putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { getVals } from '../../helpers/RootSolver';
import { create, all } from 'mathjs';
import { removeSymbol } from '../../helpers/RootSolver';

const config = {};
const math = create(all, config);

const NewCoordinatesByRotationOfAxes = () => {
  const [x, setX] = useLocalStorage('NewCoordinatesByRotationOfAxes_x', '4');
  const [y, setY] = useLocalStorage('NewCoordinatesByRotationOfAxes_y', '3');
  const [r, setR] = useLocalStorage('NewCoordinatesByRotationOfAxes_r', '20');
  const [equation, setEquation] = useLocalStorage('NewCoordinatesByRotationOfAxes_equation', '');
  const [solution, setSolution] = useLocalStorage('NewCoordinatesByRotationOfAxes_solution', '');
  const [result, setResult] = useLocalStorage('NewCoordinatesByRotationOfAxes_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('NewCoordinatesByRotationOfAxes_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NewCoordinatesByRotationOfAxes_showSteps', true);
  const [note, setNote] = useLocalStorage('NewCoordinatesByRotationOfAxes_note', undefined);
  const [usePI, setUsePI] = useLocalStorage('NewCoordinatesByRotationOfAxes_usePI', false);
  const [order, setOrder] = useLocalStorage('NewCoordinatesByRotationOfAxes_order', 'Degree');
  const [clock, setClock] = useLocalStorage('NewCoordinatesByRotationOfAxes_clock', 'Clockwise');
  const isDegree = order === 'Degree';
  const isClokwise = clock === 'Clockwise';
  let [p, q = 1] = r.split('/');
  function checkDecimal(r) {
    var isDecimal = r - Math.floor(r) !== 0;

    return isDecimal;
  }
  function decimalToFraction(val) {
    val = val?.toString();
    if (!val) return;
    if (checkDecimal(val)) {
      return (
        val.replace('.', '') + `\\above{1pt}` + 10 ** val.split('.')[1]?.length
      );
    }
    return val + `\\above{1pt}` + 1;
  }

  //fraction reduction
  function fraction(numR, denumR = 1) {
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
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the coordinates of the new point obtained after rotating the given point`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(x, y)=\\bigg(${x || 'x'},${
              y || 'y'
            }\\bigg)about the axes by an angle θ=\\bold{ ${
              isClokwise ? '-' : ''
            }{${
              q == 1
                ? p || '\\theta'
                : [usePI ? withSymbol(p, '\\pi') : p, q].join('\\above{1pt}')
            }}} \\bold{${isDegree ? 'Degee' : 'radian'} ${
              isClokwise ? 'Clockwise (cw)' : 'Counter Clockwise (ccw)'
            }} direction.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x, r, usePI, order, clock]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Point P (x, y): - \\bigg<${x || 'x'},${y || 'y'} \\bigg>`,
          type: 'equation',
        },
      ])
    );
    function evalLatex(expression) {
      try {
        const parsedExpression = math.parse(expression);
        const evaluatedResult = parsedExpression.evaluate();
        return evaluatedResult;
      } catch {
        return null;
      }
    }

    var numerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[0] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[1] || 1);
    var denumerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[1] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[0] || 1);

    let angleResult;
    if (numerator === denumerator) {
      angleResult = [1, 1];
    } else {
      angleResult = fraction(numerator, denumerator);
    }
    const finalResult = angleResult[0] / angleResult[1];
    const piIntoR = (numerator / (denumerator || 1)) * 180;
    // if (isInvalid) return;
    var valueX = x
      .replaceAll('\\frac', '')
      .replaceAll(')(', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    var valueY = y

      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');

    var valueToCalculate = isDegree
      ? ((numerator / (denumerator || 1)) * 3.14) / 180
      : usePI
      ? piIntoR
      : finalResult;
    var angleToPass = isClokwise ? -1 * valueToCalculate : valueToCalculate;
    const isValue = !!FindCosineData(
      isDegree ? (isClokwise ? -1 * r : r) : angleToPass
    );
    const cosR = FindCosineData(
      isDegree ? (isClokwise ? -1 * r : r) : angleToPass
    );
    const cosDeg = parseNumber(
      Math.cos(isClokwise ? -1 * valueToCalculate : valueToCalculate),
      {},
      3
    );
    const sinDeg = parseNumber(
      Math.sin(isClokwise ? -1 * valueToCalculate : valueToCalculate),
      {},
      5
    );
    const sinR = FindSineData(
      isDegree ? (isClokwise ? -1 * r : r) : angleToPass
    );
    var simpleX = x
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('\\sqrt', '');
    var simpleY = y
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('\\sqrt', '')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');
    var valueX = evalLatex(simpleX)?.toString();
    var valueY = evalLatex(simpleY)?.toString();
    var sinAnsX = getVals(-valueX, sinR, false);
    var sinAnsY = getVals(valueY, sinR, false);
    var cosAnsX = getVals(valueX, cosR, false);
    var cosAnsY = getVals(valueY, cosR, false);
    var calcSinX = sinAnsX
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var resultSinX = evalLatex(calcSinX)?.toString();
    var calcSinY = sinAnsY
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var resultSinY = evalLatex(calcSinY)?.toString();
    var calcCosX = cosAnsX
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var resultCosX = evalLatex(calcCosX)?.toString();
    var calcCosY = cosAnsY
      ?.toString()
      .replaceAll('\\sqrt', 'sqrt')
      .replace('\\above{1pt}', '/')
      .replaceAll('{', '(')
      .replaceAll('}', ')');
    var resultCosY = evalLatex(calcCosY)?.toString();
    var add1 = evalLatex(
      `${resultCosX}${addSymbol(resultSinY)}${abs(resultSinY)}`
    )?.toString();
    var value1 = valueX * cosDeg - valueY * sinDeg;
    var value2 = -1 * valueX * sinDeg + valueY * cosDeg;
    var add2 = evalLatex(
      `${resultSinX}${addSymbol(resultCosY)}${abs(resultCosY)}`
    )?.toString();
    sinAnsY = sinAnsY?.toString().replaceAll('(', '').replaceAll(')', '');
    cosAnsX = cosAnsX?.toString().replaceAll('(', '').replaceAll(')', '');
    sinAnsX = sinAnsX?.toString().replaceAll('(', '').replaceAll(')', '');
    cosAnsY = cosAnsY?.toString().replaceAll('(', '').replaceAll(')', '');
    function removeSpace(val) {
      return val.toString().trim('\\space');
    }

    const finalAnswer = [
      {
        value: removeSpace(` 
        The coordinates of the new point obtained after rotating the given Axes (x, y) `),
        type: 'span',
      },

      {
        value: putSpace(
          `=\\bigg({${x || 'x'}},{${y || 'y'}}\\bigg) by an angle \\theta={({${
            isClokwise ? '-' : ''
          }}{${
            denumerator == 1
              ? numerator
              : [numerator, denumerator].join('\\above{1pt}')
          }} ${isDegree ? '\\degree' : 'rad'} )} in ${
            isClokwise ? 'clockwise (cw)' : 'counter clockwise(cww)'
          } direction is `
        ),
        type: 'equation',
      },

      {
        value: `\\bold{(x, y)=\\bigg(${
          isValue
            ? `
        {${cosAnsX}} ${minusSymbol(resultSinY)} {${removeSymbol(
                sinAnsY
              )}},{${sinAnsX}} ${addSymbol(resultCosY)}
        {${removeSymbol(cosAnsY)}}
        \\bigg)  or 
        \\bigg({${parseNumber(add1, {}, 2)}} , {${parseNumber(add2, {}, 2)}}`
            : `{${parseNumber(value1, {}, 2)}},{${parseNumber(value2, {}, 2)}}`
        }\\bigg)}`,
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
        value: `The rotation of points is used to obtain coordinates from one point to another without rotating<br> the axes of
        the coordinate system by a certain angle in either cw or ccw direction. By default<br> the counter clockwise rotation is taken as positive.`,

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
        value: putSpace(`Given Inputs ,`),
        type: 'equation',
      },
      {
        value: putSpace(`x= {${x || 'x'}}`),
        type: 'equation',
      },
      {
        value: `y= {${y || 'y'}}`,
        type: 'equation',
      },
      {
        value: putSpace(`and \\theta={${isClokwise ? '-' : ''}}{${
          denumerator == 1
            ? numerator
            : [numerator, denumerator].join('\\above{1pt}')
        }}\\degree
        `),
        type: 'equation',
      },
      'br',
      {
        value: `To calculate the new coordinates of the point obtained after rotating <br>the given point by an angle θ counter clockwise we will use the formula as`,
        type: 'span',
      },
      {
        value: putSpace(`\\bold{x^,=x cos \\theta  + y sin θ}`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{y^,= -x sin \\theta + y cos \\theta}`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now, by putting the above values in the above-given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          isDegree
            ? `x^,={${x}}cos({${isClokwise ? '-' : ''}}{${
                denumerator == 1
                  ? numerator
                  : [numerator, denumerator].join('\\above{1pt}')
              }}\\degree) + {${y}}sin({${isClokwise ? '-' : ''}}{${
                denumerator == 1
                  ? numerator
                  : [numerator, denumerator].join('\\above{1pt}')
              }}\\degree)`
            : `x^,={${x}} cos(${isClokwise ? '-' : ''}{${
                usePI
                  ? parseNumber(piIntoR, {}, 3)
                  : parseNumber(finalResult, {}, 3)
              }} ${usePI ? '\\degree' : 'rad'}) + {${y}} sin(${
                isClokwise ? '-' : ''
              }{${
                usePI
                  ? parseNumber(piIntoR, {}, 3)
                  : parseNumber(finalResult, {}, 3)
              }} ${usePI ? '\\degree' : 'rad'})`
        ),
        type: 'equation',
      },
      {
        value: removeSpace(
          putSpace(
            `{${
              isValue
                ? `=({${x}})({${parseNumber(
                    cosR,
                    {},
                    3
                  )}})+({${y}})({${parseNumber(
                    sinR,
                    {},
                    3
                  )}}) ={${cosAnsX}} ${addSymbol(resultSinY)}{${removeSymbol(
                    sinAnsY
                  )}}= {${parseNumber(resultCosX, {}, 3)}}{${addSymbol(
                    resultSinY
                  )}}{${parseNumber(abs(resultSinY), {}, 3)}} = {${parseNumber(
                    add1,
                    {},
                    2
                  )}}}`
                : `=({${x}})({${parseNumber(
                    cosDeg,
                    {},
                    2
                  )}})+({${y}})({${parseNumber(
                    sinDeg,
                    {},
                    3
                  )}}) = {${parseNumber(valueX * cosDeg, {}, 3)}}{${addSymbol(
                    valueY * sinDeg
                  )}}  {${abs(
                    parseNumber(valueY * sinDeg, {}, 4)
                  )}}={${parseNumber(value1, {}, 2)}}}`
            }`
          )
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/sine/?a=${
          isClokwise ? '-' + r : r
        }&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${usePI ? 1 : 0}`
        }" target="_blank">to see Steps for Sine click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: removeSpace(
          putSpace(
            isDegree
              ? `y^,= -({${x}})sin({${isClokwise ? '-' : ''}}{${
                  denumerator == 1
                    ? numerator
                    : [numerator, denumerator].join('\\above{1pt}')
                }}\\degree)+{${y}} cos({${isClokwise ? '-' : ''}}{${
                  denumerator == 1
                    ? numerator
                    : [numerator, denumerator].join('\\above{1pt}')
                }}\\degree) `
              : `y^,=-({${x}}) sin(${isClokwise ? '-' : ''}{${
                  usePI
                    ? parseNumber(piIntoR, {}, 3)
                    : parseNumber(finalResult, {}, 3)
                }} ${usePI ? '\\degree' : 'rad'}) + {${y}} cos (${
                  isClokwise ? '-' : ''
                }{${
                  usePI
                    ? parseNumber(piIntoR, {}, 3)
                    : parseNumber(finalResult, {}, 3)
                }} ${usePI ? '\\degree' : 'rad'})`
          )
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${
            isValue
              ? `=-({${x}})({${sinR}})+({${y}})({${cosR}}) = {${sinAnsX}} ${addSymbol(
                  resultCosY
                )}{${removeSymbol(cosAnsY)}}= {${parseNumber(
                  resultSinX,
                  {},
                  2
                )}}{${addSymbol(resultCosY)}}{${parseNumber(
                  abs(resultCosY),
                  {},
                  2
                )}} =  {${parseNumber(add2, {}, 2)}}`
              : `=-({${x}})({${sinDeg}}) + ({${y}})({${parseNumber(
                  cosDeg,
                  {},
                  2
                )}}) ={${parseNumber(-1 * valueX * sinDeg)}} {${addSymbol(
                  valueY * cosDeg
                )}} {${abs(
                  parseNumber(valueY * cosDeg),
                  {},
                  5
                )}} = {${parseNumber(value2, {}, 2)}}`
          }}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/cosine/?a=${
          isClokwise ? '-' + r : r
        }&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${usePI ? 1 : 0}`
        }" target="_blank">to see the steps for cos calculation, click here</a>`,
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
  }, [x, y, showSteps, r, setSolution, usePI, isDegree, order, clock]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
    setUsePI(false);
  };

  const onChangeClock = (event) => {
    setClock(event.target.value);
    setUsePI(false);
  };
  const clear = useCallback(() => {
    setX('');
    setY('');
    setShowResult(false);
  }, [setShowResult]);

  const hasAllValue = [x, r, y].every((v) => !!v);
  const bothVals = r.indexOf('\\pi') > 0 && r.indexOf('°') > 0;
  const hasValue = r && x && !bothVals;

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
            Your input can be in form of positive real numbers
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Angle type</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Degree">Degree</option>
                <option value="Radian">Radian</option>
              </select>
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Point X</div>
            <div className="col-8">
              <MathInput
                setValue={setX}
                allowAlphabeticKeyboard={false}
                initialLatex={x}
                numericToolbarKeys={[]}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Point Y</div>
            <div className="col-8">
              <MathInput
                setValue={setY}
                allowAlphabeticKeyboard={false}
                initialLatex={y}
                numericToolbarKeys={[]}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Angle of Rotation (θ):</div>
            <div className={isDegree ? 'col-8' : 'col-5'}>
              <Input
                placeholder="Angle"
                className="col-12"
                value={r}
                setVal={setR}
                pattern={
                  /^(((\d*)|\.|(\d*\.\d*)))(\/((\d*)|\.|(\d*\.\d*)|(\d*\.)))?$/
                }
              />
            </div>
            {!isDegree ? (
              <div className="col-3 d-flex">
                <label htmlFor="check" className=" form-label mx-2 px-2">
                  Include PI
                </label>
                <input
                  className="form-check"
                  type="checkbox"
                  id="check"
                  checked={usePI}
                  onChange={(e) => setUsePI(e.target.checked)}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Rotation Type: -</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={clock}
                onChange={onChangeClock}
              >
                <option value="Clockwise">Clockwise</option>
                <option value="Counter-ClockwiseChoice">
                  Counter-ClockwiseChoice
                </option>
              </select>
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>

      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-2"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
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
      {hasAllValue && showSteps && (
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
export default NewCoordinatesByRotationOfAxes;
