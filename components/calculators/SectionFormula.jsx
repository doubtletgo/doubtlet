'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';

import { putSpace, getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  katexSimplifiedValue,
  showVal,
  valueToKatex,
} from '../../helpers/matrixHelper';

const SectionFormula = () => {
  const [x1, setX1] = useLocalStorage('SectionFormula_x1', '2');
  const [y1, setY1] = useLocalStorage('SectionFormula_y1', '-5');
  const [x2, setX2] = useLocalStorage('SectionFormula_x2', '7');
  const [y2, setY2] = useLocalStorage('SectionFormula_y2', '4');
  const [m, setM] = useLocalStorage('SectionFormula_m', '5');
  const [n, setN] = useLocalStorage('SectionFormula_n', '3');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();

  const [equation, setEquation] = useLocalStorage('SectionFormula_equation', '');
  const [solution, setSolution] = useLocalStorage('SectionFormula_solution', '');
  const [result, setResult] = useLocalStorage('SectionFormula_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SectionFormula_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SectionFormula_showSteps', true);
  const isInvalid = useRef();
  const [isPointSame, setIsPointSame] = useLocalStorage('SectionFormula_isPointSame', false);
  const [note, setNote] = useLocalStorage('SectionFormula_note', undefined);
  const [division, setDivision] = useLocalStorage('SectionFormula_division', 'Internal');
  const isInternal = division === 'Internal';

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setM(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setN(vals.z2);
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
            `Find the coordinates of the \\bold{Point} which divides the Line`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `joining two points P_1 \\bold{(${x1 || '1'}, ${
              y1 || '1'
            })} \\& P_2 \\bold{(${x2 || '1'}, ${y2 || '1'})} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `in the ratio of \\bold{${m || '1'}} : \\bold{${n || '1'}} \\bold{${
              isInternal ? 'Internally.' : 'Externally'
            }}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, x2, y1, y2, isInternal]);

  useEffect(() => {
    setIsPointSame(x1 == x2 && y1 == y2 && (isInternal ? m == n : true));
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }

    isInvalid.current = [x1, x2, y1, y2].some((x) => !x);
    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempM = katexSimplifiedValue(m);

    const tempN = katexSimplifiedValue(n);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const mValue = evalExpression(tempM);
    const nValue = evalExpression(tempN);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Point P_1 : (x_1, y_1) = (${x1 || '1'}, ${y1 || '1'})`,
          type: 'equation',
        },
        {
          value: `Point P_2 : (x_2, y_2) = (${x2 || '1'}, ${y2 || '1'})`,
          type: 'equation',
        },
        {
          value: `Ratio : (m : n) = (${m || '1'} : ${n || '1'})`,
          type: 'equation',
        },
      ])
    );

    //for internal
    const mIntoX2 = evalExpression(`${mValue} * (${x2Value})`);
    const nIntoX1 = evalExpression(`${nValue} * (${x1Value})`);
    const mIntoY2 = evalExpression(`${mValue} * (${y2Value})`);
    const nIntoY1 = evalExpression(`${nValue} * (${y1Value})`);
    const mPlusN = evalExpression(`${mValue}+(${nValue})`);
    const addMX2AndNX1 = evalExpression(`(${mIntoX2}) + (${nIntoX1})`);
    const addMX2AndNX1DivideMPlusN = evalExpression(
      `(${addMX2AndNX1}) / (${mPlusN})`
    );
    const addMY2AndNY1 = evalExpression(`${mIntoY2} + (${nIntoY1})`);
    const addMY2AndNY1DivideMPlusN = evalExpression(
      `(${addMY2AndNY1}) /( ${mPlusN})`
    );

    //for external
    const subtractMX2AndNX1 = evalExpression(`(${mIntoX2}) - (${nIntoX1})`);
    const mMinusN = evalExpression(`(${mValue})-(${nValue})`);
    const subtractMY2AndNY1 = evalExpression(`(${mIntoY2}) - (${nIntoY1})`);
    const subtractMX2AndNX1DivideMMinusN = evalExpression(
      `(${subtractMX2AndNX1}) / (${mMinusN})`
    );
    const subtractMY2AndNY1DivideMMinusN = evalExpression(
      `(${subtractMY2AndNY1}) / (${mMinusN})`
    );

    const finalAnswer = [
      {
        value: putSpace(`The coordinates of the Point which divides the Line`),
        type: 'equation',
      },
      {
        value: putSpace(`joining two points P_1 (${x1}, ${y1}) \\& `),
        type: 'equation',
      },
      {
        value: putSpace(
          `P_2 (${x2}, ${y2}) in the ratio of ${m} : ${n} ${
            isInternal ? `Internally` : `Externally`
          } is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `M (x, y) = \\bold{${
            isInternal
              ? `\\bigg({{${valueToKatex(
                  addMX2AndNX1
                )}} \\above{1pt} {${valueToKatex(mPlusN)}}}, {{${valueToKatex(
                  addMY2AndNY1
                )}} \\above{1pt} {${valueToKatex(mPlusN)}}}\\bigg)`
              : `\\bigg({{${valueToKatex(
                  subtractMX2AndNX1
                )}} \\above{1pt} {${valueToKatex(mMinusN)}}}, {{${valueToKatex(
                  subtractMY2AndNY1
                )}} \\above{1pt} {${valueToKatex(mMinusN)}}}\\bigg)`
          }} or \\bold{${
            isInternal
              ? `({${evalInDecimals(
                  addMX2AndNX1DivideMPlusN
                )}}, {${evalInDecimals(addMY2AndNY1DivideMPlusN)}})`
              : `({${evalInDecimals(
                  subtractMX2AndNX1DivideMMinusN
                )}}, {${evalInDecimals(subtractMY2AndNY1DivideMMinusN)}})`
          }
        }`
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
        value: putSpace(`We know that the \\bold{Mid-Point} of the \\bold{Line}
        `),
        type: 'equation',
      },
      {
        value: putSpace(
          `joining two points \\bold{P_1(x_1, y_1)} \\& \\bold{P_2(x_2, y_2)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below: -
        `),
        type: 'equation',
      },
      {
        value: putSpace(`Let \\bold{M (x, y)} be the coordinates of the`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Point} which divides the line joining two points`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bold{P_1(x_1, y_1)} \\& \\bold{P_2(x_2, y_2)} in the ratio of`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{m : n} \\bold{${isInternal ? `Internally` : `Externally`}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Then, Coordinates of the Point M can be `),
        type: 'equation',
      },
      {
        value: putSpace(`obtained by using the section formula for`),
        type: 'equation',
      },
      {
        value: putSpace(`${isInternal ? `Internal` : `External`} division`),
        type: 'equation',
      },

      {
        value: putSpace(
          `${
            isInternal
              ? `\\bold{x = {(mx_2+nx_1)\\above{1pt}(m+n)}}`
              : `\\bold{x = {(mx_2-nx_1)\\above{1pt}(m-n)}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${
            isInternal
              ? `\\bold{x = {(my_2+ny_1)\\above{1pt}(m+n)}}`
              : `\\bold{x = {(my_2-ny_1)\\above{1pt}(m-n)}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: `Given`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `(x_1, y_1) = \\bold{(${showVal(x1, x1Value)}, ${showVal(
            y1,
            y1Value
          )})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2) = \\bold{({${showVal(x2, x2Value)}}, {${showVal(
            y2,
            y2Value
          )}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(m, n) = \\bold{({${showVal(m, mValue)}}, {${showVal(n, nValue)}})}`
        ),
        type: 'equation',
      },
      {
        value: `Step 1`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(`Now putting these values in the above`),
        type: 'equation',
      },
      {
        value: putSpace(`given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `${
            isInternal
              ? `\\bold{x = {(${m})(${x2})+(${n})(${x1})\\above{1pt}((${m})+(${n}))}}`
              : `\\bold{x = {(${m})(${x2})-(${n})(${x1})\\above{1pt}((${m})-(${n}))}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${
            isInternal
              ? `\\bold{y = {((${m})(${y2})+(${n})(${y1}))\\above{1pt}((${m})+(${n}))}}`
              : `\\bold{y = {((${m})(${y2})-(${n})(${y1}))\\above{1pt}((${m})-(${n}))}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: `Step 2`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `After Solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `x = ${
            isInternal
              ? `{{${valueToKatex(addMX2AndNX1)}} \\above{1pt} {${valueToKatex(
                  mPlusN
                )}}} = {${valueToKatex(addMX2AndNX1DivideMPlusN)}}`
              : `{{${valueToKatex(
                  subtractMX2AndNX1
                )}} \\above{1pt} {${valueToKatex(mMinusN)}}} = {${valueToKatex(
                  subtractMX2AndNX1DivideMMinusN
                )}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: `y = ${
          isInternal
            ? `{{${valueToKatex(addMY2AndNY1)}} \\above{1pt} {${valueToKatex(
                mPlusN
              )}}} = {${valueToKatex(addMY2AndNY1DivideMPlusN)}}`
            : `{{${valueToKatex(
                subtractMY2AndNY1
              )}} \\above{1pt} {${valueToKatex(mMinusN)}}} = {${valueToKatex(
                subtractMY2AndNY1DivideMMinusN
              )}}`
        }`,
        type: 'equation',
      },
      {
        value: `(x, y) = ${
          isInternal
            ? `({${valueToKatex(addMX2AndNX1DivideMPlusN)}}, {${valueToKatex(
                addMY2AndNY1DivideMPlusN
              )}})`
            : `({${valueToKatex(
                subtractMX2AndNX1DivideMMinusN
              )}}, {${valueToKatex(subtractMY2AndNY1DivideMMinusN)}})`
        }`,
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
  }, [x1, y1, m, x2, y2, n, showSteps, isInternal]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeDivision = (event) => {
    setDivision(event.target.value);
  };

  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    mf5?.current.latex('');
    mf6?.current.latex('');

    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setM('');
    setN('');

    setShowResult(false);
  }, [setShowResult]);
  const has3dValues = [m, n].every((v) => !!v);
  const hasValue =
    [x1, x2, y1, y2].every((v) => !!v) && isInternal ? has3dValues : true;

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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Select Division Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={division}
                onChange={onChangeDivision}
              >
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className={`col-4 text-left`}>
              Enter Point P<sub>1</sub>:
            </div>
            <div className={`col-4`}>
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={x1}
              />{' '}
            </div>
            <div className={`col-4`}>
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={y1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className={`col-4 text-left`}>
              Enter Point P<sub>2</sub>:
            </div>
            <div className={`col-4`}>
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setX2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={x2}
              />{' '}
            </div>
            <div className={`col-4`}>
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setY2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={y2}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className={`col-4 text-left`}>Enter Ratio: </div>
            <div className={`col-4`}>
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setM}
                allowAlphabeticKeyboard={false}
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
                initialLatex={m}
              />{' '}
            </div>
            <div className={`col-4`}>
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setN}
                allowAlphabeticKeyboard={false}
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
                initialLatex={n}
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue &&
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

export default SectionFormula;
