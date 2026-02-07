'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { convertIntoLatex, evalToDecimals } from '@/helpers/matrixHelper';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const Mode = () => {
  const [values, setValues] = useState('5,3,-2,11,6,-2,-8,6,11,3/2,6,-2,6,-2');
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
          value: putSpace(`Calculate the mode for given set of values: `),
          type: 'equation',
        },
        {
          value: values
            ?.split(',')
            .map((i) => convertIntoLatex(i))
            .join(','),
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
    const count: Record<string, number> = {};

    const newVals = vals.map(evalToDecimals);
    for (let i = 0; i < newVals.length; i++) {
      const val = newVals[i];
      const c = count[val];
      if (count[val]) {
        count[val] = c + 1;
      } else {
        count[val] = 1;
      }
    }

    const maxCount = Math.max(...Object.values(count));
    const mode = Object.keys(count).filter((key) => count[key] === maxCount);
    const set = new Set(newVals);
    const arr = Array.from(set.values());

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

    const finalAnswer = [
      {
        type: 'equation',
        value: putSpace(
          `The mode is = \\bold{${mode
            .map((i) => convertIntoLatex(i))
            .join(',')}}`
        ),
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
        className: 'mb-2',
      },
      'br',
      {
        value:
          'The mode is defined as the value(s) with the highest frequency in the dataset.',
        type: 'span',
      },
      'br',
      {
        value: `A dataset can have:`,
        type: 'span',
      },
      'br',
      {
        value: '<b>•	No mode:</b> All values occur only once.',
        type: 'span',
      },
      'br',
      {
        value: '<b>•	One mode:</b> A single value occurs most frequently',
        type: 'span',
      },
      'br',
      {
        value:
          '<b>•	Multiple modes:</b> Two or more values have the same maximum frequency',
        type: 'span',
      },
      'br',
      {
        type: 'span',
        className: 'text-decoration-underline h6 text-dark',
        value: `<b>Step-1</b>`,
      },
      ...arr.map((v, i) => ({
        value: putSpace(
          `${i == 0 ? 'So ' : ''}${convertIntoLatex(v)} occurs ${
            count[v]
          } times`
        ),
        type: 'equation',
      })),
      {
        type: 'equation',
        value: putSpace(
          `So the mode is = ${mode.map((i) => convertIntoLatex(i)).join(',')}`
        ),
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

export default Mode;
