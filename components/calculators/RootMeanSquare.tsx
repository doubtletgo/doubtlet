'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import { convertIntoLatex, evalExpression } from '@/helpers/matrixHelper';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const RootMeanSquare = () => {
  const [values, setValues] = useLocalStorage('RootMeanSquare_values', '6, -4, 3, 0, 7, 6/3');
  const [equation, setEquation] = useLocalStorage('RootMeanSquare_equation', '');
  const [solution, setSolution] = useLocalStorage('RootMeanSquare_solution', '');
  const [result, setResult] = useLocalStorage('RootMeanSquare_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('RootMeanSquare_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RootMeanSquare_showSteps', true);
  const [note, setNote] = useLocalStorage('RootMeanSquare_note', undefined);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the Root mean square value for the given set of values:`
          ),
          type: 'equation',
        },
        {
          value: `\\{${values
            ?.split(',')
            .map((i) => convertIntoLatex(i))
            .join(',')}\\}`,
          type: 'equation',
        },
      ])
    );
  }, [values]);

  useEffect(() => {
    if (values.endsWith(',') || values.endsWith('/') || values.endsWith('-'))
      return;
    const vals = values.split(',');
    const isInvalid = vals.some((a) => !a);

    const formattedExpression = vals
      .map((val) => `(${convertIntoLatex(val)})^2`)
      .join(' + ');
    const sumOfSquares = vals
      .map((val) => `(${val})^2`)
      .reduce((a, i) => evalExpression(`${a} + (${i})`), 0);

    const rootMean = evalExpression(`(${sumOfSquares} / ${vals.length})`);
    const rootMeanSquare = evalExpression(
      `sqrt(${sumOfSquares} / ${vals.length})`
    );

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Values \\space = \\space \\{${values
            ?.split(',')
            .map((i) => convertIntoLatex(i))
            .join(',')}\\}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: putSpace(
          `The root mean square (RMS) value is: \\sqrt\\frac{${convertIntoLatex(
            sumOfSquares
          )}}{${vals.length}} = ${rootMeanSquare}`
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
        value: 'The Root Mean Square (RMS) value is calculated as:',
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `RMS Value = \\sqrt\\frac{\\Sigma^n_{i=1} (x_i)^2 }{n} = \\sqrt\\frac{(x_1)^2 + (x_2)^2 + (x_3)^2 +.....+ (x_n)^2 }{n}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where n is the number of values and xi represents the set of values.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Number of input values (n) = ${vals.length}`),
        type: 'equation',
      },
      {
        value: `The sum of the square of each input values is:`,
        type: 'span',
      },
      {
        value: putSpace(
          `${formattedExpression} = ${convertIntoLatex(sumOfSquares)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Therefore, RMS Value = \\sqrt\\frac{${convertIntoLatex(
            sumOfSquares
          )}}{${vals.length}} = \\sqrt{${convertIntoLatex(
            rootMean
          )}} = ${rootMeanSquare}`
        ),
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
  }, [values, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setValues('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = values.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    values.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !values.endsWith(e));

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
            <div className="col-3 text-left">Enter Set of Values:-</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seprated values"
                value={values}
                onBlur={(e) => {
                  if (!validateInput(e.target.value)) {
                    e.currentTarget.className =
                      'form-control border-danger col-4 min-height';
                    setShowSteps(false);
                    setShowResult(true);
                  } else {
                    e.currentTarget.className =
                      'form-control border-primary col-4 min-height';
                  }
                }}
                onChange={(e) => {
                  const input = e.target.value;

                  const validPartialInput =
                    /^(-?\d*(\.\d*)?(\/-?\d*)?)(,\s*-?\d*(\.\d*)?(\/-?\d*)?)*,?$/;

                  if (input === '' || validPartialInput.test(input)) {
                    setValues(input);
                  }
                }}
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

export default RootMeanSquare;
