'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import { solveWithLeastRoots } from '../../helpers/SolveRoot';

const AreaOfTriangleHeron = () => {
  const [a, setA] = useLocalStorage('AreaOfTriangleHeron_a', '\\sqrt{3}');
  const [b, setB] = useLocalStorage('AreaOfTriangleHeron_b', '4.5');
  const [c, setC] = useLocalStorage('AreaOfTriangleHeron_c', '\\pi');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('AreaOfTriangleHeron_equation', '');
  const [solution, setSolution] = useLocalStorage('AreaOfTriangleHeron_solution', '');
  const [result, setResult] = useLocalStorage('AreaOfTriangleHeron_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AreaOfTriangleHeron_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AreaOfTriangleHeron_showSteps', true);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.y1) setC(vals.y1);
    if (vals.x2) setB(vals.x2);
  }, []);

  useEffect(() => {
    isInvalid.current = [a, b, c].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',

        {
          value: putSpace(`First Side a = \\bold{${a || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Second Side b = \\bold{${b || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`Third Side c = \\bold{${c || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let semiPerimeter = evalExpression(
      `(${aValue} + ${bValue} + ${cValue}) / 2`
    );
    let sMinusA = evalExpression(`${semiPerimeter} - ${aValue}`);
    let sMinusB = evalExpression(`${semiPerimeter} - ${bValue}`);
    let sMinusC = evalExpression(`${semiPerimeter} - ${cValue}`);
    let calculation = evalExpression(
      `${semiPerimeter} * ${sMinusA} * ${sMinusB} * ${sMinusC}`
    );
    let final = solveWithLeastRoots(calculation);
    const isSame = calculation == final;
    let area = evalInDecimals(evalExpression(`${calculation} ^ 0.5`));
    let sum = evalExpression(`${aValue}+${bValue}+${cValue}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of the given \\bold{Triangle} with \\bold{side length}`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `a = \\bold{${a}},  b = \\bold{${b}} and c = \\bold{${c}}`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\sqrt{${valueToKatex(calculation)}}} ${
            isSame ? '' : `= {${final}}`
          } or\\bold {${valueToKatex(area)}} square units.`
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
          `We know that \\bold{Area(A)} of the \\bold{Triangle} by \\bold{Heron’s}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Formula is given as \\bold{A = \\sqrt{(S)(S-a)(S-b)(S-c)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where  \\bold{S}  is  the  \\bold{Semi-Perimeter} i.e.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bigg\\lbrace{(a+b+c)\\above{1pt}2}\\bigg\\rbrace  and \\bold{a, b} and \\bold{c} are the \\bold{given Length}  `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{of the Sides of the Triangle.}`),
        type: 'equation',
      },
      {
        value: putSpace(`From  the  above  input  it  is  given  that`),
        type: 'equation',
      },

      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`b = \\bold{${showVal(b, bValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`c = \\bold{${showVal(c, cValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now putting these values in the above given formula First`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `we calculate the value of S = {(${a}+${b}+${c})\\above{1pt}2}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `S = {{${valueToKatex(sum)}}\\above{1pt} 2} \\implies {${valueToKatex(
            semiPerimeter
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we can calculate the Area of the Triangle by using above`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `mentioned formula A =\\sqrt{({${valueToKatex(
            semiPerimeter
          )}})({${valueToKatex(semiPerimeter)}}-${a})({${valueToKatex(
            semiPerimeter
          )}}-${b})({${valueToKatex(semiPerimeter)}}-${c})}`
        ),
        type: 'equation',
      },
      {
        type: 'equation',
        value: `\\bold{\\sqrt{${valueToKatex(calculation)}}} ${
          isSame ? '' : `= {${final}}`
        } \\space or \\space
        \\bold {${valueToKatex(area)}} \\space square \\space units.`,
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
          <div className="text-left mb-3">
            Your input can be in form of FRACTION, Positive Real Number or any
            Variable
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
                setValue={setB}
                allowAlphabeticKeyboard={false}
                initialLatex={b}
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
                setValue={setC}
                allowAlphabeticKeyboard={false}
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
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
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

export default AreaOfTriangleHeron;
