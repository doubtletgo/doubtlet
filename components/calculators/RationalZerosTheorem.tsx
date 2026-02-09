'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { MathField } from '@/types/mathfield.types';
import { isInputInvalid } from '@/helpers/Validations';
import ExpressionInput from '../expression-input';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';

const sortPolynomial = (expr: string): string => {
  const terms =
    expr
      .match(/[+-]?[^+-]+/g)
      ?.map((term) => term.trim())
      .filter(Boolean) || [];

  const getPower = (term: string): number => {
    const match = term.match(/x\^(\d+)/);
    if (match) return parseInt(match[1], 10);
    if (term.includes('x')) return 1;
    return 0;
  };

  const sortedTerms = terms.sort((a, b) => getPower(b) - getPower(a));

  return sortedTerms
    .map((term, index) =>
      index === 0 ? term : term.startsWith('-') ? term : `+ ${term}`
    )
    .join(' ')
    .replace(/^\+ /, '');
};

const findFactors = (num: number) => {
  const factors = [];
  for (let i = 1; i <= Math.abs(num); i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }
  return factors;
};

const RationalZerosTheorem = () => {
  const [expression, setExpression] = useLocalStorage('RationalZerosTheorem_expression', '3x - 7 + 2x^3 - 5x^2');
  const [equation, setEquation] = useLocalStorage('RationalZerosTheorem_equation', '');
  const [solution, setSolution] = useLocalStorage('RationalZerosTheorem_solution', '');
  const [result, setResult] = useLocalStorage('RationalZerosTheorem_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('RationalZerosTheorem_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RationalZerosTheorem_showSteps', true);
  const [note, setNote] = useLocalStorage('RationalZerosTheorem_note', undefined);
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
          value: putSpace(`Find all possible rational zeros of`),
          type: 'equation',
        },
        {
          value: expression,
          type: 'equation',
        },
      ])
    );
  }, [expression]);

  useEffect(() => {
    const isInvalid = isInputInvalid(expression);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`P(x) = ${expression}`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    const parsedExpression = convertFromLatex(expression);
    const sortedExpression = sortPolynomial(expression);
    const terms = expression.replace(/\s+/g, '').split(/(?=[+-])/g);

    const trailingCoefficient =
      terms.map((term) => term.trim()).find((term) => !term.includes('x')) ||
      '0';

    const leadingTerm = terms
      .map((term) => term.trim())
      .reduce((highest, current) => {
        const highestPower = parseInt(
          highest.match(/x\^(\d+)/)?.[1] || '1',
          10
        );
        const currentPower = parseInt(
          current.match(/x\^(\d+)/)?.[1] || '1',
          10
        );

        if (current.includes('x') && currentPower > highestPower) {
          return current;
        }
        return highest;
      }, '0');

    let leadingCoefficient = leadingTerm.includes('x')
      ? leadingTerm.replace(/x\^?\d*/, '').trim() || '1'
      : leadingTerm;

    if (leadingCoefficient.startsWith('+')) {
      leadingCoefficient = leadingCoefficient.slice(1);
    }

    const trailingCoefficientNum = parseInt(trailingCoefficient, 10);
    const leadingCoefficientNum = parseInt(leadingCoefficient, 10);

    const trailingFactors = findFactors(trailingCoefficientNum);
    const leadingFactors = findFactors(leadingCoefficientNum);

    const aAllValues = trailingFactors
      .map((t) => leadingFactors.map((l) => evalExpression(`${t}/(${l})`)))
      .flat(2);

    const uniqueRoots = Array.from(new Set(aAllValues));
    const zeroRemainders: string[] = [];

    const remainderSteps = [];

    uniqueRoots.forEach((root) => {
      const divisor1 = `x - ${root}`;
      const divisor2 = `x + ${root}`;
      const solved1 = evalExpression(
        parsedExpression.replaceAll('x', `(${root})`)
      );
      const solved2 = evalExpression(
        parsedExpression.replaceAll('x', `(-${root})`)
      );
      const isSolved1Zero = evalToDecimals(solved1) == 0;
      const isSolved2Zero = evalToDecimals(solved2) == 0;
      if (isSolved1Zero) {
        zeroRemainders.push(root);
      }
      if (isSolved2Zero) {
        zeroRemainders.push(`-${root}`);
      }
      remainderSteps.push(
        ...[
          {
            value: putSpace(
              `\\bullet Check for a=${convertIntoLatex(
                root,
                false
              )}: divide ${sortedExpression} by ${divisor1}  `
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `then P(${convertIntoLatex(
                root,
                false
              )}); hence remainder is ${convertIntoLatex(solved1, false)}  ${
                isSolved1Zero ? '=' : '≠'
              } 0`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `\\bullet Check for a=-${convertIntoLatex(
                root,
                false
              )}: divide ${sortedExpression} by ${divisor2}  `
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `then P(-${convertIntoLatex(
                root,
                false
              )}); hence remainder is ${convertIntoLatex(solved2, false)} ${
                isSolved2Zero ? '=' : '≠'
              } 0`
            ),
            type: 'equation',
          },
        ]
      );
    });

    const finalAnswer = [
      {
        value: putSpace(
          `Actual Rational Roots = \\bold{${
            zeroRemainders.length > 0
              ? zeroRemainders.join(',')
              : 'No Rational Roots exists'
          }}`
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
        value: `We will sort the given polynomial from higher power to lower.`,
        type: 'span',
      },
      {
        value: putSpace(`P(x) = ${sortedExpression}`),
        type: 'equation',
      },
      {
        value: `Since all the coefficients in the given function are integers.`,
        type: 'span',
      },
      'br',
      {
        value: `Hence, Rational zero theorem can be applied.`,
        type: 'span',
      },
      'br',
      {
        value: `Trailing Coefficient = Coefficient of the constant term `,
        type: 'span',
      },
      'br',
      {
        value: `Leading Coefficient = Coefficient of the highest degree term `,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(`Trailing Coefficient = ${trailingCoefficient}`),
        type: 'equation',
      },
      {
        value: putSpace(`Leading Coefficient = ${leadingCoefficient}`),
        type: 'equation',
      },

      {
        value: `Let p = Factors of Trailing Coefficient (with ± sign)`,
        type: 'span',
      },
      {
        value: `p = ${trailingFactors
          .map((t) => `\\pm{${convertIntoLatex(t)}}`)
          .join(' , ')}`,
        type: 'equation',
      },
      {
        value: `Let q = Factors of Leading Coefficient (with ± sign)`,
        type: 'span',
      },
      {
        value: `q = ${leadingFactors
          .map((t) => `\\pm{${convertIntoLatex(t)}}`)
          .join(' , ')}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/factor-calculator/"  target="_blank">to see steps for factor of a number, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Now, find all possible values of a = \\frac{p}{q} =   ${trailingFactors
            .map((t) => leadingFactors.map((l) => `\\pm{\\frac{${t}}{${l}}}`))
            .flat(2)
            .join(' , ')}`
        ),
        type: 'equation',
      },
      {
        value: `Now, we will simplify and remove the duplicate values`,
        type: 'span',
      },
      {
        value: putSpace(
          `These are all possible rational roots: a = ${uniqueRoots
            .map((u) => `\\pm{${convertIntoLatex(u)}}`)
            .join(',')}`
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
        value: `Now, we will use remainder theorem to check all the possible roots.`,
        type: 'span',
      },
      'br',
      {
        value: `If a is a root of the polynomial P(x), then remainder from the division `,
        type: 'span',
      },
      'br',
      {
        value: `of P(x) by (x-a) should be zero means that P(a) = 0`,
        type: 'span',
      },
      'br',
      {
        value: `<a href="/calculator/evaluate-function-value-calculator/"  target="_blank">to see steps for evaluate function at a point, click here</a>`,
        type: 'span',
      },
      ...remainderSteps,
      {
        value: putSpace(
          `Hence, Remainder is zero for a = \\bold{${
            zeroRemainders.length > 0 ? zeroRemainders.join(',') : 'None'
          }}`
        ),
        type: `equation`,
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
  }, [expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression('');
    setShowResult(false);
    setShowSteps(false);
    if (inputRef.current) inputRef.current.latex('');
  }, [setShowResult]);

  const hasValue = expression.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    expression.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !expression.endsWith(e));

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
            Your input can be in the form of Positive Real Number
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-12 text-left">Enter Set of Values:-</div>
            <div className="col-12">
              <ExpressionInput
                label={'Value'}
                value={expression}
                setValue={setExpression}
                setMathfieldRef={(ref) => (inputRef.current = ref)}
                validate={(exp) => {
                  return !isInputInvalid(exp);
                }}
                labelCol="col-3"
                inputCol="col-9"
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

export default RationalZerosTheorem;
