'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { convertFromLatex, convertIntoLatex } from '../../helpers/matrixHelper';
import { isInputInvalid } from '@/helpers/Validations';
import { MathField } from '@/types/mathfield.types';
import ExpressionInput from '../expression-input';
import { polynomialDivide } from '@/helpers';

const RemainderTheorem = () => {
  const [expression, setExpression] = useLocalStorage('RemainderTheorem_expression', '0.5x^3 - \\frac{5}{2}x^2 - 3');
  const [a, setA] = useLocalStorage('RemainderTheorem_a', '7');
  const [methodType, setMethodType] = useLocalStorage<'remainder' | 'long-divison'>('RemainderTheorem_methodType', 'remainder');
  const [equation, setEquation] = useLocalStorage('RemainderTheorem_equation', '');
  const [solution, setSolution] = useLocalStorage('RemainderTheorem_solution', '');
  const [answer, setAnswer] = useLocalStorage('RemainderTheorem_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('RemainderTheorem_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RemainderTheorem_showSteps', true);
  const [note, setNote] = useLocalStorage('RemainderTheorem_note', undefined);
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
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
            `Find the remainder when f(x)= ${expression} is divided by ${
              methodType == 'remainder' ? `(x - (${a}))` : `(${a})`
            }`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression, a, methodType]);

  const hasValue =
    !isInputInvalid(expression) &&
    !isInputInvalid(a) &&
    (methodType == 'long-divison' ? /[a-z]/i.test(a) : true);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Method Type: ${
            methodType == 'remainder'
              ? `By Remainder Theorem`
              : `By Long Divison`
          }`,
          type: 'span',
        },
        {
          value: putSpace(`Polynomial f(x): ${expression}`),
          type: 'equation',
        },
        {
          value: putSpace(`Point (a): ${a}`),
          type: 'equation',
        },
      ])
    );
    if (!hasValue) {
      return;
    }
    //for remainder theorem
    const xPlusH = expression.replaceAll('x', `(${a})`).replace(/\s+/g, '');
    const simpleXPlusH = convertFromLatex(xPlusH);
    // for long division
    const parsedExpression = convertFromLatex(expression);
    const parsedA = convertFromLatex(a);
    const { quotient, remainder } = polynomialDivide(parsedExpression, parsedA);

    const finalAnswer =
      methodType == 'remainder'
        ? [
            {
              value: putSpace(
                `The remainder is : ${convertIntoLatex(simpleXPlusH)}`
              ),
              type: 'equation',
            },
          ]
        : [
            {
              value: putSpace(
                `The remainder is : ${convertIntoLatex(remainder)}`
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

    const dynamicSteps =
      methodType == 'remainder'
        ? [
            {
              value: putSpace(
                `We will find the value of the function at x = ${a}`
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `f(${a}) = ${convertIntoLatex(convertFromLatex(xPlusH))}`
              ),
              type: 'equation',
            },
            {
              value: `<a href="/calculator/evaluate-function-value-calculator/" target="_blank">to see steps for evaluate function at a point, click here</a>`,
              type: `span`,
            },
            {
              value: putSpace(
                `The remainder is : ${convertIntoLatex(simpleXPlusH)}`
              ),
              type: 'equation',
            },
          ]
        : [
            {
              value: `We will use the Polynomial long division method to evaluate the remainder.`,
              type: 'span',
            },
            {
              value: putSpace(
                `\\frac{${expression}}{${a}} = ${convertIntoLatex(
                  quotient
                )}+\\frac{${convertIntoLatex(remainder)}}{${a}}`
              ),
              type: 'equation',
            },
            {
              value: `<a href="/calculator/algebraic-polynomials-long-division/" target="_blank">to see steps for polynomial long division, click here</a>`,
              type: `span`,
            },
            {
              value: putSpace(
                `The remainder is: ${convertIntoLatex(remainder)}`
              ),
              type: 'equation',
            },
          ];

    const steps = [
      {
        value: `<b>Step-by-step-Solution</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `According to the remainder theorem, if a polynomial expression f(x) is divided by (x-a),`,
        type: 'span',
      },
      'br',
      {
        value: `then Remainder is equal to value of the function at that given point i.e. f(a).`,
        type: 'span',
      },
      'br',
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      'br',
      ...dynamicSteps,
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
  }, [expression, showSteps, methodType, a]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const handleOnChange = (event) => {
    const value = event.target.value;
    if (inputRef.current) {
      if (methodType == 'remainder') {
        inputRef.current.latex('2x-7');
      } else {
        inputRef.current.latex('7');
      }
    }
    setMethodType(value);
  };
  const clear = useCallback(() => {
    setExpression('');
    setShowResult(false);
  }, [setShowResult]);

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
            Your input can be in form of only be whole number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={methodType}
                onChange={handleOnChange}
              >
                <option value="remainder">By Remainder Theorem</option>
                <option value="long-divison">By Long Divison</option>
              </select>
            </div>
          </div>
          <ExpressionInput
            label={'Enter the polynomial:'}
            value={expression}
            setValue={setExpression}
            setMathfieldRef={(ref) => (inputRef.current = ref)}
            validate={(exp) => {
              return !isInputInvalid(exp);
            }}
            labelCol="col-3"
            inputCol="col-9"
          />
          <ExpressionInput
            label={'Enter the point (a):'}
            value={a}
            setValue={setA}
            setMathfieldRef={(ref) => (inputRef.current = ref)}
            validate={(exp) => {
              const val = convertFromLatex(exp);
              if (methodType == 'remainder') {
                return !isInputInvalid(exp) && !/[a-z]/i.test(val);
              } else {
                return !isInputInvalid(exp) && /[a-z]/i.test(val);
              }
            }}
            labelCol="col-3"
            inputCol="col-9"
          />
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />{' '}
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasValue && showResult && !showSteps && (
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
      {hasValue && showSteps && (
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

export default RemainderTheorem;
