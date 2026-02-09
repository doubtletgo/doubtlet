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

const AreaOfTrapezium = () => {
  const [b1, setB1] = useLocalStorage('AreaOfTrapezium_b1', '1');
  const [b2, setB2] = useLocalStorage('AreaOfTrapezium_b2', '9');
  const [h, setH] = useLocalStorage('AreaOfTrapezium_h', '20');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('AreaOfTrapezium_equation', '');
  const [solution, setSolution] = useLocalStorage('AreaOfTrapezium_solution', '');
  const [result, setResult] = useLocalStorage('AreaOfTrapezium_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AreaOfTrapezium_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AreaOfTrapezium_showSteps', true);
  const [note, setNote] = useLocalStorage('AreaOfTrapezium_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setB1(vals.x1);
    if (vals.y1) setH(vals.y1);
    if (vals.x2) setB2(vals.x2);
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
            `Find the \\bold{Area(A)} of the \\bold{Trapezium,} Whose Length of`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Bases (b1 and b2)} are \\bold{${b1 || '0'}} and \\bold{${
              b2 || '0'
            } resp.} and \\bold{Height(h)} is \\bold{${h || '0'}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [b1, b2, h]);

  useEffect(() => {
    isInvalid.current = [b1, b2, h].some((x) => !x);
    const tempB1 = katexSimplifiedValue(b1);
    const tempB2 = katexSimplifiedValue(b2);
    const tempH = katexSimplifiedValue(h);
    const b1Value = evalExpression(tempB1);
    const b2Value = evalExpression(tempB2);
    const hValue = evalExpression(tempH);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Base 1 (b_1) = \\bold{{${b1 || '0'}}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Base 2 (b_2) = \\bold{${b2 || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Height (h)= \\bold{${h || '0'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let add = evalExpression(`${b1Value}+${b2Value}`);
    let area = evalExpression(`(1 / 2) * ${add} * ${hValue}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Trapezium} with \\bold{bases} b_1 = \\bold{${b1}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `b_2 = \\bold{${b2}} and \\bold{height} h =\\bold{${h}} is:\\bold{${valueToKatex(
            area
          )}} or \\bold{${evalInDecimals(area)}}`
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
          `We know that \\bold{Area(A)} of the \\bold{Trapezium} is given as `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A=\\bigg\\lbrace{1\\above{1pt}2}(b_1+b_2)(h)\\bigg\\rbrace} where,\\bold{b_1 and b_2} are the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{(Bases Set of Parallel Sides)} and \\bold{h} is the \\bold{Height} of`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`the \\bold{Trapezium.}`),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`b_1 = \\bold{${showVal(b1, b1Value)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`b_2 = \\bold{${showVal(b2, b2Value)}}`),
        type: 'equation',
      },
      {
        value: `h = \\bold{${showVal(h, hValue)}} `,
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `First we calculate the value of A =\\bigg\\lbrace{1\\above{1pt}2}({${b1}}+{${b2}})({${h})}\\bigg\\rbrace`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A={1\\above{1pt}2}({${valueToKatex(
            add
          )}})({${h}}) =\\bold{${valueToKatex(
            area
          )}} or \\bold{${evalInDecimals(area)}}`
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
  }, [b1, b2, h, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setB1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setB2('');
    setH('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [b1, b2, h].some((v) => !!v || v == 0);
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
          <div className="text-left mb-3">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="row mb-3 align-items-center">
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setB1}
                allowAlphabeticKeyboard={false}
                initialLatex={b1}
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB2}
                allowAlphabeticKeyboard={false}
                initialLatex={b2}
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
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

export default AreaOfTrapezium;
