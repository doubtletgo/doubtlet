'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
  evalToDecimals,
} from '@/helpers/matrixHelper';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const Median = () => {
  const [values, setValues] = useState('5.3,11,6,-2,-8,0,7,3/2,11');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

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
          value: putSpace(`Calculate the median for given set of values: `),
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

    const sortedValues = vals.toSorted(
      (a, b) => evalToDecimals(a) - evalToDecimals(b)
    );
    const count = sortedValues.length;
    const isEven = count % 2 == 0;
    const n = isEven ? count / 2 : (count + 1) / 2;
    const nth = sortedValues[n - 1];
    const next = sortedValues[n];

    const average = evalExpression(`(${nth}+(${next}))/2`);
    const decimal = evalInDecimals(`${average}`);
    const isSame = average == decimal;

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
      ])
    );

    if (isInvalid) return;
    const oddSteps = [
      {
        value:
          'Since n is odd, so the median value is the central value among sorted values',
        type: 'span',
      },
      'br',
      {
        value: putSpace(`Central Value is (\\frac{n+1}{2})^{th} = ${n}^{th}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `The median value from sorted values is: \\{${sortedValues
            .map((e, i) =>
              i == n - 1
                ? `\\textcolor{blue}{\\bold{${convertIntoLatex(e)}}}`
                : convertIntoLatex(e)
            )
            .join(' , ')}\\}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`The ${n}^{th} value is ${convertIntoLatex(nth)}`),
        type: 'equation',
      },
      {
        value: putSpace(`So the median is = ${convertIntoLatex(nth)}`),
        type: 'equation',
      },
    ];
    const evenSteps = [
      {
        value:
          'Since n is even, so the median value is the average of the central values among sorted values.',
        type: 'span',
      },
      {
        value: putSpace(
          `Central Values are (\\frac{n}{2})^{th} = ${n}^{th} and (\\frac{n}{2} + 1) = ${
            n + 1
          }^{th} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The median value from sorted values is:  \\{${sortedValues
            .map((e, i) =>
              i == n || i == n - 1
                ? `\\textcolor{blue}{\\bold{${convertIntoLatex(e)}}}`
                : convertIntoLatex(e)
            )
            .join(' , ')}\\}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `So the ${n}^{th} value  is = ${convertIntoLatex(nth)} and ${
            n + 1
          }^{th} value is = ${convertIntoLatex(next)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The average value is = \\frac{${convertIntoLatex(
            nth
          )} + (${convertIntoLatex(next)})}{2} = ${convertIntoLatex(average)}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`So the median is = ${convertIntoLatex(average)}`),
        type: 'equation',
      },
    ];

    const finalAnswer = [
      {
        value: putSpace(
          `The Median is: ${convertIntoLatex(isEven ? average : nth)} ${
            isEven ? (isSame ? '' : ` or ${decimal}`) : ''
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
        value:
          'The median is the middle value of a dataset when it is arranged in ascending order.',
        type: 'span',
      },
      'br',
      {
        value:
          'If the dataset has an even number of elements, the median is the average of the two middle values.',
        type: 'span',
      },
      'br',
      'br',
      {
        value: '<b>Step-1</b>',
        type: 'span',
        className: 'text-decoration-underline text-black',
      },
      'br',
      {
        value: `We have to sort the given set of values from Lowest to Highest.`,
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
        value: `Now count the total number of input values (n) = ${vals.length}`,
        type: 'span',
      },
      'br',
      ...(isEven ? evenSteps : oddSteps),
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

export default Median;
