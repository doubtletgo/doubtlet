'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import Input from '../common/input';

const SimpleInterest = () => {
  const [principalAmount, setprincipalAmount] = useState('100000');
  const [rateOfInterest, setrateOfInterest] = useState('6.2');
  const [timePeriod, settimePeriod] = useState('5.5');

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const hasValue =
    principalAmount &&
    +principalAmount > 0 &&
    rateOfInterest &&
    +rateOfInterest > 0 &&
    timePeriod &&
    +timePeriod >= 0;

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Calculate the Simple Interest on the principal amount of \\bold{${Number(
              principalAmount
            ).toLocaleString(
              'en-IN'
            )}} on \\bold{${rateOfInterest}}\\% per annum interest rate for a time period of \\bold{${timePeriod}} years`
          ),
          type: 'equation',
        },
      ])
    );
  }, [timePeriod, rateOfInterest, principalAmount]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Principal Amount (P) = ${Number(
            principalAmount
          ).toLocaleString('en-IN')}`,
          type: 'span',
        },
        'br',
        {
          value: `Rate of Interest (ROI) = ${rateOfInterest}`,
          type: 'span',
        },
        'br',
        {
          value: `Time Period (T) = ${timePeriod}`,
          type: 'span',
        },
      ])
    );

    if (!hasValue) return;
    const simpleInterest =
      (Number(principalAmount) * Number(rateOfInterest) * Number(timePeriod)) /
      100;
    const amount = Number(principalAmount) + Number(simpleInterest);
    const finalAnswer = [
      {
        value: putSpace(
          `Simple Interest = \\bold{\\textcolor{green}{₹ ${simpleInterest.toLocaleString(
            'en-IN'
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Total Amount = \\bold{\\textcolor{red}{₹ ${amount.toLocaleString(
            'en-IN'
          )}}}`
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
        value: `<b>Step By Step Solution :</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `We can calculate Simple Interest as: \\frac{Principal*Rate*Time}{100}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Simple Interest = \\frac{${Number(principalAmount).toLocaleString(
            'en-IN'
          )}*${rateOfInterest}*${timePeriod}}{100} = ${simpleInterest.toLocaleString(
            'en-IN'
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Total Amount = ${Number(principalAmount).toLocaleString(
            'en-IN'
          )} + ${simpleInterest.toLocaleString(
            'en-IN'
          )} = ${amount.toLocaleString('en-IN')}`
        ),
        type: 'equation',
      },

      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [showSteps, principalAmount, timePeriod, principalAmount, rateOfInterest]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setprincipalAmount('');
    setrateOfInterest('');
    settimePeriod('');
    setShowResult(false);
  }, [setShowResult]);

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
            <div className="col-4 text-left">Principal Amount (P):</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Enter Principal Amount"
                className="col-12"
                value={principalAmount}
                setVal={setprincipalAmount}
                min={0}
                max={1000000000000}
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Rate of Interest (per annum) (R):
            </div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Enter Rate of Interest in %"
                className="col-12"
                value={rateOfInterest}
                setVal={setrateOfInterest}
                min={0}
                max={10000}
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Time Period (in years) (T):</div>
            <div className="col-8 d-flex justify-content-between gap-1">
              <Input
                type="text"
                className={'col-12'}
                value={timePeriod}
                setVal={settimePeriod}
                min={0}
                max={10000}
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
                placeholder={'Enter Time Period in years'}
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
      {hasValue && (
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

export default SimpleInterest;
