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
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  valueToKatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { addSymbol } from '../../helpers/decimal';

const FootOfPerpendicularToGivenLine = () => {
  const [a, setA] = useLocalStorage('FootOfPerpendicularToGivenLine_a', '5');
  const [b, setB] = useLocalStorage('FootOfPerpendicularToGivenLine_b', '\\sqrt{7}');
  const [p, setP] = useLocalStorage('FootOfPerpendicularToGivenLine_p', '2');
  const [c, setC] = useLocalStorage('FootOfPerpendicularToGivenLine_c', '\\sqrt{9}');
  const [q, setQ] = useLocalStorage('FootOfPerpendicularToGivenLine_q', '2');
  const [equation, setEquation] = useLocalStorage('FootOfPerpendicularToGivenLine_equation', '');
  const [solution, setSolution] = useLocalStorage('FootOfPerpendicularToGivenLine_solution', '');
  const [showResult, setShowResult] = useLocalStorage('FootOfPerpendicularToGivenLine_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FootOfPerpendicularToGivenLine_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('FootOfPerpendicularToGivenLine_isPointSame', false);
  const [result, setResult] = useLocalStorage('FootOfPerpendicularToGivenLine_result', '');
  const [note, setNote] = useLocalStorage('FootOfPerpendicularToGivenLine_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setB(vals.y1);
    if (vals.z1) setC(vals.y2);
    if (vals.y3) setP(vals.y3);
    if (vals.z3) setQ(vals.z3);
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
            `Find the coordinates of the foot of perpendicular Q (h, k) from`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Point P (\\bold{${p || 'p'},  ${q || 'q'}})  Line L: (${
              a || 'a'
            }x ${addSymbol(b || 'b')} ${removeSymbol(b || 'b')}y ${addSymbol(
              c
            )} ${removeSymbol(c || 'c')} =0) `
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, p, q]);
  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Line L: (${a || 'a'}x ${addSymbol(b)} ${
              removeSymbol(b) || 'b'
            }y ${addSymbol(c)} ${removeSymbol(c) || 'c'} =0)`
          ),
          type: `equation`,
        },

        {
          value: putSpace(`Point P: (${p || 'p'}, ${q || 'q'})`),
          type: `equation`,
        },
      ])
    );

    const isInvalid = [a, b, c, p, q].some((x) => !x);
    setIsPointSame(a == b && b == c && p == q && q == p);

    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempP = katexSimplifiedValue(p);
    const tempC = katexSimplifiedValue(c);
    const tempQ = katexSimplifiedValue(q);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const pValue = evalExpression(tempP);
    const cValue = evalExpression(tempC);
    const qValue = evalExpression(tempQ);

    // variables
    const numerator = evalExpression(
      `(-1) * ((${aValue})*(${pValue}) + ((${bValue})*(${qValue})) + (${cValue}))`
    );
    const denominator = evalExpression(`(${aValue}^2) + (${bValue}^2)`);
    const h = evalExpression(
      `((${numerator}) * (${aValue})) + ((${pValue}) * (${denominator}))`
    );
    const k = evalExpression(
      `((${numerator}) * (${bValue})) + ((${qValue}) * (${denominator}))`
    );

    let numeratorIntoA = evalExpression(`(${numerator})*(${aValue})`);
    let numeratorIntoB = evalExpression(`(${numerator})*(${bValue})`);

    const hDiviedDenominator = evalInDecimals(`(${h}) / (${denominator})`);
    const kDiviedDenominator = evalInDecimals(`(${k}) / (${denominator})`);
    const finalAnswer = [
      {
        value: putSpace(
          `Find the coordinates of the foot of perpendicular Q (h, k) from`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Point P (\\bold{${p || 'p'},  ${q || 'q'}}) to  Line L (${
            a || 'a'
          }x ${addSymbol(b || 'b')} ${removeSymbol(b || 'b')}y ${addSymbol(
            c
          )} ${removeSymbol(c || 'c')} =0)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Q(h,k) = \\bigg({\\bold{{${valueToKatex(
            h
          )}}\\above{1pt}{${valueToKatex(denominator)}}}, {{${valueToKatex(
            k
          )}}\\above{1pt}{${valueToKatex(
            denominator
          )}}}} \\bigg)  OR (${hDiviedDenominator}, ${kDiviedDenominator})`
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'span',
        value: '<b>Answer</b>',
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(equations);
    setResult(eqRender);

    if (isInvalid) return;
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that the \\bold{coordinates of the foot of perpendicular}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Q (h, k)}from the Point \\bold{P (p, q)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `to the  \\bold{Line (ax + by + c = 0)} is given by the formula below`
        ),
        type: 'equation',
      },
      {
        value: `{h-p \\above{1pt}a}={k-q\\above{1pt}b}={-(ap+bq+c)\\above{1pt} (a^2+b^2)}`,
        type: 'equation',
      },
      {
        value: `Step-1`,
        className: 'text-decoration-underline',
        type: `span`,
      },
      {
        value: `From the above input it is given that `,
        type: 'span',
      },
      {
        value: putSpace(
          `(a, b, c)=({${showVal(a, aValue)}}, {${showVal(
            b,
            bValue
          )}}, {${showVal(c, cValue)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(p, q)=({${showVal(p, pValue)},${showVal(q, qValue)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above-given formula`),
        type: 'equation',
      },
      {
        value: `Step-2`,
        className: 'text-decoration-underline',
        type: `span`,
      },
      {
        value: `{h-${p} \\above{1pt}${a}}={k-${q}\\above{1pt}${b}}={-\\lbrace(${a})(${p})+(${b})(${q})+(${c}) \\rbrace \\above{1pt} ((${a})^2+(${b})^2)}`,
        type: 'equation',
      },
      {
        value: `{h-${p} \\above{1pt}${a}}={k-${q}\\above{1pt}${b}}={{${valueToKatex(
          numerator
        )}} \\above{1pt} {${valueToKatex(denominator)}}}`,
        type: 'equation',
      },
      {
        value: `h=\\bigg({ {${valueToKatex(
          numeratorIntoA
        )}}\\above{1pt}{${valueToKatex(
          denominator
        )}}}+${p} \\bigg)={{${valueToKatex(h)}}\\above{1pt}{${valueToKatex(
          denominator
        )}}}`,
        type: 'equation',
      },
      {
        value: `k=\\bigg({{${valueToKatex(
          numeratorIntoB
        )}}\\above{1pt}{${valueToKatex(
          denominator
        )}}}+${q}\\bigg)={{${valueToKatex(k)}}\\above{1pt}{${valueToKatex(
          denominator
        )}}}`,
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
  }, [a, b, c, p, q, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    setA('');
    setB('');
    setC('');
    setP('');
    setQ('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, p, q].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, p, q].every((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point A</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                allowAlphabeticKeyboard={false}
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
                initialLatex={a}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                allowAlphabeticKeyboard={false}
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
                initialLatex={b}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC}
                allowAlphabeticKeyboard={false}
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
                initialLatex={c}
              />{' '}
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point C</div>
            <div className="col-4-5">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setP}
                allowAlphabeticKeyboard={false}
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
                initialLatex={p}
              />{' '}
            </div>
            <div className="col-4-5">
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setQ}
                allowAlphabeticKeyboard={false}
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
                initialLatex={q}
              />{' '}
            </div>
          </div>

          <Equation equation={equation} className="border-primary mt-3" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>

      {hasAllValue &&
        (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        ) : (
          <div>
            <strong>Note :-</strong> Since initial & final points are the same
            hence points are <strong>Coincident</strong> and distance between
            two coincident points is always <strong>ZERO</strong>.
          </div>
        ))}
      {hasValue && (
        <button
          className="default-btn rounded-pill mt-2 px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
        <>
          <Equation className="mt-3" equation={result} />
          {
            <button
              className="default-btn mt-3 rounded-pill px-5 btn-blue"
              onClick={toggleSteps}
            >
              Show Steps
            </button>
          }
        </>
      )}
      {hasAllValue && !isPointSame && showSteps && (
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

export default FootOfPerpendicularToGivenLine;
