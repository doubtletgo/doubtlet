'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  showVal,
  katexSimplifiedValue,
  removeSymbol,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const AreaOfTriangleFormedByTwoCoincidentVectors = () => {
  const [x1, setX1] = useState('\\sqrt{7}');
  const [y1, setY1] = useState('\\pi');
  const [z1, setZ1] = useState('\\frac{2}{3}');
  const [x2, setX2] = useState('5');
  const [y2, setY2] = useState('2.4');
  const [z2, setZ2] = useState('5');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Area of the triangle formed by the two coincident Vectors i.e.`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `({${x1 || '1'}}i${addSymbol(y1)}{${removeSymbol(
              y1 || '1'
            )}}j${addSymbol(z1)}{${removeSymbol(z1 || '1')}}k) and ({${
              x2 || '1'
            }i}${addSymbol(y2)}{${removeSymbol(y2 || '1')}}j${addSymbol(
              z2
            )}{${removeSymbol(z2 || '1')}}k).`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2]);

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
            `\\overrightarrow{A}: \\bigg<{${x1 || '1'}}i${addSymbol(
              y1
            )}{${removeSymbol(y1 || '1')}}j${addSymbol(z1)}{${removeSymbol(
              z1 || '1'
            )}}k\\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{B}: \\bigg<{${x2 || '1'}i}${addSymbol(
              y2
            )}{${removeSymbol(y2 || '1')}}j${addSymbol(z2)}{${removeSymbol(
              z2 || '1'
            )}}k\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [x1, y1, z1, x2, y2, z2].some((x) => !x && x != 0);
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempZ2 = katexSimplifiedValue(z2);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const z1Value = evalExpression(tempZ1);
    const z2Value = evalExpression(tempZ2);
    if (isInvalid) return;

    let y1IntoZ2 = evalExpression(`${y1Value} * (${z2Value})`);
    let y2IntoZ1 = evalExpression(`${y2Value} * (${z1Value})`);
    let x1IntoZ2 = evalExpression(`${x1Value} * (${z2Value})`);
    let x2IntoZ1 = evalExpression(`${x2Value} * (${z1Value})`);
    let x1IntoY2 = evalExpression(`${x1Value} * (${y2Value})`);
    let x2IntoY1 = evalExpression(`${x2Value} * (${y1Value})`);
    let i = evalExpression(`${y1IntoZ2} - (${y2IntoZ1})`);
    let j = evalExpression(`${x1IntoZ2} - (${x2IntoZ1})`);
    let k = evalExpression(`${x1IntoY2} - (${x2IntoY1})`);

    const xSqr2 = evalExpression(`(${i})^2`);
    const ySqr2 = evalExpression(`(${j})^2`);
    const zSqr2 = evalExpression(`(${k})^2`);
    const magnitude = evalInDecimals(
      evalExpression(` ${xSqr2}+(${ySqr2})+(${zSqr2})`)
    );
    const magnitudeSqrt = evalExpression(`sqrt(${magnitude})`);
    const res = evalExpression(`(1/2) * (${magnitudeSqrt})`);

    const finalAnswer = [
      {
        value: putSpace(
          `Area of the triangle formed by the two coincident Vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `({${x1}}i)${addSymbol(y1)}({${removeSymbol(y1)}}j)${addSymbol(
            z1
          )}({${removeSymbol(z1)}}k) and ({${x2}i})${addSymbol(
            y2
          )}({${removeSymbol(y2)}}j)${addSymbol(z2)}({${removeSymbol(
            z2
          )}}k) is `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{{${valueToKatex(res)}}} or \\bold{${evalInDecimals(
            res
          )} }unit square`
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
        value: putSpace(
          `We know that the \\bold{Area} of the triangle is formed`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`by two \\bold{coincident} Vectors`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} = ai + bj + ck \\& \\overrightarrow{B} = pi + qj + rk`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },

      {
        value: putSpace(
          `Area = {1\\above{1pt}2} \\lVert  \\overrightarrow{A} x \\overrightarrow{B} \\rVert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where,\\lVert  \\overrightarrow{A} x \\overrightarrow{B} \\rVert  is the magnitude of the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`cross product of two given Vectors.`),
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
        value: `(a, b, c) = \\bigg(\\bold{{${showVal(
          x1,
          x1Value
        )}}}, \\bold{{${showVal(y1, y1Value)}}}, \\bold{{${showVal(
          z1,
          z1Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(p, q, r) = \\bigg(\\bold{{${showVal(
          x2,
          x2Value
        )}}}, \\bold{{${showVal(y2, y2Value)}}}, \\bold{{${showVal(
          z2,
          z2Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we have to find the cross-product of the given vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\lVert \\overrightarrow{A} x \\overrightarrow{B} \\rVert =\\{({${valueToKatex(
            x1Value
          )}}i)${addSymbol(evalInDecimals(y1Value))}({${removeSymbol(
            valueToKatex(y1Value)
          )}}j)${addSymbol(evalInDecimals(z1Value))}({${removeSymbol(
            valueToKatex(z1Value)
          )}}k)\\} x \\{ ({${valueToKatex(x2Value)}i})${addSymbol(
            evalInDecimals(y2Value)
          )}({${removeSymbol(valueToKatex(y2))}}j)${addSymbol(
            evalInDecimals(z2Value)
          )}({${removeSymbol(valueToKatex(z2Value))}}k) \\} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(${evalInDecimals(i)})i ${minusSymbol(
            evalInDecimals(j)
          )} (${evalInDecimals(removeSymbol(j))})j ${addSymbol(
            evalInDecimals(k)
          )} (${evalInDecimals(removeSymbol(k))})k `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cross-product-of-two-vectors-calculator/?x1=${x1}&y1=${y1}&z1=${z1}&x2=${x2}&y2=${y2}&z2=${z2}" 
        target="_blank">to see the steps to find the cross product, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The magnitude of \\lVert \\overrightarrow{A} x \\overrightarrow{B} \\rVert = \\sqrt{${evalInDecimals(
            magnitude
          )}} `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/vector-magnitude-calculator/?a=${i},${j},${k}" 
        target="_blank">to see the magnitude of a vector, click here</a>`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: putSpace(
          `Now putting the above-calculated values in the above-given formula`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `Area= {1\\above{1pt}2}(\\sqrt{${evalInDecimals(
            magnitude
          )}}) = {${valueToKatex(res)}} or {${evalInDecimals(res)}}`
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
  }, [x1, y1, z1, x2, y2, z2, showSteps]);

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
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setZ1('');
    setZ2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, x2, y2, z2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, x2, y2, z2].every((v) => !!v || v == 0);

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
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector A:</div>
            <div className="col-3">
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
            <div className="col-3">
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector B:</div>
            <div className="col-3">
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
            <div className="col-3">
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z2}
              />{' '}
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

export default AreaOfTriangleFormedByTwoCoincidentVectors;
