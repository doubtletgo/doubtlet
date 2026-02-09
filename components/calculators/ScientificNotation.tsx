'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';

const ScientificNotation = () => {
  const [a, setA] = useLocalStorage('ScientificNotation_a', '345.435');
  const [equation, setEquation] = useLocalStorage('ScientificNotation_equation', '');
  const [solution, setSolution] = useLocalStorage('ScientificNotation_solution', '');
  const [result, setResult] = useLocalStorage('ScientificNotation_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('ScientificNotation_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ScientificNotation_showSteps', true);
  const [note, setNote] = useLocalStorage('ScientificNotation_note', undefined);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Convert the given number \\bold{${
              a || 'a'
            }} into Scientific Notation.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    const isInvalid = [a].some((x) => isNaN(+x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Number:\\bigg<\\bold{${a || 'a'}}\\bigg>`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    const num = parseFloat(a);

    const scientific =
      num.toExponential().replace('e', ' × 10^{').replace('+', '') + '}';

    const scientificENotation = num.toExponential();

    const finalAnswer = [
      {
        value: putSpace(
          `Scientific Notation: \\bold{${a}} = \\bold{${scientific}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Scientific eNotation: \\bold{${a}} = \\bold{${scientificENotation}}`
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
        value: `<b>Step By Step Solution : </b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Scientific Notation: \\bold{${a}} = \\bold{${scientific}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Scientific eNotation: \\bold{${a}} = \\bold{${scientificENotation}}`
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
  }, [a, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a].some((v) => (!!v && !isNaN(+v)) || +v == 0);
  const hasAllValue = [a].every((v) => (!!v && !isNaN(+v)) || +v == 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter the Number:</div>
            <div className="col-9">
              <Input
                placeholder="value of a"
                disabled={false}
                className="col-12"
                value={a}
                setVal={setA}
                min={-99999999}
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

export default ScientificNotation;
