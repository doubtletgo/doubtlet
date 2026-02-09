'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';
import { MathField } from '@/types/mathfield.types';
import Input from '../common/input';

const GeometricDistribution = () => {
  const [a, setA] = useLocalStorage('GeometricDistributionCalculator_a', '0.75');
  const [b, setB] = useLocalStorage('GeometricDistributionCalculator_b', '12');
  const [equation, setEquation] = useLocalStorage('GeometricDistributionCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('GeometricDistributionCalculator_solution', '');
  const [result, setResult] = useLocalStorage('GeometricDistributionCalculator_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('GeometricDistributionCalculator_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('GeometricDistributionCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('GeometricDistributionCalculator_note', undefined);
  const [useTrial, setUseTrial] = useLocalStorage('GeometricDistributionCalculator_useTrial', true);
  const mf1 = useRef<MathField | null>(null);

  const aConverted = convertIntoLatex(convertFromLatex(a));

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the various values for geometric distribution with n = ${b} and p = ${aConverted}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [aConverted, b]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Number of Trials (n): ${b}`),
          type: 'equation',
        },
        {
          value: putSpace(`Probability of Success (p): ${a}`),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b].some((x) => !x && +x != 0) || +a > 1 || +a <= 0;

    if (isInvalid) return;

    const pMinusOne = evalExpression(`1 - (${a})`);
    const mean = useTrial
      ? evalExpression(`(1) / (${a})`)
      : evalExpression(`(${pMinusOne}) / (${a})`);
    const variable = evalExpression(`(${pMinusOne}) / (${a})^2`);
    const standardDeviation = evalExpression(`sqrt((${pMinusOne}) / (${a})^2)`);
    const isInFraction = String(standardDeviation).indexOf('/') > 0;

    const standardDeviationLowestForm = isInFraction
      ? evalExpression(standardDeviation)
      : evalToDecimals(standardDeviation);
    const standardDeviationInDecimal = evalToDecimals(standardDeviation);
    // final answer calculation using mathjs library

    const p = parseFloat(a);
    const n = parseInt(b);

    const probFail = 1 - p;

    // Final answers
    // Probability calculations
    const pxEqualsN = useTrial
      ? Math.pow(probFail, n - 1) * p // P(X = n) with success trial
      : Math.pow(probFail, n) * p; // P(X = n) without success trial

    const pxLessThanN = useTrial
      ? 1 - Math.pow(probFail, n) // P(X < n) when success trial included
      : 1 - Math.pow(probFail, n); // P(X < n) when success trial excluded

    const pxLessThanOrEqualN = useTrial
      ? 1 - Math.pow(probFail, n) // P(X ≤ n) when success trial included
      : 1 - Math.pow(probFail, n + 1); // P(X ≤ n) when success trial excluded

    const pxGreaterThanN = useTrial
      ? Math.pow(probFail, n) // P(X > n) with success trial
      : Math.pow(probFail, n + 1); // P(X > n) without success trial

    const pxGreaterThanOrEqualN = useTrial
      ? Math.pow(probFail, n - 1) // P(X ≥ n) with success trial
      : Math.pow(probFail, n); // P(X ≥ n) without success trial

    function convertScientific(num: string) {
      if (num.toString().indexOf('e') < 0) return num;
      const number = +num;
      if (typeof number !== 'number') {
        throw new TypeError('Input must be a number');
      }

      // Convert the number to its exponential string representation
      const expString = number.toExponential();

      // Regular expression to extract base and exponent
      const regex = /^([-+]?\d*\.?\d+)e([-+]?\d+)$/i;
      const match = expString.match(regex);

      if (!match) {
        throw new Error('Invalid number format');
      }

      // Parse the base and exponent, removing unnecessary zeros
      const base = parseFloat(match[1]);
      const exponent = parseInt(match[2], 10);

      return `${base} * 10^{${exponent}}`;
    }
    const finalAnswer = [
      {
        value: `P(X = ${n}) \\approx ${convertScientific(String(pxEqualsN))}`,
        type: 'equation',
      },
      {
        value: `P(X < ${n}) \\approx ${convertScientific(String(pxLessThanN))}`,
        type: 'equation',
      },
      {
        value: `P(X \\leq ${n}) \\approx ${convertScientific(
          String(pxLessThanOrEqualN)
        )}`,
        type: 'equation',
      },
      {
        value: `P(X > ${n}) \\approx ${convertScientific(
          String(pxGreaterThanN)
        )}`,
        type: 'equation',
      },
      {
        value: `P(X \\geq ${n}) \\approx ${convertScientific(
          String(pxGreaterThanOrEqualN)
        )}`,
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

      {
        value: putSpace(
          `Mean: \\mu = \\frac{1${useTrial ? '' : '-p'}}{p} = \\frac{1 ${
            useTrial ? '' : `- (${aConverted})`
          }}{${aConverted}} = ${convertIntoLatex(mean)} = ${evalToDecimals(
            mean
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Variance: \\sigma^2 = \\frac{1-p}{p^2} = \\frac{1-${aConverted}}{(${aConverted})^2} = ${convertIntoLatex(
            variable
          )} = ${evalToDecimals(variable)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Standard deviation: \\sigma = \\sqrt{\\frac{1-p}{p^2}} = \\sqrt{\\frac{1-(${aConverted})}{(${aConverted})^2}} = \\sqrt{${convertIntoLatex(
            variable
          )}} = ${convertIntoLatex(standardDeviationLowestForm)} ${
            isInFraction ? `= ${standardDeviationInDecimal}` : ''
          }`
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
  }, [a, b, showSteps, aConverted, useTrial]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');

    setA('');
    setB('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b].some((v) => !!v || +v == 0);
  const hasAllValue = [a, b].every((v) => !!v || v == '0');
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
            <div className="col-4 text-left d-flex">Number of Trials (n):</div>
            <div className="col-8 text-left">
              <Input
                placeholder="Input X value"
                disabled={false}
                className="col-12"
                value={b}
                setVal={setB}
                pattern={/^((\d)*)\d*$/}
                min={0}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Probability of Success (p):</div>
            <div className="col-8 text-left">
              <Input
                placeholder="P value"
                disabled={false}
                className="col-12"
                value={a}
                setVal={setA}
                min={0}
                max={1.000001}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center gap-3">
            <label htmlFor="check" className="col-4 text-left">
              Include a success trial ?
            </label>
            <input
              className="form-check "
              type="checkbox"
              id="check"
              style={{ width: '20px', height: '20px' }}
              checked={useTrial}
              onChange={(e) => setUseTrial(e.target.checked)}
            />
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

export default GeometricDistribution;
