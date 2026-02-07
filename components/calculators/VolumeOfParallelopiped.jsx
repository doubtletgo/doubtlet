'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';

import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  removeSymbol,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const VolumeOfParallelopiped = () => {
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('2');
  const [z1, setZ1] = useState('1');
  const [x2, setX2] = useState('5');
  const [y2, setY2] = useState('7');
  const [z2, setZ2] = useState('3');
  const [x3, setX3] = useState('2');
  const [y3, setY3] = useState('0');
  const [z3, setZ3] = useState('8');
  const [result, setResult] = useState();
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
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
          value: putSpace(
            `Find the Volume of the Parallelopiped formed the Vectors `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{A} \\bold{(${parseNumber(x1) || '1'}, ${
              parseNumber(y1) || '1'
            }, ${parseNumber(z1) || '1'})}, \\overrightarrow{B} \\bold{({${
              parseNumber(x2) || '1'
            }}, {${parseNumber(y2) || '1'}}, {${
              parseNumber(z2) || '1'
            })}} \\& \\overrightarrow{C} \\bold{({{${
              parseNumber(x3) || '1'
            }}}, {${parseNumber(y3) || '1'}}, {${parseNumber(z3) || '1'}})}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, y2, z2, x3, x2, y3]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Vector \\overrightarrow{A}: (x_1, y_1, z_1) = \\bold{(${
            parseNumber(x1) || '1'
          }, ${parseNumber(y1) || '1'}, ${parseNumber(z1) || '1'})}`,
          type: 'equation',
        },
        {
          value: `Vector \\overrightarrow{B}: (x_2, y_2, z_2) = \\bold{(${
            parseNumber(x2) || '1'
          }, ${parseNumber(y2) || '1'}, ${parseNumber(z2) || '1'})}`,
          type: 'equation',
        },
        {
          value: `Vector \\overrightarrow{C}: (x_3, y_3, z_3) = \\bold{(${
            parseNumber(x3) || '1'
          }, ${parseNumber(y3) || '1'}, ${parseNumber(z3) || '1'})}`,
          type: 'equation',
        },
      ])
    );
    isInvalid.current = [x1, y1, z1, y2, z2, x3, x2, y3].some((x) => !x);
    if (isInvalid.current) return;
    if (x1 == x2 && y1 == y1 && z1 == z2) setIsPointSame(true);
    else setIsPointSame(false);
    const tempX1 = katexSimplifiedValue(x1);
    const tempY1 = katexSimplifiedValue(y1);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY2 = katexSimplifiedValue(y2);
    const tempZ2 = katexSimplifiedValue(z2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY3 = katexSimplifiedValue(y3);
    const tempZ3 = katexSimplifiedValue(z3);

    const x1Value = evalExpression(tempX1);
    const y1Value = evalExpression(tempY1);
    const z1Value = evalExpression(tempZ1);
    const x2Value = evalExpression(tempX2);
    const y2Value = evalExpression(tempY2);
    const z2Value = evalExpression(tempZ2);
    const x3Value = evalExpression(tempX3);
    const y3Value = evalExpression(tempY3);
    const z3Value = evalExpression(tempZ3);

    //variable
    const y2IntoZ3 = evalExpression(` ${y2Value} * (${z3Value})`);
    const y3IntoZ2 = evalExpression(` ${y3Value} * (${z2Value})`);
    const x2IntoZ3 = evalExpression(` ${x2Value} * (${z3Value})`);
    const x3IntoZ2 = evalExpression(` ${x3Value} * (${z2Value})`);
    const x2IntoY3 = evalExpression(` ${x2Value} * (${y3Value})`);
    const x3IntoY2 = evalExpression(` ${x3Value} * (${y2Value})`);

    const y2IntoZ3MinusY3IntoZ2 = evalExpression(`${y2IntoZ3} - (${y3IntoZ2})`);
    const x2IntoZ3MinusX3IntoZ2 = evalExpression(`${x2IntoZ3} - (${x3IntoZ2})`);
    const x2IntoY3MinusX3IntoY2 = evalExpression(
      `(${x2IntoY3}) - (${x3IntoY2})`
    );

    const x1IntoY2IntoZ3MinusY3IntoZ2 = evalExpression(
      `${x1Value} * (${y2IntoZ3MinusY3IntoZ2})`
    );
    const y1IntoX2IntoZ3MinusX3IntoZ2 = evalExpression(
      `${y1Value} * ${x2IntoZ3MinusX3IntoZ2}`
    );
    const z1IntoX2IntoY3MinusX3IntoY2 = evalExpression(
      `${z1Value} * (${x2IntoY3MinusX3IntoY2})`
    );

    const answer = evalExpression(`(${evalInDecimals(
      x1IntoY2IntoZ3MinusY3IntoZ2
    )})-(${evalInDecimals(y1IntoX2IntoZ3MinusX3IntoZ2)})+(${evalInDecimals(
      z1IntoX2IntoY3MinusX3IntoY2
    )})
   `);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Volume of the Parallelopiped} formed the Vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A}({${x1}}, {${y1}}, {${z1}}), \\overrightarrow{B}({${x2}},{ ${y2}},{ ${z2}}) \\& \\overrightarrow{C}({${x3}}{, ${y3}},{ ${z3}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{${valueToKatex(removeSymbol(answer))}} Cubic Units.`
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
          `We know that \\bold{Volume of the Parallelopiped} formed the Vectors `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} (x_1, y_1, z_1), \\overrightarrow{B}(x_2, y_2, z_2) \\& \\overrightarrow{C}(x_3, y_3, z_3)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(`Volume = \\bold{(A x B).C} or \\bold{[ A B C ]} `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where A, B, C are the given Vectors of the Parallelopiped.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Value of the Box Product \\bold{[ A B C ]} can be formed by obtaining`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the Determinant formed by the given vectors.`),
        type: 'equation',
      },
      {
        value: `\\begin{vmatrix}
        x_1 & y_1 & z_1 \\\\
        x_2 & y_2 & z_2 \\\\
        x_3 & y_3 & z_3
        \\end{vmatrix}
         = {x_1(y_2z_3 - y_3z_2) – y_1(x_2z_3 - x_3z_2) + z_1(x_2y_3 – x_3y_2)}`,
        type: 'equation',
      },
      {
        value: `\\bold{Given}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 = \\bold{${showVal(x1, x1Value)}}, y_1 = \\bold{${showVal(
            y1,
            y1Value
          )}},z_1 = \\bold{${showVal(z1, z1Value)}}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `x_2 = \\bold{${showVal(x2, x2Value)}}, y_2 = \\bold{${showVal(
            y2,
            y2Value
          )}} , z_2 = \\bold{${showVal(z2, z2Value)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_3 = \\bold{${showVal(x3, x3Value)}}, y_3 = \\bold{${showVal(
            y3,
            y3Value
          )}}, z_3 = \\bold{${showVal(z3, z3Value)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Value of the Box Product \\bold{[ A B C ]} can be formed by obtaining`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the Determinant formed by the given vectors.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\begin{vmatrix}${x1} & ${y1} & ${z1}\\\\${x2} & ${y2} & ${z2}\\\\${x3} & ${y3} & ${z3}\\end{vmatrix} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `= {(${x1})\\lbrace(${y2})(${z3}) - (${y3})(${z2})\\rbrace – (${y1})\\lbrace(${x2})(${z3}) - (${x3})(${z2})\\rbrace + (${z1})\\lbrace(${x2})(${y3}) – (${x3})(${y2})\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: `= (${x1})({${valueToKatex(y2IntoZ3)}} -{ ${valueToKatex(
          y3IntoZ2
        )}}) - (${y1})(${valueToKatex(x2IntoZ3)} - {${valueToKatex(
          x3IntoZ2
        )}}) + (${z1})({${valueToKatex(x2IntoY3)}} - {${valueToKatex(
          x3IntoY2
        )}})`,
        type: 'equation',
      },
      {
        value: putSpace(
          `= (${x1})({${valueToKatex(
            y2IntoZ3MinusY3IntoZ2
          )}}) - (${y1})({${valueToKatex(
            x2IntoZ3MinusX3IntoZ2
          )}}) + (${z1})({${valueToKatex(x2IntoY3MinusX3IntoY2)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` = ({${valueToKatex(
            x1IntoY2IntoZ3MinusY3IntoZ2
          )}}) - ({${valueToKatex(
            y1IntoX2IntoZ3MinusX3IntoZ2
          )}}) + ({${valueToKatex(
            z1IntoX2IntoY3MinusX3IntoY2
          )}}) = \\bold{{${valueToKatex(removeSymbol(answer))}}}`
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
    setX1('');
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    setY1('');
    setZ1('');
    setX2('');
    setY2('');
    setZ2('');
    setX3('');
    setY3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, y2, z2, x3, x2, y3].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, y2, z2, x3, x2, y3].every(
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
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Vector A:</div>
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
                width: '20%',
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
                width: '20%',
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
                width: '20%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Vector B</div>

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
                width: '20%',
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
                width: '20%',
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
                width: '20%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Vector C:</div>

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
                width: '20%',
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
                width: '20%',
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
                width: '20%',
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

export default VolumeOfParallelopiped;
