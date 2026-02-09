'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { removeSymbol } from '../../helpers/RootSolver';
import { addSymbol } from '../../helpers/decimal';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
  valueToKatex,
} from '../../helpers/matrixHelper';

const ArgumentOfAComplexNumber = () => {
  const [a, setA] = useLocalStorage('ArgumentofComplex_a', '5');
  const [b, setB] = useLocalStorage('ArgumentofComplex_b', '2');
  const [equation, setEquation] = useLocalStorage('ArgumentofComplex_equation', '');
  const [solution, setSolution] = useLocalStorage('ArgumentofComplex_solution', '');
  const [result, setResult] = useLocalStorage('ArgumentofComplex_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('ArgumentofComplex_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ArgumentofComplex_showSteps', true);
  const [note, setNote] = useLocalStorage('ArgumentofComplex_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `Question`,
          type: 'h6',
        },
        {
          value: putSpace(
            `Find the \\bold{Argument} of the Complex Number ({${
              a || 'a'
            }} ${addSymbol(b)} {${removeSymbol(b) || 'b'}}i)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [b, a]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: ` Formatted User input Display`,
          type: 'h6',
        },
        {
          value: putSpace(
            `Complex Number Z: \\bigg<{{${a || 'a'}} ${addSymbol(b)} {${
              removeSymbol(b) || 'b'
            }}i}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = ![a, b].every((i) => i == 0 || !!i);
    if (isInvalid) return;
    const tempA = convertFromLatex(a);
    const tempB = convertFromLatex(b);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const aDecimal = evalInDecimals(aValue);
    const bDecimal = evalInDecimals(bValue);
    if (!aValue || !bValue) return;
    // //Quadrant Condition
    let sinceSteps = [];
    let formula = [];
    let answer = [];
    const bDivedA = evalExpression(`(${bValue})/(${aValue})`);
    const tanInverseInRadian = evalExpression(`atan(${bDivedA})`);
    const tanInverseInDegree = evalExpression(
      `((${tanInverseInRadian})* ((180 * 7) / 22))`
    );
    // Case 1
    if (aDecimal > 0 && bDecimal > 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a > 0 and b > 0 (Complex number lies in \\bold{1^{st}} quadrant)`
          ),
          type: 'equation',
        },
      ];

      formula = [
        {
          value: putSpace(`is  tan^{-1}\\bigg({b\\above{1pt}a}\\bigg)`),
          type: 'equation',
        },
      ];
      answer = [
        {
          value: putSpace(
            `is \\theta = tan^{-1}\\bigg({{${convertIntoLatex(
              bValue
            )}}\\above{1pt}{${convertIntoLatex(aValue)}}}\\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `= tan^{-1}\\bigg({${valueToKatex(
              bDivedA
            )}}\\bigg) = \\bold{${evalInDecimals(
              tanInverseInRadian
            )}} radian or \\bold{${evalInDecimals(tanInverseInDegree)}} degree`
          ),
          type: 'equation',
        },
      ];
    }
    // Case 2
    else if (aDecimal < 0 && bDecimal > 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a < 0 and b > 0 (Complex number lies in \\bold{2^{nd}} quadrant)`
          ),
          type: 'equation',
        },
      ];

      formula = [
        {
          value: putSpace(
            `arg(Z) = \\theta =  \\pi + tan^{-1} \\bigg({b\\above{1pt}a} \\bigg)`
          ),
          type: 'equation',
        },
      ];

      answer = [
        {
          value: putSpace(
            `arg(Z) = \\theta = tan^{-1} \\bigg({${convertIntoLatex(
              bValue
            )}\\above{1pt}(${convertIntoLatex(
              aValue
            )})} \\bigg) = \\pi+({${convertIntoLatex(bDivedA)}})  `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` =\\bold{{${evalInDecimals(
              tanInverseInRadian
            )}}\\pi radian} or  \\bold{{${evalInDecimals(
              tanInverseInDegree
            )}}\\pi degree} `
          ),
          type: 'equation',
        },
      ];
    }
    // Case 3
    else if (aDecimal < 0 && bDecimal < 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a < 0 and b < 0 (Complex number lies in \\bold{3^{rd}} quadrant)`
          ),
          type: 'equation',
        },
      ];

      formula = [
        {
          value: putSpace(
            `arg(Z) = \\theta =\\pi tan^{-1}\\bigg({b\\above{1pt}a} \\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `arg(Z) = \\theta =\\pi tan^{-1}\\bigg({{${convertIntoLatex(
              bValue
            )}}\\above{1pt}{${convertIntoLatex(aValue)}}} \\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `arg(Z) = \\theta =\\pi tan^{-1}\\bigg({${convertIntoLatex(
              bDivedA
            )}}\\bigg)`
          ),
          type: 'equation',
        },
      ];
      answer = [
        {
          value: putSpace(
            `\\bold{${evalInDecimals(
              evalExpression(`(${tanInverseInRadian}*22)/7`)
            )}} Radian or \\bold{${evalInDecimals(
              evalExpression(`(${tanInverseInDegree}*22)/7`)
            )}} Degree`
          ),
          type: 'equation',
        },
      ];
    }
    // Case 4
    else if (aDecimal > 0 && bDecimal < 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a > 0 and b < 0 (Complex number lies in \\bold{4^{th}} quadrant)`
          ),
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(
            `arg(Z) = \\theta = 2\\pi + tan^{-1} \\bigg({b\\above{1pt}a} \\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `arg(Z) = \\theta = 2\\pi + tan^{-1} \\bigg({{${convertIntoLatex(
              bValue
            )}}\\above{1pt}{${convertIntoLatex(aValue)}}} \\bigg)`
          ),
          type: 'equation',
        },
      ];

      answer = [
        {
          value: putSpace(
            `\\bold{${evalInDecimals(
              evalExpression(`(2*22)/7 +  ${tanInverseInRadian}`)
            )}} radian or \\bold{${evalInDecimals(
              evalExpression(`(2*22)/7 +  (${tanInverseInDegree})`)
            )}} degree`
          ),
          type: 'equation',
        },
      ];
    }
    // Case 5
    else if (aDecimal == 0 && bDecimal > 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a = 0 and b > 0 (Complex number lies positive y - axis)`
          ),
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(
            `arg(Z) = \\theta = {\\pi \\above{1pt} 2 } radian or 90 degree `
          ),
          type: 'equation',
        },
      ];
      answer = [
        {
          value: putSpace(
            `is  = {{22\\above{1pt}7} \\above{1pt} 2 } radian or 90 degree`
          ),
          type: 'equation',
        },
      ];
    }
    // Case 6
    else if (aDecimal == 0 && bDecimal < 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a = 0 and b < 0 (Complex number lies negative y - axis)`
          ),
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(
            `arg(Z) = \\theta = {-{22\\above{1pt}7} \\above{1pt} 2} or {{22\\above{1pt}7} 3 \\above{1pt} 2} or -90 or 270 degree `
          ),
          type: 'equation',
        },
      ];

      answer = [
        {
          value: putSpace(
            `arg(Z) = \\theta = {-\\pi \\above{1pt} 2} or {\\pi 3 \\above{1pt} 2} or -90 or 270 degree `
          ),
          type: 'equation',
        },
      ];
    }
    // Case 7
    else if (aDecimal > 0 && bDecimal == 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a > 0 and b = 0 (Complex number lies positive x - axis)`
          ),
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(`arg(Z) = \\theta = 0 radian or 0 degrees`),
          type: 'equation',
        },
      ];

      answer = [
        {
          vlaue: putSpace(`arg(Z) = \\theta =  0 radian or 0 degrees`),
          type: 'equation',
        },
      ];
    }
    // Case 8
    else if (aDecimal < 0 && bDecimal == 0) {
      sinceSteps = [
        {
          value: putSpace(
            `Since a < 0 and b = 0 (Complex number lies negative x - axis)`
          ),
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(`arg(Z) = \\theta = \\pi radian or 180 degree`),
          type: 'equation',
        },
      ];
      answer = [
        {
          value: putSpace(
            `arg(Z) = \\theta = {22\\above{1pt}7} radian or 180 degree`
          ),
          type: 'equation',
        },
      ];
    }
    // Case 9
    else if (aDecimal == 0 && bDecimal == 0) {
      sinceSteps = [
        {
          value: `Since a = 0 and b = 0 (Complex number lies on origin)`,
          type: 'equation',
        },
      ];
      formula = [
        {
          value: putSpace(`arg(Z) = \\theta = Not defined`),
          type: 'equation',
        },
      ];

      answer = [
        {
          value: putSpace(`arg(Z) = \\theta = Not defined`),
          type: 'equation',
        },
      ];
    }

    const finalAnswer = [
      {
        value: putSpace(
          `The argument of the complex Number ({${convertIntoLatex(
            aValue
          )}}${addSymbol(evalInDecimals(bValue))}{${removeSymbol(
            convertIntoLatex(bValue)
          )}}i)`
        ),
        type: 'equation',
      },
      ...answer,
    ];

    const equations = [
      {
        type: 'h6',
        value: `Answer`,
      },
      ...finalAnswer,
    ];

    const eqRender = renderSteps(equations);
    setResult(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `Step By Step Solution :-`,
        type: 'h6',
      },
      {
        value: putSpace(
          `We know that the Argument of the Complex Number z = (a + ib)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` is the measure of the angle made by the line representing`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the complex number, with the positive x-axis of the argand plane.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `arg(Z) = \\theta = tan^{-1}\\bigg({b\\above{1pt}a}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: `Step -1`,
        type: 'h6',
        className: 'texp-decoration-underline',
      },
      {
        value: putSpace(`Given input`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Z = a + ib = {${convertIntoLatex(aValue)}}${addSymbol(
            bValue
          )}{${convertIntoLatex(
            removeSymbol(bValue)
          )}}{i}  then on comparing we get`
        ),
        type: 'equation',
      },

      {
        value: `a = {${valueToKatex(aValue)}} ,b = {${valueToKatex(bValue)}}`,
        type: 'equation',
      },
      ...sinceSteps,
      {
        value: putSpace(`then, we will use the formula given below`),
        type: 'equation',
      },
      ...formula,
      ...answer,
      'hr',
      {
        value: `Final Answer`,
        type: 'h6',
      },
      ...finalAnswer,
    ];
    const solution = renderSteps(steps);

    setSolution(solution);
  }, [b, a, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    setB('');
    setA('');
    setShowResult(false);
    setShowSteps('');
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="d-flex mb-2 align-items-center">
            <div className="col-4   text-left">Complex Number Z:</div>
            <div className={`col-3 me-2 `}>
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
              />
            </div>
            <div className={`col-3  `}>
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
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasValue && (
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
      {hasValue && showResult && !showSteps && (
        <>
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

export default ArgumentOfAComplexNumber;
