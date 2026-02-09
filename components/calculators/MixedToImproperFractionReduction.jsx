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
  convertIntoLatex,
} from '../../helpers/matrixHelper';

const MixedToImproperFractionReduction = () => {
  const [a, setA] = useLocalStorage('MixedToImproperFractionReduction_a', '\\sqrt{3}');
  const [l, setL] = useLocalStorage('MixedToImproperFractionReduction_l', '\\frac{7}{2}');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('MixedToImproperFractionReduction_equation', '');
  const [solution, setSolution] = useLocalStorage('MixedToImproperFractionReduction_solution', '');
  const [result, setResult] = useLocalStorage('MixedToImproperFractionReduction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MixedToImproperFractionReduction_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('MixedToImproperFractionReduction_showSteps', true);
  const [note, setNote] = useLocalStorage('MixedToImproperFractionReduction_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setA(convertIntoLatex(vals.x1));
    if (vals.x2) setL(convertIntoLatex(vals.x2));
  }, []);

  let solveValue = katexSimplifiedValue(l);
  let [b, c] = solveValue.split('/');
  //Question
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Reduce the given \\bold{mixed} fraction `),
          type: 'equation',
        },
        {
          value: putSpace(
            `Mixed Fraction \\bigg<{${a || '1'}}, {${l || '1'}} \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`to an \\bold{Improper} fraction`),
          type: 'equation',
        },
      ])
    );
  }, [l, a]);

  useEffect(() => {
    isInvalid.current = [a, l].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempL = katexSimplifiedValue(l);
    const tempB = katexSimplifiedValue(b || '1');
    const tempC = katexSimplifiedValue(c || '1');

    const aValue = evalExpression(tempA);
    const lValue = evalExpression(tempL);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Mixed Fraction \\bigg<{${a || '1'}}, {${l || '1'}} \\bigg>`
          ),
          type: `equation`,
        },
      ])
    );
    if (isInvalid.current) return;
    const res = evalInDecimals(
      evalExpression(`(${aValue})*(${cValue})+${bValue}`)
    );
    const fRes = evalInDecimals(`(${res})/(${cValue})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The Reduction of mixed fraction  ${valueToKatex(
            aValue
          )}.${valueToKatex(lValue)}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`to an improper fraction is`),
        type: `equation`,
      },
      {
        value: putSpace(` {${res}\\above{1pt}${cValue}} or ${fRes}`),
        type: `equation`,
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
          `A mixed fraction is always represented in the form of a{b \\above{1pt}c} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`where a, b and c are integers, b < c and a, c ≠ 0.`),
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
        value: putSpace(
          `Given fraction =  {${valueToKatex(aValue)}}.{${valueToKatex(
            lValue
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Given input is  a = {${showVal(a, aValue)}}, b = {${showVal(
            bValue || '1'
          )}}, c= {${showVal(cValue) || '1'}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Formula = (a)(c) + b`),
        type: 'equation',
      },

      {
        value: putSpace(
          `Now we have to convert the above given mixed fraction`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`to an improper fraction in the step below`),
        type: 'equation',
      },

      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Formula = {(${valueToKatex(aValue)}}).({${valueToKatex(
            cValue
          )}})+{${valueToKatex(bValue)}} = ${res}  `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Then divide the result by c `),
        type: 'equation',
      },
      {
        value: putSpace(
          `So improper fraction is {{${res}}\\above{1pt}{${cValue}}}`
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
  }, [a, b, c, l, showSteps]);

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
    setL('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, l, c, b].some((v) => !!v || v == 0);
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
            Your input can be in form of only positive integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Fraction:- </div>
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
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setL}
                allowAlphabeticKeyboard={false}
                initialLatex={l}
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
export default MixedToImproperFractionReduction;
