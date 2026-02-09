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
  katexSimplifiedValue,
  removeSymbol,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const PointOfIntersectionOfTwoLinesIn3D = () => {
  const [l, setL] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_l', '\\sqrt{4}');
  const [m, setM] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_m', '5');
  const [n, setN] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_n', '\\frac{2}{3}');
  const [a, setA] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_a', '5');
  const [b, setB] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_b', '2.4');
  const [c, setC] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_c', '7');
  const [p, setP] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_p', '2');
  const [q, setQ] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_q', '8');
  const [r, setR] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_r', '7');
  const [d, setD] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_d', '2');
  const [e, setE] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_e', '8');
  const [f, setF] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_f', '7');
  const [equation, setEquation] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_equation', '');
  const [solution, setSolution] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_solution', '');
  const [result, setResult] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_showSteps', true);
  const [note, setNote] = useLocalStorage('PointOfIntersectionOfTwoLinesIn3D_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();
  const mf10 = useRef();
  const mf11 = useRef();
  const mf12 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Point of Intersection} of the \\bold{Line}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L_1: {x ${minusSymbol(l)} {${removeSymbol(
              l || 'l'
            )}}\\above{1pt}{${a || 'a'}}} =  {y ${minusSymbol(
              m
            )} {${removeSymbol(m || 'm')}}\\above{1pt}{${
              b || 'b'
            }}} =  {z ${minusSymbol(n)} {${removeSymbol(
              n || 'n'
            )}}\\above{1pt}{${c || 'c'}}}`
          ),
          type: 'equation',
        },
        {
          value: `\\bold{\\&}`,
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L_1: {x ${minusSymbol(p)} {${removeSymbol(
              p || 'p'
            )}}\\above{1pt}{${d || 'd'}}} =  {y ${minusSymbol(
              q
            )} {${removeSymbol(q || 'q')}}\\above{1pt}{${
              e || 'e'
            }}} =  {z ${minusSymbol(r)} {${removeSymbol(
              r || 'r'
            )}}\\above{1pt}{${f || 'f'}}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d, e, f, l, m, n, p, q, r]);

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
            `Line L_1: {x ${minusSymbol(l)} {${removeSymbol(
              l || 'l'
            )}}\\above{1pt}{${a || 'a'}}} =  {y ${minusSymbol(
              m
            )} {${removeSymbol(m || 'm')}}\\above{1pt}{${
              b || 'b'
            }}} =  {z ${minusSymbol(n)} {${removeSymbol(
              n || 'n'
            )}}\\above{1pt}{${c || 'c'}}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L_1: {x ${minusSymbol(p)} {${removeSymbol(
              p || 'p'
            )}}\\above{1pt}{${d || 'd'}}} =  {y ${minusSymbol(
              q
            )} {${removeSymbol(q || 'q')}}\\above{1pt}{${
              e || 'e'
            }}} =  {z ${minusSymbol(r)} {${removeSymbol(
              r || 'r'
            )}}\\above{1pt}{${f || 'f'}}}`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b, c, d, e, f, l, m, n, p, q, r].some(
      (x) => !x && x != 0
    );
    const tempL = katexSimplifiedValue(l);
    const tempM = katexSimplifiedValue(m);
    const tempN = katexSimplifiedValue(n);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);
    const tempD = katexSimplifiedValue(d);
    const tempE = katexSimplifiedValue(e);
    const tempF = katexSimplifiedValue(f);

    const lValue = evalExpression(tempL);
    const mValue = evalExpression(tempM);
    const nValue = evalExpression(tempN);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);
    const dValue = evalExpression(tempD);
    const eValue = evalExpression(tempE);
    const fValue = evalExpression(tempF);
    if (isInvalid) return;

    const pSubL = evalExpression(`(${pValue}) - (${lValue})`);
    const qSubM = evalExpression(`(${qValue}) - (${mValue})`);
    const rSubN = evalExpression(`(${rValue}) - (${nValue})`);
    const x1 = a;
    const y1 = -d;
    const z1 = evalExpression(`(${lValue}) - (${pValue})`);
    const x2 = b;
    const y2 = -e;
    const z2 = m - q;
    const u = evalExpression(
      `(${x1} * (${z1} - ${z2}) - ${z1} * (${x1} - ${x2})) / (${y1} * (${x1} - ${x2}) - ${x1} * (${y1} - ${y2}))`
    );
    const k = evalExpression(
      `${u} * ${d} + (${pValue} - ${lValue}) / ${aValue} `
    );

    //condition to check whether the eq.3 satisfies or not
    const satisfy = k * c + Number(n) - u * f - r === 0;
    const finalAnswer = [
      {
        value: putSpace(`The Point of Intersection of the `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Line L_1: {x ${minusSymbol(l)} {${removeSymbol(
            l || 'l'
          )}}\\above{1pt}{${a || 'a'}}} =  {y ${minusSymbol(m)} {${removeSymbol(
            m || 'm'
          )}}\\above{1pt}{${b || 'b'}}} =  {z ${minusSymbol(n)} {${removeSymbol(
            n || 'n'
          )}}\\above{1pt}{${c || 'c'}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Line L_1: {x ${minusSymbol(p)} {${removeSymbol(
            p || 'p'
          )}}\\above{1pt}{${d || 'd'}}} =  {y ${minusSymbol(q)} {${removeSymbol(
            q || 'q'
          )}}\\above{1pt}{${e || 'e'}}} =  {z ${minusSymbol(r)} {${removeSymbol(
            r || 'r'
          )}}\\above{1pt}{${f || 'f'}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${valueToKatex(cValue)}}(${evalInDecimals(k)}) ${minusSymbol(
            evalInDecimals(fValue)
          )}{${valueToKatex(fValue)}}(${evalInDecimals(u)}) = {${valueToKatex(
            rSubN
          )}}  ${satisfy ? '  Holds true ' : 'does not Holds Ture '}`
        ),
        type: 'equation',
      },
      {
        value: `${
          satisfy
            ? `It means Given lines are INTERSECTING.`
            : `It means Given lines are <b>SKEW</b>, hence do not intersect`
        }`,
        type: 'span',
      },
      {
        value: `${
          satisfy
            ? `Hence point of intersection can be obtained by putting the values of k or µ  `
            : ``
        }`,
        type: 'span',
      },
      {
        value: `${
          satisfy
            ? `
          in the equations given in Step-1
          Put k = ${evalInDecimals(k)} `
            : ``
        }`,
        type: 'span',
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
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `We know that the <b>Point of Intersection </b> of Line 
      `,
        type: `span`,
      },
      {
        value: ` L_1  \\ {x-l \\above{1pt} a} ={x-m \\above{1pt} b}={x-n \\above{1pt} c}=k`,
        type: `equation`,
      },
      {
        value: `\\&`,
        type: `equation`,
      },
      {
        value: ` L_2  \\ {x-p \\above{1pt} d} ={x-q \\above{1pt} e}={x-r \\above{1pt} f}= µ`,
        type: `equation`,
      },

      {
        value: `is can be obtained by given method below M <br>
      Then General point on both the lines is represented as`,
        type: `span`,
      },
      'br',
      {
        value: `Point 1:  < x, y, z > = < (ka + l), (kb + m), (kc + n) >
      `,
        type: `span`,
      },
      'br',
      {
        value: `Point 2: < x, y, z > = < (µd + p), (µe + q), (µf + r) >`,
        type: `span`,
      },
      {
        value: `Given :-`,
        type: 'h6',
        className: 'text-decoration-underline',
      },

      {
        value: `(l, m , n) = \\bigg(\\bold{{${showVal(
          l,
          lValue
        )}}}, \\bold{{${showVal(m, mValue)}}}, \\bold{{${showVal(
          n,
          nValue
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(a, b, c) = \\bigg(\\bold{{${showVal(
          a,
          aValue
        )}}}, \\bold{{${showVal(b, bValue)}}}, \\bold{{${showVal(
          c,
          cValue
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(p, q, r) = \\bigg(\\bold{{${showVal(
          p,
          pValue
        )}}}, \\bold{{${showVal(q, qValue)}}}, \\bold{{${showVal(
          r,
          rValue
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(d, e, f) = \\bigg(\\bold{{${showVal(
          d,
          dValue
        )}}}, \\bold{{${showVal(e, eValue)}}}, \\bold{{${showVal(
          f,
          fValue
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `Step 1 :-`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `by putting above values we can obtain the Parametric form of general point on line`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `we can compare the coordinates of both of these points to obtain the value of k \\& µ`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Point 1:  < x, y, z > = < ({${valueToKatex(
          aValue
        )}}k ${addSymbol(evalInDecimals(lValue))} {${removeSymbol(
          valueToKatex(lValue)
        )}}), ({${valueToKatex(bValue)}}k ${addSymbol(
          evalInDecimals(mValue)
        )} {${removeSymbol(valueToKatex(mValue))}}), ({${valueToKatex(
          cValue
        )}}k ${addSymbol(evalInDecimals(nValue))} {${removeSymbol(
          valueToKatex(nValue)
        )}}) >
      `),
        type: `equation`,
      },
      {
        value: putSpace(
          `Point 2: < x, y, z > = < ({${valueToKatex(dValue)}}µ ${addSymbol(
            evalInDecimals(pValue)
          )} {${removeSymbol(valueToKatex(pValue))}}), ({${valueToKatex(
            eValue
          )}}µ  ${addSymbol(evalInDecimals(qValue))} {${removeSymbol(
            valueToKatex(qValue)
          )}}), ({${valueToKatex(fValue)}}µ ${addSymbol(
            evalInDecimals(rValue)
          )} {${removeSymbol(valueToKatex(rValue))}}) >`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `If the lines intersect, then they have a common point.`
        ),
        type: 'equation',
      },
      {
        value: `Step 2 :-`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(`So, for some values of k and μ, hence`),
        type: 'equation',
      },
      {
        value: putSpace(
          `we can compare the coordinates of both of these points to obtain the value of k \\& µ`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${valueToKatex(aValue)}}k ${addSymbol(
            evalInDecimals(lValue)
          )} {${removeSymbol(valueToKatex(lValue))}} = {${valueToKatex(
            dValue
          )}}µ ${addSymbol(evalInDecimals(pValue))} {${removeSymbol(
            valueToKatex(pValue)
          )}}   then   {${valueToKatex(aValue)}}k  ${minusSymbol(
            evalInDecimals(dValue)
          )} {${removeSymbol(valueToKatex(dValue))}}µ = {${valueToKatex(
            pSubL
          )}}……equation 1`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${valueToKatex(bValue)}}k ${addSymbol(
            evalInDecimals(mValue)
          )} {${removeSymbol(valueToKatex(mValue))}} = {${valueToKatex(
            eValue
          )}}µ ${addSymbol(evalInDecimals(mValue))} {${removeSymbol(
            valueToKatex(qValue)
          )}}   then  {${valueToKatex(bValue)}}k  ${minusSymbol(
            evalInDecimals(eValue)
          )} {${removeSymbol(valueToKatex(eValue))}}µ = {${valueToKatex(
            qSubM
          )}} ……equation 2`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` {${valueToKatex(cValue)}}k ${addSymbol(
            evalInDecimals(nValue)
          )} {${removeSymbol(valueToKatex(nValue))}} = {${valueToKatex(
            fValue
          )}}µ ${addSymbol(evalInDecimals(rValue))} {${removeSymbol(
            valueToKatex(rValue)
          )}}  then {${valueToKatex(cValue)}}k ${minusSymbol(
            evalInDecimals(fValue)
          )}{${removeSymbol(valueToKatex(fValue))}}µ = {${valueToKatex(
            rSubN
          )}} ……equation 3`
        ),
        type: 'equation',
      },
      {
        value: `Step 3 :-`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `by solving the equation no. 1 \\& 2 we can find the value of k \\& µ`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `k = {${evalInDecimals(k)}}, µ = {${evalInDecimals(u)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Both given lines will intersect only if above values of k \\& µ will satisfy the eq. 3`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${valueToKatex(cValue)}}(${evalInDecimals(k)}) ${minusSymbol(
            evalInDecimals(fValue)
          )}{${valueToKatex(fValue)}}(${evalInDecimals(u)}) = {${valueToKatex(
            rSubN
          )}}  ${satisfy ? '  Holds true ' : 'does not Holds Ture '}`
        ),
        type: 'equation',
      },
      {
        value: `${
          satisfy
            ? `It means Given lines are INTERSECTING.`
            : `It means Given lines are <b>SKEW</b>, hence do not intersect`
        }`,
        type: 'span',
      },
      {
        value: `${
          satisfy
            ? `Hence point of intersection can be obtained by putting the values of k or µ  `
            : ``
        }`,
        type: 'span',
      },
      {
        value: `${
          satisfy
            ? `
          in the equations given in Step-1
          Put k = ${evalInDecimals(k)} `
            : ``
        }`,
        type: 'span',
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
  }, [a, b, c, d, e, f, l, m, n, p, q, r, showSteps]);

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
    if (mf11.current) mf11?.current.latex('');
    if (mf12.current) mf12?.current.latex('');
    setL('');
    setM('');
    setN('');
    setA('');
    setB('');
    setC('');
    setP('');
    setQ('');
    setR('');
    setD('');
    setE('');
    setF('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [l, m, n, a, b, p, q, r].some((v) => !!v || v == 0);
  const hasAllValue = [l, m, n, a, b, , p, q, r].every((v) => !!v || v == 0);

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
            <div className="col-3 text-left">Vector A</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setL}
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
                initialLatex={l}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setM}
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
                initialLatex={m}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setN}
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
                initialLatex={n}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
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
                setMathfieldRef={(ref) => (mf5.current = ref)}
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
                setMathfieldRef={(ref) => (mf6.current = ref)}
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
            <div className="col-3 text-left">
              Line <sub>2</sub> :-
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf7.current = ref)}
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf8.current = ref)}
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf9.current = ref)}
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
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf10.current = ref)}
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
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf11.current = ref)}
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
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf12.current = ref)}
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
              />{' '}
            </div>
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

export default PointOfIntersectionOfTwoLinesIn3D;
