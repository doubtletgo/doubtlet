'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';

import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  showVal,
  evalInDecimals,
  katexSimplifiedValue,
} from '../../helpers/matrixHelper';
import { convertToKatex } from '../../helpers/SolveRoot';

const DistanceOfPointFromPlane = () => {
  const [a, setA] = useLocalStorage('DistanceOfPointFromPlane_a', '3');
  const [b, setB] = useLocalStorage('DistanceOfPointFromPlane_b', '\\pi');
  const [c, setC] = useLocalStorage('DistanceOfPointFromPlane_c', '1');
  const [d, setD] = useLocalStorage('DistanceOfPointFromPlane_d', '4');
  const [x, setX] = useLocalStorage('DistanceOfPointFromPlane_x', '2');
  const [y, setY] = useLocalStorage('DistanceOfPointFromPlane_y', '\\sqrt{34}');
  const [z, setZ] = useLocalStorage('DistanceOfPointFromPlane_z', '7');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('DistanceOfPointFromPlane_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceOfPointFromPlane_solution', '');
  const [showResult, setShowResult] = useLocalStorage('DistanceOfPointFromPlane_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceOfPointFromPlane_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('DistanceOfPointFromPlane_isPointSame', false);
  const [note, setNote] = useLocalStorage('DistanceOfPointFromPlane_note', undefined);
  const [result, setResult] = useLocalStorage('DistanceOfPointFromPlane_result', '');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.a) setA(vals.a);
    if (vals.b) setC(vals.b);
    if (vals.c) setB(vals.c);
    if (vals.d) setD(vals.d);
    if (vals.x) setX(vals.x);
    if (vals.y) setY(vals.y);
    if (vals.z) setZ(vals.z);
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
            `Find the Distance (d) of the Point P \\bold{({${x || '1'}}, {${
              y || '1'
            }}, {${z || '1'}}) }`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `from the Line L \\bold{({${a || ''}}x + {${b || ''}}y + {${
              c || ''
            }}z + {${d || '1'} }= 0)}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d, x, y, z]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Plane  equation:- {${a || ''}}x+{${b || ''}}y+{${c || ''}}z+{${
            d || 'd'
          }} = 0`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Point (P):- x =\\bold{{${x || '1'}}}, y =\\bold{{${
            y || '1'
          }}},  z =\\bold{{${z || '1'}}}`),
          type: 'equation',
        },
      ])
    );
    isInvalid.current = [a, b, c, d].some((x) => !x);
    setIsPointSame(a == b && c == d);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);
    const tempX = katexSimplifiedValue(x);
    const tempY = katexSimplifiedValue(y);
    const tempZ = katexSimplifiedValue(z);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    const xValue = evalExpression(tempX);
    const yValue = evalExpression(tempY);
    const zValue = evalExpression(tempZ);

    if (isInvalid.current) return;
    let aX = evalExpression(`(${aValue} * ${xValue})`);
    let bY = evalExpression(`(${bValue} * ${yValue})`);
    let cZ = evalExpression(`(${cValue} * ${zValue})`);
    let aSquare = evalExpression(`${aValue} *(${aValue})`);
    let bSquare = evalExpression(`${bValue} *(${bValue})`);
    let cSquare = evalExpression(`${cValue} *(${cValue})`);
    let numeratorAdd = evalExpression(`${aX} +(${bY}) +(${cZ})+ (${dValue})`);
    let denominatorAdd = evalExpression(
      `${aSquare} +(${bSquare}) + (${cSquare})`
    );
    let roundSquareRoot = evalExpression(
      ` ${numeratorAdd} / sqrt(${denominatorAdd})`
    );
    let notRoundSquareRoot = evalExpression(
      `${numeratorAdd}* sqrt(${denominatorAdd}) / (${denominatorAdd})`
    );
    let checkRoot = evalInDecimals(`sqrt(${denominatorAdd})`);
    let numByDenumKatex = convertToKatex(
      valueToKatex(numeratorAdd),
      valueToKatex(denominatorAdd),
      true
    );
    const finalAnswer = [
      {
        value: putSpace(
          `The Distance (d) of the Point P \\bold{({${x || '1'}},{ ${
            y || '1'
          }},{ ${z || '1'}})} from the Line`
        ),
        type: 'equation',
      },
      {
        value: `L \\bold{({${a}}x +{ ${b}}y + {${c || 'c'}}z +{ ${
          d || '1'
        }} = 0)} is: `,
        type: 'equation',
      },
      {
        value: `{${valueToKatex(numeratorAdd)}\\above{1pt}\\sqrt{${valueToKatex(
          denominatorAdd
        )}}} \\implies ${
          Number.isInteger(checkRoot)
            ? `${valueToKatex(roundSquareRoot)}`
            : `{${valueToKatex(numeratorAdd)}\\above{1pt}${valueToKatex(
                denominatorAdd
              )}}*\\sqrt{${valueToKatex(
                denominatorAdd
              )}} \\implies {${numByDenumKatex}}*\\sqrt{${valueToKatex(
                denominatorAdd
              )}}`
        } `,
        type: 'equation',
      },
      {
        value: `${
          Number.isInteger(checkRoot)
            ? ``
            : `\\implies ${valueToKatex(notRoundSquareRoot)}`
        }`,
        type: 'equation',
      },
    ];
    const equations = [
      {
        value: `<b>Answer</b>`,
        type: `span`,
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
        value: `We know that the <b>Distance (d)</b> of the Point <b>P (x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>)</b> from <br>the Plane 
        <b>(ax + by + cz + d = 0)</b> is given by the formula below`,
        type: 'span',
      },
      {
        value: putSpace(
          `d = \\lvert{ax_1+by_1+cz_1+d\\above{1pt}(\\sqrt{a^2+b^2+c^2})}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: `From the above input it is given that`,
        type: 'span',
      },
      {
        value: `\\bold{a = ${showVal(a, aValue)}, b = {${showVal(
          b,
          bValue
        )}}, c = {${showVal(c, cValue)}},d = {${showVal(
          d,
          dValue
        )}},x={${showVal(x, xValue)}}, y={${showVal(y, yValue)}},z = {${showVal(
          z,
          zValue
        )}} }`,
        type: 'equation',
      },
      {
        value: `Now putting these values in the above given formula`,
        type: 'span',
      },
      {
        value: `d = \\lvert{({${a}})({${x}})+({${b}})({${y}})+({${c}})({${z}}) + {${d}}\\above{1pt}(\\sqrt{{${a}}^2 +{ ${b}}^2 + {${c}}^2})}\\rvert`,
        type: 'equation',
      },
      {
        value: `After Solving`,
        type: 'span',
      },
      {
        value: `d = \\lvert{{${valueToKatex(aX)}}+{${valueToKatex(
          bY
        )}}+{${valueToKatex(cZ)}}+{${valueToKatex(
          d
        )}}\\above{1pt}\\sqrt{{${valueToKatex(aSquare)}}+{${valueToKatex(
          bSquare
        )}}+{${valueToKatex(cSquare)}}}}\\rvert`,
        type: 'equation',
      },
      {
        value: `d = \\lvert{{${valueToKatex(
          numeratorAdd
        )}}\\above{1pt}\\sqrt{{${valueToKatex(denominatorAdd)}}}}\\rvert`,
        type: 'equation',
      },
      {
        value: `d = ${
          Number.isInteger(checkRoot)
            ? `{${valueToKatex(roundSquareRoot)}}`
            : `{{${valueToKatex(numeratorAdd)}}\\above{1pt}{${valueToKatex(
                denominatorAdd
              )}}}*\\sqrt{{${valueToKatex(denominatorAdd)}}}`
        } ${
          Number.isInteger(checkRoot)
            ? ``
            : `\\implies {${valueToKatex(notRoundSquareRoot)}}`
        }`,
        type: 'equation',
      },
      `hr`,
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);
    setSolution(solution);
  }, [a, b, c, d, x, y, z, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    if (mf7.current) mf7?.current.latex('');
    setA('');
    setB('');
    setC('');
    setD('');
    setX('');
    setY('');
    setZ('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a, b, c, d, x, y, z].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, d, x, y, z].every((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Plane Equation:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setA}
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
              initialLatex={a}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setB}
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
              initialLatex={b}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setC}
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
              initialLatex={c}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setD}
              style={{
                width: '20%',
              }}
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
              initialLatex={d}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P (x, y, z):</div>
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setX}
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
              initialLatex={x}
              style={{
                width: '21.20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setY}
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
              initialLatex={y}
              style={{
                width: '21%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf7.current = ref)}
              setValue={setZ}
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
              initialLatex={z}
              style={{
                width: '21%',
              }}
            />
          </div>

          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue &&
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
          className="default-btn rounded-pill mt-2 px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
        <>
          <Equation className="mt-3" equation={result} />
          {
            <button
              className="default-btn mt-3 rounded-pill px-5 btn-blue"
              onClick={toggleSteps}
            >
              Show Steps
            </button>
          }
        </>
      )}
      {hasAllValue && !isPointSame && showSteps && (
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

export default DistanceOfPointFromPlane;
