'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { parseNumber } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { putSpace } from '../../helpers/general';

const GeometricMean = () => {
  const [n, setN] = useLocalStorage('geometricMean_n', '4,5,7,1,8,9');
  const [equation, setEquation] = useLocalStorage('geometricMean_equation', '');
  const [solution, setSolution] = useLocalStorage('geometricMean_solution', '');
  const [result, setResult] = useLocalStorage('geometricMean_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('geometricMean_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('geometricMean_showSteps', true);
  const [parsedNum, setParsedNum] = useLocalStorage('geometricMean_parsedNum', []);

  useEffect(() => {
    const numbers = n
      .split(`,`)
      .map((s) => s.trim())
      .map(Number);
    setParsedNum(numbers);
  }, [n]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(` 
            Numbers = \\bold{${parsedNum.length ? parsedNum.join(', ') : '0'}}
          `),
          type: 'equation',
        },
      ])
    );

    const len = parsedNum.length;
    const product = parsedNum.reduce((total, a) => total * a, 1);
    const parsed = parsedNum.join(',');
    const power = 1 / len;
    const res = product < 1 ? 'Does not exist' : product ** power;

    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        value: putSpace(
          `The geometric mean of ${parsed} is : \\bold{${parseNumber(res)}}`
        ),
        type: 'equation',
      },
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
        value: putSpace(`We know  that \\bold{Geometric  Mean} of`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{(X_1,X_2,X_3,.....X_n)} is given as`),
        type: 'equation',
      },
      {
        value: putSpace(`one over n^{th} power of multiplication of n numbers`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\mu = \\lbrace (X_1.X_2.X_3.......X_n)\\rbrace^{(1/n)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `From the above input it is given that values are : \\bold{${parsed}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now, product of these value is \\bold{(${parsedNum.join(
            ' * '
          )})} = ${Number.isInteger(product) ? product : parseNumber(product)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`And Number of values(n) is = ${len}`),
        type: 'equation',
      },
      {
        value: `Then by applying the above formula of Geometric mean <br>for given input values`,
        type: 'span',
      },
      {
        value: putSpace(
          `Geometric Mean = (${parseNumber(product)})^{1\\above{1pt}{${len}}}`
        ),
        type: 'equation',
      },
      {
        value: `\\implies ${parseNumber(res)}`,
        type: 'equation',
      },
      {
        value: `<hr />`,
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The \\bold{Geometric mean} of \\bold{(${parsed})} is : \\bold{${parseNumber(
            res
          )}}`
        ),
        type: 'equation',
      },
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [parsedNum, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setN('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [n].some((v) => !!v && v != '0');

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter Comma Seprated values:</div>
            <div className="col-9">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder={'enter the values'}
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasValue && showResult && !showSteps && (
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

export default GeometricMean;
