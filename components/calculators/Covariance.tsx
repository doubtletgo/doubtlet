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

const Covariance = () => {
  const [xValues, setXValues] = useLocalStorage('Covariance_xValues', '5.3,11,6,-2,-8');
  const [yValues, setYValues] = useLocalStorage('Covariance_yValues', '1,-4,2.1,7,5');
  const [equation, setEquation] = useLocalStorage('Covariance_equation', '');
  const [solution, setSolution] = useLocalStorage('Covariance_solution', '');
  const [result, setResult] = useLocalStorage('Covariance_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Covariance_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('Covariance_showSteps', true);
  const [note, setNote] = useLocalStorage('Covariance_note', undefined);
  const [methodType, setMethodType] = useLocalStorage<'Sample' | 'Population'>('Covariance_methodType', 'Sample');

  useEffect(() => {
    const xVals: Record<string, string> = getSearchParams(false);
    const yVals: Record<string, string> = getSearchParams(false);
    if (xVals.a) setXValues(xVals.a);
    if (yVals.b) setYValues(yVals.b);
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
                value: putSpace(
                  `Calculate the ${
                    methodType == 'Sample' ? `Sample` : `Population`
                  } covariance between`
                ),
                type: 'equation',
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
  }, [xValues, yValues, methodType]);

  useEffect(() => {
    if (xValues.endsWith(',') || xValues.endsWith('/') || xValues.endsWith('-'))
      return;
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');
    if (xVals.length !== yVals.length) return;
    const isInvalid = xVals.some((a) => !a) || yVals.some((a) => !a);
    const len = xVals.length;

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

    const dynamicEquation = xVals
      .map((xVal, index) => {
        const yVal = yVals[index];
        return `(${xVal} - ${evalToDecimals(
          MeanOfX
        )})(${yVal} - ${evalToDecimals(MeanOfY)})`;
      })
      .join(' + <br>');

    const SumOfProducts = xVals.reduce((sum, xVal, index) => {
      const yVal = yVals[index];
      const diffX = evalExpression(`(${xVal}) - (${MeanOfX})`);
      const diffY = evalExpression(`(${yVal}) - (${MeanOfY})`);
      const product = evalExpression(`(${diffX}) * (${diffY})`);
      return evalExpression(`${sum} + (${product})`);
    }, 0);

    const SampleAnswer = evalExpression(
      `(${SumOfProducts}) / (${xVals.length - 1})`
    );
    const PopulationAnswer = evalExpression(
      `(${SumOfProducts}) / (${xVals.length})`
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
          `The ${
            methodType == 'Sample' ? `\\bold{Sample}` : `\\bold{Population}`
          } covariance is : ${
            methodType == 'Sample'
              ? evalToDecimals(SampleAnswer)
              : evalToDecimals(PopulationAnswer)
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

    const steps = [
      {
        value: `<b>Step By Step Solution:-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The ${
            methodType == 'Sample' ? `\\bold{Sample}` : `\\bold{Population}`
          } covariance between x and y values is given by:`
        ),
        type: 'equation',
      },
      methodType == 'Sample'
        ? {
            value: `\\bold{COV(x, y)} = \\frac{\\Sigma^n_{i=1} (x_i - \\mu_x).(y_i - \\mu_y)}{n-1}`,
            type: 'equation',
          }
        : {
            value: `\\bold{COV(x, y)} = \\frac{\\Sigma^n_{i=1} (x_i - \\mu_x).(y_i - \\mu_y)}{n}`,
            type: 'equation',
          },
      {
        value: `n is the number of input values in the data set.`,
        type: 'span',
      },
      {
        value: putSpace(`\\mu_x is the mean of the x-values in the data set.`),
        type: 'equation',
      },
      {
        value: putSpace(`\\mu_y is the mean of the y-values in the data set.`),
        type: 'equation',
      },
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      {
        value: putSpace(`Number of Input Values (n) = ${len}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Mean (\\mu_x) of the x-values in the data set = ${evalToDecimals(
            MeanOfX
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/arithmetic-mean-calculator/?a=${xValues}" target="_blank">to see the steps for mean calculator, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Mean (\\mu_y) of the y-values in the data set = ${evalToDecimals(
            MeanOfY
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/arithmetic-mean-calculator/?a=${yValues}"  target="_blank">to see the steps for mean calculator, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(`Sum of (x_i-\\mu_x).(y_i-\\mu_y) = `),
        type: 'equation',
      },
      {
        value: `${dynamicEquation}`,
        type: 'span',
      },
      {
        value: putSpace(`= ${evalToDecimals(SumOfProducts)}`),
        type: 'equation',
      },
      methodType == 'Sample'
        ? {
            value: putSpace(
              `So, \\frac{Sum of (x_i - \\mu_x).(y_i - \\mu_y)}{n-1} = \\frac{${evalToDecimals(
                SumOfProducts
              )}}{${xVals.length - 1}} = ${evalToDecimals(SampleAnswer)}`
            ),
            type: 'equation',
          }
        : {
            value: putSpace(
              `So, \\frac{Sum of (x_i - \\mu_x).(y_i - \\mu_y)}{n} = \\frac{${evalToDecimals(
                SumOfProducts
              )}}{${xVals.length}} = ${evalToDecimals(PopulationAnswer)}`
            ),
            type: 'equation',
          },
      {
        value: `Hence,`,
        type: 'equation',
      },
      methodType == 'Sample'
        ? {
            value: putSpace(
              `Sample cov(x, y) = ${evalToDecimals(SampleAnswer)}`
            ),
            type: 'equation',
          }
        : {
            value: putSpace(
              `Population cov(x, y) = ${evalToDecimals(PopulationAnswer)}`
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
  }, [xValues, yValues, showSteps, methodType]);

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
            <div className="dropdown row mb-2 align-items-center">
              <div className="col-4 text-left">Type:</div>
              <div className="col-8">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={methodType}
                  onChange={(e) =>
                    setMethodType(e.target.value as 'Sample' | 'Population')
                  }
                >
                  <option value="Sample">Sample</option>
                  <option value="Population">Population</option>
                </select>
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

export default Covariance;
