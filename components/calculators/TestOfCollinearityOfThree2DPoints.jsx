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
  evalInDecimals,
  removeSymbol,
} from '../../helpers/matrixHelper';

const TestOfCollinearityOfThree2DPoints = () => {
  const [x1, setX1] = useLocalStorage('TestOfCollinearityOfThree2DPoints_x1', '4');
  const [x2, setX2] = useLocalStorage('TestOfCollinearityOfThree2DPoints_x2', '\\sqrt{3}');
  const [y1, setY1] = useLocalStorage('TestOfCollinearityOfThree2DPoints_y1', '5');
  const [y2, setY2] = useLocalStorage('TestOfCollinearityOfThree2DPoints_y2', '1');
  const [x3, setX3] = useLocalStorage('TestOfCollinearityOfThree2DPoints_x3', '5');
  const [y3, setY3] = useLocalStorage('TestOfCollinearityOfThree2DPoints_y3', '1');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('TestOfCollinearityOfThree2DPoints_equation', '');
  const [solution, setSolution] = useLocalStorage('TestOfCollinearityOfThree2DPoints_solution', '');
  const [result, setResult] = useLocalStorage('TestOfCollinearityOfThree2DPoints_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('TestOfCollinearityOfThree2DPoints_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('TestOfCollinearityOfThree2DPoints_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('TestOfCollinearityOfThree2DPoints_isPointSame', false);
  const [note, setNote] = useLocalStorage('TestOfCollinearityOfThree2DPoints_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.x3) setX3(vals.x3);
    if (vals.y3) setY3(vals.y3);
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
            `Find if the following points A (\\bold{${x1 || 'x1'}, ${
              y1 || 'y1'
            }}), B (\\bold{${x2 || 'x2'}, ${y2 || 'y3'}})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` and C (\\bold{${x3 || 'x3'}, ${
              y3 || 'y3'
            }}) are Collinear or Not.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2, x3, y3]);

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
            `Point A : (x1, y1) = (\\bold{${x1 || 'x1'}}, \\bold{${
              y1 || 'y1'
            }})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Point B : (x2, y2) = (\\bold{${x2 || 'x2'}}, \\bold{${
              y2 || 'y2'
            }})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Point C : (x3, y3) = (\\bold{${x3 || 'x3'}}, \\bold{${
              y3 || 'y3'
            }})`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, x2, y1, y2, x3, y3].some((x) => !x);
    if (!showSteps) return;
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempY3 = katexSimplifiedValue(y3);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const x3Value = evalExpression(tempX3);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const y3Value = evalExpression(tempY3);

    if (isInvalid.current) return;
    setIsPointSame(x1 == x2 && y1 == y2 && y3 == x3);

    const x2Intoy3 = evalExpression(`(${x2Value}) * (${y3Value})`);
    const x3Intoy2 = evalExpression(`(${x3Value}) * (${y2Value})`);
    const y2SubY3 = evalExpression(`(${y2Value}) - (${y3Value})`);
    const x1Y2SubX3 = evalExpression(`(${x1Value}) * (${y2SubY3})`);
    const x2subx3 = `(${x2Value}) - (${x3Value})`;
    const x2IntoY3SubX3Intoy2 = evalExpression(`(${x2Intoy3}) - (${x3Intoy2})`);
    const y1Intox2SubX3 = evalExpression(`(${y1Value}) * (${x2subx3})`);
    const result = evalExpression(
      `(${x1Y2SubX3}) - (${y1Intox2SubX3}) + (${x2IntoY3SubX3Intoy2})`
    );
    const twoDiviedResult = evalInDecimals(`(${result}) / 2`);
    const compareToZero = twoDiviedResult === 0;

    const finalAnswer = [
      {
        value: putSpace(
          `The points A(\\bold{${x1 || 'x1'}, ${y1 || 'y1'}}), B(\\bold{${
            x2 || 'x2'
          }, ${y2 || 'y3'}}), C(\\bold{${x3 || 'x3'}, ${y3 || 'y3'}}) are ${
            compareToZero ? '' : `\\bold{NOT}`
          } Collinear.`
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
        value: putSpace(`We know that test of collinearity can be done`),
        type: 'equation',
      },
      {
        value: putSpace(
          `by finding the \\bold{Area of the triangle} formed by`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `the Points A (x_1, y_1), B (x_2, y_2) \\& C (x_3, y_3)`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`as vertices by the formula`),
        type: 'equation',
      },
      {
        value:
          putSpace(`Area of the triangle = {1 \\above{1pt}2} \\lVert \\overrightarrow{AB} X 
       \\overrightarrow{AC} \\rVert \\enspace or `),
        type: `equation`,
      },
      {
        value: putSpace(
          `{1\\above{1pt}2} \\begin{vmatrix} X_1 & Y_1 & 1 \\\\ X_2 & Y_2 & 1 \\\\ X_3 & Y_3 & 1 \\end{vmatrix}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`If the area of the triangle is \\bold{ZERO} then`),
        type: 'equation',
      },
      {
        value: putSpace(`Points are collinear, else \\bold{NOT}`),
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
        value: putSpace(`Given that`),
        type: `equation`,
      },
      {
        value: putSpace(
          `(x3, y3) = (\\bold{${showVal(x1, x1Value)}, ${showVal(
            y1,
            y1Value
          )}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x2, y2) = (\\bold{${showVal(x2, x2Value)}, ${showVal(
            y2,
            y2Value
          )}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x3, y3) = (\\bold{${showVal(x3, x3Value)}, ${showVal(
            y3,
            y3Value
          )}})`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`Now putting these values in the above formula`),
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
          `{1\\above{1pt}2} \\begin{vmatrix} {${x1}} & {${y1}} & 1 \\\\ {${x2}} & {${y2}} & 1 \\\\ {${x3}} & {${y3}} & 1 \\end{vmatrix}`
        ),
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2}[(${x1}) \\lbrace (${y2})(1) - (${y3})(1) \\rbrace - (${y1})\\lbrace (${x2})(1)-(${x3})(1)\\rbrace + (1)\\lbrace (${x2})(${y3}) - (${y2})(${x3})\\rbrace ]`,
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2}\\lbrace ({${valueToKatex(
          x1Value
        )}})({${valueToKatex(y2Value)}} ${minusSymbol(
          evalInDecimals(y3Value)
        )} {${removeSymbol(valueToKatex(y3Value))}}) - ({${valueToKatex(
          y1Value
        )}})({${valueToKatex(x2Value)}} ${minusSymbol(x3)} {${removeSymbol(
          valueToKatex(x3Value)
        )}}) + (1) ({${valueToKatex(x2Intoy3)}} ${minusSymbol(
          x3Intoy2
        )} {${removeSymbol(valueToKatex(x3Intoy2))}})\\rbrace`,
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2} ({${valueToKatex(x1Y2SubX3)}} ${minusSymbol(
          evalInDecimals(y1Intox2SubX3)
        )} {${removeSymbol(valueToKatex(y1Intox2SubX3))}} ${addSymbol(
          evalInDecimals(x2IntoY3SubX3Intoy2)
        )} ${removeSymbol(valueToKatex(x2IntoY3SubX3Intoy2))})  `,
        type: `equation`,
      },

      {
        value: putSpace(
          ` = \\lVert{1 \\above{1pt}2} (${valueToKatex(
            result
          )}) \\rVert= { ${valueToKatex(
            removeSymbol(result)
          )}\\above{1pt}2}= ${valueToKatex(removeSymbol(twoDiviedResult))}`
        ),
        type: `equation`,
      },
      {
        value: `\\implies ${removeSymbol(valueToKatex(twoDiviedResult))} ${
          compareToZero ? '=' : `\\not =`
        } 0`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Hence, we can say that Given points are ${
            compareToZero ? '' : `\\bold{NOT}`
          } collinear.`
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
  }, [x1, x2, y1, y2, , x3, y3, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setX1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    mf5?.current.latex('');
    mf6?.current.latex('');
    setX2('');
    setY1('');
    setY2('');
    setX3('');
    setY3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, x2, y1, y2, x3, y3].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2, x3, y3].every((v) => !!v || v == 0);

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
          <div className="text-left mb-3">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P1:</div>
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
                // "infty",
                // "theta",
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
              setValue={setY1}
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
              setValue={setX2}
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
              allowAlphabeticKeyboard={false}
              initialLatex={x2}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setY2}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y2}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P2:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setX3}
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
              allowAlphabeticKeyboard={false}
              initialLatex={x3}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setY3}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y3}
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

export default TestOfCollinearityOfThree2DPoints;
