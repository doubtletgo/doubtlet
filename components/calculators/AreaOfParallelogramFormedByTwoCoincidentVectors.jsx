'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  valueToKatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { minusSymbol, addSymbol } from '../../helpers/decimal';
import {} from '../../helpers/decimal';

const AreaOfParallelogramFormedByTwoCoincidentVectors = () => {
  const [x1, setX1] = useState('1');
  const [x2, setX2] = useState('4');
  const [y1, setY1] = useState('1');
  const [y2, setY2] = useState('4');
  const [z1, setZ1] = useState('7');
  const [z2, setZ2] = useState('2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [result, setResult] = useState('');
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
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z1) setZ1(vals.y2);
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
          value: putSpace(`Find the Area of the parallelogram formed by the `),
          type: `equation`,
        },
        {
          value: putSpace(`two coincident Vectors i.e.`),
          type: `equation`,
        },
        {
          value: putSpace(
            ` ({${x1 || '1'}}i ${addSymbol(y1)} {${removeSymbol(
              y1
            )}}j) ${addSymbol(z1)} {${removeSymbol(z1 || '1')}}k) and  ({${
              x2 || '1'
            }}i ${addSymbol(y2)} {${removeSymbol(y2)}}j ${addSymbol(
              z2
            )} {${removeSymbol(z2 || '1')}}k)`
          ),
          type: `equation`,
        },
        {
          value: putSpace(``),
          type: `equation`,
        },
      ])
    );
  }, [x1, x2, y1, y2, z1, z2]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: putSpace(
            `\\bold{Vector \\overrightarrow{A}: \\bigg< ${x1 || '1'}, ${
              y1 || '1'
            }, ${z1 || '1'}} \\bigg>`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `\\bold{Vector \\overrightarrow{B}: \\bigg< ${x2 || '1'}, ${
              y2 || '1'
            }, ${z2 || '1'}\\bigg>}`
          ),
          type: `equation`,
        },
      ])
    );
    const isInvalid = [x1, x2, y1, y2, z1, z2].some((x) => !x);

    setIsPointSame(x1 == x2 && y1 == y2 && z1 == z2);

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
    //Varibales
    // Dot product A * B
    let y1IntoZ2 = evalExpression(`${y1Value} * (${z2Value})`);
    let y2IntoZ1 = evalExpression(`${y2Value} * (${z1Value})`);
    let x1IntoZ2 = evalExpression(`${x1Value} * (${z2Value})`);
    let x2IntoZ1 = evalExpression(`${x2Value} * (${z1Value})`);
    let x1IntoY2 = evalExpression(`${x1Value} * (${y2Value})`);
    let x2IntoY1 = evalExpression(`${x2Value} * (${y1Value})`);
    let i = evalExpression(`${y1IntoZ2} - (${y2IntoZ1})`);
    let j = evalExpression(`${x1IntoZ2} - (${x2IntoZ1})`);
    let k = evalExpression(`${x1IntoY2} - (${x2IntoY1})`);
    // magnitude of A*B
    const xSqr2 = evalExpression(`(${i})^2`);
    const ySqr2 = evalExpression(`(${j})^2`);
    const zSqr2 = evalExpression(`(${k})^2`);
    const addOfSqr = evalExpression(` ${xSqr2}+(${ySqr2})+(${zSqr2})`);
    const magnitude = evalExpression(`sqrt(${addOfSqr})`);
    const finalAnswer = [
      {
        value: putSpace(
          `Area of the parallelogram formed by the two coincident Vectors `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `({${valueToKatex(x1Value)}}i) ${addSymbol(
            evalInDecimals(y1Value)
          )} ({${removeSymbol(valueToKatex(y1Value))}}j)  ${addSymbol(
            evalInDecimals(z1Value)
          )} ({${removeSymbol(valueToKatex(z1Value))}}k) and ({${valueToKatex(
            x2Value
          )}}i) ${addSymbol(evalInDecimals(y2Value))} ({${removeSymbol(
            valueToKatex(y2Value)
          )}}j)  ${addSymbol(evalInDecimals(z2Value))} ({${removeSymbol(
            valueToKatex(z2Value)
          )}}k)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{${evalInDecimals(magnitude)}}}  unit square `
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: '<b>span</b>',
        value: 'Answer',
      },
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
          `We know that the \\bold{Area} of the parallelogram is formed `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`by two \\bold{coincident} Vectors`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{A} = ai+bj+ck } \\& \\bold{\\overrightarrow{V} = pi+qj+rk}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Area = \\lVert \\bold{\\overrightarrow{A} X \\overrightarrow{B}} \\rVert Where, \\lVert \\bold{\\overrightarrow{A} X \\overrightarrow{B}} \\rVert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is the magnitude of the cross product of two given Vectors.`
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
        value: `From the above input it is given that`,
        type: `span`,
      },
      {
        value: `(a, b, c) = \\bold{({${showVal(x1, x1Value)}}, {${showVal(
          y1,
          y1Value
        )}}, {${showVal(z1, z1Value)}})}`,
        type: `equation`,
      },
      {
        value: `(p, q, r) = \\bold{({${showVal(x2, x2Value)}}, {${showVal(
          y2,
          y2Value
        )}}, {${showVal(z2, z2Value)}})}`,
        type: `equation`,
      },

      {
        value: `Now we have to find the cross-product of the given vectors`,
        type: `span`,
      },
      {
        value: putSpace(
          `\\lVert \\bold{\\overrightarrow{A} X \\overrightarrow{B}} \\rVert = \\{(${x1}i) + (${y1}j) +(${z1}k) \\} x \\{(${x2}i) + (${y2}j) +(${z2}k) \\} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= {${evalInDecimals(i)}}i ${minusSymbol(
            evalInDecimals(j)
          )} {${removeSymbol(evalInDecimals(j))}}j ${addSymbol(
            evalInDecimals(k)
          )} ({${removeSymbol(evalInDecimals(k))}})k`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cross-product-of-two-vectors-calculator/?x1=${x1}&y1=${y1}&z1=${z1}&x2=${x2}
        &y2=${y2}&z2=${z2}" 
        target="_blank">to see the steps to find the cross product, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The magnitude of  \\lVert \\bold{\\overrightarrow{A} X \\overrightarrow{B}} \\rVert =   {\\sqrt{${evalInDecimals(
            addOfSqr
          )}}}  or {${evalInDecimals(magnitude)}}    `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/vector-magnitude-calculator/?a=${i},${j},${k}" 
        target="_blank">to see the magnitude of a vector, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now putting the above-calculated values in the`),
        type: 'equation',
      },
      {
        value: putSpace(`above-given formula`),
        type: 'equation',
      },

      {
        value: putSpace(
          `Area =   {\\sqrt{${evalInDecimals(addOfSqr)}}}  or {${evalInDecimals(
            magnitude
          )}} `
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
  }, [x1, x2, y1, y2, z1, z2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setZ1('');
    setZ2('');

    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    if (mf7.current) mf7?.current.latex('');
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, x2, y1, y2, z1, z2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2, z1, z2].every((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Real Number
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

          <Equation equation={equation} className="border-primary mt-3" />
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

export default AreaOfParallelogramFormedByTwoCoincidentVectors;
