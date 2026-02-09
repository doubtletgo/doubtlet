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
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
} from '@/helpers/matrixHelper';

const MarginOfError = () => {
  const [n, setN] = useLocalStorage('MarginOfError_n', '46');
  const [confidence, setConfidence] = useLocalStorage('MarginOfError_confidence', '90');
  const [deviation, setDeviation] = useLocalStorage('MarginOfError_deviation', '19/4');
  const [distributionType, setDistributionType] = useLocalStorage('MarginOfError_distributionType', 'Normal');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('MarginOfError_equation', '');
  const [solution, setSolution] = useLocalStorage('MarginOfError_solution', '');
  const [showResult, setShowResult] = useLocalStorage('MarginOfError_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('MarginOfError_showSteps', true);
  const [note, setNote] = useLocalStorage('MarginOfError_note', undefined);
  const [answer, setAnswer] = useLocalStorage('MarginOfError_answer', '');

  const mf1 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.deviation) setDeviation(vals.deviation);
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
            `Calculate the margin of error for the sample size n = \\bold{${n}}, Standard Deviation = \\bold{${convertIntoLatex(
              convertFromLatex(deviation)
            )}} and confidence interval \\bold{${confidence}}\\% with \\bold{${distributionType}} distribution`
          ),
          type: 'equation',
        },
      ])
    );
  }, [deviation, distributionType, n, confidence]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Sample Size (n) = ${n} `,
          type: 'span',
        },
        'br',
        {
          value: `Confidence Level (%) = ${confidence}`,
          type: 'span',
        },
        'br',
        {
          value: `Standard Deviation (σ) = ${deviation}`,
          type: 'span',
        },
        'br',
        {
          value: `Distribution Type: <b>${distributionType}</b>`,
          type: 'span',
        },
      ])
    );

    isInvalid.current = [deviation].some((x) => !x);
    if (isInvalid.current) return;

    const alpha = 1 - parseFloat(confidence) / 100;
    const tailArea = 1 - alpha / 2; // Two-tailed test
    let criticalValue;

    if (distributionType === 'Normal') {
      // For normal distribution
      criticalValue = jStat.normal.inv(tailArea, 0, 1); // Mean = 0, StdDev = 1
    } else if (distributionType === 'T-Value') {
      // For t-distribution
      const degreesOfFreedom = parseInt(n) - 1;
      criticalValue = jStat.studentt.inv(tailArea, degreesOfFreedom);
    }

    const sampleSize = parseInt(n);
    const standardError = evalExpression(
      `${deviation} / (sqrt(${sampleSize}))`
    );
    // Margin of Error formula
    const marginOfError = criticalValue * standardError;

    const finalAnswer = [
      {
        value: putSpace(`The margin of Error(ME) : ${marginOfError}`),
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
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `For the given confidence interval, critical value ${
            distributionType == 'Normal' ? `(z*)` : `(t*)`
          } = ${criticalValue}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now, we will find standard error of the mean: SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${convertIntoLatex(
            convertFromLatex(deviation)
          )}}{\\sqrt{${n}}} = ${standardError}`
        ),
        type: 'equation',
      },
      {
        value: `Margin of Error (ME) = (Critical value).(Standard Error) = ${
          distributionType == 'Normal' ? `(z*)` : `(t*)`
        }.SE`,
        type: 'span',
      },
      {
        value: putSpace(
          `Margin of Error (ME) = (${criticalValue}).(${standardError}) = ${marginOfError}`
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
  }, [deviation, showSteps, , distributionType, n, confidence]);
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

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');

    setDeviation('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [deviation, distributionType].some((v) => !!v || v == 0);
  const hasAllValue = [deviation, distributionType].every((v) => !!v || v == 0);
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
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left d-flex">Enter Sample Size(n):</div>
            <div className="col-8 text-left">
              <Input
                placeholder="Input X value"
                disabled={false}
                className="col-12"
                value={n}
                setVal={setN}
                pattern={/^((\d)*)\d*$/}
                min={0}
                max={1000000}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left d-flex">
              Enter Confidence level(%):
            </div>
            <div className="col-8 text-left">
              <Input
                placeholder="Input X value"
                disabled={false}
                className="col-12"
                value={confidence}
                setVal={setConfidence}
                pattern={/^((\d)*)\d*$/}
                min={0}
                max={100}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Standard deviation:</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                initialLatex={deviation}
                setValue={setDeviation}
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
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Select Distribution Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={distributionType}
                onChange={onChangeDistributionType}
              >
                <option value="Normal">Normal</option>
                <option value="T-Value">T-value</option>
              </select>
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

export default MarginOfError;
