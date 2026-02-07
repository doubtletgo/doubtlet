'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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

const InterQuartile = () => {
  const [values, setValues] = useState('5.3,11,6,-2,-8,0,7,3/2');
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
    const isInvalid = vals.some((a) => !a);
    const statistics = new Statistics(vals);

    const Q1 = statistics.lowerQuartile();
    const Q3 = statistics.upperQuartile();
    const IQR = statistics.interQuartile();
    const decimal = evalToDecimals(IQR);

    const isSame = IQR == decimal;

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
          `The Interquartile range (IQR) is = \\bold{${convertIntoLatex(
            IQR
          )}} ${isSame ? '' : ` or ${decimal}`}`
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
          `The Interquartile range also called as (IQR, midspread, middle 50\\%, H-spread) be calculated`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `by finding the difference between the Upper(Q_3) and Lower(Q_1) Quartiles.`
        ),
        type: 'equation',
      },
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      'br',
      {
        value: putSpace(
          `Upper Quartile (Q_3) for given set of Values = ${convertIntoLatex(
            Q3
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/upper-quartile-calculator/?a=${values}"  target="_blank">Click here to see steps for upper Quartile calculation</a>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Lower Quartile (Q_1) for given set of values = ${convertIntoLatex(
            Q1
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/lower-quartile-calculator/?a=${values}"  target="_blank">Click here to see steps for lower Quartile calculation</a>`,
        type: 'span',
      },
      'br',
      {
        value: 'Now',
        type: 'span',
      },
      {
        value: putSpace(
          `Interquartile range (IQR) = Upper Quartile (Q_3) – Lower Quartile (Q_1)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Interquartile range = ${convertIntoLatex(Q3)} - (${convertIntoLatex(
            Q1
          )}) = ${convertIntoLatex(IQR)}`
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

export default InterQuartile;
