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

const VolumeOfSphere = () => {
  const [r, setR] = useLocalStorage('VolumeOfSphere_r', '\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('VolumeOfSphere_equation', '');
  const [solution, setSolution] = useLocalStorage('VolumeOfSphere_solution', '');
  const [result, setResult] = useLocalStorage('VolumeOfSphere_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('VolumeOfSphere_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('VolumeOfSphere_showSteps', true);
  const [note, setNote] = useLocalStorage('VolumeOfSphere_note', undefined);
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
          value: putSpace(
            `Find the \\bold{Volume(V)} of the \\bold{Sphere},Whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(` \\bold{Radius(r)} is: \\bold{${r || 1}}.`),
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
          value: putSpace(`Radius (r) = \\bold{${r || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let rCube = evalExpression(`(${rValue})^3`);
    let multiple = evalExpression(`4 * (${rCube})`);
    let denominator = 7 * 3;
    let multiplePi = evalExpression(`(${multiple}) * 22`);
    let area = evalExpression(`(${multiplePi}) /( ${denominator})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Volume(V)} of above given \\bold{Sphere} with radius r = \\bold{${r}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{{${valueToKatex(
            multiple
          )}}\\above{1pt}3}\\pi} or \\bold{{${evalInDecimals(area)}}}`
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
          `We  know  that  \\bold{Volume(V)} of the \\bold{Sphere} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{V={4\\above{1pt}3}(\\pi)(r^3)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where, \\bold{r} is the \\bold{Radius}. From the above input it is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`given that r =\\bold{{${showVal(r, rValue)}}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(`we can calculate the Volume of the Sphere`),
        type: 'equation',
      },
      {
        value: putSpace(`V = {4\\above{1pt}3}(\\pi)(({${r}})^3)`),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `V = {4\\above{1pt}3}(\\pi)({${valueToKatex(
            rCube
          )}}) = {{${valueToKatex(multiple)}}\\above{1pt}3}\\pi `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `V = {{${valueToKatex(multiplePi)}}\\above{1pt}{${valueToKatex(
            denominator
          )}}} \\implies { \\bold{${evalInDecimals(area)}}}`
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

export default VolumeOfSphere;
