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

const AreaOfRegularPentagon = () => {
  const [b, setB] = useLocalStorage('AreaOfTriangle_b', '\\sqrt{3}');
  const [h, setH] = useLocalStorage('AreaOfTriangle_h', '\\pi');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('AreaOfTriangle_equation', '');
  const [solution, setSolution] = useLocalStorage('AreaOfTriangle_solution', '');
  const [result, setResult] = useLocalStorage('AreaOfTriangle_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AreaOfTriangle_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AreaOfTriangle_showSteps', true);
  const [note, setNote] = useLocalStorage('AreaOfTriangle_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setB(vals.x1);
    if (vals.x2) setH(vals.x2);
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
            `Find the \\bold{Area(A)} of the Triangle, Whose Length of \\bold{Base(b)} is`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `is \\bold{${b || 1}} and \\bold{Height(h)} is \\bold{${h || 1}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [h, b]);

  useEffect(() => {
    isInvalid.current = [b, h].some((x) => !x);
    const tempB = katexSimplifiedValue(b);
    const tempH = katexSimplifiedValue(h);
    const bValue = evalExpression(tempB);
    const hValue = evalExpression(tempH);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Base Length b = \\bold{${b || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Height Length h =\\bold{${h || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    //
    let bIntoH = evalExpression(`(${bValue})* (${hValue})`);
    let res = evalExpression(`(1/2)* (${bIntoH})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Triangle} with`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `base b =\\bold{${b}}, and\\bold{height}(h) = \\bold{${h}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is {${evalInDecimals(res)}} `),
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
          `We know that \\bold{Area(A)} of the \\bold{Triangle} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{A = \\bigg({1\\above{1pt}2}\\bigg)(b)(h)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `where, \\bold{b} is the Base and \\bold{h} is the \\bold{Height} of the \\bold{Triangle.}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: putSpace(`b = {${showVal(b, bValue)}}`),
        type: 'equation',
      },

      {
        value: putSpace(`h = {${showVal(h, hValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },

      {
        value: putSpace(`First we calculate the value of A=`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A = \\bigg({1\\above{1pt}2}\\bigg)({${valueToKatex(
            bValue
          )}})({${valueToKatex(hValue)}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A = \\bigg({1\\above{1pt}2}\\bigg)({${valueToKatex(
            bIntoH
          )}})} = ${evalInDecimals(res)}`
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
  }, [b, h, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setB('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    setH('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [b, h].some((v) => !!v || v == 0);
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
              />{' '}
            </div>
            <div className="col-6">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setH}
                allowAlphabeticKeyboard={false}
                initialLatex={h}
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
          AreaOfParallelogram
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
export default AreaOfRegularPentagon;
