'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';
import Input from '../common/input';
import { jStat } from 'jstat';

const HypergeometricDistribution = () => {
  const [populationSize, setPopulationSize] = useState('25');
  const [populationK, setPopulationK] = useState('13');
  const [sampleSize, setSampleSize] = useState('14');
  const [sampleK, setSampleK] = useState('7');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setSampleSize(vals.x);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate the various values for hypergeometric distribution with N = ${populationSize}, K = ${populationK}, n = ${sampleSize} and k = ${sampleK}`,
          type: 'span',
        },
      ])
    );
  }, [sampleSize, populationSize, populationK, sampleK]);

  useEffect(() => {
    const isInvalid = [populationSize, populationK, sampleSize, sampleK].some(
      (a) => !a
    );

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Population Size (N) = ${populationSize}`,
          type: 'span',
        },
        'br',
        {
          value: `No. of Successes in Population (K) = ${populationK}`,
          type: 'span',
        },
        'br',
        {
          value: `Sample Size (n) = ${sampleSize}`,
          type: 'span',
        },
        'br',
        {
          value: `No. of Successes in the Sample (k) = ${sampleK}`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    const populationKByPopulationSize = evalExpression(
      `${populationK} / (${populationSize})`
    );
    const mean = evalExpression(
      `${sampleSize} * (${populationKByPopulationSize})`
    );

    const variable = evalExpression(
      `${sampleSize} * (${populationK}/${populationSize}) * (${populationSize}-${populationK})/${populationSize} * (${populationSize}-${sampleSize})/(${populationSize}-1)`
    );

    const standardDeviation = evalExpression(`sqrt(${variable})`);

    //final answer
    const N = parseInt(populationSize, 10);
    const K = parseInt(populationK, 10);
    const n = parseInt(sampleSize, 10);
    const k = parseInt(sampleK, 10);

    // Validate logical constraints
    if (k > n || n > N || k > K) {
      return;
    }

    // Helper function to calculate combinations safely
    const safeCombination = (n, r) => {
      if (n < r || r < 0) return 0; // Invalid combination
      return jStat.combination(n, r);
    };

    // Hypergeometric PMF
    const hypergeometricPMF = (N, K, n, k) => {
      return (
        (safeCombination(K, k) * safeCombination(N - K, n - k)) /
        safeCombination(N, n)
      );
    };

    // Hypergeometric CDF
    const hypergeometricCDF = (N, K, n, k) => {
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += hypergeometricPMF(N, K, n, i);
      }
      return sum;
    };

    const pxEqualsK = hypergeometricPMF(N, K, n, k); // P(X = k)
    const pxLessThanK = k > 0 ? hypergeometricCDF(N, K, n, k - 1) : 0; // P(X < k)
    const pxLessThanOrEqualK = hypergeometricCDF(N, K, n, k); // P(X ≤ k)
    const pxGreaterThanK = 1 - pxLessThanOrEqualK; // P(X > k)
    const pxGreaterThanOrEqualK = 1 - pxLessThanK; // P(X ≥ k)

    const finalAnswer = [
      {
        value: `P(X = ${k}) \\approx ${pxEqualsK.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X < ${k}) \\approx ${pxLessThanK.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X \\leq ${k}) \\approx ${pxLessThanOrEqualK.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X > ${k}) \\approx ${pxGreaterThanK.toFixed(10)}`,
        type: 'equation',
      },
      {
        value: `P(X \\geq ${k}) \\approx ${pxGreaterThanOrEqualK.toFixed(10)}`,
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
          `Mean: \\mu = n \\frac{K}{N} = ${sampleSize} \\frac{${populationK}}{${populationSize}} = ${convertIntoLatex(
            mean
          )} = ${evalToDecimals(mean)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Variable: \\sigma^2 = n(\\frac{K}{N})(\\frac{N-K}{N})(\\frac{N-n}{N-1}) = ${sampleSize}(\\frac{${populationK}}{${populationSize}})(\\frac{${populationSize}-${populationK}}{${populationSize}})(\\frac{${populationSize}-${sampleSize}}{${populationSize}-1})`
        ),
        type: 'equation',
      },
      {
        value: `= ${convertIntoLatex(variable)} = ${evalToDecimals(variable)}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Standard deviation: \\sigma = \\sqrt{n(\\frac{K}{N})(\\frac{N-K}{N})(\\frac{N-n}{N-1})} = \\sqrt{${sampleSize}(\\frac{${populationK}}{${populationSize}})(\\frac{${populationSize}-${populationK}}{${populationSize}})(\\frac{${populationSize}-${sampleSize}}{${populationSize}-1})}`
        ),
        type: 'equation',
      },
      {
        value: ` = \\sqrt{${convertIntoLatex(variable)}}= ${evalToDecimals(
          standardDeviation
        )}`,
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
  }, [sampleSize, showSteps, populationSize, populationK]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setSampleSize('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = sampleSize.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    sampleSize.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !sampleSize.endsWith(e));

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
            <div className="col-6 text-left">Population Size (N):-</div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="N"
                className="col-12"
                value={populationSize}
                setVal={setPopulationSize}
                min={-1}
                max={10000000}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">
              No. of Successes in Population (K):-
            </div>
            <div className="col-5">
              <Input
                type="text"
                placeholder="K"
                className="col-12"
                value={populationK}
                setVal={setPopulationK}
                min={-1}
                max={10000000}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">Sample Size (n):-</div>
            <div className="col-5">
              <Input
                type="number"
                placeholder="n"
                className="col-12"
                value={sampleSize}
                setVal={setSampleSize}
                min={-1}
                max={10000000}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-6 text-left">
              No. of Successes in the Sample (k):-
            </div>
            <div className="col-5">
              <Input
                type="number"
                placeholder="k"
                className="col-12"
                value={sampleK}
                setVal={setSampleK}
                min={-1}
                max={10000000}
                disabled={false}
                pattern={/^\d+(\/\d+)?$/}
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

export default HypergeometricDistribution;
