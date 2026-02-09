'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { jStat } from 'jstat';
import Input from '../common/input';
import { convertFromLatex, evalToDecimals } from '../../helpers/matrixHelper';

const PValue = () => {
  const [x1, setX1] = useLocalStorage('PValue_x1', '2.11');
  const [degreesOfFreedom, setDegreesOfFreedom] = useLocalStorage('PValue_degreesOfFreedom', '2');
  const [degreesOfFreedomSecond, setDegreesOfFreedomSecond] = useLocalStorage('PValue_degreesOfFreedomSecond', '3');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('PValue_equation', '');
  const [solution, setSolution] = useLocalStorage('PValue_solution', '');
  const [showResult, setShowResult] = useLocalStorage('PValue_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PValue_showSteps', true);
  const [note, setNote] = useLocalStorage('PValue_note', undefined);
  const [answer, setAnswer] = useLocalStorage('PValue_answer', '');
  const [distributionType, setDistributionType] = useLocalStorage('PValue_distributionType', 'Z-Value');
  const [pValueType, setPValueType] = useLocalStorage('PValue_pValueType', 'Two-Tailed');

  const mf1 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
  }, []);

  const label =
    distributionType == 'Z-Value'
      ? `Normal \\space (z-value)`
      : distributionType == 'T-Value'
      ? `Student's \\space t-value`
      : distributionType == 'X-Square'
      ? `Chi-Squared(X^2)`
      : `F (Fisher-Snedecor)`;

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `\\LARGE{Calculate the \\bold{${pValueType}} P-Value for z=\\bold{${x1}} with \\bold{${label}} distribution ${
              distributionType == 'Z-Value'
                ? ``
                : `with \\bold{${degreesOfFreedom}}, ${
                    distributionType == 'F-Value'
                      ? `\\bold{${degreesOfFreedomSecond}}`
                      : ''
                  } degrees of freedom`
            }}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [
    x1,
    pValueType,
    distributionType,
    degreesOfFreedom,
    degreesOfFreedomSecond,
    label,
  ]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `\\bold{Distribution} = ${label}`,
          type: 'equation',
        },
        {
          value: `\\bold{P-Value \\space Type}: ${pValueType}`,
          type: 'equation',
        },
        {
          value: `\\bold{Z-Value} = ${x1}`,
          type: 'equation',
        },
        distributionType == 'Z-Value'
          ? { value: ``, type: 'span' }
          : {
              value: putSpace(
                `\\bold{1st Degree of freedom} : ${degreesOfFreedom}`
              ),
              type: 'equation',
            },
        distributionType == 'F-Value'
          ? {
              value: putSpace(
                `\\bold{2nd Degree of freedom} : ${degreesOfFreedomSecond}`
              ),
              type: 'equation',
            }
          : {
              value: ``,
              type: 'span',
            },
      ])
    );

    isInvalid.current = [x1].some((x) => !x);
    if (isInvalid.current) return;

    //final calculation
    let pValue = 0;
    const df = parseInt(degreesOfFreedom);
    const simplex = convertFromLatex(x1);
    const xDecimal = evalToDecimals(simplex);
    const df2 = parseInt(degreesOfFreedomSecond);

    if (distributionType === 'Z-Value') {
      if (pValueType === 'Two-Tailed') {
        pValue = 2 * (1 - jStat.normal.cdf(Math.abs(xDecimal), 0, 1));
      } else if (pValueType === 'Left-Tailed') {
        pValue = jStat.normal.cdf(xDecimal, 0, 1);
      } else if (pValueType === 'Right-Tailed') {
        pValue = 1 - jStat.normal.cdf(xDecimal, 0, 1);
      }
    } else if (distributionType === 'T-Value') {
      if (pValueType === 'Two-Tailed') {
        pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(xDecimal), df));
      } else if (pValueType === 'Left-Tailed') {
        pValue = jStat.studentt.cdf(Math.abs(xDecimal), df);
      } else if (pValueType === 'Right-Tailed') {
        pValue = 1 - jStat.studentt.cdf(Math.abs(xDecimal), df);
      }
    } else if (distributionType === 'X-Square') {
      pValue = 1 - jStat.chisquare.cdf(xDecimal, df);
    } else if (distributionType === 'F-Value') {
      pValue = 1 - jStat.centralF.cdf(xDecimal, df, df2);
    }

    const finalAnswer = [
      {
        value: `\\LARGE{The \\space P \\space Value \\approx \\bold{${pValue}}}`,
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
    setAnswer(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [
    x1,
    showSteps,
    pValueType,
    distributionType,
    degreesOfFreedom,
    degreesOfFreedomSecond,
    label,
  ]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeDistributionType = (event) => {
    setDistributionType(event.target.value);
  };

  const onChangePValueType = (event) => {
    setPValueType(event.target.value);
  };

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');

    setX1('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, pValueType, distributionType].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, pValueType, distributionType].every(
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
            Your input can be in the form of Integer, Fraction or any Real
            Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Select Distribution Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={distributionType}
                onChange={onChangeDistributionType}
              >
                <option value="Z-Value">Normal Z-Value</option>
                <option value="T-Value">Student&apos;s t-value</option>
                <option value="X-Square">Chi-Squared (X-Square)</option>
                <option value="F-Value">F Fisher-Snedecor</option>
              </select>
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Select P-Value Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={
                  distributionType == 'X-Square' ||
                  distributionType == 'F-Value'
                    ? 'Right-Tailed'
                    : pValueType
                }
                onChange={onChangePValueType}
                disabled={
                  distributionType == 'X-Square' ||
                  distributionType == 'F-Value'
                    ? true
                    : false
                }
              >
                <option value="Two-Tailed">Two-Tailed</option>
                <option value="Left-Tailed">Left-Tailed</option>
                <option value="Right-Tailed">Right-Tailed</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Enter Z Value:</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setX1}
                initialLatex={x1}
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
          {distributionType == 'Z-Value' ? (
            ''
          ) : (
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left d-flex">
                1st Degree of Freedom:
              </div>
              <div className="col-8 text-left">
                <Input
                  placeholder="Input X value"
                  disabled={false}
                  className="col-12"
                  value={degreesOfFreedom}
                  setVal={setDegreesOfFreedom}
                  pattern={/^((\d)*)\d*$/}
                  min={0}
                  max={120}
                />
              </div>
            </div>
          )}
          {distributionType == 'F-Value' ? (
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left d-flex">
                2nd Degree of Freedom:
              </div>
              <div className="col-8 text-left">
                <Input
                  placeholder="Input X value"
                  disabled={false}
                  className="col-12"
                  value={degreesOfFreedomSecond}
                  setVal={setDegreesOfFreedomSecond}
                  pattern={/^((\d)*)\d*$/}
                  min={0}
                  max={120}
                />
              </div>
            </div>
          ) : (
            ''
          )}
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
          <Equation className="mt-3" equation={answer} />
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

export default PValue;
