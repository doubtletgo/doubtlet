'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol } from '../../helpers/decimal';
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

const DivisionOfTwoComplexNumbers = () => {
  const [a, setA] = useLocalStorage('DivisionOfTwoComplexNumbers_a', '1');
  const [b, setB] = useLocalStorage('DivisionOfTwoComplexNumbers_b', '3');
  const [c, setC] = useLocalStorage('DivisionOfTwoComplexNumbers_c', '2');
  const [d, setD] = useLocalStorage('DivisionOfTwoComplexNumbers_d', '4');
  const [equation, setEquation] = useLocalStorage('DivisionOfTwoComplexNumbers_equation', '');
  const [solution, setSolution] = useLocalStorage('DivisionOfTwoComplexNumbers_solution', '');
  const [result, setResult] = useLocalStorage('DivisionOfTwoComplexNumbers_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DivisionOfTwoComplexNumbers_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DivisionOfTwoComplexNumbers_showSteps', true);
  const [note, setNote] = useLocalStorage('DivisionOfTwoComplexNumbers_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setA(vals.x1);
    if (vals.x2) setC(vals.x2);
    if (vals.y1) setB(vals.y1);
    if (vals.y2) setD(vals.y2);
  }, []);

  const isInvalid = !(a && b && c && d);
  const tempA = convertFromLatex(a);
  const tempB = convertFromLatex(b);
  const tempC = convertFromLatex(c);
  const tempD = convertFromLatex(d);
  const aValue = evalExpression(tempA);
  const bValue = evalExpression(tempB);
  const cValue = evalExpression(tempC);
  const dValue = evalExpression(tempD);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{division} of the given Complex Number`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Z_1(\\bold{{${a || 'a'}} ${addSymbol(
              evalInDecimals(tempB)
            )} {${removeSymbol(b || 'b')}}i}) by Z_2 (\\bold{{${
              c || 'c'
            }} ${addSymbol(evalInDecimals(tempD))} {${removeSymbol(
              d || 'd'
            )}}i}).`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, c, b, d]);

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
            `Complex Number Z_1: \\bigg<\\bold{{${a || 'a'}} ${addSymbol(
              evalInDecimals(tempB)
            )} {${removeSymbol(b || 'b')}}i}\\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Z_2 \\bigg<\\bold{{${c || 'c'}} ${addSymbol(
              evalInDecimals(tempD)
            )} {${removeSymbol(d || 'd')}}i}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    //variables
    const x1MulY1 = evalExpression(`((${aValue})*(${cValue}))`);
    const x2MulY2 = evalExpression(`((${bValue})*(${dValue}))`);
    const sub = evalExpression(`(${x1MulY1})-(${x2MulY2})`);
    if (isInvalid || !aValue || !bValue || !cValue || !dValue || !sub) return;
    //
    const aIntoC = evalExpression(`((${aValue}) * (${cValue}))`);
    const cIntoD = evalExpression(`((${bValue}) * (${dValue}))`);
    const add1 = evalExpression(`((${aIntoC}) + (${cIntoD}))`);

    const bIntoC = evalExpression(`((${bValue}) * (${cValue}))`);
    const aIntoD = evalExpression(`((${aValue}) * (${dValue}))`);
    const sub1 = evalExpression(`(${bIntoC}) - (${aIntoD})`);

    const cSqr = evalExpression(`(${cValue})^2`);
    const dSqr = evalExpression(`(${dValue})^2`);
    const sqrAdd = evalExpression(`(${cSqr}) + (${dSqr})`);

    const resLeftSide = evalExpression(`(${add1})/(${sqrAdd})`);
    const resRightSide = evalExpression(`(${sub1})/(${sqrAdd})`);

    //Final Answer
    const finalAnswer = [
      {
        value: putSpace(
          `The division result of Complex Numbers (\\bold{{${
            a || 'a'
          }} ${addSymbol(evalInDecimals(tempB))} {${removeSymbol(
            b || 'b'
          )}}i}) by (\\bold{{${c || 'c'}} ${addSymbol(
            evalInDecimals(tempD)
          )} {${removeSymbol(d || 'd')}}i})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is {${valueToKatex(resLeftSide)}}${addSymbol(
            evalInDecimals(resRightSide)
          )}{${valueToKatex(
            removeSymbol(resRightSide)
          )}}i or \\bold{${evalInDecimals(resLeftSide)}} ${addSymbol(
            evalInDecimals(resRightSide)
          )} \\bold{${removeSymbol(evalInDecimals(resRightSide))}}i`
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
          `To divide two complex numbers, we will multiply and divide`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`by the conjugate of denominator.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `{(a + ib)\\above{1pt}(c + id)} = {(a + ib)(c - id)\\above{1pt}(c + id)(c-id)} = {(ac + bd)+(bc - ad)\\above{1pt}(c^2 + d^2)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` = {(ac + bd)\\above{1pt}(c^2 + d^2)}+ i {(bc - ad)\\above{1pt}(c^2 + d^2)}`
        ),
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
        value: putSpace(`\\bold{Given input values}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `z_1 = a + ib =( {${valueToKatex(aValue)}}) + ({${valueToKatex(
            b,
            bValue
          )}})i then on comparing a = {${valueToKatex(
            aValue
          )}}, b = {${valueToKatex(b, bValue)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `z_2 = c + id =   ({${valueToKatex(cValue)}})+({${valueToKatex(
            d,
            dValue
          )}})i then on comparing c = {${valueToKatex(
            cValue
          )}} , d = {${valueToKatex(d, dValue)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now to find {Z_1 \\above{1pt} Z_2} we need to calculate values of`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` (ac + bd), (bc - ad)\\& (c^2 + d^2) then`),
        type: 'equation',
      },

      {
        value: putSpace(
          `ac+bd = ({${valueToKatex(aValue)}}) ({${valueToKatex(
            cValue
          )}}) + ({${valueToKatex(bValue)}})({${valueToKatex(
            dValue
          )}}) =   ({${valueToKatex(aIntoC)}}) + ({${valueToKatex(
            cIntoD
          )}}) = {${valueToKatex(add1)}}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `bc-ad = ({${valueToKatex(bValue)}}) ({${valueToKatex(
            cValue
          )}}) - ({${valueToKatex(aValue)}})({${valueToKatex(
            dValue
          )}}) = ({${valueToKatex(bIntoC)}}) - ({${valueToKatex(
            aIntoD
          )}})  = {${valueToKatex(sub1)}} `
        ),
        type: 'equation',
      },
      //   {
      //     value: `<a href="/calculator/matrix-of-cofactors/?a=${frstMatrix}&b=${row}"  target="_blank">to see Steps click here</a>`,
      //     type: "span",
      //   },
      {
        value: putSpace(
          `c^2+d^2 =({${valueToKatex(cValue)}})^2 +({${valueToKatex(
            dValue
          )}})^2 = ({${valueToKatex(cSqr)}})+({${valueToKatex(
            dSqr
          )}}) = {${valueToKatex(sqrAdd)}} `
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now by using the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `= {{${valueToKatex(aValue)}}+{${valueToKatex(
            bValue
          )}}i\\above{1pt} {${valueToKatex(cValue)}} + {${valueToKatex(
            dValue
          )}}i} = {{${valueToKatex(add1)}}\\above{1pt} {${valueToKatex(
            sqrAdd
          )}}} + {{${valueToKatex(sub1)}}\\above{1pt}{${valueToKatex(
            sqrAdd
          )}}}i  = {${valueToKatex(resLeftSide)}}${addSymbol(
            evalInDecimals(resRightSide)
          )}{${valueToKatex(removeSymbol(resRightSide))}}i`
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
  }, [a, c, b, d, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    mf1.current.latex('');
    mf2.current.latex('');
    mf3.current.latex('');
    mf4.current.latex('');

    setA('');
    setB('');
    setC('');
    setD('');
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
        </div>{' '}
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Complex Number Z<sub>1</sub>:
            </div>
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
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                initialLatex={b}
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
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-3"></div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Complex Number Z<sub>2</sub>:
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC}
                initialLatex={c}
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
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setD}
                initialLatex={d}
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
                allowAlphabeticKeyboard={false}
              />
            </div>
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

export default DivisionOfTwoComplexNumbers;
