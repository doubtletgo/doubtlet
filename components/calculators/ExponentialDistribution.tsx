'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import { MathField } from '@/types/mathfield.types';
import { jStat } from 'jstat';

const ExponentialDistribution = () => {
  const [a, setA] = useState('2.5');
  const [b, setB] = useState('1.6');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef<MathField | null>(null);
  const mf2 = useRef<MathField | null>(null);

  const aConverted = convertIntoLatex(convertFromLatex(a));
  const bConverted = convertIntoLatex(convertFromLatex(b));

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the various values for exponential distribution with \\lambda = ${aConverted} and x = ${bConverted}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [aConverted, bConverted]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Average rate of Success (\\lambda): ${a}`),
          type: 'equation',
        },
        {
          value: putSpace(`Value of a Random Variable (X): ${b}`),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b].some((x) => !x && +x != 0);

    if (isInvalid) return;

    const parsedA = convertFromLatex(a);
    const parsedB = convertFromLatex(b);

    if (evalToDecimals(parsedA) <= 0 || evalToDecimals(parsedB) < 0) return;

    const mean = evalExpression(`1 / (${parsedA})`);
    const variable = evalExpression(`1 / (${parsedA})^2`);
    const lambda = evalToDecimals(parsedA);
    const x = evalToDecimals(parsedB);

    // P(X = x) is 0 for continuous distributions
    const pdf = 0;

    // P(X > x) = CDF
    const cdf = jStat.exponential.cdf(x, lambda);

    // P(X < x) =1 -  CDF
    const ccdf = 1 - cdf;

    const finalAnswer = [
      {
        value: `P(X = ${x}) = ${pdf}`,
        type: 'equation',
      },
      {
        value: `P(X < ${x}) = ${cdf.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X ≤ ${x}) = ${cdf.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X > ${x}) = ${ccdf.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X ≥ ${x}) = ${ccdf.toFixed(6)}`,
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
        value: `The exponential distribution is defined by the probability density function (PDF):`,
        type: 'span',
      },
      'br',
      {
        value: `f(X; λ) = λe<sup>(-λX)</sup>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Mean: \\mu = \\frac{1}{\\lambda} = ${convertIntoLatex(
            mean
          )} = ${evalToDecimals(mean)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Variable: \\sigma^2 = \\frac{1}{\\lambda^2} = ${convertIntoLatex(
            variable
          )} = ${evalToDecimals(variable)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Standard deviation: \\sigma = \\sqrt{\\frac{1}{\\lambda^2}} = ${convertIntoLatex(
            mean
          )} = ${evalToDecimals(mean)}`
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
  }, [a, b, showSteps, aConverted, bConverted]);

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
            <div className="col-4 text-left">Average rate of Success (λ):</div>
            <div className="col-8 text-left">
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
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left d-flex">
              Value of a Random Variable (X):
            </div>
            <div className="col-8 text-left">
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

export default ExponentialDistribution;
