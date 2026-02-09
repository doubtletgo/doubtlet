'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  removeSymbol,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const ConcurrencyOfStraightLine = () => {
  const [a1, setA1] = useLocalStorage('ConcurrencyOfStraightLine_a1', '1');
  const [b1, setB1] = useLocalStorage('ConcurrencyOfStraightLine_b1', '2');
  const [c1, setC1] = useLocalStorage('ConcurrencyOfStraightLine_c1', '\\sqrt{1}');
  const [a2, setA2] = useLocalStorage('ConcurrencyOfStraightLine_a2', '1');
  const [b2, setB2] = useLocalStorage('ConcurrencyOfStraightLine_b2', 'e^5');
  const [c2, setC2] = useLocalStorage('ConcurrencyOfStraightLine_c2', '4');
  const [a3, setA3] = useLocalStorage('ConcurrencyOfStraightLine_a3', '2');
  const [b3, setB3] = useLocalStorage('ConcurrencyOfStraightLine_b3', '\\sqrt{1}');
  const [c3, setC3] = useLocalStorage('ConcurrencyOfStraightLine_c3', '8');
  const [result, setResult] = useLocalStorage('ConcurrencyOfStraightLine_result', undefined);
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('ConcurrencyOfStraightLine_equation', '');
  const [solution, setSolution] = useLocalStorage('ConcurrencyOfStraightLine_solution', '');
  const [showResult, setShowResult] = useLocalStorage('ConcurrencyOfStraightLine_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ConcurrencyOfStraightLine_showSteps', true);
  const [note, setNote] = useLocalStorage('ConcurrencyOfStraightLine_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA1(vals.x1);
    if (vals.y1) setB1(vals.y1);
    if (vals.z1) setC1(vals.z1);
    if (vals.x2) setA2(vals.x2);
    if (vals.y2) setB2(vals.y2);
    if (vals.z2) setC2(vals.z2);
    if (vals.x3) setA3(vals.x3);
    if (vals.y3) setB3(vals.y3);
    if (vals.z3) setC3(vals.z3);
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
            `Find if the given three lines Line A(\\bold{ {${
              a1 || 'a'
            }}x ${addSymbol(b1)} {${removeSymbol(b1) || 'b'}}y ${addSymbol(
              c1
            )} {${removeSymbol(c1) || 'c'}} = 0}),`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` B (\\bold{{${a2 || 'a'}}x ${addSymbol(b2)} {${
              b2 || 'b'
            }}y ${addSymbol(c2)} {${c2 || 'c'}} = 0}) and C (\\bold{{${
              a3 || 'a'
            }}x ${addSymbol(b3)} {${removeSymbol(b3) || 'b'}}y ${addSymbol(
              c3
            )} {${removeSymbol(c3) || 'c'}} = 0})`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`are Concurrent or Not.`),
          type: 'equation',
        },
      ])
    );
  }, [a1, b1, c1, b2, c2, a3, a2, b3]);

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
            `Line A:{${a1 || 'a'}}x ${addSymbol(b1)} {${removeSymbol(
              b1 || 'b'
            )}}y ${addSymbol(c1)} {${removeSymbol(c1 || 'c')}} = 0`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line B: {${a2 || 'a'}}x ${addSymbol(b2)} {${removeSymbol(
              b2 || 'b'
            )}}y ${addSymbol(c2)} {${removeSymbol(c2 || 'c')}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line C: {${a3 || 'a'}}x ${addSymbol(b3)} {${removeSymbol(
              b3 || 'b'
            )}}y ${addSymbol(c3)} {${removeSymbol(c3 || 'c')}}`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [a1, b1, c1, b2, c2, a3, a2, b3].some((x) => !x);
    if (isInvalid.current) return;
    const tempA1 = katexSimplifiedValue(a1);
    const tempB1 = katexSimplifiedValue(b1);
    const tempC1 = katexSimplifiedValue(c1);
    const tempA2 = katexSimplifiedValue(a2);
    const tempB2 = katexSimplifiedValue(b2);
    const tempC2 = katexSimplifiedValue(c2);
    const tempA3 = katexSimplifiedValue(a3);
    const tempB3 = katexSimplifiedValue(b3);
    const tempC3 = katexSimplifiedValue(c3);

    const a1Value = evalExpression(tempA1);
    const b1Value = evalExpression(tempB1);
    const c1Value = evalExpression(tempC1);
    const a2Value = evalExpression(tempA2);
    const b2Value = evalExpression(tempB2);
    const c2Value = evalExpression(tempC2);
    const a3Value = evalExpression(tempA3);
    const b3Value = evalExpression(tempB3);
    const c3Value = evalExpression(tempC3);

    //variable
    const b2IntoC3 = evalExpression(`(${b2Value}) * (${c3Value})`);
    const c2IntoB3 = evalExpression(`(${c2Value}) * (${b3Value})`);
    const a2IntoC3 = evalExpression(`(${a2Value}) * (${c3Value})`);
    const c2IntoA3 = evalExpression(`(${c2Value}) * (${a3Value})`);
    const a2IntoB3 = evalExpression(`(${a2Value}) * (${b3Value})`);
    const b2IntoA3 = evalExpression(`(${b2Value}) * (${a3Value})`);

    const b2IntoC3Minusc2IntoB3 = evalExpression(
      `(${b2IntoC3}) - (${c2IntoB3})`
    );
    const a2IntoC3Minusc2IntoA3 = evalExpression(
      `(${a2IntoC3}) - (${c2IntoA3})`
    );
    const a2IntoB3Minusb2IntoA3 = evalExpression(
      `(${a2IntoB3}) - (${b2IntoA3})`
    );

    const a1IntoB2IntoC3Minusc2IntoB3 = evalExpression(
      `(${a1Value}) * (${b2IntoC3Minusc2IntoB3})`
    );
    const b1IntoA2IntoC3Minusc2IntoA3 = evalExpression(
      `(${b1Value}) * (${a2IntoC3Minusc2IntoA3})`
    );
    const c1IntoA2IntoB3Minusb2IntoA3 = evalExpression(
      `(${c1Value}) * (${a2IntoB3Minusb2IntoA3})`
    );

    const result = evalExpression(`(${a1IntoB2IntoC3Minusc2IntoB3}) -
      (${b1IntoA2IntoC3Minusc2IntoA3}) +
      (${c1IntoA2IntoB3Minusb2IntoA3})`);

    const compare = result === 0;

    const finalAnswer = [
      {
        value: putSpace(
          `The given three lines Line A(\\bold{ {${a1 || 'a'}}x ${addSymbol(
            b1
          )} {${removeSymbol(b1) || 'b'}}y ${addSymbol(c1)} {${
            removeSymbol(c1) || 'c'
          }} = 0}),`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` B (\\bold{{${a2}}x ${addSymbol(b2)} {${b2 || 'b'}}y ${addSymbol(
            c2
          )} {${c2 || 'c'}} = 0}) and C (\\bold{{${a3 || 'a'}}x ${addSymbol(
            b3
          )} {${removeSymbol(b3) || 'b'}}y ${addSymbol(c3)}{${
            removeSymbol(c3) || 'c'
          }}= 0})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`are ${compare ? `` : `\\bold{NOT}`} Concurrent.`),
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

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`We know that concurrency of given three straight`),
        type: 'equation',
      },
      {
        value: putSpace(`lines can be tested by finding the`),
        type: 'equation',
      },
      {
        value: putSpace(`determinant formed by the coefficients of `),
        type: 'equation',
      },
      {
        value: putSpace(`the equation of all three lines.`),
        type: 'equation',
      },
      {
        value: `\\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 
        \\\\ a_3 & b_3 & c_3 \\end{vmatrix} = 0 `,
        type: `equation`,
      },
      {
        value: putSpace(
          `If the value of the above determinant is \\bold{ZERO}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` then lines are Concurrent, else NOT`),
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
        value: putSpace(`Given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(a_1, b_1, c_1) = \\bigg(\\bold{{${showVal(
            a1,
            a1Value
          )}},  {${showVal(b1, b1Value)}},  {${showVal(c1, c1Value)}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(a_1, b_1, c_1) = \\bigg(\\bold{{${showVal(
            a2,
            a2Value
          )}},  {${showVal(b2, b2Value)}},  {${showVal(c2, c2Value)}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(a_1, b_1, c_1) = \\bigg(\\bold{{${showVal(
            a3,
            a3Value
          )}},  {${showVal(b3, b3Value)}},  {${showVal(c3, c3Value)}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above formula`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `\\begin{vmatrix} {${a1}} & {${b1}} & {${c1} }\\\\{ ${a2}} & {${b2}} & {${c2}} 
        \\\\ {${a3}} & {${b3}} & {${c3}} \\end{vmatrix} = 0 `,
        type: `equation`,
      },
      {
        value: `= ({${valueToKatex(a1Value)}}) \\{({${valueToKatex(
          b2Value
        )}})({${valueToKatex(c3Value)}}) - ({${valueToKatex(
          b3Value
        )}})({${valueToKatex(c2Value)}})\\} - ({${valueToKatex(
          b1Value
        )}}) \\{({${valueToKatex(a2Value)}})({${valueToKatex(
          c3Value
        )}}) - ({${valueToKatex(c2Value)}})({${valueToKatex(
          a3Value
        )}})\\} + ({${valueToKatex(c1Value)}}) \\{({${valueToKatex(
          a2Value
        )}})({${valueToKatex(b3Value)}}) - ({${valueToKatex(
          b2Value
        )}})({${valueToKatex(a3Value)}})\\}`,
        type: 'equation',
      },
      {
        value: `= ({${a1}}) ({${valueToKatex(b2IntoC3)}} ${minusSymbol(
          evalInDecimals(c2IntoB3)
        )} {${removeSymbol(
          valueToKatex(c2IntoB3)
        )}}) - (${b1}) ({${valueToKatex(a2IntoC3)}} ${minusSymbol(
          evalInDecimals(c2IntoA3)
        )} {${removeSymbol(valueToKatex(c2IntoA3))}}) + (${c1})({${valueToKatex(
          a2IntoB3
        )}} ${minusSymbol(evalInDecimals(b2IntoA3))} {${valueToKatex(
          removeSymbol(b2IntoA3)
        )}})`,
        type: 'equation',
      },
      {
        value: ` = ({${valueToKatex(a1Value)}})({${valueToKatex(
          b2IntoC3Minusc2IntoB3
        )}}) - ({${valueToKatex(b1Value)}})({${valueToKatex(
          a2IntoC3Minusc2IntoA3
        )}}) + ({${valueToKatex(c1Value)}})({${valueToKatex(
          a2IntoB3Minusb2IntoA3
        )}})`,
        type: 'equation',
      },
      {
        value: `= ({${valueToKatex(a1IntoB2IntoC3Minusc2IntoB3)}} ${minusSymbol(
          evalInDecimals(b1IntoA2IntoC3Minusc2IntoA3)
        )} {${valueToKatex(
          removeSymbol(b1IntoA2IntoC3Minusc2IntoA3)
        )}} ${addSymbol(
          evalInDecimals(c1IntoA2IntoB3Minusb2IntoA3)
        )}{ ${valueToKatex(
          removeSymbol(c1IntoA2IntoB3Minusb2IntoA3)
        )}}) = {${valueToKatex(result)}}`,
        type: 'equation',
      },
      {
        value: ` \\implies ${evalInDecimals(result)} ${
          compare ? `=` : `\\not =`
        } 0 `,
        type: 'equation',
      },
      {
        value: putSpace(
          `Hence, we can say that Given lines are ${
            compare ? `` : '\\bold{NOT}'
          } concurrent.`
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
  }, [a1, b1, c1, a2, b2, c2, a3, b3, c3, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA1('');
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    setB1('');
    setC1('');
    setA2('');
    setB2('');
    setC2('');
    setA3('');
    setB3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a1, b1, c1, b2, c2, a3, a2, b3].some((v) => !!v || v == 0);
  const hasAllValue = [a1, b1, c1, b2, c2, a3, a2, b3].every(
    (v) => !!v || v == 0
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
            <div className="col-2 text-left">Line A:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setA1}
              initialLatex={a1}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setB1}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
              initialLatex={b1}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setC1}
              initialLatex={c1}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Line B:</div>

            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setA2}
              initialLatex={a2}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setB2}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
              initialLatex={b2}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setC2}
              initialLatex={c2}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Line C:</div>

            <MathInput
              setMathfieldRef={(ref) => (mf7.current = ref)}
              setValue={setA3}
              initialLatex={a3}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf8.current = ref)}
              setValue={setB3}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
              initialLatex={b3}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf9.current = ref)}
              setValue={setC3}
              initialLatex={c3}
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
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
            />
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
          className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
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

export default ConcurrencyOfStraightLine;
