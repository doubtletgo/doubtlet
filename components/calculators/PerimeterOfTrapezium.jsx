'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const PerimeterOfTrapezium = () => {
  const [a, setA] = useLocalStorage('PerimeterOfTrapezium_a', '2');
  const [b, setB] = useLocalStorage('PerimeterOfTrapezium_b', '\\pi');
  const [c, setC] = useLocalStorage('PerimeterOfTrapezium_c', '\\sqrt{7}');
  const [d, setD] = useLocalStorage('PerimeterOfTrapezium_d', '6');
  const [equation, setEquation] = useLocalStorage('PerimeterOfTrapezium_equation', '');
  const [solution, setSolution] = useLocalStorage('PerimeterOfTrapezium_solution', '');
  const [result, setResult] = useLocalStorage('PerimeterOfTrapezium_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PerimeterOfTrapezium_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PerimeterOfTrapezium_showSteps', true);
  const [note, setNote] = useLocalStorage('PerimeterOfTrapezium_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the perimeter of the Trapezium with the length`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `of its sides as \\bold{${a || 'A'},  ${b || 'B'},  ${
              c || 'C'
            }} and  \\bold{${d || 'D'}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Side A: \\bold{${a || 'A'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Side B: \\bold{${b || 'B'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Side C: \\bold{${c || 'C'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Side D: \\bold{${d || 'D'}}`),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b, c, d].some((x) => !x && x != 0);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    if (isInvalid) return;

    let res = evalExpression(`(${aValue} + ${bValue} + ${cValue} + ${dValue})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The Perimeter of the triangle with the length of its sides as `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${a}, ${b}, ${c} and  ${d} is {${valueToKatex(
            res
          )}} or {${evalInDecimals(res)}}`
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
          `The perimeter of any geometrical figure is determined`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`by adding the length of all the sides.`),
        type: 'equation',
      },
      {
        value: putSpace(`Perimeter of triangle = (a + b + c + d)`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Given the values} `),
        type: 'equation',
      },
      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`b = \\bold{${showVal(b, bValue)} }`),
        type: 'equation',
      },
      {
        value: putSpace(`c = \\bold{${showVal(c, cValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`d = \\bold{${showVal(d, dValue)} }`),
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
        value: putSpace(`Perimeter of triangle = (${a} + ${b} + ${c} + ${d})`),
        type: 'equation',
      },
      {
        value: putSpace(
          `({${valueToKatex(aValue)}} + {${valueToKatex(
            bValue
          )}} + {${valueToKatex(cValue)}} + {${valueToKatex(
            dValue
          )}}) = {${valueToKatex(res)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now adding the fraction= {${evalInDecimals(res)}}`),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/fraction-addition-substraction-calculator/?l=${a},${b},${c},${d}"
          target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [a, b, , c, d, showSteps]);

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
    setA('');
    setB('');
    setC('');
    setD('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, d].every((v) => !!v || v == 0);

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
          <div className="text-left mb-2">
            Your input can be in form of positive real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Side A: </div>
            <div className="col-8">
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4  text-left">Side B: </div>
            <div className="col-8">
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Side C: </div>
            <div className="col-8">
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
            <div className="col-4  text-left">Side D: </div>
            <div className="col-8">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
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

export default PerimeterOfTrapezium;
