'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber, abs, addSymbol } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import {
  evalExpression,
  evalInDecimals,
  removeSymbol,
  valueToKatex,
  katexSimplifiedValue,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { getSearchParams, putSpace } from '../../helpers/general';
import KatexInput from '../common/katexInput';

const DistanceBetweenTwoParallelPlanes = () => {
  const [a, setA] = useLocalStorage('DistanceBetweenTwoParallelPlanes_a', '1');
  const [b, setB] = useLocalStorage('DistanceBetweenTwoParallelPlanes_b', '2');
  const [c, setC] = useLocalStorage('DistanceBetweenTwoParallelPlanes_c', '\\sqrt{1}');
  const [d1, setD1] = useLocalStorage('DistanceBetweenTwoParallelPlanes_d1', 'e^5');
  const [d2, setD2] = useLocalStorage('DistanceBetweenTwoParallelPlanes_d2', '4');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('DistanceBetweenTwoParallelPlanes_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceBetweenTwoParallelPlanes_solution', '');
  const [showResult, setShowResult] = useLocalStorage('DistanceBetweenTwoParallelPlanes_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceBetweenTwoParallelPlanes_showSteps', true);
  const [note, setNote] = useLocalStorage('DistanceBetweenTwoParallelPlanes_note', undefined);
  const [result, setResult] = useLocalStorage('DistanceBetweenTwoParallelPlanes_result', '');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.a) setA(vals.a);
    if (vals.b) setB(vals.b);
    if (vals.c) setC(vals.c);
    if (vals.d1) setD1(vals.d1);
    if (vals.d2) setD2(vals.d2);
  }, []);

  const tempB = katexSimplifiedValue(b);
  const tempC = katexSimplifiedValue(c);
  const tempD1 = katexSimplifiedValue(d1);
  const tempD2 = katexSimplifiedValue(d2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the Distance (d) between the Plane Plane`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Plane P_1: (\\bold{{${a || ''}}}x ${addSymbol(
              evalInDecimals(tempB)
            )}  \\bold{{${removeSymbol(b || '')}}}y   ${addSymbol(
              evalInDecimals(tempC)
            )} \\bold{{${removeSymbol(c || '')}}}z ${addSymbol(
              evalInDecimals(tempD1)
            )}  \\bold{{${removeSymbol(d1 || '1')}}} = 0)`
          ),
          type: 'equation',
        },
        {
          value: `<b>&</b>`,
          type: 'span',
        },
        {
          value: `Plane  P_2: (\\bold{{${a || ''}}}x ${addSymbol(
            evalInDecimals(tempB)
          )}  \\bold{{${removeSymbol(b || '')}}}y ${addSymbol(
            evalInDecimals(tempC)
          )} \\bold{{${removeSymbol(c || '')}}}z ${addSymbol(
            evalInDecimals(tempD2)
          )} \\bold{{${removeSymbol(d2 || '1')}}} = 0)`,
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d1, d2]);

  useEffect(() => {
    isInvalid.current = [a, b, c, d1].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD1 = katexSimplifiedValue(d1);
    const tempD2 = katexSimplifiedValue(d2);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const d1Value = evalExpression(tempD1);
    const d2Value = evalExpression(tempD2);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Plane P_1: \\bold{{${a || ''}}}x ${addSymbol(
              evalInDecimals(tempB)
            )}  \\bold{{${removeSymbol(b || '')}}}y   ${addSymbol(
              evalInDecimals(tempC)
            )} \\bold{{${removeSymbol(c || '')}}}z ${addSymbol(
              evalInDecimals(tempD1)
            )}  \\bold{{${removeSymbol(d1 || '1')}}} = 0`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Plane P_2:\\bold{{${a || ''}}}x ${addSymbol(
              evalInDecimals(tempB)
            )}  \\bold{{${removeSymbol(b || '')}}}y ${addSymbol(
              evalInDecimals(tempC)
            )} \\bold{{${removeSymbol(c || '')}}}z ${addSymbol(
              evalInDecimals(tempD2)
            )} \\bold{{${removeSymbol(d2 || '1')}}} = 0`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;
    const numeratorMinus = evalExpression(`${d1Value} - (${d2Value})`);
    const denominatorAdd = evalExpression(
      `${aValue}^2 + ${bValue}^2 + ${cValue}^2`
    );
    const denominatorRoot = evalExpression(`sqrt(${denominatorAdd})`);
    const divide = evalExpression(`${numeratorMinus} / ${denominatorRoot}`);

    const finalAnswer = [
      {
        value: putSpace(`The \\bold{Distance (d)} between the Plane`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` P_1 (\\bold{{${convertIntoLatex(aValue)}}}x ${addSymbol(
            evalInDecimals(tempB)
          )}  \\bold{{${removeSymbol(
            convertIntoLatex(bValue)
          )}}}y   ${addSymbol(evalInDecimals(tempC))} \\bold{{${removeSymbol(
            convertIntoLatex(cValue)
          )}}}z ${addSymbol(evalInDecimals(tempD1))}  \\bold{{${removeSymbol(
            convertIntoLatex(d1Value)
          )}}} = 0)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\& P_2 (\\bold{{${convertIntoLatex(aValue)}}}x ${addSymbol(
            evalInDecimals(tempB)
          )}  \\bold{{${removeSymbol(convertIntoLatex(bValue))}}}y ${addSymbol(
            evalInDecimals(tempC)
          )} \\bold{{${removeSymbol(convertIntoLatex(cValue))}}}z ${addSymbol(
            evalInDecimals(tempD2)
          )} \\bold{{${removeSymbol(convertIntoLatex(d2Value))}}} = 0) is`
        ),
        type: 'equation',
      },
      {
        value: `\\bold{{${valueToKatex(
          numeratorMinus
        )} \\above{1pt} \\sqrt{${valueToKatex(
          denominatorAdd
        )}}} \\space or \\space
        ${parseNumber(removeSymbol(valueToKatex(divide)))}} = ${evalInDecimals(
          divide || ' '
        )}`,
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

    if (!showSteps) return;
    setResult(renderSteps(equations));
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `We know that the <b>Distance (d)</b> between the`,
        type: 'span',
      },
      {
        value: putSpace(`P_1(ax + by + cz + d_1 = 0) \\&`),
        type: 'equation',
      },
      {
        value: putSpace(`P_2 (ax + by + cz + d_2 = 0) is given by the`),
        type: 'equation',
      },
      {
        value: putSpace(
          `formula below d = \\lvert{d_2 - d_1 \\above{1pt}\\sqrt{a^2+b^2+c^2}}\\rvert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that `),
        type: 'equation',
      },
      {
        value: `a = \\bold{${convertIntoLatex(
          aValue
        )}}, b = \\bold{${convertIntoLatex(
          b,
          bValue
        )}}, c = \\bold{${convertIntoLatex(
          cValue
        )}}, d_1 = \\bold{${convertIntoLatex(
          d1,
          d1Value
        )}}, d_2 = \\bold{${convertIntoLatex(d2Value)}} `,
        type: 'equation',
      },
      {
        value: `Now putting these values in the above given formula`,
        type: 'span',
      },
      {
        value: `d = \\lvert{{${valueToKatex(d1Value)}} - {${valueToKatex(
          abs(d2Value)
        )}} \\above{1pt}\\sqrt{{${valueToKatex(aValue)}}^2+{${valueToKatex(
          bValue
        )}}^2+{${valueToKatex(cValue)}}^2}}\\rvert`,
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: `d = \\lvert{${valueToKatex(
          numeratorMinus
        )} \\above{1pt} \\sqrt{${valueToKatex(denominatorAdd)}}}\\rvert`,
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: `d = \\lvert{${valueToKatex(
          numeratorMinus
        )} \\above{1pt}${valueToKatex(
          denominatorRoot
        )}}\\rvert \\implies ${valueToKatex(removeSymbol(divide))}`,
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
  }, [a, b, c, d1, d2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf6.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    setB('');
    setC('');
    setD1('');
    setD2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d1, d2].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, d1, d2].every((v) => !!v || v == 0);
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
          <div className="col-2 text-left d-flex">Plane 1 :</div>
          <div className="row mb-2 align-items-center">
            <div className="col-3">
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
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
                initialLatex={b}
              />
            </div>
            <div className="col-3">
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setD1}
                initialLatex={d1}
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
              />
            </div>
          </div>
          <div className="col-2 text-left d-flex">Plane 2:</div>
          <div className="row mb-2 align-items-center">
            <div className="col-3">
              <KatexInput
                inputValue={a}
                // setMathfieldRef={(ref) => (mf6.current = ref)}
              />
            </div>

            <div className="col-3">
              <KatexInput
                inputValue={b}
                // setMathfieldRef={(ref) => (mf6.current = ref)}
              />
            </div>
            <div className="col-3">
              <KatexInput
                inputValue={c}
                // setMathfieldRef={(ref) => (mf6.current = ref)}
              />
            </div>

            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setD2}
                initialLatex={d2}
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
              />
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

export default DistanceBetweenTwoParallelPlanes;
