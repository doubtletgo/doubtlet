'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  evalInDecimals,
  convertFromLatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import MathInput from 'react-math-keyboard';

const MultiplicationOfTwoComplexNumbers = () => {
  const [x1, setX1] = useLocalStorage('MultiplicationOfTwoComplexNumbers_x1', '3');
  const [y1, setY1] = useLocalStorage('MultiplicationOfTwoComplexNumbers_y1', '2');
  const [x2, setX2] = useLocalStorage('MultiplicationOfTwoComplexNumbers_x2', '9');
  const [y2, setY2] = useLocalStorage('MultiplicationOfTwoComplexNumbers_y2', '6');
  const [equation, setEquation] = useLocalStorage('MultiplicationOfTwoComplexNumbers_equation', '');
  const [solution, setSolution] = useLocalStorage('MultiplicationOfTwoComplexNumbers_solution', '');
  const [result, setResult] = useLocalStorage('MultiplicationOfTwoComplexNumbers_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MultiplicationOfTwoComplexNumbers_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('MultiplicationOfTwoComplexNumbers_showSteps', true);
  const [note, setNote] = useLocalStorage('MultiplicationOfTwoComplexNumbers_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
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
  const x1Value = evalExpression(tempX1);
  const y1Value = evalExpression(tempY1);
  const x2Value = evalExpression(tempX2);
  const y2Value = evalExpression(tempY2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Find the Multiplication of the Complex numbers`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Z_1(\\bold{{${x1 || 'a'}} ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || 'b')}}i}) and Z_2 (\\bold{{${
              x2 || 'c'
            }} ${addSymbol(evalInDecimals(tempY2))} {${removeSymbol(
              y2 || 'd'
            )}}i})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        'br',
        {
          value: putSpace(
            `Z_1: \\bigg<\\bold{{${x1 || 'a'}} ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || 'b')}}i} \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Z_2: \\bigg<\\bold{{${x2 || 'c'}} ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || 'd')}}i} \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    //variables
    const x1MulY1 = evalExpression(`((${x1Value})*(${x2Value}))`);
    const x2MulY2 = evalExpression(`((${y1Value})*(${y2Value}))`);
    const sub = evalExpression(`(${x1MulY1})-(${x2MulY2})`);
    const x1MulY2 = evalExpression(`((${x1Value})*(${y2Value}))`);
    const y1MulX2 = evalExpression(`((${y1Value})*(${x2Value}))`);
    const add = evalExpression(`(${x1MulY2})+(${y1MulX2})`);

    //Final Answer
    const finalAnswer = [
      {
        value: putSpace(`The Multiplication of the Given Complex numbers`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Z_1(\\bold{{${x1 || 'a'}} ${addSymbol(
            evalInDecimals(tempY1)
          )} {${removeSymbol(y1 || 'b')}}i}) and Z_2 (\\bold{{${
            x2 || 'c'
          }} ${addSymbol(evalInDecimals(tempY2))} {${removeSymbol(
            y2 || 'd'
          )}}i}) is (\\bold{${evalInDecimals(sub)} ${addSymbol(
            y2
          )} {${removeSymbol(evalInDecimals(add))}}i}) `
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
        value: putSpace(`For Multiplication of two Complex numbers, we will use 
        `),
        type: 'equation',
      },
      {
        value: putSpace(`the distributive property.`),
        type: 'equation',
      },
      {
        value: putSpace(`Let Z_1= a + ib \\& Z_2 = c + id`),
        type: 'equation',
      },
      {
        value: putSpace(
          `then Z_1 . Z_2 = (a + ib).(c + id) = (ac - bd) +(ad + bc)i`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given input values`,
        type: 'span',
      },
      {
        value: putSpace(
          `a = {${valueToKatex(x1Value)}}, b = {${valueToKatex(y1Value)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `c = {${valueToKatex(x2Value)}}, d = {${valueToKatex(y2Value)}}`
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
          `then by putting the values of a, b, c, d in the above given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `({${valueToKatex(x1Value)} + {${valueToKatex(
            y1Value
          )}}}i).({${valueToKatex(x2Value)} + {${valueToKatex(
            y2Value
          )}}}i) = (({${valueToKatex(x1Value)}} x {${valueToKatex(
            x2Value
          )}}) - ({${valueToKatex(y1Value)}} x {${valueToKatex(
            y2Value
          )}})) + i(({${valueToKatex(x1Value)}} x {${valueToKatex(
            y2Value
          )}}) + ({${valueToKatex(y1Value)}} x {${valueToKatex(x2Value)}})) `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= (\\bold{${evalInDecimals(sub)} ${addSymbol(y2)} {${removeSymbol(
            evalInDecimals(add)
          )}}i}) `
        ),
        type: 'equation',
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [x1, x2, y1, y2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1.current.latex('');
    mf2.current.latex('');
    mf3.current.latex('');
    mf4.current.latex('');
    setX1('');
    setY1('');
    setX2('');
    setY2('');
    setShowResult(false);
    setShowSteps('');
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [1].every((v) => (!!v && !isNaN(v)) || v === 0);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>{' '}
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Complex Number Z<sub>1</sub>:
            </div>
            <div className="col-4">
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
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-4">
              <MathInput
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
              Complex Number Z<sub>2</sub>
            </div>
            <div className="col-4">
              <MathInput
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

export default MultiplicationOfTwoComplexNumbers;
