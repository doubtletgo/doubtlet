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
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const MidPointOfLineJoiningTwoPoints = () => {
  const [x1, setx1] = useLocalStorage('MidPointOfLineJoiningTwoPoints_x1', '4');
  const [x2, setx2] = useLocalStorage('MidPointOfLineJoiningTwoPoints_x2', '\\sqrt{3}');
  const [y1, sety1] = useLocalStorage('MidPointOfLineJoiningTwoPoints_y1', '5');
  const [y2, sety2] = useLocalStorage('MidPointOfLineJoiningTwoPoints_y2', '1');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('MidPointOfLineJoiningTwoPoints_equation', '');
  const [solution, setSolution] = useLocalStorage('MidPointOfLineJoiningTwoPoints_solution', '');
  const [result, setResult] = useLocalStorage('MidPointOfLineJoiningTwoPoints_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MidPointOfLineJoiningTwoPoints_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('MidPointOfLineJoiningTwoPoints_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('MidPointOfLineJoiningTwoPoints_isPointSame', false);
  const [note, setNote] = useLocalStorage('MidPointOfLineJoiningTwoPoints_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setx1(vals.x1);
    if (vals.y1) sety1(vals.y1);
    if (vals.x2) setx2(vals.x2);
    if (vals.y2) sety2(vals.y2);
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
            `Find the \\bold{Mid-Point} of the {Line} joining two points `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `p_1 (x_1, y_1) = \\bold{(${valueToKatex(x1) || '0'}, ${
              valueToKatex(y1) || '0'
            })} \\& p_2 (x_2 , y_2) = \\bold{(${valueToKatex(x2) || '0'}, ${
              valueToKatex(y2) || '0'
            })}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2]);

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
            `Point p_1 (x_1, y_1) = \\bold{(${valueToKatex(x1) || '0'}, ${
              valueToKatex(y1) || '0'
            })}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Point p_2 (x_2 , y_2) = \\bold{(${valueToKatex(x2) || '0'}, ${
              valueToKatex(y2) || '0'
            })}`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, x2, y1, y2].some((x) => !x);
    if (!showSteps) return;
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);

    if (isInvalid.current) return;
    setIsPointSame(x1 == x2 && y1 == y2);
    const xNumeratorAdd = evalExpression(`(${x1Value}) + (${x2Value})`);
    const yNumeratorAdd = evalExpression(`(${y1Value}) + (${y2Value})`);
    // const valueOfX = evalExpression(`(${xNumeratorAdd})/2`);
    const valueOfX = evalExpression(`(${xNumeratorAdd})/2`);
    const valueOfY = evalExpression(`(${yNumeratorAdd})/2`);
    console.log('>>>>>>>>>>>>>', valueOfY);

    const finalAnswer = [
      {
        value: putSpace(`The \\bold{Mid-Point} of the Line joining two points`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{P}_1\\bold{(${valueToKatex(x1)}, ${valueToKatex(
            y1
          )})} \\& P_2 \\bold{(${valueToKatex(x2)}, ${valueToKatex(
            y2
          )})} is M (x, y)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= \\bold{(${valueToKatex(valueOfX)}, ${valueToKatex(
            valueOfY
          )})} or \\bold{(${evalInDecimals(valueOfX)}, ${evalInDecimals(
            valueOfY
          )})}`
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

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `We know that the <b>Mid-Point</b> of the <b>Line</b> joining two points`,
        type: 'span',
      },
      'br',
      {
        value: ` <b>P<sub>1</sub>
(x1, y1)</b> & <b>P<sub>2</sub> (x2, y2)</b> is given by the formula below`,
        type: 'span',
      },
      'br',
      {
        value: `Let <b>M (x, y)</b> be the <b>Mid-Point</b> of the line joining two points`,
        type: 'span',
      },
      'br',
      {
        value: `<b>P<sub>1</sub> 
(x<sub>1</sub>, y<sub>1</sub>)</b> & <b>P<sub>2</sub> (x<sub>2</sub>, y<sub>2</sub>)</b> `,
        type: 'span',
      },
      'br',
      {
        value: `Then, Coordinates of the Point M can be obtained by`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `using the formula x = {(x_1+x_2)\\above{1pt}(2)} and  y = {(y_1+y_2)\\above{1pt}(2)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that `),
        type: 'equation',
      },
      {
        value: `x_1 = \\space \\bold{${showVal(
          x1,
          x1Value
        )}}, \\space y_1 = \\space \\bold{${showVal(
          y1,
          y1Value
        )}}, \\space x_2 = \\space \\bold{${showVal(
          x2,
          x2Value
        )}}, \\space y_2 = \\space \\bold{${showVal(y2, y2Value)}}`,
        type: 'equation',
      },
      {
        value: `Now putting these values in the above given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `x ={({${valueToKatex(x1Value)}}+{${valueToKatex(
            x2Value
          )}})\\above{1pt}(2)} and y = {({${valueToKatex(
            y1Value
          )}}+{${valueToKatex(y2)}})\\above{1pt}(2)}`
        ),
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `x = {{${valueToKatex(
            xNumeratorAdd
          )}}\\above{1pt} 2}  and  y = {{${valueToKatex(
            yNumeratorAdd
          )}}\\above{1pt}2}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x  = {${valueToKatex(valueOfX)}} and  y = {${valueToKatex(
            valueOfY
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `P (x, y) = ({${valueToKatex(valueOfX)}},{ ${valueToKatex(
            valueOfY
          )}})`
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
  }, [x1, x2, y1, y2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setx1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    setx2('');
    sety1('');
    sety2('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [x1, x2, y1, y2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2].every((v) => !!v || v == 0);
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
            <div className="col-4 text-left">Point P1:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setx1}
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
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={sety1}
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
              initialLatex={y1}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P2:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setx2}
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
              initialLatex={x2}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={sety2}
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
              initialLatex={y2}
              style={{
                width: '33.33%',
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

export default MidPointOfLineJoiningTwoPoints;
