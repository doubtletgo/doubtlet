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

const TotalSurfaceAreaOfHemisphere = () => {
  const [r, setR] = useLocalStorage('TotalSurfaceAreaOfHemisphere_r', '\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('TotalSurfaceAreaOfHemisphere_equation', '');
  const [solution, setSolution] = useLocalStorage('TotalSurfaceAreaOfHemisphere_solution', '');
  const [result, setResult] = useLocalStorage('TotalSurfaceAreaOfHemisphere_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('TotalSurfaceAreaOfHemisphere_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('TotalSurfaceAreaOfHemisphere_showSteps', true);
  const [note, setNote] = useLocalStorage('TotalSurfaceAreaOfHemisphere_note', undefined);
  const mf1 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setR(vals.x1);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Total Surface Area (T.S.A)} of`),
          type: 'equation',
        },
        {
          value: putSpace(
            `the \\bold{Hemisphere}, Whose \\bold{Radius(r)} is: \\bold{${
              r || 1
            }}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [r]);

  useEffect(() => {
    isInvalid.current = [r].some((x) => !x);
    const tempR = katexSimplifiedValue(r);
    const rValue = evalExpression(tempR);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          Radius (r) = \\bold{${r || '1'}}`,
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let threePi = evalExpression(` (3 * 22) / 7`);
    let rSquare = evalExpression(`(${rValue}) * (${rValue})`);
    let area = evalExpression(`(${threePi}) * (${rSquare})`);
    let piArea = evalExpression(`3 * (${rSquare})`);
    let multiple = evalExpression(`(${piArea}) * 22`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Total Surface Area(T.S.A)} of above given \\bold{Hemisphere}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`with radius r = \\bold{{${r}}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` is \\bold{{${valueToKatex(
            piArea
          )}}\\pi} or \\bold{{${evalInDecimals(area)}}}`
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
          `We know that \\bold{Total Surface} \\bold{Area(T.S.A)} of the `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Hemisphere} is given as`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{T.S.A=(3\\pi)(r^2)} Where, \\bold{r} is the \\bold{Radius}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: putSpace(`r = \\bold{${showVal(r, rValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula,`),
        type: 'equation',
      },
      {
        value: putSpace(
          `we can calculate the Total Surface Area of the Hemisphere.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`T.S.A = (3 \\pi)({{${valueToKatex(rValue)}}}^2)`),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `T.S.A = (3 \\pi)({${valueToKatex(rSquare)}}) = {${valueToKatex(
            piArea
          )}}\\pi `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `T.S.A = {{${valueToKatex(
            multiple
          )}}\\above{1pt}7} \\implies {${evalInDecimals(area)}}`
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
  }, [r, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setR('');
    mf1?.current.latex('');

    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [r].some((v) => !!v || v == 0);
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
            <div className="col-3 text-left">Radius(r):</div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setR}
                allowAlphabeticKeyboard={false}
                initialLatex={r}
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

export default TotalSurfaceAreaOfHemisphere;
