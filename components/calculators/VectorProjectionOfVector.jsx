'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  removeSymbol,
  evalInDecimals,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';

const VectorProjectionOfVector = () => {
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('7');
  const [z1, setZ1] = useState('3');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('5');
  const [z2, setZ2] = useState('6');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const [answer, setAnswer] = useState('');
  const [projection, setProjection] = useState('Vector');
  const isScalar = projection === 'Scalar';

  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
  }, []);

  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempZ1 = convertFromLatex(z1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);
  const tempZ2 = convertFromLatex(z2);

  const x1Value = evalExpression(tempX1);
  const y1Value = evalExpression(tempY1);
  const z1Value = evalExpression(tempZ1);
  const x2Value = evalExpression(tempX2);
  const y2Value = evalExpression(tempY2);
  const z2Value = evalExpression(tempZ2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find  the  ${
            isScalar
              ? `\\bold{Scalar  Projection}`
              : `\\bold{Vector  Projection}`
          }  of  the  given Vector
          `),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{\\overrightarrow{A}}(\\bold{{${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(
              z1 || '1'
            )}}}k ) onto \\bold{\\overrightarrow{B}}(\\bold{{${
              x2 || '1'
            }}i ${addSymbol(evalInDecimals(tempY2))} {${removeSymbol(
              y2 || '1'
            )}}j ${addSymbol(evalInDecimals(tempZ2))} {${removeSymbol(
              z2 || '1'
            )}}k })`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2, isScalar]);

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
            `\\overrightarrow{A} : \\bigg< \\bold{{${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1 || '1')}}}k \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{B} : \\bigg< \\bold{{${x2 || '1'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ2)
            )} {${removeSymbol(z2 || '1')}}}k \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, y1, z1, x2, y2, z2].some((x) => !x);
    if (isInvalid.current) return;
    if (x1 == x2 && y1 == y2 && z1 == z2) setIsPointSame(true);
    else setIsPointSame(false);
    // dot product  A.B
    const x1IntoX2 = evalExpression(`${x1Value} * (${x2Value})`);
    const y1IntoY2 = evalExpression(`${y1Value} * (${y2Value})`);
    const z1IntoZ2 = evalExpression(`${z1Value} * (${z2Value})`);
    const product = evalExpression(`(${x1IntoX2})+(${y1IntoY2})+(${z1IntoZ2})`);

    // Magnitude of  B
    const xSqr2 = evalExpression(`(${x2Value})^2`);
    const ySqr2 = evalExpression(`(${y2Value})^2`);
    const zSqr2 = evalExpression(`(${z2Value})^2`);
    const magnitudeB = evalExpression(` ${xSqr2}+(${ySqr2})+(${zSqr2})`);

    //Vector
    let into1 = evalExpression(`(${x2Value})*(${product})`);
    let into2 = evalExpression(`(${y2Value})*(${product})`);
    let into3 = evalExpression(`(${z2Value})*(${product})`);

    let divide1 = evalExpression(`(${into1})/(${magnitudeB})`);
    let divide2 = evalExpression(`(${into2})/(${magnitudeB})`);
    let divide3 = evalExpression(`(${into3})/(${magnitudeB})`);

    // Scalar Steps
    let scalar = evalExpression(`(${product})/(sqrt(${magnitudeB}))`);

    //Steps
    const vectorSteps = [
      {
        value: putSpace(
          `Vector Proj.\\enspace _{\\overrightarrow{b}}{\\overrightarrow{a}}=({{${evalInDecimals(
            product
          )}} \\above{1pt} (\\sqrt{${evalInDecimals(magnitudeB)}})^2})({${
            x2 || '1'
          }}i ${addSymbol(y2)} {${removeSymbol(y2 || '1')}}j ${addSymbol(
            z2
          )} {${removeSymbol(z2 || '1')}}k)=({${evalInDecimals(
            into1
          )}i\\above{1pt} {${evalInDecimals(magnitudeB)}}} ${addSymbol(
            evalInDecimals(into2)
          )}{${removeSymbol(
            evalInDecimals(into2)
          )}j\\above{1pt} {${evalInDecimals(magnitudeB)}}}${addSymbol(
            evalInDecimals(into3)
          )}{${removeSymbol(
            evalInDecimals(into3)
          )}k\\above{1pt} {${evalInDecimals(magnitudeB)}}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After simplifying`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bigg(\\bold{{${evalInDecimals(
            into1
          )}i\\above{1pt} {${evalInDecimals(magnitudeB)}}} ${addSymbol(
            evalInDecimals(into2)
          )}{${removeSymbol(
            evalInDecimals(into2)
          )}j\\above{1pt} {${evalInDecimals(magnitudeB)}}}${addSymbol(
            evalInDecimals(into3)
          )}{${removeSymbol(
            evalInDecimals(into3)
          )}k\\above{1pt} {${evalInDecimals(
            magnitudeB
          )}}}}\\bigg) or ({${evalInDecimals(divide1)}}i ${addSymbol(
            evalInDecimals(divide2)
          )} {${removeSymbol(evalInDecimals(divide2))}}j ${addSymbol(
            evalInDecimals(divide3)
          )} {${removeSymbol(evalInDecimals(divide3))}}k)`
        ),
        type: 'equation',
      },
    ];
    const scalarSteps = [
      {
        value: putSpace(
          `Scalar Proj.\\enspace _{\\overrightarrow{b}}{\\overrightarrow{a}} = \\bigg({{${evalInDecimals(
            product
          )}} \\above{1pt} \\sqrt{${evalInDecimals(
            magnitudeB
          )}}}\\bigg) or {${evalInDecimals(scalar)}}`
        ),
        type: 'equation',
      },
    ];

    const stepsShow = isScalar ? scalarSteps : vectorSteps;

    const vectorStepsFinal = [
      {
        value: putSpace(
          `The Vector Projection is \\bigg(\\bold{{${evalInDecimals(
            into1
          )}i\\above{1pt} {${evalInDecimals(magnitudeB)}}} ${addSymbol(
            evalInDecimals(into2)
          )}{${removeSymbol(
            evalInDecimals(into2)
          )}j\\above{1pt} {${evalInDecimals(magnitudeB)}}}${addSymbol(
            evalInDecimals(into3)
          )}{${removeSymbol(
            evalInDecimals(into3)
          )}k\\above{1pt} {${evalInDecimals(
            magnitudeB
          )}}}}\\bigg) or (\\bold{{${evalInDecimals(divide1)}}i${addSymbol(
            evalInDecimals(divide2)
          )}{${removeSymbol(evalInDecimals(divide2))}}j${addSymbol(
            evalInDecimals(divide3)
          )}{${removeSymbol(evalInDecimals(divide3))}}}k)`
        ),
        type: 'equation',
      },
    ];
    const scalarStepsFinal = [
      {
        value: putSpace(
          `The \\bold{Scalar Projection} is \\bigg({{${evalInDecimals(
            product
          )}} \\above{1pt} \\sqrt{${evalInDecimals(
            magnitudeB
          )}}}\\bigg) or {${evalInDecimals(scalar)}} `
        ),
        type: 'equation',
      },
    ];
    const finalAnswerSteps = isScalar ? scalarStepsFinal : vectorStepsFinal;

    const finalAnswer = [...finalAnswerSteps];
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
        value: `We know that the ${
          isScalar ? `<b>Scalar projection</b>` : `<b>Vector projection</b>`
        } of the<br> <b> Vector a = ai + bj + ck</b> on to the
        <br><b>Vector b = pi + qj + rk</b> is given by the formula below`,
        type: 'span',
      },
      {
        value: putSpace(
          `${
            isScalar
              ? `Scalar Proj._{\\overrightarrow{b}}{\\overrightarrow{a}} = ({\\overrightarrow{a}.\\overrightarrow{b} \\above{1pt} \\lvert \\overrightarrow{b} \\rvert})`
              : `Vector Proj._{{\\overrightarrow{b}}}{\\overrightarrow{a}} = ({\\overrightarrow{a}.\\overrightarrow{b} \\above{1pt} \\lvert \\overrightarrow{b} \\rvert^2})\\overrightarrow{b}`
          }`
        ),
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
        value: putSpace(`From the above input, it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(a, b, c) = \\bigg({${convertIntoLatex(
            x1Value
          )}}, {${convertIntoLatex(y1Value)}}, {${convertIntoLatex(
            z1Value
          )}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(p, q, r) = \\bigg({${convertIntoLatex(
            x2Value
          )}}, {${convertIntoLatex(y2Value)}}, {${convertIntoLatex(z2Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we have to find the dot product of the given vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A}.\\overrightarrow{B} = ({${valueToKatex(
            x1Value
          )}},  {${valueToKatex(y1Value)}}, {${valueToKatex(
            z1Value
          )}}) . ({${valueToKatex(x2Value)}},  {${valueToKatex(
            y2Value
          )}}, {${valueToKatex(z2Value)}})   =  ${evalInDecimals(product)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/dot-product-calculator/?a=${x1},${y1},${z1}&b=${x2},${y2},${z2}"  
        target="_blank">to see the dot product of two vectors click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The Magnitude of \\overrightarrow{B} = \\sqrt{{${evalInDecimals(
            magnitudeB
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/vector-magnitude-calculator/?a=${x2},${y2},${z2}
        " target="_blank">to see the magnitude of a vector click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now putting the above calculated value in the above given formula`
        ),
        type: 'equation',
      },
      ...stepsShow,
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
  }, [x1, y1, z1, x2, y2, z2, isScalar, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeProjection = (event) => {
    setProjection(event.target.value);
  };

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');

    setX1('');
    setY1('');
    setZ1('');
    setX2('');
    setY2('');
    setZ2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, x2, y2, z2, isScalar].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, y1, z1, x2, y2, z2, isScalar].every(
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
            Your input can be in the form of Integer, Fraction or any Real
            Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Projection type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={projection}
                onChange={onChangeProjection}
              >
                <option selected value="Vector">
                  Vector
                </option>
                <option value="Scalar">Scalar</option>
              </select>
            </div>
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

export default VectorProjectionOfVector;
