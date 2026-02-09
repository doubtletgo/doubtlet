'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  evalInDecimals,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { addSymbol } from '../../helpers/decimal';

const DirectionCosinsOfVector = () => {
  const [x1, setX1] = useLocalStorage('DirectionCosinsOfVector_x1', '5');
  const [y1, setY1] = useLocalStorage('DirectionCosinsOfVector_y1', '\\sqrt{3}');
  const [z1, setZ1] = useLocalStorage('DirectionCosinsOfVector_z1', '4');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('DirectionCosinsOfVector_equation', '');
  const [solution, setSolution] = useLocalStorage('DirectionCosinsOfVector_solution', '');
  const [result, setResult] = useLocalStorage('DirectionCosinsOfVector_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DirectionCosinsOfVector_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DirectionCosinsOfVector_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('DirectionCosinsOfVector_isPointSame', false);
  const [note, setNote] = useLocalStorage('DirectionCosinsOfVector_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.x2) setZ1(vals.x2);
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
            `Find the \\bold{Direction cosines} of the given Vector `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `({\\bold{${x1 || '1'}}}i ${addSymbol(y1)} {\\bold{${removeSymbol(
              y1 || '1'
            )}}}j ${addSymbol(z1)} \\bold{{${removeSymbol(z1 || '1')}}}k)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [z1, y1, x1]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          \\overrightarrow{A}: -\\bigg<{\\bold{${x1 || '1'}}}i ${addSymbol(
            y1
          )} {\\bold{${removeSymbol(y1 || '1')}}}j ${addSymbol(
            z1
          )} {\\bold{${removeSymbol(z1 || '1')}}}k\\bigg>`,
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [z1, y1, x1].some((x) => !x);
    if (!showSteps) return;
    const tempZ1 = katexSimplifiedValue(z1);
    const tempY1 = katexSimplifiedValue(y1);
    const tempX1 = katexSimplifiedValue(x1);
    const x1Value = evalExpression(tempX1);
    const y1Value = evalExpression(tempY1);
    const z1Value = evalExpression(tempZ1);

    if (isInvalid.current) return;
    setIsPointSame(z1 == y1 && y1 == x1);
    const xSqr2 = evalInDecimals(evalExpression(`(${x1Value})^2`));
    const ySqr2 = evalInDecimals(evalExpression(`(${y1Value})^2`));
    const zSqr2 = evalInDecimals(evalExpression(`(${z1Value})^2`));
    const addOfSqr = evalExpression(` ${xSqr2}+(${ySqr2})+(${zSqr2})`);
    const l = evalExpression(`(${x1Value})/ (sqrt(${addOfSqr}))`);
    const m = evalExpression(`(${y1Value})/ (sqrt(${addOfSqr}))`);
    const n = evalExpression(`(${z1Value})/ (sqrt(${addOfSqr}))`);
    const finalAnswer = [
      {
        value: putSpace(
          `The Direction cosines of the given Vector ({\\bold{${
            x1 || '1'
          }}}i ${addSymbol(y1)} {\\bold{${removeSymbol(
            y1 || '1'
          )}}}j ${addSymbol(z1)} \\bold{{${removeSymbol(z1 || '1')}}}k) are`
        ),
        type: 'equation',
      },
      {
        value: `\\bigg(l = {{${valueToKatex(
          x1Value
        )}} \\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}}}, m = { {${valueToKatex(
          y1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}} }, n = { {${valueToKatex(
          z1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}} }\\bigg)\\space or\\space  (\\bold{{${evalInDecimals(
          l
        )}}, {${evalInDecimals(m)}}, {${evalInDecimals(n)}}} )`,
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
          `We know that the \\bold{Direction cosines (l, m, n)} of a given Vector`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} = ai+bj+ck is given by the formula below`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `l = {a \\above{1pt} \\lvert A \\rvert}, m ={b \\above{1pt} \\lvert A \\rvert}, n = {c \\above{1pt} \\lvert A \\rvert}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `Where \\lvert \\overrightarrow{A} \\rvert is the magnitude of the given Vector.`
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
        value: `From the above input, it is given that`,
        type: 'span',
      },
      {
        value: putSpace(
          `(a, b, c) = \\bigg(\\bold{{${valueToKatex(
            x1Value
          )}}}, \\bold{{${valueToKatex(y1Value)}}}, \\bold{{${valueToKatex(
            z1Value
          )}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: `Now we have to find the magnitude of the given vector`,
        type: 'span',
      },
      {
        value: putSpace(
          `The Magnitude of \\overrightarrow{A} = \\sqrt{{${valueToKatex(
            addOfSqr
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/vector-magnitude-calculator/?a=${x1},${y1},${z1}" target="_blank">To see the steps to find magnitude of a vector, click here</a>`,
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
        value: putSpace(`Now putting the above-calculated value in`),
        type: 'equation',
      },
      {
        value: putSpace(`the above-given formula`),
        type: 'equation',
      },
      {
        value: `l = {{${valueToKatex(
          x1Value
        )}} \\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}}}, m = { {${valueToKatex(
          y1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}} }, n = { {${valueToKatex(
          z1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(addOfSqr)}}}} }`,
        type: 'equation',
      },

      {
        value: `l = \\bigg({{${valueToKatex(
          x1Value
        )}} \\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}}}\\bigg), m = \\bigg({ {${valueToKatex(
          y1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(
          addOfSqr
        )}}}} }\\bigg), n = \\bigg({{${valueToKatex(
          z1Value
        )}}\\above{1pt} \\sqrt{{\\large{${valueToKatex(addOfSqr)}}}} }\\bigg)`,
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
  }, [z1, y1, x1, showSteps]);

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
    setY1('');
    setX1('');
    setZ1('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [z1, y1, x1].some((v) => !!v || v == 0);
  const hasAllValue = [z1, y1, x1].every((v) => !!v || v == 0);
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
            Your input can be in form of Integer Fraction and any Real Number
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
                  // "infty",
                  // "theta",
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
                  // "infty",
                  // "theta",
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z1}
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

export default DirectionCosinsOfVector;
