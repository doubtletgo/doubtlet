'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
} from '../../helpers/matrixHelper';

const SumOfFirstNTermsOfAP = () => {
  const [a, setA] = useLocalStorage('SumOfFirstNTermsOfAP_a', '1');
  const [d, setD] = useLocalStorage('SumOfFirstNTermsOfAP_d', '\\sqrt{9}');
  const [n, setN] = useLocalStorage('SumOfFirstNTermsOfAP_n', '20');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('SumOfFirstNTermsOfAP_equation', '');
  const [solution, setSolution] = useLocalStorage('SumOfFirstNTermsOfAP_solution', '');
  const [result, setResult] = useLocalStorage('SumOfFirstNTermsOfAP_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SumOfFirstNTermsOfAP_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SumOfFirstNTermsOfAP_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('SumOfFirstNTermsOfAP_isPointSame', false);
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
          value: putSpace(`First Term a = \\bold{${parseNumber(a) || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Common Difference d = \\bold{${parseNumber(d) || '0'}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Number Of Terms n = \\bold{${parseNumber(n) || '0'}}`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let twoA = evalExpression(`2 * (${aValue})`);
    let subtract = evalExpression(`${nValue} - 1`);
    let divide = evalExpression(`${nValue} / 2`);
    let multipleIn = evalExpression(`(${subtract}) * (${dValue})`);
    let add = evalExpression(`${twoA} + (${multipleIn})`);
    let multipleOut = evalExpression(`${divide} * (${add})`);
    let res = evalExpression(
      `${divide} * (2 * ${aValue} + ${subtract} * ${dValue})`
    );

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Sum} of first \\bold{{${n}}} Terms \\bold{S_{{${n}}}} of above given \\bold{Arithmetic sequence}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` is \\bold{{${valueToKatex(res)}}} or ${evalInDecimals(res)} .`
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
          'We know that \\bold {Sum of first n terms (S_n)}\\space in \\bold{Arithmetic}'
        ),
        type: 'equation',
      },
      {
        value: putSpace('\\bold{sequence} is represented by the'),
        type: 'equation',
      },
      {
        value: putSpace(
          `following formula \\bold {S_n = {{n\\above{1pt}2}\\Bigg\\lbrace (2a+(n-1)(d)}\\Bigg\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where a is the  \\bold{First term} and d is the \\bold{Common difference}.`
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
        value: putSpace(`d = \\bold{${showVal(d, dValue)}}   `),
        type: 'equation',
      },
      {
        value: putSpace(`n = \\bold{${showVal(n, nValue)}}`),
        type: 'equation',
      },
      {
        value: 'After putting the values in the formula',
        type: 'span',
      },
      {
        value: putSpace(
          `S_{{${n}}} = {{{${n}}\\above{1pt}2}\\Bigg\\lbrace (2*{${a}})+({${n}}-1)({${d}})}\\Bigg\\rbrace`
        ),
        type: `equation`,
      },
      {
        value: `After Solving`,
        type: `span`,
      },
      {
        value: putSpace(
          `S_{{${valueToKatex(n)}}} = {{${valueToKatex(
            divide
          )}}\\Big\\lbrace ({${valueToKatex(twoA)}})+({${valueToKatex(
            subtract
          )}})(${valueToKatex(d)})}\\Big\\rbrace`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `S_{${n}} = {{${valueToKatex(divide)}}({${valueToKatex(
            twoA
          )}}+{${valueToKatex(multipleIn)}})}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `S_{${n}} = {{${valueToKatex(divide)}}({${valueToKatex(add)}})}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `S_{${n}} = \\bold{{${valueToKatex(
            multipleOut
          )}}} or \\bold{{${evalInDecimals(multipleOut)}}}`
        ),
        type: `equation`,
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
          <div className="text-left mb-2">
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

export default SumOfFirstNTermsOfAP;
