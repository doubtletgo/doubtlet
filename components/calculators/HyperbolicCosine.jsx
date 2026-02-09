'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { create, all } from 'mathjs';

import { putSpace } from '@/helpers/general';

const config = {};
const math = create(all, config);

const Test = () => {
  const [latex, setLatex] = useLocalStorage('HyperbolicCosine_latex', '5');
  const [a, setA] = useLocalStorage('HyperbolicCosine_a', '');
  const [equation, setEquation] = useLocalStorage('HyperbolicCosine_equation', '');
  const [solution, setSolution] = useLocalStorage('HyperbolicCosine_solution', '');
  const [result, setResult] = useLocalStorage('HyperbolicCosine_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('HyperbolicCosine_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('HyperbolicCosine_showSteps', true);
  const [note, setNote] = useLocalStorage('HyperbolicCosine_note', undefined);
  const [input, setInput] = useLocalStorage('HyperbolicCosine_input', undefined);

  function evalLatex(expression) {
    try {
      // Parse the LaTeX expression
      const parsedExpression = math.parse(expression);

      // Evaluate the parsed expression
      const evaluatedResult = parsedExpression.evaluate();

      // Return the evaluated result
      return evaluatedResult;
    } catch {
      // Handle any psing or evaluation errors

      return null;
    }
  }
  let [p, q = 1] = a.split('/');

  useEffect(() => {
    var expr = latex
      .replaceAll('\\frac', '')
      .replaceAll('}{', '/')
      .replaceAll('}', '')
      .replaceAll('{', '')
      .replaceAll('\\sqrt', '√');
    var expr2 = latex
      .replaceAll('\\frac', '')
      .replaceAll('}{', ')/(')
      .replaceAll('}', ')')
      .replaceAll('{', '(')
      .replaceAll('\\sqrt', 'sqrt')
      .replaceAll('\\left(', '')
      .replaceAll('\\right)', '');

    setInput(evalLatex(expr2)?.toString());
    setA(expr.replace('√', ''));

    setNote(
      renderSteps([
        {
          value: `Question`,
          type: 'h6',
        },
        {
          value: putSpace(
            `Calculate the value of Cosh( {${
              latex.replace('\\frac', '').split('}{').join('\\above{1pt}') ||
              '1'
            }})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, latex]);

  useEffect(() => {
    const isInvalid = [input].some((x) => !x);

    setEquation(
      renderSteps([
        {
          value: `Formatted User Input Display`,
          type: `h6`,
        },
        {
          value: putSpace(
            `Value of X = {\\space${
              latex.replace('\\frac', '').split('}{').join('\\above{1pt}') ||
              '1'
            }}`
          ),
          type: 'equation',
        },
      ])
    );
    if (!a) return;
    if (isInvalid) return;

    //perimeter calculation
    function checkDecimal(n) {
      var isDecimal = n - Math.floor(n) !== 0;

      return isDecimal;
    }
    function decimalToFraction(val) {
      val = val?.toString();
      if (!val) return;
      if (checkDecimal(val)) {
        return (
          val.replace('.', '') +
          `\\above{1pt}` +
          10 ** val.split('.')[1]?.length
        );
      }
      return val + `\\above{1pt}` + 1;
    }

    var numerator =
      decimalToFraction(p).split(`\\above{1pt}`)[0] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[1] || 1);
    var denumerator =
      decimalToFraction(p).split(`\\above{1pt}`)[1] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[0] || 1);
    const showUpValuOnly = !checkDecimal(p) && q == 1;

    const finalAnswer = [
      {
        value: putSpace(
          `The value of Cosh({${parseNumber(p || '(X)')} ${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          }) is \\bold{\\frac{(e^{{${parseNumber(p || 'X')}${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          }} + e^{-{${parseNumber(p || 'X')}${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          }})}{2}} or \\bold{${
            (1 / 2) * (math.exp(p / q) + math.exp(-(p / q)))
          }} `
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'h6',
        value: `Answer`,
      },
      ...finalAnswer,
    ];

    const eqRender = renderSteps(equations);
    setResult(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `Step By Step Solution :-`,
        type: 'h6',
      },
      {
        value: putSpace(
          `The term \\bold{Cosh(X)} represents the hyperbolic cosine function.It is a mathematical function`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `that relates to the hyperbolic trigonometric functions, which are analogues of the standard`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `trigonometric functions (sine, cosine, tangent) in the context of hyperbolic geometry.`
        ),
        type: 'equation',
      },

      {
        value:
          putSpace(`The hyperbolic cosine function cosh x, can be defined using exponential functions as follows:
        `),
        type: 'equation',
      },
      {
        value: putSpace(`Cosh(X) = \\bold{\\frac{(e^X+e^{-X})}{2}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `where, e (2.71828) represents the mathematical constant \\bold{Euler’s} number.`
        ),
        type: 'equation',
      },
      {
        value: `Step-1`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `Given value of X = {${
            showUpValuOnly
              ? numerator
              : [numerator, denumerator].join(`\\above{1pt}`)
          }}`
        ),
        type: 'equation',
      },
      {
        value: `Now putting the given value of X in the above given formula`,
        type: 'span',
      },
      'br',
      {
        value: `Cosh({${parseNumber(p || 'X')} 
        ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }) = \\frac{(e^{{${parseNumber(p || 'X')} 
        ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }} + e^{-{${parseNumber(p || 'X')} 
        ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }})}{2} \\space = \\bold{${
          (1 / 2) * (math.exp(p / q) + math.exp(-(p / q)))
        }}`,
        type: 'equation',
      },
      'hr',
      {
        value: `Final Answer`,
        type: 'h6',
      },
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [a, latex, showSteps, setSolution]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setLatex('');
    setInput('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p].every((v) => (!!v && !isNaN(v)) || v === 0);

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
          <div className="text-left mb-2">
            Your input can be in form of Integer, Fraction or any real number.
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Cosh(X):-</div>
            <div className="col-9">
              <div className="dropdown row mb-2 align-items-center">
                <MathInput
                  setValue={setLatex}
                  initialLatex={latex}
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
                />
              </div>
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
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default Test;
