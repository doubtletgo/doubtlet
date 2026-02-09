'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import { putSpace } from '../../helpers/general';

const ImproperToMixedFraction = () => {
  const [l, setL] = useLocalStorage('ImproperToMixedFraction_l', '2/6');
  const [equation, setEquation] = useLocalStorage('ImproperToMixedFraction_equation', '');
  const [solution, setSolution] = useLocalStorage('ImproperToMixedFraction_solution', '');
  const [result, setResult] = useLocalStorage('ImproperToMixedFraction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('ImproperToMixedFraction_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ImproperToMixedFraction_showSteps', true);
  const [note, setNote] = useLocalStorage('ImproperToMixedFraction_note', undefined);

  let [p, q] = l.split('/');
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setL(vals.a);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Reduce the given \\bold{improper} fraction {${parseNumber(
              p || 'p'
            )} \\above{1pt} ${parseNumber(q || 'q')}} to a mixed fraction.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [l, p, q]);

  useEffect(() => {
    const isInvalid = [p, q].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: putSpace(
            `Improper Fraction : {${parseNumber(
              p || 'p'
            )} \\above{1pt} ${parseNumber(q || 'q')}}`
          ),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const bothNeg = p < 0 && q < 0;
    const verifyPAndQ = p < 0 || q < 0;

    if (p < 0) {
      p = abs(p);
    }
    if (q < 0) {
      q = abs(q);
    }

    //fraction reduction
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return { numR, denumR };
        }
      }
      return { numR, denumR };
    }
    let Result;
    if (p === q) {
      Result = { numR: 1, denumR: 1 };
    } else {
      Result = fraction(p, q);
    }

    const { numR, denumR } = Result;

    //calculation for improper to mixed division
    const remainder = numR % denumR;
    const quotient = Math.floor(numR / denumR);
    const divisors = quotient;

    const finalAnswer = [
      {
        value: putSpace(
          `The Reduction of improper fraction {${parseNumber(
            p
          )} \\above{1pt} ${parseNumber(q)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `to a mixed fraction is ${
            remainder === 0
              ? `= ${bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`}${quotient}`
              : `${
                  quotient === 0
                    ? `= ${
                        bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
                      } {${remainder} \\above{1pt} ${parseNumber(denumR)}}`
                    : `\\large = ${
                        bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
                      } ${divisors} {${remainder} \\above{1pt} ${parseNumber(
                        denumR
                      )}}`
                }`
          }`
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

    let a = numR;
    let aString = a.toString();
    let b = denumR;
    let remain = 0;
    let quotArray = [];
    let remainArray = [];

    for (let i = 0; i < aString.length; i++) {
      let num = Number(remain + aString[i]);
      remainArray.push(num);
      let quot = Math.floor(num / b);
      quotArray.push(quot * b);
      remain = num % b;
    }

    let iterations = 1;
    let result = quotArray
      .map((num, index) => {
        if (!num) return [];
        const space = `\\hspace{${iterations * 10 + 8}px}`;
        const space2 = `\\hspace{${iterations * 10}px}`;
        return [
          iterations++ > 1
            ? {
                value: putSpace(`${space} ${remainArray[index]}`),
                type: 'equation',
              }
            : undefined,
          {
            value: putSpace(`${space2} -${num}`),
            type: 'equation',
          },
          { value: `${space2} ..............`, type: 'equation' },
        ].filter((a) => !!a);
      })
      .flat();

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `An improper fraction is always represented in the form of {p \\above{1pt} q}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where p and q are positive integers, p > q, and q ≠ 0.`
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
        value: `Given fraction = ${
          bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
        }{${parseNumber(p || 'p')} \\above{1pt} ${parseNumber(q || 'q')}}  ${
          (p === numR, q === denumR)
            ? ``
            : `= ${
                bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
              }{${numR} \\above{1pt} ${denumR}}`
        }`,
        type: 'equation',
      },
      {
        value: putSpace(`Now, p = ${parseNumber(p)}, q = ${parseNumber(q)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we have to divide the numerator by the denominator in a way such that `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the remainder is always less than the denominator.`),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: "<div className='card'><div className='card-body'>",
        type: 'raw',
      },
      {
        value: `\\large ${parseNumber(denumR)}) ${parseNumber(
          numR
        )}( ${parseNumber(quotient)}`,
        type: 'equation',
      },
      ...result,
      {
        value: `\\hspace{${(quotArray.length + 1) * 10}px}${remainder}`,
        type: 'equation',
      },
      { value: '</div></div>', type: 'raw' },

      {
        value: putSpace(
          `So mixed fraction is written as Quotient {Remainder \\above{1pt} Divisor}`
        ),
        type: 'equation',
      },
      {
        value:
          remainder === 0
            ? `= ${bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`}${quotient}`
            : `${
                quotient === 0
                  ? `=${
                      bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
                    }{${remainder} \\above{1pt} ${parseNumber(denumR)}}`
                  : `\\large = ${
                      bothNeg ? '' : `${verifyPAndQ ? `(-)` : ''}`
                    }${divisors} {${remainder} \\above{1pt} ${parseNumber(
                      denumR
                    )}}`
              }`,
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
  }, [l, p, q, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setL('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p, q].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p, q].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Fraction:-</div>
            <div className="col-9">
              <Input
                placeholder="Enter / seprated values"
                autoComplete="off"
                className="col-12"
                value={l}
                setVal={setL}
                pattern={/^(-?(\d)*)(\/-?(\d)*)?$/}
                prohibited={[0]}
              />
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
          className="btn default-btn px-5 rounded-pill mr-3 mt-2 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 mt-2 btn btn-danger"
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

export default ImproperToMixedFraction;
