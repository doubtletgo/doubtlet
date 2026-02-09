'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const VolumeOfTetrahedron = () => {
  const [a, setA] = useLocalStorage('VolumeOfTetrahedron_a', '\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('VolumeOfTetrahedron_equation', '');
  const [solution, setSolution] = useLocalStorage('VolumeOfTetrahedron_solution', '');
  const [result, setResult] = useLocalStorage('VolumeOfTetrahedron_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('VolumeOfTetrahedron_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('VolumeOfTetrahedron_showSteps', true);
  const [note, setNote] = useLocalStorage('VolumeOfTetrahedron_note', undefined);
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
          value: putSpace(
            `Find the \\bold{Volume (V)} of the \\bold{Tetrahedron}, whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(` length of the side (a) is \\bold{{${a || '1'}}}.`),
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
          value: putSpace(`Side length (a) = < \\bold{${a || '1'}} >`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    const aCube = evalExpression(`(${aValue})^3`);
    const result = evalExpression(`(${aCube}) / (6 * sqrt(2))`);

    const finalAnswer = [
      {
        value: putSpace(`The Volume (V) of the Tetrahedron, whose length of`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` the side (a) is {${valueToKatex(
            aValue
          )}} is \\bold{V = {{${valueToKatex(
            aCube
          )}} \\above{1pt} 6 \\sqrt{2}}} = {${evalInDecimals(
            result
          )}} cubic unit`
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
          `We know that the \\bold{Volume} of the \\bold{Tetrahedron} is given as`
        ),
        type: 'equation',
      },
      {
        value: `\\bold{V = {1 \\above{1pt} 6 \\sqrt{2}} (a)^3}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `where a is the length of the side of the tetrahedron.`
        ),
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`From the above input, it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`Length of the side (a) = {${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above-given formula,`),
        type: 'equation',
      },
      'br',
      {
        value: putSpace(`we can calculate the Volume of the Tetrahedron.`),
        type: 'euqation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `\\bold{V = {1 \\above{1pt} 6 \\sqrt{2}} ({${valueToKatex(
            aValue
          )}})^3}`
        ),
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\bold{V = {{${valueToKatex(
            aCube
          )}} \\above{1pt} 6 \\sqrt{2}}} = {${evalInDecimals(
            result
          )}} cubic  unit`
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
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Positive Real Number or any
            Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Side length(a):</div>
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

export default VolumeOfTetrahedron;
