'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { convertFromLatex } from '../../helpers/matrixHelper';
import Nerdamer from 'nerdamer';

const solve = (a: string, b: string) => {
  try {
    const expr = Nerdamer(a).subtract(b).expand();
    return Nerdamer(expr).divide('h').expand().toString();
  } catch (error) {
    console.log(error);
    return '';
  }
};

const parseToLatex = (str: string) => {
  try {
    return Nerdamer(str)
      .toTeX()
      .replaceAll('\\cdot', '')
      .replaceAll('*', '')
      .replace(/\s+/g, '');
  } catch (error) {
    console.log(error);
    return '';
  }
};

const DifferenceQuotient = () => {
  const [expression, setExpression] = useLocalStorage('DifferenceQuotient_expression', '2x^2 + 3x - 1');
  const [equation, setEquation] = useLocalStorage('DifferenceQuotient_equation', '');
  const [solution, setSolution] = useLocalStorage('DifferenceQuotient_solution', '');
  const [answer, setAnswer] = useLocalStorage('DifferenceQuotient_answer', undefined);
  const [invalidInput, setInvalidInput] = useLocalStorage('DifferenceQuotient_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('DifferenceQuotient_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DifferenceQuotient_showSteps', true);
  const [note, setNote] = useLocalStorage('DifferenceQuotient_note', undefined);

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
            `Find the difference Quotient for f(x)= ${expression} `
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`f(x) = ${expression}`),
          type: 'equation',
        },
      ])
    );
    const isInvalid =
      !expression ||
      [
        '/',
        '*',
        '-',
        '+',
        'log',
        'sin',
        'cos',
        'tan',
        'cosec',
        'sec',
        'e',
        '(',
        '\\cdot',
      ].some((e) => expression.endsWith(e));

    const simpleExp = convertFromLatex(expression);
    const xPlusH = expression.replaceAll('x', `(x+h)`).replace(/\s+/g, '');
    const simpleXPlusH = convertFromLatex(xPlusH);
    const answer = solve(simpleXPlusH, simpleExp);

    if (isInvalid) {
      setInvalidInput(true);
      return;
    } else {
      setInvalidInput(false);
    }
    const finalAnswer = [
      {
        value: putSpace(`The Difference Quotient is: ${parseToLatex(answer)}`),
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
        value: `<b>Step-by-step-Solution</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `The Difference Quotient for a Function is given by : `,
        type: 'span',
      },
      {
        value: `f(x)= \\frac {f(x+h)-f(x)}{h}`,
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Plug (x + h) in place of x in f(x)`,
        type: 'span',
      },
      {
        value: putSpace(`f(x + h) = ${xPlusH}`),
        type: `equation`,
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `After using the above-given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\frac{f(x+h)-f(x)}{h} = \\frac{(${xPlusH})-(${expression})}{h} = ${parseToLatex(
            answer
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!expression &&
    [
      '/',
      '*',
      '-',
      '+',
      'log',
      'sin',
      'cos',
      'tan',
      'cosec',
      'sec',
      'e',
      '(',
      '\\cdot',
    ].every((e) => !expression.endsWith(e));
  console.log(hasValue, expression);
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
          <div className="dropdown row mb-2 d-flex">
            <div className="col-5 text-left">Enter function Expression:</div>
            <div className={`col-6 ${invalidInput ? 'invalid' : ''}`}>
              <MathInput
                setValue={setExpression}
                initialLatex={expression}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "arcsin",
                  // "arccos",
                  // "arctan",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
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

export default DifferenceQuotient;
