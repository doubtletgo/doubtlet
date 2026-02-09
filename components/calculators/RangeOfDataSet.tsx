'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { convertIntoLatex, evalToDecimals } from '@/helpers/matrixHelper';
import Statistics from '@/helpers/Statistics';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const RangeOfDataSet = () => {
  const [values, setValues] = useLocalStorage('RangeOfDataSet_values', '5.3,11,6,-2,-8,0,7,3/2,-5,1.6,16');
  const [equation, setEquation] = useLocalStorage('RangeOfDataSet_equation', '');
  const [solution, setSolution] = useLocalStorage('RangeOfDataSet_solution', '');
  const [result, setResult] = useLocalStorage('RangeOfDataSet_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('RangeOfDataSet_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RangeOfDataSet_showSteps', true);
  const [note, setNote] = useLocalStorage('RangeOfDataSet_note', undefined);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setValues(vals.a);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the Interquartile range for given set of values: `
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
    if (vals.length < 2) return;
    const isInvalid = vals.some((a) => !a);
    const statistics = new Statistics(vals);
    const sortedValues = statistics._sorted;
    const L1 = statistics.maximum();
    const L2 = statistics.minimum();
    const range = statistics.range();
    const decimal = evalToDecimals(range);

    const isSame = range == decimal;

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Values \\space = \\space \\{${vals
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
          `The range of data set is = \\bold{${convertIntoLatex(range)}} ${
            isSame ? '' : ` or ${decimal}`
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
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The range of data is the difference between the largest and smallest value in the dataset.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The sorted values are : ${sortedValues
            .map((i) => convertIntoLatex(i))
            .join(',')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`So the largest value L_1 = ${convertIntoLatex(L1)}`),
        type: 'equation',
      },
      {
        value: putSpace(`and the smallest value L_2 = ${convertIntoLatex(L2)}`),
        type: 'equation',
      },
      {
        value: 'Now Calculate the difference',
        type: 'span',
      },
      {
        value: putSpace(`Difference = ${L1} – (${L2}) = ${range}`),
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
            <div className="col-12 text-left">Enter Set of Values:-</div>
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

export default RangeOfDataSet;
