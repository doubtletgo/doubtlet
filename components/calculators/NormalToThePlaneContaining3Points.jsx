'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  removeSymbol,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const NormalToThePlaneContaining3Points = () => {
  const [x1, setX1] = useLocalStorage('NormalToThePlaneContaining3Points_x1', '1');
  const [y1, setY1] = useLocalStorage('NormalToThePlaneContaining3Points_y1', '2');
  const [z1, setZ1] = useLocalStorage('NormalToThePlaneContaining3Points_z1', '\\sqrt{1}');
  const [x2, setX2] = useLocalStorage('NormalToThePlaneContaining3Points_x2', '1');
  const [y2, setY2] = useLocalStorage('NormalToThePlaneContaining3Points_y2', 'e^5');
  const [z2, setZ2] = useLocalStorage('NormalToThePlaneContaining3Points_z2', '4');
  const [x3, setX3] = useLocalStorage('NormalToThePlaneContaining3Points_x3', '2');
  const [y3, setY3] = useLocalStorage('NormalToThePlaneContaining3Points_y3', '\\sqrt{1}');
  const [z3, setZ3] = useLocalStorage('NormalToThePlaneContaining3Points_z3', '8');
  const [result, setResult] = useLocalStorage('NormalToThePlaneContaining3Points_result', undefined);
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('NormalToThePlaneContaining3Points_equation', '');
  const [solution, setSolution] = useLocalStorage('NormalToThePlaneContaining3Points_solution', '');
  const [showResult, setShowResult] = useLocalStorage('NormalToThePlaneContaining3Points_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NormalToThePlaneContaining3Points_showSteps', true);
  const [note, setNote] = useLocalStorage('NormalToThePlaneContaining3Points_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
    if (vals.x3) setX3(vals.x3);
    if (vals.y3) setY3(vals.y3);
    if (vals.z3) setZ3(vals.z3);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find if the given three lines Line `),
          type: 'equation',
        },
        {
          value: putSpace(
            `A(\\bold{{${x1 || 'a'}},  {${y1 || 'b'}}, {${
              z1 || 'c'
            }}}), B(\\bold{{${x2 || 'a'}}, {${y2 || 'b'}}, {${
              z2 || 'c'
            }}}) \\& C(\\bold{{${x3 || 'a'}}, {${y3 || 'b'}}, {${z3 || 'c'}}})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, y2, z2, x3, x2, y3, z3]);

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
            `(x_1, y_1, z_1) = ({${x1 || '1'}}, {${y1 || '1'}}, {${z1 || '1'}})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(x_2, y_2, z_2) = ({${x2 || '1'}}, {${y2 || '1'}}, {${z2 || '1'}})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(x_3, y_3, z_3) = ({${x3 || '1'}}, {${y3 || '1'}}, {${z3 || '1'}})`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, y1, z1, y2, z2, x3, x2, y3, z3].some((x) => !x);
    if (isInvalid.current) return;
    const tempX1 = katexSimplifiedValue(x1);
    const tempY1 = katexSimplifiedValue(y1);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY2 = katexSimplifiedValue(y2);
    const tempZ2 = katexSimplifiedValue(z2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY3 = katexSimplifiedValue(y3);
    const tempC3 = katexSimplifiedValue(z3);

    const x1Value = evalExpression(tempX1);
    const y1Value = evalExpression(tempY1);
    const z1Value = evalExpression(tempZ1);
    const x2Value = evalExpression(tempX2);
    const y2Value = evalExpression(tempY2);
    const z2Value = evalExpression(tempZ2);
    const x3Value = evalExpression(tempX3);
    const y3Value = evalExpression(tempY3);
    const z3Value = evalExpression(tempC3);

    //variables
    const x2SubX1 = evalExpression(`(${x2Value})-(${x1Value})`);
    const Y2SubY1 = evalExpression(`(${y2Value})-(${y1Value})`);
    const Z2SubZ1 = evalExpression(`(${z2Value})-(${z1Value})`);

    const x3SubX1 = evalExpression(`(${x3Value})-(${x1Value})`);
    const y3SubY1 = evalExpression(`(${y3Value})-(${y1Value})`);
    const z3SubZ1 = evalExpression(`(${z3Value})-(${z1Value})`);

    let Z2SubZ1IntoZ3SubZ1 = evalExpression(`${Y2SubY1} * (${z3SubZ1})`);
    let y3SubY1IntoZ2SubZ1 = evalExpression(`${y3SubY1} * (${Z2SubZ1})`);
    let x2SubX1IntoZ3SubZ1 = evalExpression(`${x2SubX1} * (${z3SubZ1})`);
    let x3SubX1IntoZ2SubZ1 = evalExpression(`${x3SubX1} * (${Z2SubZ1})`);
    let x2SubX1InotY3SubY1 = evalExpression(`${x2SubX1} * (${y3SubY1})`);
    let x3SubX1IntoY2SubY1 = evalExpression(`${x3SubX1} * (${Y2SubY1})`);

    let i = evalExpression(`${Z2SubZ1IntoZ3SubZ1} - (${y3SubY1IntoZ2SubZ1})`);
    let j = evalExpression(`${x2SubX1IntoZ3SubZ1} - (${x3SubX1IntoZ2SubZ1})`);
    let k = evalExpression(`${x2SubX1InotY3SubY1} - (${x3SubX1IntoY2SubY1})`);

    const finalAnswer = [
      {
        value: putSpace(`The Normal vector to the plane containing the points`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A(\\bold{{${x1 || 'a'}},  {${y1 || 'b'}}, {${
            z1 || 'c'
          }}}), B(\\bold{{${x2 || 'a'}}, {${y2 || 'b'}}, {${
            z2 || 'c'
          }}}) \\& C(\\bold{{${x3 || 'a'}}, {${y3 || 'b'}}, {${z3 || 'c'}}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` = \\bold{{${evalInDecimals(i)}}i ${minusSymbol(
            evalInDecimals(j)
          )} {${removeSymbol(evalInDecimals(j))}}j ${addSymbol(
            evalInDecimals(k)
          )} {${removeSymbol(evalInDecimals(k))}}k}`
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
        value: putSpace(
          `We know that the Normal vector to the plane containing `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the points A (x_1, y_1, z_1), B (x_2, y_2, z_2) \\& C (x_3, y_3, z_ 3)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`can be calculated by taking the cross product of any`),
        type: 'equation',
      },
      {
        value: putSpace(` two vectors formed by these points.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Normal vector \\overrightarrow{(N)} = ±( \\overrightarrow{AB} x \\overrightarrow{AC} )`
        ),
        type: 'equation',
      },
      {
        value: `Step-1`,
        type: 'h6',
      },
      {
        value: putSpace(`Now, Given values are`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_1, y_1, z_1) = ({${showVal(x1, x1Value)}}, {${showVal(
            y1,
            y1Value
          )}}, {${showVal(z1, z1Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2, z_2) = ({${showVal(x2, x2Value)}}, {${showVal(
            y2,
            y2Value
          )}}, {${showVal(z2, z2Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_3, y_3, z_3) = ({${showVal(x3, x3Value)}}, {${showVal(
            y3,
            y3Value
          )}}, {${showVal(z3, z3Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`then we have to find the AB \\& AC vectors`),
        type: 'equation',
      },
      {
        value: `\\overrightarrow{AB} = (x_2, y_2, z_2)-(x_1, y_1, z_1) = ({${valueToKatex(
          x2Value
        )}}, {${valueToKatex(y2Value)}}, {${valueToKatex(
          z2Value
        )}})-({${valueToKatex(x1Value)}}, {${valueToKatex(
          y1Value
        )}}, {${valueToKatex(z1Value)}}) = 
        \\bigg<{${valueToKatex(x2SubX1)}}, {${valueToKatex(
          Y2SubY1
        )}}, {${valueToKatex(Z2SubZ1)}}\\bigg>`,
        type: 'equation',
      },
      {
        value: `\\overrightarrow{AC} = (x_3, y_3, z_3)-(x_1, y_1, z_1) = ({${valueToKatex(
          x3Value
        )}}, {${valueToKatex(y3Value)}}, {${valueToKatex(
          z3Value
        )}})-({${valueToKatex(x1Value)}}, {${valueToKatex(
          y1Value
        )}}, {${valueToKatex(z1Value)}}) = \\bigg<{${valueToKatex(
          x3SubX1
        )}},{${valueToKatex(y3SubY1)}},{${valueToKatex(z3SubZ1)}}\\bigg>`,
        type: 'equation',
      },
      {
        value: `Step-2`,
        type: 'h6',
      },
      {
        value: putSpace(
          `Now putting the given values in the above-given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{AB}x \\overrightarrow{AC} =\\bigg<{${valueToKatex(
            x2SubX1
          )}}, {${valueToKatex(Y2SubY1)}}, {${valueToKatex(
            Z2SubZ1
          )}}\\bigg> * \\bigg<{${valueToKatex(x3SubX1)}},{${valueToKatex(
            y3SubY1
          )}},{${valueToKatex(
            z3SubZ1
          )}}\\bigg> = \\bigg<\\bold{{${evalInDecimals(i)}}i ${minusSymbol(
            evalInDecimals(j)
          )} {${removeSymbol(evalInDecimals(j))}}j ${addSymbol(
            evalInDecimals(k)
          )} {${removeSymbol(evalInDecimals(k))}}k}\\bigg>`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cross-product-of-two-vectors-calculator/?x1=${x2SubX1}&y1=${Y2SubY1}
        &z1=${Z2SubZ1}&x2=${x3SubX1}&y2=${y3SubY1}&z2=${z3SubZ1}" 
        target="_blank">to see Steps click here</a>`,
        type: `span`,
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
  }, [x1, y1, z1, y2, z2, x3, x2, y3, z3, showSteps]);
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
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
    setX1('');
    setY1('');
    setZ1('');
    setX2('');
    setY2('');
    setZ2('');
    setX3('');
    setY3('');
    setZ3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, y2, z2, x3, x2, y3, z3].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, y1, z1, y2, z2, x3, x2, y3, z3].every(
    (v) => !!v || v == 0
  );
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
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Line A:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setX1}
              initialLatex={x1}
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
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setY1}
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
              style={{
                width: '28%',
              }}
              initialLatex={y1}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setZ1}
              initialLatex={z1}
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
              style={{
                width: '28%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Line B:</div>

            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setX2}
              initialLatex={x2}
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
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setY2}
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
              style={{
                width: '28%',
              }}
              initialLatex={y2}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setZ2}
              initialLatex={z2}
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
              style={{
                width: '28%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Line C:</div>

            <MathInput
              setMathfieldRef={(ref) => (mf7.current = ref)}
              setValue={setX3}
              initialLatex={x3}
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
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf8.current = ref)}
              setValue={setY3}
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
              style={{
                width: '28%',
              }}
              initialLatex={y3}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf9.current = ref)}
              setValue={setZ3}
              initialLatex={z3}
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
              style={{
                width: '28%',
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
      {hasAllValue && (
        <button
          className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
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

export default NormalToThePlaneContaining3Points;
