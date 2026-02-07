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

const NormalDistribution = () => {
  const [mean, setMean] = useState('15');
  const [deviation, setDeviation] = useState('13');
  const [score, setScore] = useState('4');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef<MathField | null>(null);
  const mf2 = useRef<MathField | null>(null);
  const mf3 = useRef<MathField | null>(null);

  const meanConverted = convertIntoLatex(convertFromLatex(mean));
  const deviationConverted = convertIntoLatex(convertFromLatex(deviation));

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the values for the Normal distribution with \\mu = ${mean}, \\sigma = ${deviation}, and x = ${score} `
          ),
          type: 'equation',
        },
      ])
    );
  }, [meanConverted, deviationConverted]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        {
          value: `Mean (\\mu) = ${mean}`,
          type: 'equation',
        },
        {
          value: `Standard Deviation (\\sigma) = ${deviation}`,
          type: 'equation',
        },
        {
          value: `Raw score value (x) = ${score}`,
          type: 'equation',
        },
      ])
    );

    const isInvalid = [meanConverted, deviationConverted].some(
      (x) => !x && +x != 0
    );

    if (isInvalid) return;

    const zScore = evalExpression(`((${score})-${mean})/ ${deviation}`);

    //final answer calculations
    const pLessThanX = jStat.normal.cdf(score, mean, deviation); // P(X < x)
    const pLessThanOrEqualX = pLessThanX; // P(X ≤ x), same as CDF
    const pGreaterThanX = 1 - pLessThanX; // P(X > x)
    const pGreaterThanOrEqualX = 1 - pLessThanX; // P(X ≥ x), same as P(X > x)

    const finalAnswer = [
      {
        value: `P(x < X) ≈ ${pLessThanX.toFixed(7)}`,
        type: 'equation',
      },
      {
        value: `P(x ≤ X) ≈ ${pLessThanOrEqualX.toFixed(7)}`,
        type: 'equation',
      },
      {
        value: `P(x > X) ≈ ${pGreaterThanX.toFixed(7)}`,
        type: 'equation',
      },
      {
        value: `P(x ≥ X) ≈ ${pGreaterThanOrEqualX.toFixed(7)}`,
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
        value: `Z-Score(X) = ${convertIntoLatex(zScore)} = ${evalToDecimals(
          zScore
        )}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/z-score-calculator/?a=${mean}&b=${deviation}&c=${score}}" target="_blank">to see the steps for z-score, click here</a>`,
        type: 'span',
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
  }, [mean, deviation, showSteps, meanConverted, deviationConverted]);

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

    setMean('');
    setDeviation('');
    setScore('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [mean, deviation, score].some((v) => !!v || +v == 0);
  const hasAllValue = [mean, deviation, score].every((v) => !!v || v == '0');
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
            <div className="col-4 text-left">Mean (µ):</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setMean}
                allowAlphabeticKeyboard={false}
                initialLatex={mean}
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
            <div className="col-4 text-left d-flex">Standard Deviation (σ)</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setDeviation}
                allowAlphabeticKeyboard={false}
                initialLatex={deviation}
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
            <div className="col-4 text-left">Raw score value (x):</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setScore}
                allowAlphabeticKeyboard={false}
                initialLatex={score}
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

export default NormalDistribution;
