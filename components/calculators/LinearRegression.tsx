'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const LinearRegression = () => {
  const [xValues, setXValues] = useLocalStorage('LinearRegression_xValues', '5,-8,0,7');
  const [yValues, setYValues] = useLocalStorage('LinearRegression_yValues', '2,7,6,-2');
  const [equation, setEquation] = useLocalStorage('LinearRegression_equation', '');
  const [solution, setSolution] = useLocalStorage('LinearRegression_solution', '');
  const [result, setResult] = useLocalStorage('LinearRegression_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('LinearRegression_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('LinearRegression_showSteps', true);
  const [note, setNote] = useLocalStorage('LinearRegression_note', undefined);

  useEffect(() => {
    const xVals: Record<string, string> = getSearchParams(false);
    if (xVals.a) setXValues(xVals.a);
  }, []);

  useEffect(() => {
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');

    // TODO: MAKE THE ERROR MESSAGE BETTER AT LINE NUMBER 60
    const isLenSame = xVals.length == yVals.length;
    setNote(
      renderSteps(
        isLenSame
          ? [
              {
                value: `<b>Question</b>`,
                type: 'span',
              },
              {
                value: putSpace(`Find the equation of line of best fit for:`),
                type: 'equation',
              },
              {
                value: `\\bold{\\{${xVals
                  .map(
                    (x, i) =>
                      `(${convertIntoLatex(x)},${convertIntoLatex(yVals?.[i])})`
                  )
                  .join(',')}\\}}`,
                type: 'equation',
              },
            ]
          : [
              {
                value: putSpace(`Number of X and Y values must be same`),
                type: 'equation',
              },
            ]
      )
    );
  }, [xValues, yValues]);

  useEffect(() => {
    if (xValues.endsWith(',') || xValues.endsWith('/') || xValues.endsWith('-'))
      return;
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');
    const isInvalid = xVals.some((a) => !a) || yVals.some((a) => !a);

    const xyMultiplication = xVals.map((x, i) =>
      evalExpression(`${x}*(${yVals?.[i]})`)
    );
    const xSquare = xVals.map((x) => evalExpression(`(${x})^2`));
    const ySquare = yVals.map((y) => evalExpression(`(${y})^2`));

    const xyMultiplicationSum = xyMultiplication.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const xValsSum = xVals.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const yValsSum = yVals.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const xSquareSum = xSquare.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );
    const ySquareSum = ySquare.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const productOfMNumberator = evalExpression(
      `${xVals.length} * (${xyMultiplicationSum}) - (${xValsSum}) * (${yValsSum})`
    );
    const productOfMDenomenator = evalExpression(
      `${xVals.length} * (${xSquareSum}) - (${xValsSum})^ 2`
    );
    const resultForM = evalToDecimals(
      `${productOfMNumberator} / (${productOfMDenomenator})`
    );

    const mValue = evalExpression(
      `${productOfMNumberator}/(${productOfMDenomenator})`
    );

    const productOfNNumerator = evalExpression(
      `${yValsSum} * (${xSquareSum}) - (${xValsSum}) * (${xyMultiplicationSum})`
    );
    const productOfNDenomenator = evalExpression(
      `${xVals.length} * ${xSquareSum} - (${xValsSum}) ^ 2`
    );
    const resultForN = evalToDecimals(
      `${productOfNNumerator} / (${productOfNDenomenator})`
    );
    const nValue = evalExpression(
      `${productOfNNumerator}/${productOfNDenomenator}`
    );

    const tableRows = xVals.map((x, i) => {
      const y = yVals[i];
      const xSquare = convertIntoLatex(`(${x})^2`);
      const ySquare = convertIntoLatex(`(${y})^2`);
      const xy = convertIntoLatex(`(${x})*(${y})`);

      return `& ${x} & ${y} & ${xy} & ${xSquare} & ${ySquare} \\\\ \\hline`;
    });

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `X-Values \\space = \\space ${xVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
        {
          value: `Y-Values \\space = \\space ${yVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: putSpace(`The Line of best fit is = `),
        type: 'equation',
      },
      {
        value: `(${convertIntoLatex(mValue)}x + ${convertIntoLatex(
          nValue
        )}) or (${resultForM}x + ${resultForN})`,
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
        value: putSpace(`The equation of best line fit is: y = mx + b`),
        type: 'equation',
      },
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      'br',
      {
        value: `First, we will count number of input points.`,
        type: 'span',
      },
      'br',
      {
        value: `The number of input points n = ${xVals.length}`,
        type: 'span',
      },
      'br',
      {
        value: `Now generate the following table:`,
        type: 'span',
      },
      {
        value: `\\begin{array}{|c|c|c|c|c|c|}
        \\hline
        & \\textbf{x} & \\textbf{y} & \\textbf{xy} & \\textbf{x}^2 & \\textbf{y}^2 \\\\
        \\hline
        ${tableRows.join('\n')}
        \\Sigma & {${convertIntoLatex(xValsSum)}} & {${convertIntoLatex(
          yValsSum
        )}} & {${convertIntoLatex(xyMultiplicationSum)}} & {${convertIntoLatex(
          xSquareSum
        )}} & {${convertIntoLatex(ySquareSum)}} \\\\
        \\hline
        \\end{array}`,
        type: 'equation',
      },
      {
        value: `We can calculate the value of m and b by using given formulas:`,
        type: 'span',
      },
      {
        value: `m = \\frac {n(\\Sigma xy) - (\\Sigma x)(\\Sigma y)}{n(\\Sigma x^2) - (\\Sigma x)^2} = \\frac {${
          xVals.length
        }(${convertIntoLatex(xyMultiplicationSum)}) - (${convertIntoLatex(
          xValsSum
        )})(${convertIntoLatex(yValsSum)})}{${xVals.length}(${convertIntoLatex(
          xSquareSum
        )}) - (${convertIntoLatex(xValsSum)})^2} = ${convertIntoLatex(mValue)}`,
        type: 'equation',
      },
      {
        value: `n = \\frac {(\\Sigma y)(\\Sigma x^2)-(\\Sigma x)(\\Sigma xy)}{n(\\Sigma x^2) - (\\Sigma x)^2} = \\frac {(${convertIntoLatex(
          yValsSum
        )})(${convertIntoLatex(xSquareSum)}) - (${convertIntoLatex(
          xValsSum
        )})(${convertIntoLatex(xyMultiplicationSum)})}{${
          xVals.length
        }(${convertIntoLatex(xSquareSum)}) - (${convertIntoLatex(
          xValsSum
        )})^2} =${convertIntoLatex(nValue)}`,
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
  }, [xValues, yValues, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setXValues('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue =
    xValues.split(',').some((v) => !!v || +v == 0) ||
    yValues.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    xValues.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !xValues.endsWith(e)) &&
    yValues.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !yValues.endsWith(e));

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
            <div className="col-12 text-left">Enter X-Values:-</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seperated Values"
                value={xValues}
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
                    setXValues(input);
                  }
                }}
              />
            </div>
            <div className="col-12 text-left">Enter Y-Values:-</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seperated Values"
                value={yValues}
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
                    setYValues(input);
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

export default LinearRegression;
