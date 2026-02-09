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
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const PerimeterOfTriangle = () => {
  const [a, setA] = useLocalStorage('PerimeterOfTriangle_a', '4');
  const [b, setB] = useLocalStorage('PerimeterOfTriangle_b', '\\sqrt{3}');
  const [c, setC] = useLocalStorage('PerimeterOfTriangle_c', '5');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('PerimeterOfTriangle_equation', '');
  const [solution, setSolution] = useLocalStorage('PerimeterOfTriangle_solution', '');
  const [result, setResult] = useLocalStorage('PerimeterOfTriangle_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PerimeterOfTriangle_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PerimeterOfTriangle_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('PerimeterOfTriangle_isPointSame', false);
  const [note, setNote] = useLocalStorage('PerimeterOfTriangle_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setA(vals.x1);
    if (vals.x2) setB(vals.x2);
    if (vals.y1) setC(vals.y1);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Calculate the perimeter of the triangle with`),
          type: 'equation',
        },
        {
          value: putSpace(
            ` the length of its sides as \\bold{${a || 'A'}}, \\bold{${
              b || 'B'
            }} and \\bold{${c || 'C'}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c]);

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
          value: putSpace(`Side C: \\bold{${c || 'C'} }`),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [a, b, c].some((x) => !x);
    if (!showSteps) return;
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    if (isInvalid.current) return;
    setIsPointSame(a == b && b == c);

    let add = evalExpression(`(${aValue}) + (${bValue}) + (${cValue})`);

    const finalAnswer = [
      {
        value: putSpace(`The Perimeter of the triangle with the length`),
        type: 'equation',
      },
      {
        value: putSpace(
          `of its sides as {${valueToKatex(aValue)}}, {${valueToKatex(
            bValue
          )}} and {${valueToKatex(cValue)}} is \\bold{${evalInDecimals(add)}} `
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
        value: putSpace(`Perimeter of triangle = (a + b + c)`),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that `),
        type: 'equation',
      },
      {
        value: putSpace(
          `a = \\bold{${showVal(a, aValue)}}, B =\\bold{${showVal(
            b,
            bValue
          )}}, C = \\bold{${showVal(c, cValue)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Perimeter= ({${valueToKatex(aValue)}} + {${valueToKatex(
            bValue
          )}} + {${valueToKatex(cValue)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`=(\\bold{${evalInDecimals(add)}})`),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/fraction-addition-substraction-calculator/?l=${a}, ${b}, ${c} " 
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

    const solution = renderSteps(steps);
    setSolution(solution);
  }, [a, b, c, showSteps]);

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
    setB('');
    setC('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c].every((v) => !!v || v == 0);
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
            <div className="col-4 text-left">Side A:</div>
            <div className="col-8">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
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
                initialLatex={a}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Side B:</div>
            <div className="col-8">
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Side C:</div>
            <div className="col-8">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC}
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
                initialLatex={c}
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

export default PerimeterOfTriangle;
