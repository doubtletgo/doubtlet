'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';
import Statistics from '@/helpers/Statistics';
import BoxWhiskerPlot from '../graph/box-whishker';
// import BoxPlotChart from '../graphs/BoxPlot';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const BoxAndWhiskerPlot = () => {
  const [xValues, setXValues] = useLocalStorage('BoxAndWhiskerPlot_xValues', '5.3,11,6,-2,-8,0,7,3/2');
  const [yValues, setYValues] = useLocalStorage('BoxAndWhiskerPlot_yValues', '10,-2,2.3,7/4,5,7');
  const [equation, setEquation] = useLocalStorage('BoxAndWhiskerPlot_equation', '');
  const [solution, setSolution] = useLocalStorage('BoxAndWhiskerPlot_solution', '');
  const [result, setResult] = useLocalStorage('BoxAndWhiskerPlot_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('BoxAndWhiskerPlot_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('BoxAndWhiskerPlot_showSteps', true);
  const [note, setNote] = useLocalStorage('BoxAndWhiskerPlot_note', undefined);
  const x1Ref = useRef<Statistics | null>(null);
  const x2Ref = useRef<Statistics | null>(null);

  useEffect(() => {
    const xVals: Record<string, string> = getSearchParams(false);
    if (xVals.a) setXValues(xVals.a);
  }, []);

  useEffect(() => {
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');

    // TODO: MAKE THE ERROR MESSAGE BETTER AT LINE NUMBER 60
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Generate the box and whisker plot for given set of values:`
          ),
          type: 'equation',
        },
        {
          value: `\\bold{\\{${xVals
            .map((x) => convertIntoLatex(x))
            .join(',')}\\} \\space and \\space \\{${yVals
            .map((y) => convertIntoLatex(y))
            .join(',')}\\}}`,
          type: 'equation',
        },
      ])
    );
  }, [xValues, yValues]);

  useEffect(() => {
    if (
      xValues.endsWith(',') ||
      xValues.endsWith('/') ||
      xValues.endsWith('-') ||
      xValues.length == 0 ||
      yValues.length == 0
    )
      return;
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');
    const isInvalid = xVals.some((a) => !a) || yVals.some((a) => !a);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Group \\space 1 \\space = \\space ${xVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
        {
          value: `Group \\space 2 \\space = \\space ${yVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const xStatistics = new Statistics(xVals);
    const yStatistics = new Statistics(yVals);
    x1Ref.current = xStatistics;
    x2Ref.current = yStatistics;

    const xMedianQuartile = evalExpression(`${xStatistics.median()}`);
    const yMedianQuartile = evalExpression(`${yStatistics.median()}`);
    const equations = [];

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
        value: `We will calculate the Five Number Summary for the given set of values.`,
        type: 'span',
      },
      'br',
      {
        value: `Then we will generate whisker plot based on those values.`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `First, we will take Set 1 values.`,
        type: 'span',
      },
      {
        value: putSpace(
          `Minimum Value = ${convertIntoLatex(xStatistics.minimum())}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Lower(first) Quartile Q_1 is = ${convertIntoLatex(
            xStatistics.lowerQuartile()
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The median(second) Quartile Q_2 is = ${convertIntoLatex(
            xMedianQuartile
          )} = ${xStatistics.median()}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The upper Quartile Q_3 is = ${convertIntoLatex(
            xStatistics.upperQuartile()
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Maximum Value = ${convertIntoLatex(xStatistics.maximum())}`
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
        value: `First, we will take Set 2 values.`,
        type: 'span',
      },
      {
        value: putSpace(
          `Minimum Value = ${convertIntoLatex(yStatistics.minimum())}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Lower(first) Quartile Q_1 is = ${convertIntoLatex(
            yStatistics.lowerQuartile()
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The median(second) Quartile Q_2 is = ${convertIntoLatex(
            yMedianQuartile
          )} = ${yStatistics.median()}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The upper Quartile Q_3 is = ${convertIntoLatex(
            yStatistics.upperQuartile()
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Maximum Value = ${convertIntoLatex(yStatistics.maximum())}`
        ),
        type: 'equation',
      },
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
    ['-', '/', '.', ','].every((e) => !yValues.endsWith(e)) &&
    xValues.length > 0 &&
    yValues.length > 0;

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
            <div className="col-12 text-left">Group 1:-</div>
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
            <div className="col-12 text-left">Group 2:-</div>
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
          <div className="mt-4 mb-5">
            <Equation
              print
              equation={solution}
              className="solution-container"
            />
            <div className="container mx-auto px-5">
              {x1Ref.current && x2Ref.current && (
                <BoxWhiskerPlot
                  data={[
                    {
                      y: x1Ref.current._values.map(evalToDecimals),
                      name: 'Group 1',
                      markerColor: '#4d66b0',
                    },
                    {
                      y: x2Ref.current._values.map(evalToDecimals),
                      name: 'Group 2',
                      markerColor: '#f5a284',
                    },
                  ]}
                />
              )}
            </div>
          </div>

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

export default BoxAndWhiskerPlot;
