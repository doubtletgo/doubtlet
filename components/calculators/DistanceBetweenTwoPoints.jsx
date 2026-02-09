'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { putSpace, getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  katexSimplifiedValue,
  showVal,
  valueToKatex,
  lowestForm,
  convertIntoLatex,
} from '../../helpers/matrixHelper';

const DistanceBetweenTwoPoints = () => {
  const [x1, setX1] = useLocalStorage('DistanceBetweenTwoPoints_x1', '2');
  const [y1, setY1] = useLocalStorage('DistanceBetweenTwoPoints_y1', '3');
  const [z1, setZ1] = useLocalStorage('DistanceBetweenTwoPoints_z1', '0');
  const [x2, setX2] = useLocalStorage('DistanceBetweenTwoPoints_x2', '5');
  const [y2, setY2] = useLocalStorage('DistanceBetweenTwoPoints_y2', '7');
  const [z2, setZ2] = useLocalStorage('DistanceBetweenTwoPoints_z2', '0');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();

  const [equation, setEquation] = useLocalStorage('DistanceBetweenTwoPoints_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceBetweenTwoPoints_solution', '');
  const [result, setResult] = useLocalStorage('DistanceBetweenTwoPoints_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DistanceBetweenTwoPoints_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceBetweenTwoPoints_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('DistanceBetweenTwoPoints_isPointSame', false);
  const [note, setNote] = useLocalStorage('DistanceBetweenTwoPoints_note', undefined);
  const [dimension, setDimension] = useLocalStorage('DistanceBetweenTwoPoints_dimension', '2D');
  const is3d = dimension === '3D';

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the distance (d) between Point P_1 \\bold{(${
              parseNumber(x1) || 0
            }, ${parseNumber(y1) || 0}${
              is3d ? `, ${z1 || '0'}` : ' '
            })} and Point P_2 \\bold{(${parseNumber(x2) || 0}, ${
              parseNumber(y2) || 0
            }${is3d ? `, ${z2 || '0'}` : ' '})}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2]);

  useEffect(() => {
    const isInvalid = [x1, x2, y1, y2].some((x) => !x);
    setIsPointSame(x1 == x2 && y1 == y2 && (is3d ? z1 == z2 : true));
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempZ2 = katexSimplifiedValue(z2);
    const x1Value = parseNumber(evalExpression(tempX1), {}, 2);
    const x2Value = parseNumber(evalExpression(tempX2), {}, 2);
    const y1Value = parseNumber(evalExpression(tempY1), {}, 2);
    const y2Value = parseNumber(evalExpression(tempY2), {}, 2);
    const z1Value = parseNumber(evalExpression(tempZ1), {}, 2);
    const z2Value = parseNumber(evalExpression(tempZ2), {}, 2);
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `(x_1, y_1 ${is3d ? `, z_1` : ' '}) = \\bold{(${
              parseNumber(x1) || 0
            }, ${parseNumber(y1) || 0}${is3d ? `, ${z1 || '0'}` : ' '})}`
          ),
          type: 'equation',
        },
        {
          value: `(x_2, y_2 ${is3d ? `, z_2` : ' '} )=\\bold{(${
            parseNumber(x2) || 0
          }, ${parseNumber(y2) || 0}${is3d ? `, ${z2 || '0'}` : ' '})}`,
          type: 'equation',
        },
      ])
    );

    let x = evalExpression(`${x1Value}-(${x2Value})`);
    let y = evalExpression(`${y1Value}-(${y2Value})`);
    let z = evalExpression(`${z1Value}-(${z2Value})`);
    let sqrX = evalExpression(`${x}*(${x})`);
    let sqrY = evalExpression(`${y}*(${y})`);

    let sqrZ = evalExpression(`${z}*(${z})`);

    const dTemp = evalExpression(`${sqrX}+${sqrY}+ ${sqrZ} `);
    const d = +evalInDecimals(dTemp);
    let [numR, denumR = 1] = dTemp?.split('/') || [dTemp, 1];
    let num =
      denumR == 1 ? `\\sqrt{${numR}}` : `\\sqrt{\\frac{${numR}}{${denumR}}}`;
    let lowest =
      denumR == 1
        ? `{${evalInDecimals(`sqrt(${numR})`)}}`
        : `\\frac{${evalInDecimals(`sqrt(${numR})`)}}{${evalInDecimals(
            `sqrt(${denumR})`
          )}}`;
    numR = lowestForm(numR);
    denumR = lowestForm(denumR);
    let res = Math.sqrt(d);

    if (isInvalid) return;

    setResult(
      renderSteps([
        {
          value: `Answer`,
          type: `h6`,
        },
        {
          value: putSpace(
            `The distance(d) between points  P_1 \\bold{(${parseNumber(
              x1
            )},${parseNumber(y1)} ${
              is3d ? `, ${z1}` : ''
            })} \\space and Point P_2 \\bold{(${parseNumber(x2)},${parseNumber(
              y2
            )} ${is3d ? `, ${z2}` : ''})}  is given below:`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`Exact value in root form`),
          type: 'equation',
        },

        {
          value: ` \\bold{\\sqrt{${d}}} `,
          type: 'equation',
        },
        {
          value: putSpace(`Exact value in decimal form up to 10 digits`),
          type: 'equation',
        },
        {
          value: `d = \\bold{${Number.isInteger(res) ? res : res.toFixed(10)}}`,
          type: 'equation',
        },
      ])
    );

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The \\space distance \\space (d) \\space between \\space two \\space points `,
        type: 'equation',
      },
      {
        value: `\\space P_1 
        \\space = (x_1, y_1 ${
          is3d ? ', z_1' : ''
        }) \\space and \\space P_2 \\space = \\space (x_2, y_2 ${
          is3d ? ', z_2' : ''
        })`,
        type: 'equation',
      },
      {
        value: ` is \\space given \\space
        by \\space the \\space following \\space formula \\space :- `,
        type: 'equation',
      },

      {
        value: `d = \\sqrt{(x_1-x_2)^2+(y_1-y_2)^2${
          is3d ? `+ (z_1-z_2)^2` : ''
        }}`,
        type: 'equation',
      },
      {
        value: `Given \\space the \\space values \\space of \\space the \\space variables :`,
        type: 'equation',
      },
      {
        value: `x_1 = \\space ${convertIntoLatex(
          x1Value
        )}, \\space y_1 = \\space ${convertIntoLatex(y1Value)}
          ${
            is3d ? `, \\space y_2 = \\space ${convertIntoLatex(z1Value)}` : ''
          } ,
          \\space x_2 = \\space ${convertIntoLatex(
            x2Value
          )}, \\space y_2 = \\space ${convertIntoLatex(y2Value)}
          ${is3d ? `, \\space y_2 = \\space ${convertIntoLatex(z2Value)}` : ''}
          `,

        type: 'equation',
      },

      {
        value: putSpace(
          `After putting these values in the above given formula`
        ),
        type: 'equation',
      },
      {
        type: 'equation',
        value: `d = \\sqrt{(${parseNumber(x1) ?? 0}-${
          parseNumber(x2) ?? 0
        })^2+(${parseNumber(y1) ?? 0}-${parseNumber(y2) ?? 0})^2  ${
          +is3d ? `+(${parseNumber(z1) ?? 0}-${parseNumber(z2) ?? 0})^2` : ''
        } }`,
      },
      {
        type: 'equation',
        value: `d = \\sqrt{(${valueToKatex(x)})^2+(${valueToKatex(y)})^2 ${
          is3d ? `+(${valueToKatex(z)})^2` : ''
        } }`,
      },
      {
        value: `After \\space solving`,
        type: 'equation',
      },
      {
        type: 'equation',
        value: `
          d = \\sqrt{${valueToKatex(sqrX)}+${valueToKatex(sqrY)} ${
          is3d ? `+ ${valueToKatex(sqrZ)}` : ''
        }  } = \\sqrt{${valueToKatex(dTemp)}}`,
      },
      {
        type: 'equation',
        value: `d =${num} = ${showVal(
          lowest,
          Number.isInteger(res) ? res : res.toFixed(10),
          '\\implies'
        )}`,
      },

      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',

      {
        value: putSpace(
          `The distance(d) between points  P_1 \\bold{(${parseNumber(
            x1
          )},${parseNumber(y1)} ${
            is3d ? `, ${z1}` : ''
          })} \\space and Point P_2 \\bold{(${parseNumber(x2)},${parseNumber(
            y2
          )} ${is3d ? `, ${z2}` : ''})}  is given below:`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Exact value in root form`),
        type: 'equation',
      },

      {
        value: `d = \\bold{${
          denumR == 1 ? numR : `\\frac{${numR}}{${denumR}}`
        }} `,
        type: 'equation',
      },
      {
        value: putSpace(`Exact value in decimal form up to 10 digits`),
        type: 'equation',
      },

      {
        value: `d = \\bold{${Number.isInteger(res) ? res : res.toFixed(10)}}`,
        type: 'equation',
      },
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [x1, y1, z1, x2, y2, z2, showSteps, is3d]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeDimension = (event) => {
    setDimension(event.target.value);
  };
  const clear = useCallback(() => {
    mf1.current.latex('');
    mf2.current.latex('');
    if (is3d) mf3.current.latex('');
    mf4.current.latex('');
    mf5.current.latex('');
    if (is3d) mf6.current.latex('');
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setZ1('');
    setZ2('');
    setShowSteps(false);
    setShowResult(false);
  }, [setShowResult]);
  const has3dValues = [z1, z2].every((v) => !!v);
  const hasValue =
    [x1, x2, y1, y2].every((v) => !!v) && is3d ? has3dValues : true;

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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Distance Type</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={dimension}
                onChange={onChangeDimension}
              >
                <option value="3D">3D</option>
                <option value="2D">2D</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className={`col-${is3d ? 3 : 4} text-left`}>Point P_1:</div>
            <div className={`col-${is3d ? 3 : 4}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setX1}
                allowAlphabeticKeyboard={false}
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
                initialLatex={x1}
              />{' '}
            </div>
            <div className={`col-${is3d ? 3 : 4}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setY1}
                allowAlphabeticKeyboard={false}
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
                initialLatex={y1}
              />{' '}
            </div>
            {is3d && (
              <div className="col-3">
                <MathInput
                  setMathfieldRef={(ref) => (mf3.current = ref)}
                  setValue={setZ1}
                  allowAlphabeticKeyboard={false}
                  numericToolbarKeys={[
                    'epower',
                    'pi',
                    'ln',
                    'log',
                    'dot',
                    // "infty",
                    // "theta",
                    'sin',
                    'cos',
                    'tan',
                  ]}
                  initialLatex={z1}
                />{' '}
              </div>
            )}
          </div>
          <div className="row mb-2 align-items-center">
            <div className={`col-${is3d ? 3 : 4} text-left`}>Point P_2:</div>
            <div className={`col-${is3d ? 3 : 4}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setX2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={x2}
              />{' '}
            </div>
            <div className={`col-${is3d ? 3 : 4}`}>
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setY2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={y2}
              />{' '}
            </div>

            {is3d && (
              <div className="col-3">
                <MathInput
                  setMathfieldRef={(ref) => (mf6.current = ref)}
                  setValue={setZ2}
                  allowAlphabeticKeyboard={false}
                  numericToolbarKeys={[
                    'epower',
                    'pi',
                    'ln',
                    'log',
                    'dot',
                    // "infty",
                    // "theta",
                    'sin',
                    'cos',
                    'tan',
                  ]}
                  initialLatex={z2}
                />{' '}
              </div>
            )}
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue &&
        (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        ) : (
          <div>
            <strong>Note :-</strong> Since initial & final points are the same
            hence points are <strong>Coincident</strong> and distance between
            two coincident points is always <strong>ZERO</strong>.
          </div>
        ))}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
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

export default DistanceBetweenTwoPoints;
