'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import Input from '../common/input';

const EightthPayCommission = () => {
  const [basicSalary, setBasicSalary] = useLocalStorage('8thPayCommission_basicSalary', '50200');
  const [fitmentFactor, setFitmentFactor] = useLocalStorage('8thPayCommission_fitmentFactor', '1.86');
  const [expectedDA, setExpectedDA] = useLocalStorage('8thPayCommission_expectedDA', '0');
  const [hraCityClass, setHraCityClass] = useLocalStorage<'X' | 'Y' | 'Z'>('8thPayCommission_hraCityClass', 'X');
  const [equation, setEquation] = useLocalStorage('8thPayCommission_equation', '');
  const [solution, setSolution] = useLocalStorage('8thPayCommission_solution', '');
  const [result, setResult] = useLocalStorage('8thPayCommission_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('8thPayCommission_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('8thPayCommission_showSteps', true);
  const [note, setNote] = useLocalStorage('8thPayCommission_note', undefined);

  const hasValue =
    basicSalary &&
    +basicSalary > 0 &&
    fitmentFactor &&
    +fitmentFactor > 0 &&
    +fitmentFactor < 5 &&
    expectedDA &&
    +expectedDA >= 0 &&
    +expectedDA <= 200;

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setExpectedDA(vals.x);
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
          value: putSpace(
            `Calculate the 8^{th} pay commission salary when Basic Salary is ${Number(
              basicSalary
            ).toLocaleString(
              'en-IN'
            )} with fitment factor of ${fitmentFactor} and ${expectedDA}\\% DA in ${hraCityClass} class city.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expectedDA, fitmentFactor, basicSalary, hraCityClass]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Basic Salary = ${Number(basicSalary).toLocaleString(
            'en-IN'
          )}`,
          type: 'span',
        },
        'br',
        {
          value: `Fitment Factor = ${fitmentFactor}`,
          type: 'span',
        },
        'br',
        {
          value: `Expected DA = ${expectedDA}`,
          type: 'span',
        },
        'br',
        {
          value: `HRA City Class = ${hraCityClass}`,
          type: 'span',
        },
      ])
    );

    if (!hasValue) return;
    const newBasicSalary = Number(basicSalary) * Number(fitmentFactor);
    const expectedSalary = (newBasicSalary * Number(expectedDA)) / 100;
    const cityFactor =
      hraCityClass == 'X' ? 0.3 : hraCityClass == 'Y' ? 0.2 : 0.1;
    const hraInXCity = Number(newBasicSalary) * cityFactor;
    const netTotal = (
      newBasicSalary +
      expectedSalary +
      hraInXCity
    ).toLocaleString('en-IN');

    const finalAnswer = [
      {
        value: putSpace(
          `\\large{Net Total Salary (Basic + DA + HRA) = \\bold{\\textcolor{green}{₹ ${netTotal}}}}`
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
        value: putSpace(
          `Current Basic Salary = ${Number(basicSalary).toLocaleString(
            'en-IN'
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Expected Fitment Factor = ${fitmentFactor}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `New Basic Salary = ${Number(basicSalary).toLocaleString(
            'en-IN'
          )} x ${fitmentFactor} = ${newBasicSalary.toLocaleString('en-IN')}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `Expected (DA) = ${newBasicSalary.toLocaleString(
            'en-IN'
          )} x \\frac{${expectedDA}}{100} = ${expectedSalary.toLocaleString(
            'en-IN'
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `HRA in ${hraCityClass} City = ${Number(
            newBasicSalary
          ).toLocaleString('en-IN')} x \\frac{${
            cityFactor * 100
          }}{100} = ${hraInXCity.toLocaleString('en-IN')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Net Total Salary = ${newBasicSalary.toLocaleString(
            'en-IN'
          )} + ${expectedSalary.toLocaleString(
            'en-IN'
          )} + ${hraInXCity.toLocaleString('en-IN')} = \\bold{₹ ${netTotal}}`
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
  }, [
    showSteps,
    basicSalary,
    expectedDA,
    basicSalary,
    fitmentFactor,
    hraCityClass,
  ]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpectedDA('');
    setHraCityClass('X');
    setBasicSalary('');
    setFitmentFactor('');
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
            <div className="col-4 text-left">Basic Salary:-</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="basicSalary"
                className="col-12"
                value={basicSalary}
                setVal={setBasicSalary}
                min={0}
                max={10000000}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Fitment Factor:-</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Fitment factor"
                className="col-12"
                value={fitmentFactor}
                setVal={setFitmentFactor}
                min={-0.0001}
                max={5.000001}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Expected DA (%):-</div>
            <div className="col-8 d-flex justify-content-between gap-1">
              <Input
                type="text"
                className={'col-12'}
                value={expectedDA}
                setVal={setExpectedDA}
                min={-0.000001}
                max={100.00001}
                pattern={/^(\d*)?$/}
                disabled={false}
                placeholder={'DA'}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">HRA City Class:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={hraCityClass}
                onChange={(e) =>
                  setHraCityClass(e.target.value as 'X' | 'Y' | 'Z')
                }
              >
                <option value="X">X</option>
                <option value="Y">Y</option>
                <option value="Z">Z</option>
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

export default EightthPayCommission;
