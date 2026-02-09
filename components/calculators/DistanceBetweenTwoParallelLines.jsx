'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import {
  addSymbol,
  minusSymbol,
  parseNumber,
  withSymbol,
} from '../../helpers/decimal';
import MathInput from 'react-math-keyboard';
import { removeSymbol } from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import KatexInput from '../common/katexInput';

const DistanceBetweenTwoParallelLines = () => {
  const [m, setM] = useLocalStorage('DistanceBetweenTwoParallelLines_m', '\\sqrt{5}');
  const [c1, setC1] = useLocalStorage('DistanceBetweenTwoParallelLines_c1', '\\frac{3}{2}');
  const [c2, setC2] = useLocalStorage('DistanceBetweenTwoParallelLines_c2', '2.2');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('DistanceBetweenTwoParallelLines_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceBetweenTwoParallelLines_solution', '');
  const [result, setResult] = useLocalStorage('DistanceBetweenTwoParallelLines_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DistanceBetweenTwoParallelLines_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceBetweenTwoParallelLines_showSteps', true);
  const [note, setNote] = useLocalStorage('DistanceBetweenTwoParallelLines_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Distance (d)} between the \\bold{two parallel}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Lines y = ${withSymbol(m || 'm', 'x')} ${addSymbol(c1)} ${
              removeSymbol(c1) || 'c1'
            } \\& y = ${withSymbol(m || 'm', 'x')} ${addSymbol(c2)} ${
              removeSymbol(c2) || 'c2'
            }.}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [m, c1, c2]);

  useEffect(() => {
    if (isInvalid.current) return;
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Line L_1 :- y = ${withSymbol(
            parseNumber(m || 'm'),
            'x'
          )} + (${parseNumber(c1 || 'c1')})`,
          type: 'equation',
        },
        {
          value: `Line L_2 :- y = ${withSymbol(
            parseNumber(m || '1'),
            'x'
          )} + (${parseNumber(c2 || 'c2')})`,
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [m, c1, c2].some((x) => !x);
    if (!showSteps) return;
    const tempM = katexSimplifiedValue(m);
    const tempC1 = katexSimplifiedValue(c1);
    const tempC2 = katexSimplifiedValue(c2);
    const mValue = evalExpression(tempM);
    const C2Value = evalExpression(tempC2);
    const c1Value = evalExpression(tempC1);

    const c2MinusC1 = evalExpression(`(${C2Value}) - (${c1Value})`);
    const onePlusMSquare = evalExpression(`1 + (${mValue})^2`);
    const squareRootOfOnePlusMSquare = evalExpression(
      `sqrt(${onePlusMSquare})`
    );
    const result = evalExpression(
      `(${c2MinusC1}) / (${squareRootOfOnePlusMSquare})`
    );

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Distance (d)} between the \\bold{two parallel}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Lines y = ${withSymbol(m, 'x')} ${addSymbol(
            evalInDecimals(c1, c1Value)
          )} ${removeSymbol(c1)} \\& y = ${withSymbol(m, 'x')} ${addSymbol(
            evalInDecimals(c2, C2Value)
          )} ${removeSymbol(c2)}} is `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\lvert {{${valueToKatex(
            c2MinusC1
          )}} \\above{1pt} \\sqrt{{${valueToKatex(
            onePlusMSquare
          )}}}}  \\rvert \\space or \\space {${evalInDecimals(
            removeSymbol(result)
          )}}`
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
        value: putSpace(`We know that the \\bold{Distance (d)} between`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{two parallel Lines y = mx + c_1} \\&`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{y = mx + c_2} is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `d = \\lvert {c_2 - c_1 \\above{1pt} \\sqrt{1 + m^2}}  \\rvert`
        ),
        type: 'equation',
      },
      {
        value: `From the above input it is given that `,
        type: 'span',
      },
      {
        value: putSpace(
          `m= \\bold{{${showVal(m, mValue)}}},  c_1= \\bold{{${showVal(
            c1,
            c1Value
          )}}} , c_2= \\bold{{${showVal(c2, C2Value)}}} `
        ),
        type: 'equation',
      },
      {
        value: `Now putting these values in the above`,
        type: 'span',
      },
      'br',
      {
        value: `given formula`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `d = \\lvert {{${c2}} {${minusSymbol(
            evalInDecimals(c1Value)
          )}} {${removeSymbol(c1)}} \\above{1pt} \\sqrt{1 +{${m}}^2}}  \\rvert`
        ),
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: `d = \\lvert {{${valueToKatex(
          c2MinusC1
        )}} \\above{1pt} \\sqrt{{${valueToKatex(onePlusMSquare)}}}} \\rvert`,
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: `d = \\lvert {{${valueToKatex(
          c2MinusC1
        )}} \\above{1pt} \\sqrt{{${valueToKatex(
          onePlusMSquare
        )}}}}  \\rvert = {${evalInDecimals(result)}}`,
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
  }, [m, c1, c2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');

    setC1('');
    setC2('');
    setM('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [m, c1, c2].some((v) => !!v || v == 0);
  const hasAllValue = [m, c1, c2].every((v) => !!v || v == 0);

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
            <div className="col-4 text-left">Plane 1:</div>
            <div className="col-4">
              <MathInput
                setRef={(ref) => (mf1.current = ref)}
                setValue={setM}
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
                initialLatex={m}
              />
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setC1}
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
                initialLatex={c1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Plane 2: </div>
            <div className="col-4">
              <div className="col-3">
                <KatexInput
                  inputValue={m}
                  // setRef={(ref) => (mf6.current = ref)}
                />
              </div>
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC2}
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
                initialLatex={c2}
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

export default DistanceBetweenTwoParallelLines;
