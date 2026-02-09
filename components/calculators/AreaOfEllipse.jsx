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

const AreaOfEllipse = () => {
  const [a, setA] = useLocalStorage('AreaOfEllipse_a', '3');
  const [b, setB] = useLocalStorage('AreaOfEllipse_b', '2');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('AreaOfEllipse_equation', '');
  const [solution, setSolution] = useLocalStorage('AreaOfEllipse_solution', '');
  const [result, setResult] = useLocalStorage('AreaOfEllipse_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AreaOfEllipse_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AreaOfEllipse_showSteps', true);
  const [note, setNote] = useLocalStorage('AreaOfEllipse_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.x2) setB(vals.x2);
  }, []);

  //Question
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Area(A)} of the  \\bold{Ellipse}, Whose \\bold{Length} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `of \\bold{Semi  Major} and \\bold{Semi Minor axis} is \\bold{${
              a || 1
            }} and \\bold{${b || 1}}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [b, a]);

  useEffect(() => {
    isInvalid.current = [a, b].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Length of Semi Major Axis (a) = \\bold{${a || '1'}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`
          Length of Semi Minor Axis (b) = \\bold{${b || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let area = evalExpression(`(22 / 7) * (${aValue}) * (${bValue})`);
    let multiple = evalExpression(`(${aValue}) * (${bValue})`);
    let piMultiple = evalExpression(`22 * (${multiple})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Ellipse} with \\bold{Length} of \\bold{Semi Major}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `axis a = \\bold{${a}} and \\bold{Length} of \\bold{Semi Minor} axis`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `b = \\bold{${b}}\\enspace is\\enspace \\bold{${valueToKatex(
            multiple
          )}\\pi} or \\bold{${evalInDecimals(area)}}`
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
          `We know that \\bold{Area(A)} of the \\bold{Ellipse} is given as`
        ),
        type: 'equation',
      },
      {
        value: `\\bold{A = (\\pi)(a)(b)}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `where, \\bold{a} is the \\bold{Length of} \\bold{ Semi Major} and \\bold{b} is the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Length of Semi Minor} axis.`),
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
        value: putSpace(`b = \\bold{${showVal(b, bValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = (\\pi)(${a})(${b}) = {${valueToKatex(multiple)}}\\pi`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = {${valueToKatex(
            piMultiple
          )}\\above{1pt}7} or \\bold{${evalInDecimals(area)}}`
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
  }, [a, b, showSteps]);

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
    mf2?.current.latex('');
    setB('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b].some((v) => !!v || v == 0);
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

          <div className="row mb-3 align-items-center">
            <div className="col-6">
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
            <div className="col-6">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                allowAlphabeticKeyboard={false}
                initialLatex={b}
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
              />
              {''}
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

export default AreaOfEllipse;
