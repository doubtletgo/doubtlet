'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  katexSimplifiedValue,
  removeSymbol,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const withT = (val) => (val ? `${val}t` : val);

const EquationOfLineJoiningTwoPointsIn3D = () => {
  const [x1, setX1] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_x1', '2');
  const [y1, setY1] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_y1', '-1');
  const [z1, setZ1] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_z1', '\\frac{2}{3}');
  const [x2, setX2] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_x2', '5');
  const [y2, setY2] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_y2', '2.4');
  const [z2, setZ2] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_z2', '7');
  const [equation, setEquation] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_equation', '');
  const [solution, setSolution] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_solution', '');
  const [result, setResult] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_showSteps', true);
  const [note, setNote] = useLocalStorage('EquationOfLineJoiningTwoPointsIn3D_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Cartesian} and  \\bold{Parametric} Equation joining two points`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` P_1 \\bold{(${x1 || '1'}, ${y1 || '1'}, ${
              z1 || '1'
            })} \\& P_2\\bold{(${x2 || '1'}, ${y2 || '1'}, ${z2 || '1'})}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2]);

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
            `Point P_1 (x_1, y_1, z_1) = \\bold{\\bigg<${x1 || '1'}, ${
              y1 || '1'
            }, ${z1 || '1'}\\bigg>}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Point P_2 (x_2, y_2, z_2) = \\bold{\\bigg<${x2 || '1'}, ${
              y2 || '1'
            }, ${z2 || '1'}\\bigg>}`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [x1, y1, z1, x2, y2, z2].some((x) => !x && x != 0);
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempZ2 = katexSimplifiedValue(z2);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const z1Value = evalExpression(tempZ1);
    const z2Value = evalExpression(tempZ2);
    if (isInvalid) return;
    let x2MinusX1 = evalExpression(`${x2Value}-(${x1Value})`);
    let y2MinusY1 = evalExpression(`${y2Value}-(${y1Value})`);
    let z2MinusZ1 = evalExpression(`${z2Value}-(${z1Value})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Cartesian} and  \\bold{Parametric} Equation of the \\bold{Line} joining two points`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{P_1(${x1}, ${y1}, ${z1})} \\& \\bold{P_2 (${x2}, ${y2}, ${z2})} is \\bold{r(t) = \\bigg<x(t), y(t), z(t)\\bigg>}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= \\bold{\\bigg< ${x1} ${addSymbol(
            evalInDecimals(x2MinusX1)
          )}${withT(removeSymbol(valueToKatex(x2MinusX1)))}, ${y1} ${addSymbol(
            evalInDecimals(y2MinusY1)
          )} ${withT(removeSymbol(valueToKatex(y2MinusY1)))}, ${z1} ${addSymbol(
            z2MinusZ1
          )} ${withT(
            removeSymbol(valueToKatex(z2MinusZ1))
          )} \\bigg>} or \\bold{(${evalInDecimals(x1)} ${addSymbol(
            evalInDecimals(x2MinusX1)
          )}${withT(removeSymbol(evalInDecimals(x2MinusX1)))}, ${evalInDecimals(
            y1
          )} ${addSymbol(evalInDecimals(y2MinusY1))} ${withT(
            removeSymbol(evalInDecimals(y2MinusY1))
          )}, ${evalInDecimals(z1)} ${addSymbol(z2MinusZ1)} ${withT(
            removeSymbol(evalInDecimals(z2MinusZ1))
          )})}`
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
          `We know that the \\bold{Equation} of  \\bold{Line} joining two points`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{P1(x_1, y_1, z_1)} \\& \\bold{P_2 (x_2, y_2, z_2)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` is given by the formula below`),
        type: 'equation',
      },

      {
        value: putSpace(`r(t) = r_0 + t(v) `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold where {r(t)} is the \\bold{Position vector of any point} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(` \\bold{P (x, y, z)} on  the line itself`),
        type: 'equation',
      },

      {
        value: putSpace(
          `\\bold{r_0} is the \\bold{Position vector} of the point through`
        ),
        type: 'equation',
      },
      {
        value: putSpace(` which the line passes \\&`),
        type: 'equation',
      },

      {
        value: putSpace(
          `\\bold{v} is the vector representing any line \\bold{parallel} to it.`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `\\bold{r(t)} = \\bigg<x_1, y_1, z_1\\bigg>+t.\\bigg<(x_2-x_1), (y_2-y_1), (z_2-z_1)\\bigg>`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: `(x_1, y_1, z_1) = \\bigg(\\bold{{${valueToKatex(
          x1Value
        )}}}, \\bold{{${valueToKatex(y1Value)}}}, \\bold{{${valueToKatex(
          z1Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(x_2, y_2, z_2) = \\bigg(\\bold{{${valueToKatex(
          x2Value
        )}}}, \\bold{{${valueToKatex(y2Value)}}}, \\bold{{${valueToKatex(
          z2Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },

      {
        value: `r(t) = \\bigg< ${x1}, ${y1}, ${z1}\\bigg> + t.\\bigg<(${x2} ${minusSymbol(
          evalInDecimals(x1Value)
        )} ${removeSymbol(x1)}), (${y2} ${minusSymbol(
          evalInDecimals(y1Value)
        )} ${removeSymbol(y1)}), (${z2} ${minusSymbol(
          evalInDecimals(z1Value)
        )} ${removeSymbol(z1)})\\bigg>`,
        type: 'equation',
      },
      'br',
      {
        value: `After Solving`,
        type: 'span',
      },
      'br',
      {
        value: `r(t) = \\bigg< ${x1}, ${y1}, ${z1}\\bigg> + t. \\bigg< ${valueToKatex(
          x2MinusX1
        )}, ${valueToKatex(y2MinusY1)}, ${valueToKatex(z2MinusZ1)}\\bigg>`,
        type: 'equation',
      },
      'br',
      {
        value: `After Solving`,
        type: 'span',
      },
      'br',
      {
        value: `r(t) = \\bigg< ${x1}, ${y1}, ${z1}\\bigg> + \\bigg< ${withT(
          valueToKatex(x2MinusX1)
        )}, ${withT(valueToKatex(y2MinusY1))}, ${withT(
          valueToKatex(z2MinusZ1)
        )}\\bigg>`,
        type: 'equation',
      },
      {
        value: `=  \\bigg< ${x1} ${addSymbol(evalInDecimals(x2MinusX1))}${withT(
          removeSymbol(valueToKatex(x2MinusX1))
        )}, ${y1} ${addSymbol(evalInDecimals(y2MinusY1))} ${withT(
          removeSymbol(valueToKatex(y2MinusY1))
        )}, ${z1} ${addSymbol(evalInDecimals(z2MinusZ1))} ${withT(
          removeSymbol(valueToKatex(z2MinusZ1))
        )} \\bigg>`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Now, the parametric equation of Line in 3-D can be written below`
        ),
        type: 'equation',
      },

      {
        value: `r(t) = \\bigg< x(t), y(t), z(t) \\bigg> `,
        type: 'equation',
      },
      {
        value: `=  \\bigg< ${x1} ${addSymbol(
          evalInDecimals(x2MinusX1)
        )} ${withT(removeSymbol(valueToKatex(x2MinusX1)))}, ${y1} ${addSymbol(
          evalInDecimals(y2MinusY1)
        )} ${withT(removeSymbol(valueToKatex(y2MinusY1)))}, ${z1} ${addSymbol(
          evalInDecimals(z2MinusZ1)
        )} ${withT(removeSymbol(valueToKatex(z2MinusZ1)))} \\bigg>`,
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
  }, [x1, y1, z1, x2, y2, z2, showSteps]);

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
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setZ1('');
    setZ2('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [x1, y1, z1, x2, y2, z2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, x2, y2, z2].every((v) => !!v || v == 0);

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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">
              {' '}
              Point P<sub>1</sub>:
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setX1}
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
                initialLatex={x1}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setY1}
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
                initialLatex={y1}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setZ1}
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
                initialLatex={z1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">
              Point P<sub>2</sub>:
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setX2}
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
                initialLatex={x2}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setY2}
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
                initialLatex={y2}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setZ2}
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
                initialLatex={z2}
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

export default EquationOfLineJoiningTwoPointsIn3D;
