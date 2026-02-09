'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';
import Input from '../common/input';
import { jStat } from 'jstat';

const BinomialDistribution = () => {
  const [n, setN] = useLocalStorage('BinomialDistribution_n', '25');
  const [x, setX] = useLocalStorage('BinomialDistribution_x', '7');
  const [p, setP] = useLocalStorage('BinomialDistribution_p', '0.5');
  const [equation, setEquation] = useLocalStorage('BinomialDistribution_equation', '');
  const [solution, setSolution] = useLocalStorage('BinomialDistribution_solution', '');
  const [result, setResult] = useLocalStorage('BinomialDistribution_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('BinomialDistribution_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('BinomialDistribution_showSteps', true);
  const [note, setNote] = useLocalStorage('BinomialDistribution_note', undefined);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setX(vals.x);
  }, []);

  const xConverted = convertIntoLatex(convertFromLatex(x));
  const nConverted = convertIntoLatex(convertFromLatex(n));
  const pConverted = convertIntoLatex(convertFromLatex(p));

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate the various values for binomial distribution with`,
          type: 'span',
        },
        {
          value: putSpace(
            `n=${nConverted}, x=${xConverted} and p=${pConverted}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [xConverted, nConverted, pConverted]);

  useEffect(() => {
    const isInvalid = [n, x, p].some((a) => !a) || +x < 0 || +x > +n;

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `n = ${n}`,
          type: 'equation',
        },
        {
          value: `x = ${x}`,
          type: 'equation',
        },
        {
          value: `p = ${p}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const mean = evalExpression(`${n} * (${p})`);
    const nIntoP = evalExpression(`${n} * (${p})`);
    const OneMinusP = evalExpression(`1 - (${p})`);
    const variable = evalExpression(`(${nIntoP}) * (${OneMinusP})`);
    const standardDeviation = evalExpression(`sqrt(${variable})`);

    //final answer calculation
    const nVal = evalToDecimals(n);
    const pVal = evalToDecimals(p);
    const xVal = evalToDecimals(x);

    const pEqualX = jStat.binomial.pdf(xVal, nVal, pVal); // P(X = x)
    const pLessThanX = Array.from({ length: xVal }, (_, i) =>
      jStat.binomial.pdf(i, nVal, pVal)
    ).reduce((sum, prob) => sum + prob, 0); // P(X < x)
    const pLessThanOrEqualX = pLessThanX + pEqualX; // P(X ≤ x)
    const pGreaterThanX = 1 - pLessThanOrEqualX; // P(X > x)
    const pGreaterThanOrEqualX = 1 - pLessThanX; // P(X ≥ x)

    const finalAnswer = [
      {
        value: `P(X = ${xVal}) \\approx ${pEqualX.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X < ${xVal}) \\approx ${pLessThanX.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X \\leq ${xVal}) \\approx ${pLessThanOrEqualX.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X > ${xVal}) \\approx ${pGreaterThanX.toFixed(6)}`,
        type: 'equation',
      },
      {
        value: `P(X \\geq ${xVal}) \\approx ${pGreaterThanOrEqualX.toFixed(6)}`,
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
        value: `Mean : \\mu = np = (${nConverted}).(${pConverted}) = ${convertIntoLatex(
          convertFromLatex(mean)
        )} = ${evalToDecimals(mean)}`,
        type: 'equation',
      },
      {
        value: `Variable : \\sigma^2 = np(1-p) = (${nConverted}).(${pConverted}).(1 - ${pConverted}) = ${convertIntoLatex(
          convertFromLatex(variable)
        )} = ${evalToDecimals(variable)}`,
        type: 'equation',
      },
      {
        value: `Standard \\space deviation : \\sigma = \\sqrt{np(1 - p)} = \\sqrt{(${nConverted}).(${pConverted})(1 - (${pConverted}))} = ${convertIntoLatex(
          convertFromLatex(standardDeviation)
        )} = ${evalToDecimals(standardDeviation)}`,
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
  }, [x, showSteps, n, p, xConverted, nConverted, pConverted]);

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
            <div className="col-6 text-left">Number of Trials(n):-</div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="n"
                className="col-12"
                value={n}
                setVal={setN}
                min={-1}
                max={10000000}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">Number of Successes(x):-</div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="x"
                className="col-12"
                value={x}
                setVal={setX}
                min={-1}
                max={+n + 0.0000001}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">Probability of Success(p):-</div>
            <div className="col-5">
              <Input
                type="number"
                placeholder="p"
                className="col-12"
                value={p}
                setVal={setP}
                min={-0.0000000000001}
                max={1.00000000001}
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

export default BinomialDistribution;
