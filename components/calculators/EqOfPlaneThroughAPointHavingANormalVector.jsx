'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol, withSymbol } from '../../helpers/decimal';
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

const EqOfPlaneThroughAPointHavingANormalVector = () => {
  const [x1, setX1] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_x1', '4');
  const [y1, setY1] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_y1', '5');
  const [z1, setZ1] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_z1', '3');
  const [a, setA] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_a', '5');
  const [b, setB] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_b', '2');
  const [c, setC] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_c', '7');
  const [x, setX] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_x', '2');
  const [y, setY] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_y', '8');
  const [z, setZ] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_z', '7');
  const [equation, setEquation] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_equation', '');
  const [solution, setSolution] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_solution', '');
  const [result, setResult] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_showSteps', true);
  const [note, setNote] = useLocalStorage('EqOfPlaneThroughAPointHavingANormalVector_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Cartesian Equation of the Plane} passing through the `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` Point (${x1 || '1'}, ${y1 || '1'}, ${
              z1 || '1'
            }) \\& having Normal vector  ${a || '1'}i ${addSymbol(
              b
            )} ${removeSymbol(b || '1')}j ${addSymbol(c)} ${removeSymbol(
              c || '1'
            )}k`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, a, b, c]);

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
            ` Point P :- (x_0, y_0, z_0) = (${x1 || '1'}, ${y1 || '1'}, ${
              z1 || '1'
            })`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Normal N :- (a, b, c) = (${a || '1'}, ${b || '1'}, ${c || '1'})`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [x1, y1, z1, a, b, c].some((x) => !x && x != 0);
    const tempX1 = katexSimplifiedValue(x1);
    const tempY1 = katexSimplifiedValue(y1);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);

    const xValue = evalExpression(tempX1);
    const yValue = evalExpression(tempY1);
    const zValue = evalExpression(tempZ1);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    if (isInvalid) return;

    const aIntoX = evalExpression(`${aValue} * ${xValue}`);
    const bIntoY = evalExpression(`${bValue} * ${yValue}`);
    const cIntoZ = evalExpression(`${cValue} * ${zValue}`);
    const addition = evalExpression(`${-aIntoX} + (-${bIntoY}) + (-${cIntoZ})`);

    const finalAnswer = [
      {
        value: putSpace(
          `Find the Cartesian Equation of the Plane passing through the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Point (${x1}, ${y1}, ${z1}) \\& having Normal vector  ${a}i ${addSymbol(
            b
          )} ${removeSymbol(b)}j ${addSymbol(c)} ${removeSymbol(c)}k`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{${aValue}x ${addSymbol(
            evalInDecimals(bValue)
          )} ${valueToKatex(removeSymbol(bValue))}y ${addSymbol(
            evalInDecimals(cValue)
          )} ${valueToKatex(removeSymbol(cValue))}z ${addSymbol(
            evalInDecimals(addition)
          )} ${valueToKatex(removeSymbol(addition))} = 0}`
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
        value: putSpace(`We know that the Equation of the Plane passing `),
        type: 'equation',
      },
      {
        value: putSpace(`through the Point P (x0, y0, z0) \\& having `),
        type: 'equation',
      },
      {
        value: putSpace(`Normal vector (ai + bj + ck) can be obtained`),
        type: 'equation',
      },
      {
        value: putSpace(`by the formula given below`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Plane P :-}`),
        type: 'equation',
      },
      {
        value: putSpace(`a(x - x_0) + b(y - y_0) + c(z - z_0) = 0`),
        type: 'equation',
      },

      {
        value: `From the above inputs`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `(x_1, y_1, z_1) = \\bigg(\\bold{{${showVal(
            x1,
            xValue
          )}}}, \\bold{{${showVal(y1, yValue)}}}, \\bold{{${showVal(
            z1,
            zValue
          )}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2, z_2) = \\bigg(\\bold{{${showVal(
            a,
            aValue
          )}}}, \\bold{{${showVal(b, bValue)}}}, \\bold{{${showVal(
            c,
            cValue
          )}}}\\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now putting the above values in the equation of plane`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Plane P :-}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\{${a}(x-${x1})\\} +\\{${b}(y-${y1})\\} + \\{${c}(z-${z1})\\}=0`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `${withSymbol(valueToKatex(aValue), 'x')}${minusSymbol(
            aIntoX
          )}{${valueToKatex(removeSymbol(aIntoX))}}${addSymbol(
            bValue
          )}{${withSymbol(
            valueToKatex(removeSymbol(bValue)),
            'y'
          )}} ${minusSymbol(bIntoY)}{${valueToKatex(
            removeSymbol(bIntoY)
          )}} ${addSymbol(cValue)}{${withSymbol(
            valueToKatex(removeSymbol(cValue)),
            'z'
          )}} ${minusSymbol(cIntoZ)} {${valueToKatex(
            removeSymbol(cIntoZ)
          )}} = 0`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`Cartesian equation of the plane is`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bold{${aValue}x ${addSymbol(
            evalInDecimals(bValue)
          )} ${valueToKatex(removeSymbol(bValue))}y ${addSymbol(
            evalInDecimals(cValue)
          )} ${valueToKatex(removeSymbol(cValue))}z ${addSymbol(
            evalInDecimals(addition)
          )} ${valueToKatex(removeSymbol(addition))} = 0}`
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
  }, [x1, y1, z1, a, b, c, , x, y, z, showSteps]);

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
    setX1('');
    setY1('');
    setZ1('');
    setA('');
    setB('');
    setC('');
    setX('');
    setY('');
    setZ('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, a, b, x, y, z].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, a, b, , x, y, z].every((v) => !!v || v == 0);

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
            <div className="col-3 text-left">Point P:-</div>
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
            <div className="col-3 text-left">Normal N :-</div>
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

export default EqOfPlaneThroughAPointHavingANormalVector;
