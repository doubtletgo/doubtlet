'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  evalInDecimals,
  convertFromLatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import MathInput from 'react-math-keyboard';
import { addSymbol } from '../../helpers/decimal';

const RealPartOfAComplexNumber = () => {
  const [a, setA] = useLocalStorage('RealPartOfAComplexNumber_a', '9');
  const [span, setB] = useLocalStorage('RealPartOfAComplexNumber_span', '2');
  const [equation, setEquation] = useLocalStorage('RealPartOfAComplexNumber_equation', '');
  const [solution, setSolution] = useLocalStorage('RealPartOfAComplexNumber_solution', '');
  const [result, setResult] = useLocalStorage('RealPartOfAComplexNumber_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('RealPartOfAComplexNumber_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RealPartOfAComplexNumber_showSteps', true);
  const [note, setNote] = useLocalStorage('RealPartOfAComplexNumber_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setB(vals.y1);
  }, []);

  const tempA = convertFromLatex(a);
  const tempB = convertFromLatex(span);
  const aValue = evalExpression(tempA);
  const bValue = evalExpression(tempB);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<span>Question</span>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Find the Real Part of the complex number Z = ({${
              a || 'a'
            }}${addSymbol(evalInDecimals(tempB))}{${removeSymbol(
              span || 'span'
            )}}i).`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, span]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: putSpace(
            `Z: \\bigg<\\bold{${a || 'a'}} ${addSymbol(
              evalInDecimals(tempB)
            )} \\bold{{${removeSymbol(span || 'span')}}}i\\bigg> `
          ),
          type: 'equation',
        },
      ])
    );
    //Final Answer
    const finalAnswer = [
      {
        value: putSpace(
          `The Real Part of the above given comlex number({${valueToKatex(
            aValue
          )}}  ${addSymbol(bValue)}{${removeSymbol(
            valueToKatex(bValue)
          )}}i) is \\bold{{${valueToKatex(aValue)}}}        `
        ),
        type: 'equation',
      },
    ];

    const equations = [
      {
        type: 'span',
        value: `<span>Answer</span>`,
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(equations);
    setResult(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<span>Step By Step Solution :-</span>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`A complex number is always written as the sum of its`),
        type: 'equation',
      },
      {
        value: putSpace(`real imaginary part and It is denoted by Z.`),
        type: 'equation',
      },
      {
        value: putSpace(` where Z = (a + ib) = Re(Z) + i Im(z)`),
        type: 'equation',
      },
      {
        value: putSpace(`then`),
        type: 'equation',
      },
      {
        value: putSpace(`Re(Z)= a`),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given input values are`,
        type: 'span',
      },
      {
        value: putSpace(
          `a = \\bold{{${valueToKatex(aValue)}}}, span = \\bold{{${valueToKatex(
            bValue
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`then by putting these values in the above formula`),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`Re(Z)= {${valueToKatex(aValue)}}`),
        type: 'equation',
      },
      'hr',
      {
        value: `Final Answer`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [a, span, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    setA('');
    setB('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [1].every((v) => (!!v && !isNaN(v)) || v === 0);

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
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Complex Number Z</div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                initialLatex={a}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                initialLatex={span}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={true}
              />
            </div>
            <div className="col-3"></div>
            <div className="col-3"></div>
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
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-2"
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
      {hasAllValue && showSteps && (
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

export default RealPartOfAComplexNumber;
