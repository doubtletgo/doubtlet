'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
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

const PearsonCorrelationCoefficient = () => {
  const [xValues, setXValues] = useLocalStorage('PearsonCorrelationCoefficient_xValues', '5.3,11,6,-2');
  const [yValues, setYValues] = useLocalStorage('PearsonCorrelationCoefficient_yValues', '1,-4,2.1,7');
  const [equation, setEquation] = useLocalStorage('PearsonCorrelationCoefficient_equation', '');
  const [solution, setSolution] = useLocalStorage('PearsonCorrelationCoefficient_solution', '');
  const [result, setResult] = useLocalStorage('PearsonCorrelationCoefficient_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PearsonCorrelationCoefficient_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PearsonCorrelationCoefficient_showSteps', true);
  const [note, setNote] = useLocalStorage('PearsonCorrelationCoefficient_note', undefined);

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
              'br',
              {
                value: `Calculate the Pearson correlation coefficient between`,
                type: 'span',
              },
              {
                value: `\\{${xVals
                  .map((i) => convertIntoLatex(i))
                  .join(',')}\\} and  \\{${yVals
                  .map((i) => convertIntoLatex(i))
                  .join(',')}\\}`,
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
    if (xVals.length !== yVals.length) return;
    const isInvalid = xVals.some((a) => !a) || yVals.some((a) => !a);
    const len = xVals.length;

    // Calculate means
    const SumOfXVals = xVals
      .map((val) => `(${val})`)
      .reduce((a, i) => evalExpression(`${a} + (${i})`), 0);
    const MeanOfX =
      xVals.length > 0 ? evalExpression(`${SumOfXVals} / ${xVals.length}`) : 0;

    const SumOfYVals = yVals
      .map((val) => `(${val})`)
      .reduce((a, i) => evalExpression(`${a} + (${i})`), 0);
    const MeanOfY =
      yVals.length > 0 ? evalExpression(`${SumOfYVals} / ${yVals.length}`) : 0;

    // Calculate standard deviations
    const SumOfSquaredDiffsX = xVals.reduce((sum, xVal) => {
      const diffX = evalExpression(`(${xVal}) - (${MeanOfX})`);
      return evalExpression(`${sum} + (${diffX})^2`);
    }, 0);
    const StdDevX = evalExpression(`sqrt(${SumOfSquaredDiffsX} / ${len - 1})`);

    const SumOfSquaredDiffsY = yVals.reduce((sum, yVal) => {
      const diffY = evalExpression(`(${yVal}) - (${MeanOfY})`);
      return evalExpression(`${sum} + (${diffY})^2`);
    }, 0);
    const StdDevY = evalExpression(`sqrt(${SumOfSquaredDiffsY} / ${len - 1})`);

    // Calculate covariance
    const SumOfProducts = xVals.reduce((sum, xVal, index) => {
      const yVal = yVals[index];
      const diffX = evalExpression(`(${xVal}) - (${MeanOfX})`);
      const diffY = evalExpression(`(${yVal}) - (${MeanOfY})`);
      const product = evalExpression(`(${diffX}) * (${diffY})`);
      return evalExpression(`${sum} + (${product})`);
    }, 0);
    const Covariance = evalExpression(`${SumOfProducts} / ${len - 1}`);
    // Calculate Pearson correlation coefficient
    const PearsonCoefficient = evalExpression(
      `${Covariance} / (${StdDevX} * ${StdDevY})`
    );

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
        value: putSpace(
          `The Pearson Correlation Coefficient is: r = ${evalToDecimals(
            PearsonCoefficient
          )}`
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
        value: `<b>Step By Step Solution:-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The Pearson correlation coefficient between x and y values is the `,
        type: 'span',
      },
      'br',
      {
        value: `ratio of the covariance and the product of the standard deviations.`,
        type: 'span',
      },
      {
        value: putSpace(`r =  \\frac{cov(x, y)}{S_x.S_y}`),
        type: 'equation',
      },
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      {
        value: putSpace(
          `The covariance between set of x and y values is = ${evalToDecimals(
            Covariance
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/covariance-calculator/?a=${xValues}&b=${yValues}"  target="_blank">to see the steps for covariance calculator, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(
          `The standard deviation of set of x-values is: S_x = ${evalToDecimals(
            StdDevX
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/standard-deviation-calculator/?a=${xValues}"  target="_blank">to see the steps for standard deviation calculator, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(
          `The standard deviation of set of y-values is: S_y = ${evalToDecimals(
            StdDevY
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/standard-deviation-calculator/?a=${yValues}"  target="_blank">to see the steps for standard deviation calculator, click here</a>`,
        type: 'span',
      },
      {
        value: `So, r = \\frac{cov(x, y)}{S_x.S_y}`,
        type: 'equation',
      },
      {
        value: `= \\frac{${evalToDecimals(Covariance)}}{(${evalToDecimals(
          StdDevX
        )}).(${evalToDecimals(StdDevY)})}`,
        type: 'equation',
      },
      {
        value: `= ${evalToDecimals(PearsonCoefficient)}`,
        type: 'equation',
      },
      {
        value: `Hence`,
        type: 'span',
      },
      {
        value: putSpace(
          `Pearson Correlation Coefficient is: r = ${evalToDecimals(
            PearsonCoefficient
          )}`
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
    (xValues.split(',').some((v) => !!v || +v == 0) ||
      yValues.split(',').some((v) => !!v || +v == 0)) &&
    xValues.split(',').length == yValues.split(',').length;

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

export default PearsonCorrelationCoefficient;
