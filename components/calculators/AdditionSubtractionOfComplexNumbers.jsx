'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  showVal,
  evalInDecimals,
  convertFromLatex,
  convertIntoLatex,
  removeSymbol,
} from '../../helpers/matrixHelper';

import { putSpace } from '../../helpers/general';

import MathInput from 'react-math-keyboard';
import Complex from '../../helpers/Complex';

const AdditionSubtractionOfComplexNumbers = () => {
  const [x1, setX1] = useLocalStorage('AdditionSubtractionOfComplexNumbers_x1', '2');
  const [y1, setY1] = useLocalStorage('AdditionSubtractionOfComplexNumbers_y1', '3');
  const [x2, setX2] = useLocalStorage('AdditionSubtractionOfComplexNumbers_x2', '5');
  const [y2, setY2] = useLocalStorage('AdditionSubtractionOfComplexNumbers_y2', '6');
  const [equation, setEquation] = useLocalStorage('AdditionSubtractionOfComplexNumbers_equation', '');
  const [solution, setSolution] = useLocalStorage('AdditionSubtractionOfComplexNumbers_solution', '');
  const [result, setResult] = useLocalStorage('AdditionSubtractionOfComplexNumbers_result', '');
  const [showResult, setShowResult] = useLocalStorage('AdditionSubtractionOfComplexNumbers_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AdditionSubtractionOfComplexNumbers_showSteps', true);
  const [note, setNote] = useLocalStorage('AdditionSubtractionOfComplexNumbers_note', '');
  const [order, setOrder] = useLocalStorage('AdditionSubtractionOfComplexNumbers_order', 'Addition');
  const mf1 = useRef(null);
  const mf2 = useRef(null);
  const mf3 = useRef(null);
  const mf4 = useRef(null);
  const isAddition = order === 'Addition';

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y1) setY1(vals.y1);
    if (vals.y2) setY2(vals.y2);
  }, []);

  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the ${
              isAddition ? 'Addition' : 'Subtraction'
            }  of the Complex numbers`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` Z_1(\\bold{{${x1 || 'a'}}}  ${
              isAddition
                ? `${addSymbol(evalInDecimals(tempY1))}`
                : `${minusSymbol(evalInDecimals(tempY1))}`
            } \\bold{{${removeSymbol(y1 || 'b')}i}}) and Z_2(\\bold{{${
              x2 || 'c'
            }}}  ${
              isAddition
                ? `${addSymbol(evalInDecimals(tempY2))}`
                : `${minusSymbol(evalInDecimals(tempY2))}`
            } \\bold{{${removeSymbol(y2 || 'd')}i}})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2, order]);

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
            `Z_1: \\bigg< \\bold{{${x1 || 'a'}}} ${
              isAddition
                ? `${addSymbol(evalInDecimals(tempY1))}`
                : `${minusSymbol(evalInDecimals(tempY1))}`
            } \\bold{{${removeSymbol(y1 || 'b')}i}}\\bigg>`
          ),
          type: 'equation',
        },

        {
          value: putSpace(
            `Z_2: \\bigg<\\bold{{${x2 || 'c'}}} ${
              isAddition
                ? `${addSymbol(evalInDecimals(tempY2))}`
                : `${minusSymbol(evalInDecimals(tempY2))}`
            } \\bold{{${removeSymbol(y2 || 'd')}i}}  \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    const sign = isAddition ? '+' : '-';
    const z1 = new Complex(tempX1, tempY1);
    const z2 = new Complex(tempX2, tempY2);
    const result = isAddition ? z1.add(z2) : z1.subtract(z2);
    const x1Value = evalExpression(tempX1)?.toString();
    const y1Value = evalExpression(tempY1)?.toString();
    const x2Value = evalExpression(tempX2);
    const y2Value = evalExpression(tempY2);

    const finalAnswer = [
      {
        value: putSpace(
          `The Given Complex numbers Z_1 \\bigg(\\bold{{${convertIntoLatex(
            x1Value || 'a'
          )}}}  ${
            isAddition
              ? `${addSymbol(evalInDecimals(y1Value))}`
              : `${minusSymbol(evalInDecimals(y1Value))}`
          } \\bold{{${removeSymbol(
            convertIntoLatex(y1Value || 'b')
          )}i}}\\bigg) and Z_2 \\bigg(\\bold{{${convertIntoLatex(
            x2Value || 'c'
          )}}}  ${
            isAddition
              ? `${addSymbol(evalInDecimals(y2Value))}`
              : `${minusSymbol(evalInDecimals(y2Value))}`
          } \\bold{{${removeSymbol(convertIntoLatex(y2Value || 'd'))}i}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Given Complex numbers ${z1.toLatex()} and ${z2.toLatex()}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is \\space \\bold{${result.toLatex()}}`),
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
        value: putSpace(`For \\bold{ ${
          isAddition ? 'Addition ' : 'Subtraction'
        }} of two Complex numbers, we need to ${isAddition ? 'Add' : 'Subtract'}
        `),
        type: 'equation',
      },
      {
        value:
          putSpace(`the Real parts and Imaginary parts of both the given complex
      `),
        type: 'equation',
      },

      {
        value: putSpace(`numbers separately.
      `),
        type: 'equation',
      },
      {
        value: putSpace(`Let Z_1 = a + ib \\& Z_2 = c + id`),
        type: 'equation',
      },

      {
        value: putSpace(`then`),
        type: 'equation',
      },

      {
        value:
          putSpace(`Z_1${sign}Z_2= (a+ib) + (c + id)= (a${sign} c) + i(b ${sign} d)
        `),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given input values are: -`,
        type: 'span',
      },
      {
        value: putSpace(
          `a = \\bold{{${valueToKatex(
            x1Value || ''
          )}}}, b = \\bold{{${valueToKatex(y1Value)}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `c = \\bold{{${showVal(x2, x2Value, '')}}}, d = {${showVal(
            y2,
            y2Value,
            ''
          )}}`
        ),
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
          `then by \\bold{${
            isAddition ? 'Adding' : 'Subtracting'
          }} the respective Real \\& Imaginary pats of`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the above given complex numbers`),
        type: 'equation',
      },
      {
        value: putSpace(`{${convertIntoLatex(x1Value)}} ${addSymbol(
          evalInDecimals(y1Value)
        )} {${removeSymbol(
          convertIntoLatex(y1Value)
        )}}i ${sign} {${convertIntoLatex(x2Value)}} ${addSymbol(
          evalInDecimals(y2Value)
        )} {${removeSymbol(
          convertIntoLatex(y2Value)
        )}}i = i({${convertIntoLatex(x1Value)}} ${addSymbol(
          evalInDecimals(x2Value)
        )} {${removeSymbol(
          convertIntoLatex(x2Value)
        )}}) + i({${convertIntoLatex(y1Value)}} ${addSymbol(
          evalInDecimals(y2Value)
        )} {${removeSymbol(convertIntoLatex(y2Value))}})
        `),
        type: 'equation',
      },
      {
        value: putSpace(`= ${result.toLatex()}`),
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
  }, [x1, x2, y1, y2, showSteps, order]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    mf1.current?.latex('');
    mf2.current?.latex('');
    mf3.current?.latex('');
    mf4.current?.latex('');
    setX1('');
    setY1('');
    setX2('');
    setY2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [1].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of Integer, Fraction or any Real number
          </div>

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Operation:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Addition">Addition</option>

                <option value="Subtraction">Subtraction</option>
              </select>
            </div>

            <div className="row mb-2 align-items-center"></div>

            <div className="col-4 text-left">
              Complex Number Z<sub>1</sub>:
            </div>

            <div className="col-4">
              <MathInput
                tabShouldSkipKeys
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
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-4">
              <MathInput
                tabShouldSkipKeys
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setY1}
                initialLatex={y1}
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
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-3"></div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Complex Number Z<sub>2</sub>:
            </div>
            <div className="col-4">
              <MathInput
                tabShouldSkipKeys
                setMathfieldRef={(ref) => (mf3.current = ref)}
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
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-4">
              <MathInput
                tabShouldSkipKeys
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setY2}
                initialLatex={y2}
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
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-3"></div>
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

export default AdditionSubtractionOfComplexNumbers;
