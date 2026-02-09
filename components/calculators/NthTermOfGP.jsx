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
import { parseNumber } from '../../helpers/decimal';
import { pluralise } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
} from '../../helpers/matrixHelper';

const NthTermOfGP = () => {
  const [a, setA] = useLocalStorage('NthTermOfGP_a', '\\pi');
  const [r, setR] = useLocalStorage('NthTermOfGP_r', '6');
  const [n, setN] = useLocalStorage('NthTermOfGP_n', '4');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('NthTermOfGP_equation', '');
  const [solution, setSolution] = useLocalStorage('NthTermOfGP_solution', '');
  const [result, setResult] = useLocalStorage('NthTermOfGP_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('NthTermOfGP_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NthTermOfGP_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('NthTermOfGP_isPointSame', false);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setN(vals.y1);
    if (vals.x2) setR(vals.x2);
  }, []);

  useEffect(() => {
    setIsPointSame(a == r && ((a == n) == r) == a);
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    isInvalid.current = [a, r, n].some((x) => !x);
    if (isInvalid.current) return;
    const tempA = katexSimplifiedValue(a);
    const tempR = katexSimplifiedValue(r);
    const tempN = katexSimplifiedValue(n);
    const aValue = evalExpression(tempA);
    const rValue = evalExpression(tempR);
    const nValue = evalExpression(tempN);
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          First Term a = \\bold{${parseNumber(a) || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Common Ratio r = \\bold{${parseNumber(r) || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Value Of Term n = \\bold{${parseNumber(n) || '0'}}`),
          type: 'equation',
        },
      ])
    );
    let subtract = evalExpression(`(${nValue})- 1`);
    let power = evalExpression(`${rValue}^(${subtract})`);
    let multiple = evalExpression(`${aValue} * (${power})`);
    let answer = evalExpression(`${aValue} * ${rValue}^(${nValue} - 1)`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{${pluralise(n)}} Term \\bold{(T_{${parseNumber(
            n
          )}})} of given \\bold{Geometric Sequence} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{${valueToKatex(answer)}} or ${evalInDecimals(answer)}`
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
          `We know that \\bold{N^{th} term(T_n)} of a \\bold{Geometric sequence} is given a`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `by the following formula \\bold{T_n =\\lbrace a * r^{(n-1)}\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where \\bold a is the \\bold{First Term} and r is the \\bold{Common Ratio}.`
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
        value: putSpace(`r = \\bold{${showVal(r, rValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`n = \\bold{${showVal(n, nValue)}}`),
        type: 'equation',
      },
      {
        value: `After putting the values in the formula`,
        type: 'span',
      },
      {
        value: putSpace(`T_{{${n}}} = {${a}}*{${r}}^{({${n}}-1)}`),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(`T_{${n}} = ${a}*${r}^{${valueToKatex(subtract)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`T_{${n}} = ${a}*{${valueToKatex(power)}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `T_{${n}} =\\bold{${valueToKatex(
            multiple
          )}}  or \\bold{{${evalInDecimals(multiple)}}}`
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
  }, [a, r, n, showSteps]);

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
    setR('');
    setN('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, r, n].some((v) => !!v || v == 0);
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

export default NthTermOfGP;
