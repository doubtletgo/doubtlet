'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { create, all, sqrt } from 'mathjs';

const config = {};
const math = create(all, config);

function putSpace(val) {
  return val.split(' ').join(' \\space ');
}

const InverseHyperbolicSecant = () => {
  const [latex, setLatex] = useLocalStorage('InverseHyperbolicSecant_latex', '\\frac{1}{3}');
  const [a, setA] = useLocalStorage('InverseHyperbolicSecant_a', '');
  const [equation, setEquation] = useLocalStorage('InverseHyperbolicSecant_equation', '');
  const [solution, setSolution] = useLocalStorage('InverseHyperbolicSecant_solution', '');
  const [result, setResult] = useLocalStorage('InverseHyperbolicSecant_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('InverseHyperbolicSecant_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('InverseHyperbolicSecant_showSteps', true);
  const [note, setNote] = useLocalStorage('InverseHyperbolicSecant_note', undefined);
  const [input, setInput] = useLocalStorage('InverseHyperbolicSecant_input', undefined);

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
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Calculate the value of Sech^{-1}({${latex
              .replace('\\frac', '')
              .split('}{')
              .join('\\above{1pt}')}})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, latex]);

  useEffect(() => {
    const iSecvalid = [input].some((x) => !x);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: `Value \\space of \\space X\\space = {\\space${latex
            .replace('\\frac', '')
            .split('}{')
            .join('\\above{1pt}')}}`,
          type: 'equation',
        },
      ])
    );
    if (!a) return;
    if (iSecvalid) return;
    //if(!(a<1 && -1<a)) return;

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
        value: `The \\space value \\space of \\space Sech^{-1}({${parseNumber(
          p || '(X)'
        )} ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }) \\space is \\space \\bold{ ln(\\space \\frac{(\\space1 + \\space \\sqrt{(1 - ({{${parseNumber(
          p || 'X'
        )} 
            ${
              q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
            }})^2)}\\space)}{{{${parseNumber(p || 'X')} 
                ${
                  q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
                }}} \\space )} \\space or \\space \\bold{${math.log(
          (1 + sqrt(1 - (p / q) * (p / q))) / (p / q)
        )}} `,
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
        value: `The term <b>Inverse Sech(X) or Sech<sup>-1</sup>(X)</b> represents the Inverse hyperbolic Secant function.
          It is a mathematical function <br/> that relates to the Inverse hyperbolic trigonometric functions, 
          which are analogues of the standard inverse hyperbolic trigonometric <br/> functions such as 
          (Inverse Sinh, Inverse Cosh, Inverse Sech) in the context of Inverse hyperbolic geometry.<br/> 
          It is also commonly denoted as <b>arcSech(X)</b> or <b>aSech(X)</b>.</br>
          In words, the inverse Sech function of a given value X returns the value Y such that Sech(Y) is equal to X.</br> 
          The Inverse hyperbolic Secant function or Sech<sup>-1</sup>(X), can be defined using logarithimic 
          functions as follows: `,
        type: 'span',
      },
      'br',
      {
        value: `Sech^{-1}(X) = \\bold{\\space ln(\\frac{(\\space1+\\sqrt{(1-X^2)}\\space)}{X})} \\space where, 
          \\space 0 < X \\le 1 `,
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
        value: `Given \\space value \\space of \\space X = {${
          showUpValuOnly
            ? numerator
            : [numerator, denumerator].join(`\\above{1pt}`)
        }}`,
        type: 'equation',
      },
      {
        value: `Now putting the given value of X in the above given formula`,
        type: 'span',
      },
      'br',
      {
        value: `Sech^{-1}({${parseNumber(p || 'X')} 
        ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }) = (\\space \\frac{(\\space1 + \\space \\sqrt{(1 - ({{${parseNumber(
          p || 'X'
        )} 
            ${
              q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
            }})^2)}\\space)}{{{${parseNumber(p || 'X')} 
                ${
                  q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
                }}} \\space ) \\space = \\bold{${math.log(
          (1 + sqrt(1 - (p / q) * (p / q))) / (p / q)
        )}} `,
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
            <div className="col-4 text-right">
              Sech<sup>-1</sup>(X):-
            </div>
            <div className="col-8">
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

export default InverseHyperbolicSecant;
