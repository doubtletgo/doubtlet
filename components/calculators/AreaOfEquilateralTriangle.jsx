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

const AreaOfEquilateralTriangle = () => {
  const [a, setA] = useLocalStorage('AreaOfEquilateralTriangle_a', '\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('AreaOfEquilateralTriangle_equation', '');
  const [solution, setSolution] = useLocalStorage('AreaOfEquilateralTriangle_solution', '');
  const [result, setResult] = useLocalStorage('AreaOfEquilateralTriangle_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AreaOfEquilateralTriangle_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AreaOfEquilateralTriangle_showSteps', true);
  const [note, setNote] = useLocalStorage('AreaOfEquilateralTriangle_note', undefined);
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
            `Find the \\bold{Area(A)} of the \\bold{Equilateral Triangle},`
          ),
          type: 'equation',
        },

        {
          value: putSpace(
            `Whose Length of \\bold{Side(a)} is \\bold{${a || '0'}}.`
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
          value: putSpace(`Side (a) = \\bold{${a || '0'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let root = evalExpression(`sqrt(${3})`);
    let rootByFour = evalExpression(`${root} / 4`);
    let aSquare = evalExpression(`${aValue} * ${aValue}`);
    let area = evalExpression(`${rootByFour} * ${aSquare}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Equilateral Triangle} with`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Side length a = \\bold{${a}} is \\bold{(${valueToKatex(
            aSquare
          )})\\bigg({\\sqrt{3}\\above{1pt}4}\\bigg)} or \\bold{${evalInDecimals(
            area
          )}}`
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
          `We know that \\bold{Area(A)} of the  \\bold{Equilateral Triangle} is given as `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A=\\bigg({\\sqrt{3}\\above{1pt}4}\\bigg)(a)^2}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where, \\bold a is the \\bold{Length of the Side} of the \\bold{Equilateral Triangle.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that \\space
       `),
        type: 'equation',
      },
      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(`First we calculate the value of`),
        type: 'equation',
      },
      {
        value: putSpace(`A = \\bigg({\\sqrt{3}\\above{1pt}4}\\bigg)(${a})^2`),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bigg({\\sqrt{3}\\above{1pt}4}\\bigg)({${valueToKatex(
            aSquare
          )}}) \\implies \\bold{${evalInDecimals(area)}}`
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

export default AreaOfEquilateralTriangle;
