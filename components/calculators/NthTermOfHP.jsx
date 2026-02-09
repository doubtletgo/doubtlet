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
import { pluralise } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
} from '../../helpers/matrixHelper';

const NthTermOfHP = () => {
  const [a, setA] = useLocalStorage('NthTermOfHP_a', '2');
  const [d, setD] = useLocalStorage('NthTermOfHP_d', '4');
  const [n, setN] = useLocalStorage('NthTermOfHP_n', '3');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('NthTermOfHP_equation', '');
  const [solution, setSolution] = useLocalStorage('NthTermOfHP_solution', '');
  const [result, setResult] = useLocalStorage('NthTermOfHP_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('NthTermOfHP_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NthTermOfHP_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('NthTermOfHP_isPointSame', false);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setN(vals.y1);
    if (vals.x2) setD(vals.x2);
  }, []);

  useEffect(() => {
    setIsPointSame(a == d && ((a == n) == d) == a);
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    isInvalid.current = [a, d, n].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempD = katexSimplifiedValue(d);
    const tempN = katexSimplifiedValue(n);
    const aValue = evalExpression(tempA);
    const dValue = evalExpression(tempD);
    const nValue = evalExpression(tempN);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`First Term a = \\bold{${a || '0'}}`),
          type: 'equation',
        },

        {
          value: putSpace(`Common difference d = \\bold{${d || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Value Of Term n = \\bold{${n || '0'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let subtract = evalExpression(`(${nValue}) - 1`);
    let multiple = evalExpression(`${subtract} * (${dValue})`);
    let res = evalExpression(`1 / (${aValue} + (${nValue} - 1) * ${dValue})`);
    let denominator = evalExpression(`${aValue} + (${nValue} - 1) * ${dValue}`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{${pluralise(
            nValue
          )}} Term \\bold{(T_{${nValue}})} Of Given \\bold{Harmonic Sequence} is \\bold{${
            valueToKatex(res)
              ? valueToKatex(res)
              : `{1 \\above{1pt} {${valueToKatex(denominator)}}}`
          }}`
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
          `We know that \\bold{N^{th} term (T_n)} of a \\bold{Harmonic sequence} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is given by the following formula \\bold{T_n = \\bigg\\lbrace{1 \\above{1pt}a+(n-1)(d)}\\bigg\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where a is the \\bold{First term} and \\bold{d} is the \\bold{Common difference}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`d = \\bold{${showVal(d, dValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`n = \\bold{${showVal(n, nValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`After putting the values in the formula`),
        type: 'equation',
      },
      {
        value: putSpace(`T_{${n}} = {1 \\above{1pt}{${a}}+({${n}}-1)*{${d}}}`),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `T_{${n}} = {1 \\above{1pt}{${a}}+${valueToKatex(subtract)}*{${d}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `T_{${n}} = {1 \\above{1pt}{${a}}+${valueToKatex(multiple)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `T_{${n}} = \\bold{${
            valueToKatex(res)
              ? valueToKatex(res)
              : `{1 \\above{1pt} ${evalInDecimals(denominator)}}`
          }}`
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
  }, [a, d, n, showSteps]);

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
    mf3?.current.latex('');
    setD('');
    setN('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, d, n].some((v) => !!v || v == 0);
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setD}
                allowAlphabeticKeyboard={false}
                initialLatex={d}
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
                setValue={setN}
                allowAlphabeticKeyboard={false}
                initialLatex={n}
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
      <div className="mt-3 mb-1"></div>{' '}
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

export default NthTermOfHP;
