'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  showVal,
  removeSymbol,
  evalInDecimals,
  evalExpression,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import { MathField } from '@/types/mathfield.types';

const AngleBetweenLineAndPlane = () => {
  const [a, setA] = useLocalStorage('AngleBetweenLineAndPlane_a', '\\sqrt{4}');
  const [b, setB] = useLocalStorage('AngleBetweenLineAndPlane_b', '5');
  const [c, setC] = useLocalStorage('AngleBetweenLineAndPlane_c', '6');
  const [d, setD] = useLocalStorage('AngleBetweenLineAndPlane_d', '5');
  const [e, setE] = useLocalStorage('AngleBetweenLineAndPlane_e', '2.4');
  const [f, setF] = useLocalStorage('AngleBetweenLineAndPlane_f', '7');
  const [p, setP] = useLocalStorage('AngleBetweenLineAndPlane_p', '2');
  const [q, setQ] = useLocalStorage('AngleBetweenLineAndPlane_q', '8');
  const [r, setR] = useLocalStorage('AngleBetweenLineAndPlane_r', '7');
  const [s, setS] = useLocalStorage('AngleBetweenLineAndPlane_s', '3');
  const [equation, setEquation] = useLocalStorage('AngleBetweenLineAndPlane_equation', '');
  const [solution, setSolution] = useLocalStorage('AngleBetweenLineAndPlane_solution', '');
  const [result, setResult] = useLocalStorage('AngleBetweenLineAndPlane_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AngleBetweenLineAndPlane_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AngleBetweenLineAndPlane_showSteps', true);
  const [note, setNote] = useLocalStorage('AngleBetweenLineAndPlane_note', undefined);
  const mf1 = useRef<MathField | null>(null);
  const mf2 = useRef<MathField | null>(null);
  const mf3 = useRef<MathField | null>(null);
  const mf4 = useRef<MathField | null>(null);
  const mf5 = useRef<MathField | null>(null);
  const mf6 = useRef<MathField | null>(null);
  const mf7 = useRef<MathField | null>(null);
  const mf8 = useRef<MathField | null>(null);
  const mf9 = useRef<MathField | null>(null);
  const mf10 = useRef<MathField | null>(null);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the Acute Angle(θ) between the Line `),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L:− {x ${minusSymbol(a || 'a')} ${removeSymbol(
              a || 'a'
            )}\\above{1pt} ${d || 'd'}} = {y ${minusSymbol(b)} ${removeSymbol(
              b || 'b'
            )}\\above{1pt} ${e || 'e'}} ={z ${minusSymbol(c)} ${removeSymbol(
              c || 'c'
            )}\\above{1pt} ${f || 'f'}} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `and Plan ${removeSymbol(p || 'p')}x ${addSymbol(q)} ${removeSymbol(
              q || 'q'
            )}y ${addSymbol(r)} ${removeSymbol(r || 'r')}z ${addSymbol(
              r
            )} ${removeSymbol(s || 's')} = 0`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d, e, f, p, q, r, s]);

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
            `Line L:− {x ${minusSymbol(a || 'a')} ${removeSymbol(
              a || 'a'
            )}\\above{1pt} ${d || 'd'}} = {y ${minusSymbol(b)} ${removeSymbol(
              b || 'b'
            )}\\above{1pt} ${e || 'e'}} ={z ${minusSymbol(c)} ${removeSymbol(
              c || 'c'
            )}\\above{1pt} ${f || 'f'}} `
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b, c, d, e, f, p, q, r, s].some((x) => !x && +x != 0);
    const tempA = convertFromLatex(a);
    const tempB = convertFromLatex(b);
    const tempC = convertFromLatex(c);
    const tempD = convertFromLatex(d);
    const tempE = convertFromLatex(e);
    const tempF = convertFromLatex(f);
    const tempP = convertFromLatex(p);
    const tempQ = convertFromLatex(q);
    const tempR = convertFromLatex(r);
    const tempS = convertFromLatex(s);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    const eValue = evalExpression(tempE);
    const fValue = evalExpression(tempF);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);
    const sValue = evalExpression(tempS);

    if (isInvalid) return;

    const pIntoD = evalExpression(`${pValue} * ${dValue}`);
    const qIntoe = evalExpression(`${qValue} * ${eValue}`);
    const rIntoF = evalExpression(`${rValue} * ${fValue}`);
    const pSqr = evalExpression(`${pValue} ^ 2`);
    const qSqr = evalExpression(`${qValue} ^ 2`);
    const rSqr = evalExpression(`${rValue} ^ 2`);
    const dSqr = evalExpression(`${dValue} ^ 2`);
    const eSqr = evalExpression(`${eValue} ^ 2`);
    const fSqr = evalExpression(`${fValue} ^ 2`);

    const numerator = evalExpression(`(${pIntoD})+(${qIntoe})+(${rIntoF})`);
    const addLeftDenominatorSqr = evalExpression(
      `(${pSqr})+(${qSqr})+(${rSqr})`
    );
    const addRightDenominatorSqr = evalExpression(
      `(${dSqr})+(${eSqr})+(${fSqr})`
    );
    const addLeftFinal = evalExpression(addLeftDenominatorSqr);
    const addRightFinal = evalExpression(addRightDenominatorSqr);
    const bothSame =
      addLeftDenominatorSqr == addLeftFinal &&
      addRightDenominatorSqr == addRightFinal;
    const denominator = evalExpression(
      `${addRightDenominatorSqr} * ${addLeftDenominatorSqr}`
    );
    const denominatorSqr = evalInDecimals(
      evalExpression(`sqrt(${denominator})`)
    );
    const res = evalExpression(`${numerator}/${denominatorSqr}`);
    const radian = evalExpression(`acos(${res})`);
    const degree = evalExpression(`(${radian} * 180)*7/ 22`);
    const finalAnswer = [
      {
        value: putSpace(`Find the Acute Angle(θ) between the Line L `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Line L:− {x ${minusSymbol(a)} ${removeSymbol(
            a
          )}\\above{1pt} ${d}} = {y ${minusSymbol(b)} ${removeSymbol(
            b
          )}\\above{1pt} ${e}} ={z ${minusSymbol(c)} ${removeSymbol(
            c
          )}\\above{1pt} ${f}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `and Plan ${removeSymbol(p)}x ${addSymbol(q)} ${removeSymbol(
            q
          )}y ${addSymbol(r)} ${removeSymbol(r)}z ${addSymbol(
            r
          )} ${removeSymbol(s)} = 0`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\theta =cos^{-1}  ${evalInDecimals(
            radian
          )} radian= ${evalInDecimals(degree)} degree`
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
        value: putSpace(`We know that the Acute Angle(θ) between `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Line {x ${minusSymbol(a)} ${removeSymbol(
            a
          )}\\above{1pt} ${d}} = {y ${minusSymbol(b)} ${removeSymbol(
            b
          )}\\above{1pt} ${e}} ={z ${minusSymbol(c)} ${removeSymbol(
            c
          )}\\above{1pt} ${f}}} \\&`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` \\bold{Plane P: Ax + By + Cz + D = 0} `),
        type: 'equation',
      },
      {
        value: putSpace(`is represented by the angle between`),
        type: 'equation',
      },
      {
        value: putSpace(`angle between and normal vector to `),
        type: 'equation',
      },
      {
        value: putSpace(`the plane and can be calculated by using`),
        type: 'equation',
      },
      {
        value: putSpace(`the formula given below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta) =cos^{-1} \\lvert{Ad+Be+Cf \\above{1pt} \\sqrt{A^2+B^2+C^2} \\sqrt{d^2+e^2+f^2}}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Where ɵ is the acute angle between line and normal `),
        type: 'equation',
      },
      {
        value: putSpace(`to the given Plane.`),
        type: 'equation',
      },

      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: putSpace(
          `a=${showVal(a, aValue)}, b=${showVal(b, bValue)}, c=${showVal(
            c,
            cValue
          )}, d=${showVal(d, dValue)}, e=${showVal(e, eValue)}, f=${showVal(
            f,
            fValue
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A= ${showVal(p, pValue)}, B= ${showVal(q, qValue)}, C= ${showVal(
            r,
            rValue
          )}, D= ${showVal(s, sValue)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta) =cos^{-1} \\lvert{(${p})(${d})+(${q})(${e})+(${r})(${f}) \\above{1pt} \\sqrt{(${p})^2+(${q})^2+(${r})^2} \\sqrt{(${d})^2+(${e})^2+(${f})^2}}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta) =cos^{-1} \\lvert{({${valueToKatex(
            pIntoD
          )}})+({${valueToKatex(qIntoe)}})+({${valueToKatex(
            rIntoF
          )}}) \\above{1pt} \\sqrt{{${valueToKatex(pSqr)}}+{${valueToKatex(
            qSqr
          )}}+{${valueToKatex(rSqr)}}} \\sqrt{{${valueToKatex(
            dSqr
          )}}+{${valueToKatex(eSqr)}}+{${valueToKatex(fSqr)}}}}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta) =cos^{-1} \\lvert{({${valueToKatex(
            numerator
          )}}) \\above{1pt} \\sqrt{{${valueToKatex(
            addLeftDenominatorSqr
          )}}} \\sqrt{{${valueToKatex(addRightDenominatorSqr)}}}}\\rvert ${
            bothSame
              ? ''
              : `cos^{-1} \\lvert{({${valueToKatex(
                  numerator
                )}}) \\above{1pt} {{${addLeftFinal}}}* {{${addRightFinal}}}}\\rvert`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta) =cos^{-1} \\lvert{({${evalInDecimals(
            numerator
          )}}) \\above{1pt} {\\sqrt{${evalInDecimals(denominator)}}}}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{After solving}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\theta =cos^{-1}  ${evalInDecimals(
            radian
          )} radian= ${evalInDecimals(degree)} degree`
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
  }, [a, b, c, d, e, f, p, q, r, s, showSteps]);

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
    if (mf7.current) mf7?.current.latex('');
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
    if (mf10.current) mf10?.current.latex('');

    setA('');
    setB('');
    setC('');
    setD('');
    setE('');
    setF('');
    setP('');
    setQ('');
    setR('');
    setS('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d, e, p, q, r, s].some((v) => !!v || +v == 0);
  const hasAllValue = [a, b, c, d, e, , p, q, r, s].every(
    (v) => !!v || v == '0'
  );
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
            <div className="col-2 text-left">Point P:</div>
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf1.current = ref)}
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
              style={{
                width: '28%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf2.current = ref)}
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
              style={{
                width: '28%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf3.current = ref)}
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
              style={{
                width: '27%',
              }}
            />{' '}
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left"></div>
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf4.current = ref)}
              setValue={setD}
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
              initialLatex={d}
              style={{
                width: '28%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf5.current = ref)}
              setValue={setE}
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
              initialLatex={e}
              style={{
                width: '28%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf6.current = ref)}
              setValue={setF}
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
              initialLatex={f}
              style={{
                width: '27%',
              }}
            />{' '}
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Plane P:</div>
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf7.current = ref)}
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
              style={{
                width: '21%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf8.current = ref)}
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
              style={{
                width: '20%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf9.current = ref)}
              setValue={setR}
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
              initialLatex={r}
              style={{
                width: '21%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf10.current = ref)}
              setValue={setS}
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
              initialLatex={s}
              style={{
                width: '21%',
              }}
            />{' '}
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

export default AngleBetweenLineAndPlane;
