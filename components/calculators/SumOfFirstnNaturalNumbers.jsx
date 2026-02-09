'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { putSpace } from '../../helpers/general';

const SumOfFirstnNaturalNumbers = () => {
  const [n, setN] = useLocalStorage('SumOfFirstnNaturalNumbers_n', '43');
  const [equation, setEquation] = useLocalStorage('SumOfFirstnNaturalNumbers_equation', '');
  const [solution, setSolution] = useLocalStorage('SumOfFirstnNaturalNumbers_solution', '');
  const [result, setResult] = useLocalStorage('SumOfFirstnNaturalNumbers_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SumOfFirstnNaturalNumbers_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SumOfFirstnNaturalNumbers_showSteps', true);

  useEffect(() => {
    const isInvalid = [n].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `n = \\bold{${parseNumber(n) || '0'}}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    let addOne = Number(n) + 1;
    let multiple = n * addOne;
    let divide = multiple / 2;

    const finalAnswer = [
      {
        value: putSpace(
          `The Sum \\bold{S_{${parseNumber(n)}}} Of First \\bold{${parseNumber(
            n
          )}} Natural Number is \\bold{${divide}}`
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
        value: putSpace('We know that \\bold{Sum (S_n) of first n Natural}'),
        type: 'equation',
      },
      {
        value: putSpace('\\bold{numbers} is given by the formula'),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{S_n = \\bigg\\lbrace{(n)(n+1)\\above{1pt}2}\\bigg\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where \\bold{n} is the \\bold {Number of Natural numbers}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `From the above input it is given that n=${parseNumber(n)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace('After putting the values in the formula'),
        type: 'equation',
      },
      {
        value: putSpace(
          `S_{${parseNumber(n)}} = {${parseNumber(n)} * (${parseNumber(
            n
          )}+1)\\above{1pt}2}`
        ),
        type: `equation`,
      },
      {
        value: `After Solving`,
        type: `span`,
      },
      {
        value: putSpace(
          `S_{${parseNumber(n)}} = {(${parseNumber(n)} * ${
            parseNumber(n) + 1
          })\\above{1pt}2}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`S_{${parseNumber(n)}} = {${multiple}\\above{1pt}2}`),
        type: `equation`,
      },
      {
        value: putSpace(`S_{${parseNumber(n)}} = {${divide}}`),
        type: `equation`,
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
  }, [n, showSteps]);

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
  }, [setShowResult]);

  const hasValue = [n].some((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of <b>{`"Positive"`}</b> Integer or any
            Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Value of n:</div>
            <div className="col-9">
              <Input
                placeholder="n"
                pattern={/^\d*$/}
                autoComplete="off"
                className="col-12"
                value={n}
                setVal={setN}
                min={0}
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
      {showResult && !showSteps && (
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

export default SumOfFirstnNaturalNumbers;
