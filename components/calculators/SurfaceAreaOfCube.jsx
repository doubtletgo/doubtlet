'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';

import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const SurfaceAreaOfCube = () => {
  const [a, setA] = useLocalStorage('SurfaceAreaOfCube_a', '\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('SurfaceAreaOfCube_equation', '');
  const [solution, setSolution] = useLocalStorage('SurfaceAreaOfCube_solution', '');
  const [result, setResult] = useLocalStorage('SurfaceAreaOfCube_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SurfaceAreaOfCube_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SurfaceAreaOfCube_showSteps', true);
  const [note, setNote] = useLocalStorage('SurfaceAreaOfCube_note', undefined);
  const mf1 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA(vals.x1);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Surface Area (S.A)} of the`),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Cube}, Whose \\bold{Side length(a)} is: \\bold{${a || 1}}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    isInvalid.current = [a].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const aValue = evalExpression(tempA);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Length of side (a) = \\bold{${a || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let aSquare = evalExpression(`(${aValue}) * (${aValue})`);
    let area = evalExpression(`6 * (${aSquare})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Surface Area(S.A)} of above given \\bold{Cube} with`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Side length a = \\bold{${a}} is \\bold{${evalInDecimals(
            area
          )}} square unit`
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
          `We know that \\bold{Surface Area(S.A)} of the \\bold{Cube} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{S.A=(6)(a^2)} Where, \\bold{a} is the \\bold{Side} \\bold{Length}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above`),
        type: 'equation',
      },
      {
        value: putSpace(`given formula S.A = (6)({${a}}^2)`),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `S.A = (6)({${valueToKatex(aSquare)}}) =\\bold{{${evalInDecimals(
            area
          )}}}`
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
    mf1?.current.latex('');

    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a].some((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Positive Real Number or any
            Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Side (a):</div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                allowAlphabeticKeyboard={false}
                initialLatex={a}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
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

export default SurfaceAreaOfCube;
