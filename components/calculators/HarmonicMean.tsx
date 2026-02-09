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
  // Regex to validate the complete input
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const HarmonicMean = () => {
  const [x, setX] = useLocalStorage('HarmonicMean_x', '6,-4,3.1,4/5,7,6');
  const [equation, setEquation] = useLocalStorage('HarmonicMean_equation', '');
  const [solution, setSolution] = useLocalStorage('HarmonicMean_solution', '');
  const [result, setResult] = useLocalStorage('HarmonicMean_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('HarmonicMean_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('HarmonicMean_showSteps', true);
  const [note, setNote] = useLocalStorage('HarmonicMean_note', undefined);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setX(vals.x);
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
            `Calculate the Harmonic mean for the given set of values:\\set{${x
              ?.split(',')
              .map((i) => convertIntoLatex(i))
              .join(',')}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x]);

  useEffect(() => {
    if (x.endsWith(',') || x.endsWith('/') || x.endsWith('-')) return;
    const values = x.split(',');
    const isInvalid = values.some((a) => !a);

    const reciprocalSum = evalExpression(
      values.map((v) => `(1/(${v}))`).join('+')
    );
    const sumInDecimals = evalToDecimals(reciprocalSum);
    const isSame = reciprocalSum == sumInDecimals;
    const hmValue = evalToDecimals(`${values.length}/${sumInDecimals}`);
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Values \\space = \\space ${x
            ?.split(',')
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: `The harmonic mean is : <b>${hmValue}</b>`,
        type: 'span',
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
          'The harmonic mean of a given set of values is given by the formula:',
        type: 'span',
      },
      {
        value: putSpace(
          `H.M. = \\frac{n}{\\displaystyle\\sum_{i=1}^{n}\\bigg(\\frac{1}{x_i}\\bigg)}`
        ),
        type: 'equation',
      },
      {
        value: `where n is the number of values and x<sub>i</sub> represents the set of values`,
        type: 'span',
      },
      'br',
      {
        value: `Since we have ${values.length} values so, n = ${values.length}`,
        type: 'span',
      },
      'br',
      {
        value: `The sum of reciprocal of the values is:`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `${values
            .map((v) => `(\\frac{1}{${convertIntoLatex(v)}})`)
            .join('+')} = ${convertIntoLatex(reciprocalSum)} ${
            isSame ? '' : `= ${sumInDecimals}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Therefore, the harmonic mean (H.M.)  = \\frac{${values.length}}{${sumInDecimals}} = ${hmValue}`
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
  }, [x, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setX('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = x.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    x.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !x.endsWith(e));

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
            Your input can be in the form of any Real Number
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter Values:</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seprated values"
                value={x}
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
                    setX(input);
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

export default HarmonicMean;
