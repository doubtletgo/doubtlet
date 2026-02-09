'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { evalToDecimals } from '@/helpers/matrixHelper';
import Input from '../common/input';
import { jStat } from 'jstat';

const BetaDistribution = () => {
  const [alpha, setAlpha] = useLocalStorage('BetaDistribution_alpha', '3.2');
  const [beta, setBeta] = useLocalStorage('BetaDistribution_beta', '4.5');
  const [x, setX] = useLocalStorage('BetaDistribution_x', '0.7');
  const [equation, setEquation] = useLocalStorage('BetaDistribution_equation', '');
  const [solution, setSolution] = useLocalStorage('BetaDistribution_solution', '');
  const [result, setResult] = useLocalStorage('BetaDistribution_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('BetaDistribution_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('BetaDistribution_showSteps', true);
  const [note, setNote] = useLocalStorage('BetaDistribution_note', undefined);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setX(vals.x);
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
            `Calculate the various values for beta distribution α = ${alpha}, β = ${beta} and X = ${x}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x, alpha, beta]);

  useEffect(() => {
    const isInvalid = [alpha, beta, x].some((a) => !a);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Alpha (α) = ${alpha}`),
          type: 'equation',
        },
        {
          value: putSpace(`Beta (β) = ${beta}`),
          type: 'equation',
        },
        {
          value: putSpace(`Random Variable (X) = ${x}`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const mue = evalToDecimals(`(${alpha})/(${beta}+(${alpha}))`);
    const sigmaSqr = evalToDecimals(
      `((${alpha})*(${beta}))/(((${alpha}+(${beta}))^2)*(${alpha}+(${beta})+1))`
    );
    const sigma = evalToDecimals(`sqrt(${sigmaSqr})`);

    const alphaVal = parseFloat(alpha);
    const betaVal = parseFloat(beta);
    const xVal = parseFloat(x);

    if (isNaN(alphaVal) || isNaN(betaVal) || isNaN(xVal)) return;

    const pEqualX = jStat.beta.pdf(xVal, alphaVal, betaVal);
    const pLessThanX = jStat.beta.cdf(xVal, alphaVal, betaVal);
    const pLessThanOrEqualX = pLessThanX;
    const pGreaterThanX = 1 - pLessThanOrEqualX;
    const pGreaterThanOrEqualX = 1 - pLessThanX;

    const finalAnswer = [
      {
        value: `P(X = ${xVal}) \\approx ${pEqualX.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X < ${xVal}) \\approx ${pLessThanX.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X \\leq ${xVal}) \\approx ${pLessThanOrEqualX.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X > ${xVal}) \\approx ${pGreaterThanX.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X \\geq ${xVal}) \\approx ${pGreaterThanOrEqualX.toFixed(
          10
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
      'br',
      {
        value: putSpace(
          `Mean: \\mu = \\frac{\\alpha}{\\alpha + \\beta} \\approx ${mue}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Variable: \\sigma^2 = \\frac{\\alpha{\\beta}}{(\\alpha + \\beta)^2(\\alpha + \\beta + 1)} \\approx ${sigmaSqr}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Standard derivation: \\sigma = \\sqrt{\\frac{\\alpha{\\beta}}{(\\alpha + \\beta)^2(\\alpha + \\beta + 1)}} \\approx ${sigma}`
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
  }, [x, showSteps, alpha, beta]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setX('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = x.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    x.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !x.endsWith(e));

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
            Your input can be in the form of Positive Real Number
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">Enter value of Alpha (α):-</div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="α"
                className="col-12"
                value={alpha}
                setVal={setAlpha}
                min={0}
                max={10000000}
                disabled={false}
                pattern={/^(?:\d*|\d*\.\d*|\d+(?:\/\d*)?)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">Enter value of Beta (β):-</div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="α"
                className="col-12"
                value={beta}
                setVal={setBeta}
                min={0}
                max={10000000}
                disabled={false}
                pattern={/^(?:\d*|\d*\.\d*|\d+(?:\/\d*)?)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">
              Value of Random Variable (X):-
            </div>
            <div className="col-5">
              <Input
                type="number"
                placeholder="X"
                className="col-12"
                value={x}
                setVal={setX}
                min={-1}
                max={1.00001}
                disabled={false}
                pattern={/^(?:\d*|\d*\.\d*|\d+(?:\/\d*)?)?$/}
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
          className="btn default-btn px-5 rounded-pill mr-3 mt-2 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 mt-2 btn btn-danger"
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

export default BetaDistribution;
