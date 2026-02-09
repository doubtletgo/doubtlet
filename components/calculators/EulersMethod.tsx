'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import AdComponent from '../AdSense';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import Input from '../common/input';
import { create, all } from 'mathjs';
import {
  convertFromLatex,
  convertIntoLatex,
  evalToDecimals,
} from '../../helpers/matrixHelper';

const config = {};
const math = create(all, config);

const evaluateFunction = (funcExp: string, tVar: string, yVar: string) => {
  try {
    return math.evaluate(funcExp, { t: +tVar, x: +tVar, y: +yVar });
  } catch {
    return NaN;
  }
};

const hasMultipleVariables = (expression: string) => {
  if (!expression) return false;
  expression = expression
    .replace(/sqrt|sin|cos|tan|log|ln|e|pi|left|right/g, '')
    .replaceAll('\\frac', '');
  const vars = expression.replaceAll('y', '').match(/[a-zA-Z]/g);
  if (!vars) return false;
  const varSet = new Set(vars.map((v) => v.toLowerCase()));
  return varSet.size > 1;
};

const EulerMethodCalculator = () => {
  const [expression, setExpression] = useLocalStorage('EulersMethod_expression', '3t(e^{-y})');
  const [hValue, setHValue] = useLocalStorage('EulersMethod_hValue', '0.2');
  const [t0Value, setT0Value] = useLocalStorage('EulersMethod_t0Value', '0');
  const [y0Value, setY0Value] = useLocalStorage('EulersMethod_y0Value', '2');
  const [t1Value, setT1Value] = useLocalStorage('EulersMethod_t1Value', '0.6');
  const [methodType, setMethodType] = useLocalStorage<'Number-of-steps' | 'Step-size'>('EulersMethod_methodType', 'Step-size');

  const [equation, setEquation] = useLocalStorage('EulersMethod_equation', '');
  const [note, setNote] = useLocalStorage('EulersMethod_note', '');
  const [answer, setAnswer] = useLocalStorage('EulersMethod_answer', '');
  const [solution, setSolution] = useLocalStorage('EulersMethod_solution', '');
  const [error, setError] = useLocalStorage('EulersMethod_error', '');
  const [invalidInput, setInvalidInput] = useLocalStorage('EulersMethod_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('EulersMethod_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('EulersMethod_showSteps', false);
  const [isInvalid, setIsInvalid] = useLocalStorage('EulersMethod_isInvalid', false);

  const hasValue =
    !!expression &&
    !hasMultipleVariables(expression) &&
    !!t0Value &&
    !!y0Value &&
    !!t1Value &&
    !!hValue &&
    !invalidInput;

  useEffect(() => {
    const qNote = renderSteps([
      {
        value: `<b>Question</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Find the value of \\bm{y(${convertIntoLatex(
            t1Value
          )})} for the given function \\bm{y' = ${expression}}, when \\bm{y(${convertIntoLatex(
            t0Value
          )}) = ${convertIntoLatex(y0Value)}}, h = ${convertIntoLatex(
            hValue
          )} using Euler’s Method.`
        ),
        type: 'equation',
      },
    ]);
    setNote(qNote);
    if (hasMultipleVariables(expression)) {
      setError('Expression have too many variables');
    } else {
      setError('');
    }
  }, [expression, t0Value, y0Value, t1Value, hValue, methodType]);

  useEffect(() => {
    const eq = renderSteps([
      {
        value: `<b>Formatted User Input Display</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Find \\bm{y(${convertIntoLatex(
            t1Value
          )})} for y' = ${expression}, when \\bm{y(${convertIntoLatex(
            t0Value
          )}) = ${convertIntoLatex(y0Value)}}, h=${convertIntoLatex(
            hValue
          )}, using Euler’s method.`
        ),
        type: 'equation',
      },
    ]);
    setEquation(eq);
  }, [expression, t0Value, y0Value, t1Value, hValue, methodType]);

  useEffect(() => {
    if (!hasValue) return;

    const fExp = convertFromLatex(expression);
    const t0 = convertFromLatex(t0Value);
    const y0 = convertFromLatex(y0Value);
    const t1 = convertFromLatex(t1Value);
    const h = convertFromLatex(hValue);

    const start = evalToDecimals(t0);
    const end = evalToDecimals(t1);
    const step = evalToDecimals(h);
    console.log(methodType, step);
    if (methodType == 'Number-of-steps' && step.toString().indexOf('.') > -1) {
      setError('n Must be an integer value');
      setIsInvalid(true);
      return;
    }

    if (methodType == 'Step-size' && step > end) {
      setError('h cannot be greater than t<sub>1</sub>');
      setIsInvalid(true);
      return;
    }
    if (isNaN(start) || isNaN(end) || isNaN(step)) return;

    const n = evalToDecimals(`(${end} - (${start})) / (${step})`);

    if (n < 0 || n.toString().indexOf('.') > -1) {
      setError('t<sub>1</sub>-t<sub>0</sub> / h should be an integer');
      setIsInvalid(true);
      return;
    }
    setError('');
    setIsInvalid(false);

    let currentT = start;
    let currentY = +y0;

    const stepDetails: (object | string)[] = [
      {
        value: `<b>Step-by-step-solution:</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `The Euler’s method states that \\bm{y_{n+1} = y_n + h f(t_n, y_n)} and \\bm{t_{n+1} = t_n + h}`
        ),
        type: 'equation',
      },
      ...(methodType == 'Number-of-steps'
        ? [
            {
              value: putSpace(
                `We will get the step size (h) = \\frac{${t1Value} - (${t0Value})}{${hValue}} = {${n}}`
              ),
              type: 'equation',
            },
          ]
        : []),
      {
        value: putSpace(
          `Given: h = ${convertIntoLatex(hValue)}, t_0 = ${convertIntoLatex(
            t0Value
          )}, y_0 = ${convertIntoLatex(
            y0Value
          )}, \\text{and} \\space f(t, y) = ${expression}`
        ),
        type: 'equation',
      },
    ];

    for (let i = 1; i <= n; i++) {
      const fVal = evaluateFunction(
        fExp,
        currentT.toString(),
        currentY.toString()
      );
      const nextT = currentT + step;
      const nextY = currentY + step * (isNaN(fVal) ? 0 : fVal);

      stepDetails.push(
        {
          value: `<b>Step-${i}:</b>`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(
            `t_${i} = t_{${i - 1}} + h = ${convertIntoLatex(
              currentT.toString()
            )} + ${convertIntoLatex(h.toString())} = ${convertIntoLatex(
              nextT.toString()
            )}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `y_${i} = y(t_${i}) = y_{${i - 1}} + h f(t_{${i - 1}}, y_{${
              i - 1
            }}) = ${convertIntoLatex(currentY.toString())} + ${convertIntoLatex(
              h.toString()
            )} * f(${convertIntoLatex(currentT.toString())}, ${convertIntoLatex(
              currentY.toString()
            )}) `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `So , y_${i} = ${convertIntoLatex(
              currentY.toString()
            )} + (${convertIntoLatex(
              h.toString()
            )})(${fVal.toString()}) = ${convertIntoLatex(nextY.toString())}`
          ),
          type: 'equation',
        }
      );

      currentT = nextT;
      currentY = nextY;
    }

    stepDetails.push(
      {
        value: putSpace(
          `Since we have obtained the value of \\bm{y(${convertIntoLatex(
            t1Value
          )})} in this step`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`So we will terminate the process here.`),
        type: 'equation',
      },
      {
        value: `<b>Final Answer:</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `y(${convertIntoLatex(t1Value)}) ≈ ${convertIntoLatex(
            currentY.toString()
          )}`
        ),
        type: 'equation',
      }
    );

    const finalAns = renderSteps([
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        value: putSpace(
          `y(${convertIntoLatex(t1Value)}) ≈ ${convertIntoLatex(
            currentY.toString()
          )}`
        ),
        type: 'equation',
      },
    ]);

    setAnswer(finalAns);

    if (showSteps) {
      const fullSolution = renderSteps(stepDetails);
      setSolution(fullSolution);
    }
  }, [
    expression,
    hValue,
    t0Value,
    y0Value,
    t1Value,
    showSteps,
    hasValue,
    methodType,
  ]);

  useEffect(() => {
    setInvalidInput(hasMultipleVariables(expression));
  }, [expression]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, []);

  const toggleSteps = useCallback(() => {
    setShowSteps((prev) => !prev);
  }, []);

  const clear = useCallback(() => {
    setExpression('');
    setHValue('');
    setT0Value('');
    setY0Value('');
    setT1Value('');
    setShowResult(false);
    setShowSteps(false);
  }, []);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer, Fraction, variable or any
            Real Number
          </div>
          <div className="text-left mb-2">
            Please use parentheses where necessary when typing expressions.
          </div>
          {error && (
            <div
              className="alert alert-danger"
              role="alert"
              dangerouslySetInnerHTML={{ __html: error }}
            />
          )}

          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">y’ = f(t, y):</div>
            <div
              className={`col-8 ${invalidInput ? 'invalid' : ''}`}
              style={{ position: 'relative' }}
            >
              <MathInput
                setValue={setExpression}
                initialLatex={expression}
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
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              {methodType == 'Step-size' ? 'h' : 'n'} :
            </div>
            <div className="col-8">
              <Input
                placeholder={'Enter step size'}
                className="col-12"
                value={hValue}
                setVal={setHValue}
                pattern={/^(-?\d+(\.\d*)?)$/}
                min={0.000001}
                max={10000}
                disabled={false}
              />
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              t<sub>0</sub>or x<sub>0</sub>:
            </div>
            <div className="col-8">
              <Input
                placeholder="Initial t0"
                className="col-12"
                value={t0Value}
                min={-1}
                setVal={setT0Value}
                pattern={/^(-?\d+(\.\d*)?)$/}
                disabled={false}
              />
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              y<sub>0</sub>:
            </div>
            <div className="col-8">
              <Input
                placeholder="Initial y0"
                className="col-12"
                value={y0Value}
                setVal={setY0Value}
                pattern={/^(-?\d+(\.\d*)?)$/}
                disabled={false}
              />
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              t<sub>1</sub> or x<sub>1</sub>:
            </div>
            <div className="col-8">
              <Input
                placeholder="Target t1"
                className="col-12"
                value={t1Value}
                setVal={setT1Value}
                pattern={/^(-?\d+(\.\d*)?)$/}
                disabled={false}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Method</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={methodType}
                onChange={(e) =>
                  setMethodType(
                    e.target.value as 'Number-of-steps' | 'Step-size'
                  )
                }
              >
                <option value="Step-size">Step size</option>
                <option value="Number-of-steps">Number of Steps</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Equation equation={equation} className="border-primary" />
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasValue && !isInvalid && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && !isInvalid && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
          onClick={clear}
        >
          clear
        </button>
      )}

      {hasValue && showResult && !showSteps && !isInvalid && (
        <>
          <hr />
          <span>
            <Equation equation={answer} className="mt-3" />
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

      {hasValue && showSteps && !isInvalid && (
        <>
          <Equation
            className="mt-4 mb-5 solution-container"
            print
            equation={solution}
          />
          <div className="bottom-note">
            <strong>Note :-</strong> If you find any computational or logical
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

export default EulerMethodCalculator;
