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
  removeSymbol,
  evalInDecimals,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';

const ScalarTripleProduct = () => {
  const [x1, setX1] = useLocalStorage('ScalarTripleProduct_x1', '2');
  const [y1, setY1] = useLocalStorage('ScalarTripleProduct_y1', '3');
  const [z1, setZ1] = useLocalStorage('ScalarTripleProduct_z1', '3');
  const [x2, setX2] = useLocalStorage('ScalarTripleProduct_x2', '2');
  const [y2, setY2] = useLocalStorage('ScalarTripleProduct_y2', '4');
  const [z2, setZ2] = useLocalStorage('ScalarTripleProduct_z2', '6');
  const [x3, setX3] = useLocalStorage('ScalarTripleProduct_x3', '7');
  const [y3, setY3] = useLocalStorage('ScalarTripleProduct_y3', '8');
  const [z3, setZ3] = useLocalStorage('ScalarTripleProduct_z3', '8');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('ScalarTripleProduct_equation', '');
  const [solution, setSolution] = useLocalStorage('ScalarTripleProduct_solution', '');
  const [showResult, setShowResult] = useLocalStorage('ScalarTripleProduct_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ScalarTripleProduct_showSteps', true);
  const [note, setNote] = useLocalStorage('ScalarTripleProduct_note', undefined);
  const [answer, setAnswer] = useLocalStorage('ScalarTripleProduct_answer', '');
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

  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempZ1 = convertFromLatex(z1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);
  const tempZ2 = convertFromLatex(z2);
  const tempX3 = convertFromLatex(x3);
  const tempY3 = convertFromLatex(y3);
  const tempZ3 = convertFromLatex(z3);

  const x1Value = evalExpression(tempX1);
  const y1Value = evalExpression(tempY1);
  const z1Value = evalExpression(tempZ1);
  const x2Value = evalExpression(tempX2);
  const y2Value = evalExpression(tempY2);
  const z2Value = evalExpression(tempZ2);
  const x3Value = evalExpression(tempX3);
  const y3Value = evalExpression(tempY3);
  const z3Value = evalExpression(tempZ3);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Scalar Triple Product} of the given Vectors`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `
            \\overrightarrow{A}({${x1 || 'a'}}i${addSymbol(
              evalInDecimals(tempY1)
            )}  {${removeSymbol(y1 || 'b')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )}{${removeSymbol(z1 || 'c')}}k),  \\overrightarrow{B}({${
              x2 || 'a'
            }}i ${addSymbol(evalInDecimals(tempY2))} {${removeSymbol(
              y2 || 'b'
            )}}j${addSymbol(evalInDecimals(tempZ2))}  {${removeSymbol(
              z2 || 'c'
            )}}k) \\& \\overrightarrow{C}({${x3 || 'a'}}i ${addSymbol(
              evalInDecimals(tempY3)
            )}  {${removeSymbol(y3 || 'b')}}j ${addSymbol(
              evalInDecimals(tempZ3)
            )}  {${removeSymbol(z3 || 'c')}}k)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2, x3, y3, z3]);

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
            `Vector \\overrightarrow{A}: \\bigg< {${x1 || 'a'}}i${addSymbol(
              evalInDecimals(tempY1)
            )}  {${removeSymbol(y1 || 'b')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )}{${removeSymbol(z1 || 'c')}}k \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Vector \\overrightarrow{B}: \\bigg< {${x2 || 'a'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || 'b')}}j${addSymbol(
              evalInDecimals(tempZ2)
            )}  {${removeSymbol(z2 || 'c')}}k \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Vector \\overrightarrow{C}: \\bigg< {${x3 || 'a'}}i ${addSymbol(
              evalInDecimals(tempY3)
            )}  {${removeSymbol(y3 || 'b')}}j ${addSymbol(
              evalInDecimals(tempZ3)
            )}  {${removeSymbol(z3 || 'c')}}k \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, y1, z1, x2, y2, z2, x3, y3, z3].some((x) => !x);
    if (isInvalid.current) return;

    //variables
    let y2IntoZ3 = evalExpression(`${y2Value}*${z3Value}`);
    let y3IntoZ2 = evalExpression(`${y3Value}*${z2Value}`);
    let x2IntoZ3 = evalExpression(`${x2Value}*${z3Value}`);
    let x3IntoZ2 = evalExpression(`${x3Value}*${z2Value}`);
    let x2IntoY3 = evalExpression(`${x2Value}*${y3Value}`);
    let x3IntoY2 = evalExpression(`${x3Value}*${y2Value}`);

    let y2IntoZ3SubY3IntoZ2 = evalExpression(`(${y2IntoZ3})-(${y3IntoZ2})`);
    let x2IntoZ3SubX3IntoZ2 = evalExpression(`(${x2IntoZ3})-(${x3IntoZ2})`);
    let x2IntoY3SubX3IntoY2 = evalExpression(`(${x2IntoY3})- (${x3IntoY2})`);
    let into1 = evalExpression(`(${x1Value})*(${y2IntoZ3SubY3IntoZ2})`);
    let into2 = evalExpression(`(${y1Value})*(${x2IntoZ3SubX3IntoZ2})`);
    let into3 = evalExpression(`(${z1Value})*(${x2IntoY3SubX3IntoY2})`);
    let res = evalExpression(`(1) * ((${into1} - ${into2} + ${into3}) )`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Scalar Triple Product} of the Vectors is \\bold{{${valueToKatex(
            res
          )}}}  or  \\bold{{${evalInDecimals(res)}}}`
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
    setAnswer(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that the \\bold{Scalar Triple Product} of the given Vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} (x_1, y_1, z_1), \\overrightarrow{B} (x_2, y_2, z_2) \\& \\overrightarrow{C} (x_3, y_3, z_3)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Scalar Triple Product =  \\bold{(\\overrightarrow{A}  x \\overrightarrow{B} ).C or [ \\overrightarrow{A} \\overrightarrow{B}\\overrightarrow{C} ]}`
        ),
        type: 'equation',
      },
      {
        value: `Step-1`,
        type: 'span',
      },
      {
        value: putSpace(
          `Value of the Box Product \\bold{(\\overrightarrow{A}  x \\overrightarrow{B}).\\overrightarrow{C}} or \\bold{[ \\overrightarrow{A} \\overrightarrow{B} \\overrightarrow{C} ]}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` can be formed by obtaining the`),
        type: 'equation',
      },

      {
        value: putSpace(`Determinant formed by the given vectors.`),
        type: 'equation',
      },
      {
        value: `\\begin{vmatrix}
        x_1 & y_1 & z_1 \\\\
        x_2 & y_2 & z_2 \\\\
        x_3 & y_3 & z_3
        \\end{vmatrix} = {x_1(y_2z_3 - y_3z_2) – y_1(x_2z_3 - x_3z_2) + z_1(x_2y_3 – x_3y_2)}`,
        type: 'equation',
      },
      {
        value: putSpace(`Now, Given values are`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_1, y_1, z_1) = ({${convertIntoLatex(
            x1Value
          )}}, {${convertIntoLatex(y1Value)}}, {${convertIntoLatex(z1Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2, z_2) = ({${convertIntoLatex(
            x2Value
          )}}, {${convertIntoLatex(y2Value)}}, {${convertIntoLatex(z2Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_3, y_3, z_3) = ({${convertIntoLatex(
            x3Value
          )}}, {${convertIntoLatex(y3Value)}}, {${convertIntoLatex(z3Value)}})`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Now putting the given values in the above given formula`
        ),
        type: 'equation',
      },
      {
        value: `\\begin{vmatrix}
        {${valueToKatex(x1Value)}} & {${valueToKatex(
          y1Value
        )}} & {${valueToKatex(z1Value)}} \\\\
        {${valueToKatex(x2Value)}} & {${valueToKatex(
          y2Value
        )}} & {${valueToKatex(z2Value)}} \\\\
        {${valueToKatex(x3Value)}} & {${valueToKatex(
          y3Value
        )}} & {${valueToKatex(z3Value)}}
        \\end{vmatrix} = {({${valueToKatex(x1Value)}}) \\{ ({${valueToKatex(
          y2Value
        )}})({${valueToKatex(z3Value)}}) - ({${valueToKatex(
          y3Value
        )}})({${valueToKatex(z2Value)}})\\} – ({${valueToKatex(
          y1Value
        )}})\\{ ({${valueToKatex(x2Value)}})({${valueToKatex(
          z3Value
        )}}) - ({${valueToKatex(x3Value)}})({${valueToKatex(
          z2Value
        )}})\\} + ({${valueToKatex(z1Value)}}) \\{
            ({${valueToKatex(x2Value)}})({${valueToKatex(
          y3Value
        )}}) – ({${valueToKatex(x3Value)}})({${valueToKatex(y2Value)}})} \\}`,
        type: 'equation',
      },

      {
        value: putSpace(
          `= {({${valueToKatex(x1Value)}})  ({${valueToKatex(
            y2IntoZ3
          )}} - {${valueToKatex(y3IntoZ2)}}) – ({${valueToKatex(
            y1Value
          )}}) ({${valueToKatex(x2IntoZ3)}} - {${valueToKatex(
            x3IntoZ2
          )}}) + ({${valueToKatex(z1Value)}}) ({${valueToKatex(
            x2IntoY3
          )}} – {${valueToKatex(x3IntoY2)}})} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `= {({${valueToKatex(x1Value)}})  ({${valueToKatex(
            y2IntoZ3SubY3IntoZ2
          )}}) - ({${valueToKatex(y1Value)}}) ({${valueToKatex(
            x2IntoZ3SubX3IntoZ2
          )}}) + ({${valueToKatex(z1Value)}}) ({${valueToKatex(
            x2IntoY3SubX3IntoY2
          )}})} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `= {{${evalInDecimals(into1)}} ${minusSymbol(
            evalInDecimals(into2)
          )} {${removeSymbol(evalInDecimals(into2))}} ${addSymbol(
            evalInDecimals(into3)
          )} {${removeSymbol(evalInDecimals(into3))}}} = {${valueToKatex(res)}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/determinant-of-a-matrix/?a=&b=&c="  target="_blank">to see the Steps to calculate the determinant, click here</a>`,
        type: 'span',
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
  }, [x1, y1, z1, x2, y2, z2, x3, y3, z3, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    if (mf9.current) mf9.current.latex('');

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

  const hasValue = [x1, y1, z1, x2, y2, z2, x3, y3, z3].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, y1, z1, x2, y2, z2, x3, y3, z3].every(
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
          <div className="text-left mb-3">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Vector A: </div>
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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
            <div className="col-2 text-left d-flex">Vector B: </div>

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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
            <div className="col-2 text-left d-flex">Vector C: </div>

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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
                // "infty",
                // "theta",
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
      {
        hasAllValue && (
          // (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        )
        // ) : (
        //   <div>
        //     <strong>Note :-</strong> Since initial & final points are the same
        //     hence points are <strong>Coincident</strong> and distance between
        //     two coincident points is always <strong>ZERO</strong>.
        //   </div>
        // ))
      }
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
          <Equation className="mt-3" equation={answer} />
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

export default ScalarTripleProduct;
