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

const StandardDeviation = () => {
  const [xValues, setXValues] = useLocalStorage('StandardDeviation_xValues', '5.3,11,6,-2,-8');
  const [equation, setEquation] = useLocalStorage('StandardDeviation_equation', '');
  const [solution, setSolution] = useLocalStorage('StandardDeviation_solution', '');
  const [result, setResult] = useLocalStorage('StandardDeviation_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('StandardDeviation_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('StandardDeviation_showSteps', true);
  const [note, setNote] = useLocalStorage('StandardDeviation_note', undefined);
  const [methodType, setMethodType] = useLocalStorage<'Sample' | 'Population'>('StandardDeviation_methodType', 'Sample');

  useEffect(() => {
    const xVals: Record<string, string> = getSearchParams(false);
    if (xVals.a) setXValues(xVals.a);
    if (xVals.type === 'Sample' || xVals.type === 'Population') {
      setMethodType(xVals.type as 'Sample' | 'Population');
    }
  }, []);

  useEffect(() => {
    const xVals = xValues.split(',');

    // TODO: MAKE THE ERROR MESSAGE BETTER AT LINE NUMBER 60
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the ${
              methodType == 'Sample' ? `Sample` : `Population`
            } standard deviation for the given set of values:`
          ),
          type: 'equation',
        },
        {
          value: `\\{${xVals.map((i) => convertIntoLatex(i)).join(',')}\\} `,
          type: 'equation',
        },
      ])
    );
  }, [xValues, methodType]);

  useEffect(() => {
    if (xValues.endsWith(',') || xValues.endsWith('/')) return;
    const xVals = xValues.split(',');
    const isInvalid = xVals.some((a) => !a);
    const len = xVals.length;

    const SumOfXVals = xVals
      .map((val) => `(${val})`)
      .reduce((a, i) => evalExpression(`${a} + (${i})`), 0);
    const MeanOfX =
      xVals.length > 0 ? evalExpression(`${SumOfXVals} / ${xVals.length}`) : 0;

    const dynamicEquation = xVals
      .map((xVal) => {
        return `(${xVal} - ${evalToDecimals(MeanOfX)})^2`;
      })
      .join(' + ');

    const SumOfProducts = xVals.reduce((sum, xVal) => {
      const diffX = evalExpression(`(${xVal}) - (${MeanOfX})`);
      const product = evalExpression(`(${diffX}) * (${diffX})`);
      return evalExpression(`${sum} + (${product})`);
    }, 0);

    const SampleAnswer = evalExpression(
      `(${SumOfProducts}) / (${xVals.length - 1})`
    );
    const SqrtSampleAnswer = evalExpression(`sqrt(${SampleAnswer})`);
    const PopulationAnswer = evalExpression(
      `(${SumOfProducts}) / (${xVals.length})`
    );
    const SqrtPopulationAnswer = evalExpression(`sqrt(${PopulationAnswer})`);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Values \\space = \\space ${xVals
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
          } standard deviation is: ${
            methodType == 'Sample' ? SqrtSampleAnswer : SqrtPopulationAnswer
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
          } standard deviation for the given set of values is given by:`
        ),
        type: 'equation',
      },
      methodType == 'Sample'
        ? {
            value: `\\bold{\\sigma} = \\sqrt{\\frac{\\Sigma^n_{i=1} (x_i - \\mu)^2}{n-1}} = \\sqrt{\\frac{Sum \\space of(x_i - \\mu)^2}{n-1}}`,
            type: 'equation',
          }
        : {
            value: `\\bold{\\sigma} = \\sqrt{\\frac{\\Sigma^n_{i=1} (x_i - \\mu)^2}{n}} = \\sqrt{\\frac{Sum \\space of(x_i - \\mu)^2}{n}}`,
            type: 'equation',
          },
      {
        value: `n is the number of input values in the data set`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\mu is the mean of the input values in the data set.`
        ),
        type: 'equation',
      },
      {
        value: `Standard Deviation is also called as square root of the Variance.`,
        type: 'span',
      },
      'br',
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
          `Mean (\\mu) of the data set = ${evalToDecimals(MeanOfX)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/arithmetic-mean-calculator/?a=${xValues}"  target="_blank">to see the steps for mean calculator, click here</a>`,
        type: 'span',
      },
      {
        value: putSpace(`Sum of (x_i-\\mu)^2 = `),
        type: 'equation',
      },
      {
        value: `${dynamicEquation}`,
        type: 'equation',
      },
      {
        value: putSpace(`= ${evalToDecimals(SumOfProducts)}`),
        type: 'equation',
      },
      methodType == 'Sample'
        ? {
            value: putSpace(
              `So, \\frac{Sum of (x_i - \\mu)^2}{n-1} = \\frac{${evalToDecimals(
                SumOfProducts
              )}}{${xVals.length - 1}} = ${evalToDecimals(SampleAnswer)}`
            ),
            type: 'equation',
          }
        : {
            value: putSpace(
              `So, \\frac{Sum of (x_i - \\mu)^2}{n} = \\frac{${evalToDecimals(
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
              `Sample Standard Deviation (\\sigma) = \\sqrt{${evalToDecimals(
                SampleAnswer
              )}} = ${SqrtSampleAnswer}`
            ),
            type: 'equation',
          }
        : {
            value: putSpace(
              `Population Standard Deviation (\\sigma) = \\sqrt{${evalToDecimals(
                PopulationAnswer
              )}} = ${SqrtPopulationAnswer}`
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
  }, [xValues, showSteps, methodType]);

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

  const hasValue = xValues.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    xValues.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !xValues.endsWith(e));

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
            <div className="col-12 text-left">Enter set of Values:-</div>
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

export default StandardDeviation;
