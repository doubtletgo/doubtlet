'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import {
  convertFromLatex,
  convertIntoLatex,
  evalToDecimals,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import { MathField } from '@/types/mathfield.types';
import { create, all } from 'mathjs';
import Input from '../common/input';

const PoissonDistributionCalculator = () => {
  const [a, setA] = useLocalStorage('PoissonDistributionCalculator_a', '21');
  const [b, setB] = useLocalStorage('PoissonDistributionCalculator_b', '13');
  const [equation, setEquation] = useLocalStorage('PoissonDistributionCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('PoissonDistributionCalculator_solution', '');
  const [result, setResult] = useLocalStorage('PoissonDistributionCalculator_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('PoissonDistributionCalculator_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('PoissonDistributionCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('PoissonDistributionCalculator_note', undefined);
  const mf1 = useRef<MathField | null>(null);

  const convertedA = convertIntoLatex(convertFromLatex(a));

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the various values for Poisson distribution with \\lambda = ${convertedA} and x = ${b}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [convertedA, b]);

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

    const isInvalid = [a, b].some((x) => !x && +x != 0) || Number(a) <= 0;

    const sqrtA = evalToDecimals(`sqrt(${convertFromLatex(a)})`);

    // final answer calculation using mathjs library
    const math = create(all);
    const lambda = evalToDecimals(convertFromLatex(a));
    const x = +convertFromLatex(b);

    const pEqualX =
      (Number(math.pow(lambda, x)) * Number(math.exp(-lambda))) /
      Number(math.factorial(x));

    let pLessThanX = 0;

    for (let i = 0; i < x; i++) {
      const pEqualI =
        (Number(math.pow(lambda, i)) * Number(math.exp(-lambda))) /
        Number(math.factorial(i));
      pLessThanX += pEqualI;
    }

    let pLessThanOrEqualX = 0;

    for (let i = 0; i <= x; i++) {
      const pEqualI =
        (Number(math.pow(lambda, i)) * Number(math.exp(-lambda))) /
        Number(math.factorial(i));
      pLessThanOrEqualX += pEqualI;
    }
    const pGreaterThanX = 1 - pLessThanOrEqualX;
    const pGreaterThanOrEqualX = 1 - pLessThanX;

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: putSpace(`P(X = ${b}) \\approx \\large{\\bold{${pEqualX}}}`),
        type: 'equation',
      },
      {
        value: putSpace(`P(X < ${b}) \\approx \\large{\\bold{${pLessThanX}}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `P(X \\le ${b}) \\approx \\large{\\bold{${pLessThanOrEqualX}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `P(X > ${b}) \\approx \\large{\\bold{${pGreaterThanX}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `P(X \\geq ${b}) \\approx \\large{\\bold{${pGreaterThanOrEqualX}}}`
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
      {
        value: putSpace(`Mean: \\mu = \\lambda = ${a}`),
        type: 'equation',
      },
      {
        value: putSpace(`Variance: \\sigma^2 = \\lambda = ${a}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Standard deviation: \\sigma = \\sqrt{\\lambda} = \\sqrt{${a}} = ${evalToDecimals(
            sqrtA
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/standard-deviation-calculator/" target="_blank">to see Steps of Standard Deviation, click here</a>`,
        type: `span`,
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
  }, [a, b, showSteps, convertedA]);

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
              <Input
                placeholder="Input X value"
                disabled={false}
                className="col-12"
                value={b}
                setVal={setB}
                pattern={/^((\d)*)\d*$/}
                min={-0.1}
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

export default PoissonDistributionCalculator;
