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
import Input from '../common/input';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const PercentileRank = () => {
  const [values, setValues] = useLocalStorage('PercentileRank_values', '5.3,11,6,-2,-8,0,6,3/2,-5,1.6,6');
  const [p, setP] = useLocalStorage('PercentileRank_p', '6');
  const [equation, setEquation] = useLocalStorage('PercentileRank_equation', '');
  const [solution, setSolution] = useLocalStorage('PercentileRank_solution', '');
  const [result, setResult] = useLocalStorage('PercentileRank_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PercentileRank_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PercentileRank_showSteps', true);
  const [note, setNote] = useLocalStorage('PercentileRank_note', undefined);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the percentile rank of ${p} from the given set of values: `
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
  }, [values, p]);

  useEffect(() => {
    if (values.endsWith(',') || values.endsWith('/') || values.endsWith('-'))
      return;
    const vals = values.split(',');
    const isInvalid = vals.some((a) => !a);

    const sortedValues = vals.sort(
      (a, b) => evalToDecimals(a) - evalToDecimals(b)
    );

    const lessThanP = vals.filter(
      (value) => evalToDecimals(value) < evalToDecimals(p)
    ).length;
    const equalToP = vals.filter(
      (value) => evalToDecimals(value) === evalToDecimals(p)
    ).length;
    const PRNumerator = evalExpression(
      `(${lessThanP} +( ${equalToP}) / 2) * 100`
    );
    const answer = evalToDecimals(`${PRNumerator} / (${vals.length})`);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Values \\space = \\space ${vals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
        {
          value: `Score \\space = \\space ${p}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: putSpace(
          `The percentile rank of ${p} is = \\frac{${PRNumerator}}{${vals.length}}\\% = ${answer}\\%`
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
        value:
          'We have to sort the given set of values from Lowest to Highest.',
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The sorted values are : ${sortedValues
            .map((i) => convertIntoLatex(i))
            .join(',')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now count the total number of input values: N = \\bold{${vals.length}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now count the total number values less than score: L = \\bold{${lessThanP}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now count the total number values equal to the score: S = \\bold{${equalToP}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The percentile rank is: \\bold{PR} = (\\frac{L + \\frac{S}{2}}{N}).100\\% = (\\frac{${lessThanP} + \\frac{${equalToP}}{2}}{${vals.length}}).100\\% = \\frac{${PRNumerator}}{${vals.length}}\\%`
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
  }, [values, showSteps, p]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setValues('');
    setP('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = p && values.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    p &&
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
            <div className="col-3 text-left">Score:-</div>
            <div className="col-12">
              <Input
                placeholder="score"
                disabled={false}
                className="col-12"
                value={p}
                setVal={setP}
                min={-100}
                max={100}
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

export default PercentileRank;
