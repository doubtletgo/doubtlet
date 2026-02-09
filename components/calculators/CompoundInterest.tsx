'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import Input from '../common/input';
type CompoundType =
  | 'Continuously'
  | 'Anually'
  | 'Semianually'
  | 'Quarterly'
  | 'Monthly'
  | 'Weekly'
  | 'Daily';
const CompoundInterest = () => {
  const [principalAmount, setPrincipalAmount] = useLocalStorage('CompoundInterest_principalAmount', '100000');
  const [rateOfInterest, setRateOfInterest] = useLocalStorage('CompoundInterest_rateOfInterest', '6.2');
  const [timePeriod, setTimePeriod] = useLocalStorage('CompoundInterest_timePeriod', '5.5');
  const [compoundedAs, setCompoundedAs] = useLocalStorage<CompoundType>('CompoundInterest_compoundedAs', 'Continuously');
  const [equation, setEquation] = useLocalStorage('CompoundInterest_equation', '');
  const [solution, setSolution] = useLocalStorage('CompoundInterest_solution', '');
  const [result, setResult] = useLocalStorage('CompoundInterest_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('CompoundInterest_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('CompoundInterest_showSteps', true);
  const [note, setNote] = useLocalStorage('CompoundInterest_note', undefined);

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
            `Calculate the Compound Interest on the principal compoundInterest of \\bold{${Number(
              principalAmount
            ).toLocaleString(
              'en-IN'
            )}} on \\bold{${rateOfInterest}}\\% per annum interest rate ${compoundedAs} for a time period of \\bold{${timePeriod}} years`
          ),
          type: 'equation',
        },
      ])
    );
  }, [timePeriod, rateOfInterest, principalAmount, compoundedAs]);

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
          value: `Rate of Interest (ROI) = ${rateOfInterest} \%`,
          type: 'span',
        },
        'br',
        {
          value: `Compounded = ${rateOfInterest}`,
          type: 'span',
        },
        'br',
        {
          value: `Time Period (T) = ${timePeriod} years`,
          type: 'span',
        },
      ])
    );

    if (!hasValue) return;
    
    const nValues = compoundedAs == 'Continuously' ? '': compoundedAs == 'Daily'  ? 365 : compoundedAs == 'Weekly' ? 52 : compoundedAs == 'Monthly' ? 12 : compoundedAs == 'Quarterly' ? 4 : compoundedAs == 'Semianually' ? 2 : 1;     
    const amount = compoundedAs == 'Continuously' ?   Number(principalAmount) * Math.exp(Number(rateOfInterest) * Number(timePeriod)) : Number(principalAmount) * Math.pow(1 + Number(rateOfInterest) / (100 * (+nValues)), (+nValues) * (+timePeriod));
    const compoundInterest = amount - (+principalAmount);

    const finalAnswer = [
        {
          value: putSpace(`Compound Interest = ${compoundInterest}`),
          type: 'equation',
        },
        {
          value: putSpace(`Total Amount = ${amount}`),
          type: 'equation',
        }
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

    const compoundedAsValues = compoundedAs == 'Continuously' ? [] :    [
      {
        value: putSpace(`Since rate of interest is compounded ${compoundedAs} then n = ${compoundedAs == 'Daily'  ? 365 : compoundedAs == 'Weekly' ? 52 : compoundedAs == 'Monthly' ? 12 : compoundedAs == 'Quarterly' ? 4 : compoundedAs == 'Semianually' ? 2 : 1 }`),
        type: 'equation',  
      }
    ];
    
    const amountSteps = compoundedAs == 'Continuously' ? [
      {
        value: putSpace(`Amount (A) = P.e^{rt} = ${principalAmount}.e^{(${rateOfInterest})(${timePeriod})} = ${amount}`),
        type: 'equation'
      }
    ] : [
      {
        value : putSpace(`Amount (A) = (${principalAmount})\\big(1 + \\frac{${rateOfInterest}}{(100)(${nValues})}\\big)^{(${nValues})(${timePeriod})} = ${amount}`),
        type  : 'equation'
      }
    ]

    const steps = [
      {
        value: `<b>Step By Step Solution :</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `We can calculate Amount as:A = ${compoundedAs == 'Continuously' ? 'P.e^{rt}' : 'P(1 + \\frac{R}{(100)(n)})^{nt}'}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Where, Compound Interest = Amount - Principal`),
        type: 'equation',
      },
      ...compoundedAsValues,
      ...amountSteps,
      {
        value: putSpace(
          `Compound Interest = ${amount} - ${principalAmount} = ${compoundInterest}`
        ),
        type: 'equation',
      },'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [showSteps, principalAmount, timePeriod, principalAmount, rateOfInterest, compoundedAs]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setPrincipalAmount('');
    setRateOfInterest('');
    setTimePeriod('');
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
                setVal={setPrincipalAmount}
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
            <Input
              type="text"
              placeholder="Enter Rate of Interest in %"
              className="col-3"
              value={rateOfInterest}
              setVal={setRateOfInterest}
              min={0}
              max={10000}
              pattern={/^(\d)*(\.\d*)?$/}
              disabled={false}
            />{' '}
            <div className="col-4">
              <select
                onChange={(e) =>
                  setCompoundedAs(e.target.value as CompoundType)
                }
                value={compoundedAs}
                className="form-select border-primary"
              >
                <option value="Continuously">Continuously</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semianually">Semianually</option>
                <option value="Anually">Anually</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Time Period (in years) (T):</div>
            <div className="col-8 d-flex justify-content-between gap-1">
              <Input
                type="text"
                className={'col-12'}
                value={timePeriod}
                setVal={setTimePeriod}
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

export default CompoundInterest;
