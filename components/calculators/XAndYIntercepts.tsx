'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { convertIntoLatex, evalToDecimals } from '@/helpers/matrixHelper';
import MathInput from 'react-math-keyboard';
import { MathField } from '@/types/mathfield.types';
import { ExpressionParser, Polynomial } from '@yaffle/expression/index';
import { isInputInvalid } from '@/helpers/Validations';
import Parser from '@/helpers/parser/parser';

const getRoots = (expression: string, variable: 'x' | 'y') => {
  try {
    const p = Polynomial.toPolynomial(
      ExpressionParser.parse(expression),
      ExpressionParser.parse(variable)
    );
    return p.getZeros().map((x) => x.toString());
  } catch (error) {
    console.log(error);
    return [];
  }
};

const XAndYIntercepts = () => {
  const [expression, setExpression] = useLocalStorage('XAndYIntercepts_expression', 'x^{2} + y^{2} + 5x – 3y -1 ');
  const [equation, setEquation] = useLocalStorage('XAndYIntercepts_equation', '');
  const [solution, setSolution] = useLocalStorage('XAndYIntercepts_solution', '');
  const [result, setResult] = useLocalStorage('XAndYIntercepts_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('XAndYIntercepts_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('XAndYIntercepts_showSteps', true);
  const [note, setNote] = useLocalStorage('XAndYIntercepts_note', undefined);
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
  }, []);

  const hasValue = !isInputInvalid(expression);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the X \\& Y intercept of the equation: `),
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
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        {
          value: `Expression : ${expression}`,
          type: 'equation',
        },
      ])
    );

    if (!hasValue) return;
    const valueForX = new Parser(
      expression.replaceAll('y', '(0)')
    ).toSimplified();

    const xParser = new Parser(valueForX);

    const valueForY = new Parser(
      expression.replaceAll('x', '(0)')
    ).toSimplified();

    const yParser = new Parser(valueForY);

    const xRoots = getRoots(valueForX, 'x');
    const yRoots = getRoots(valueForY, 'y');

    const yDoesNotExist = expression.indexOf('y') < 0;

    const finalAnswer = [
      {
        value: putSpace(
          `\\bold{x-Intercepts:} =  ${xRoots
            .map(
              (el) =>
                `(${convertIntoLatex(el)}, 0) \\approx (${evalToDecimals(
                  el
                )}, 0)`
            )
            .join(' \\& ')}`
        ),
        type: 'equation',
      },
      yDoesNotExist
        ? {
            value: putSpace(`\\bold{y-Intercepts: Does Not Exist}`),
            type: 'equation',
          }
        : {
            value: putSpace(
              `\\bold{y-Intercepts:} =  ${yRoots
                .map(
                  (el) =>
                    `(0, ${convertIntoLatex(el)}) \\approx (0, ${evalToDecimals(
                      el
                    )})`
                )
                .join(' \\& ')}`
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

    // if the y values doesn't exist
    const ySteps = yDoesNotExist
      ? []
      : [
          {
            value: putSpace(
              `To find the y intercept, Substitute x = 0 into the given equation `
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `and solve the resulting equation ${yParser.toTex()} = 0 for y.`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `\\bold{y-Intercepts:} =  ${yRoots
                .map(
                  (el) =>
                    `(0, ${convertIntoLatex(el)}) \\approx (0, ${evalToDecimals(
                      el
                    )})`
                )
                .join(' \\& ')}`
            ),
            type: 'equation',
          },
          {
            value: `<a href="/calculator/solving-algebraic-equations-calculator/"  target="_blank">to see the steps for solving algebraic equation, click here </a>`,
            type: 'span',
          },
        ];

    const eqRender = renderSteps(equations);
    setResult(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `To find the x intercept, Substitute y = 0 into the given equation `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `and solve the resulting equation ${xParser.toTex()} = 0 for x.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{x-Intercepts:} =  ${xRoots
            .map(
              (el) =>
                `(${convertIntoLatex(el)}, 0) \\approx  (${evalToDecimals(
                  el
                )}, 0)`
            )
            .join(' \\& ')}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/solving-algebraic-equations-calculator/"  target="_blank">to see the steps for solving algebraic equation, click here </a>`,
        type: 'span',
      },
      ...ySteps,
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
  }, [expression, showSteps, hasValue]);

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
              <MathInput
                setValue={setExpression}
                setMathfieldRef={(ref: MathField) => (inputRef.current = ref)}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
                initialLatex={expression}
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
      {hasValue && (
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
      {hasValue && showResult && !showSteps && (
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

export default XAndYIntercepts;
