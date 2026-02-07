'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}
const AgeCalculator = () => {
  const [dateOfBirth, setDateOfBirth] = useState(new Date('06-21-1994'));
  const [calculationDate, setCalculationDate] = useState(
    new Date('01-24-2025')
  );

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [note, setNote] = useState('');

  const hasValue = dateOfBirth && calculationDate;

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
            `Calculate the age of the person on \\bold{${calculationDate.toLocaleDateString(
              'en-GB'
            )}} whose date of birth is \\bold{${dateOfBirth.toLocaleDateString(
              'en-GB'
            )}}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [calculationDate, dateOfBirth]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Date of Birth (DOB) = ${dateOfBirth.toLocaleDateString(
            'en-GB'
          )}`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate Age on Date = ${calculationDate.toLocaleDateString(
            'en-GB'
          )}`,
          type: 'span',
        },
      ])
    );
    if (!hasValue) return;

    const dob = new Date(dateOfBirth);
    const calcDate = new Date(calculationDate);

    if (dob > calcDate) {
      setResult('Error: Date of Birth cannot be after the Calculation Date.');
      setShowResult(false);
      return;
    }

    let years = calcDate.getFullYear() - dob.getFullYear();
    let months = calcDate.getMonth() - dob.getMonth();
    let days = calcDate.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(
        calcDate.getFullYear(),
        calcDate.getMonth(),
        0
      ).getDate();
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const age = `${years} years, ${months} months, ${days} days`;

    setResult(
      renderSteps([
        {
          value: putSpace(`Age = \\bold{${age}}`),
          type: 'equation',
        },
      ])
    );

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `1. Adjust days: \\bold{${calcDate.getDate()} - ${dob.getDate()} = ${days} days (adjusted if negative)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `2. Adjust months: \\bold{${calcDate.getMonth() + 1} - ${
            dob.getMonth() + 1
          } = ${months} months (adjusted if negative)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `3. Calculate the difference in years: \\bold{${calcDate.getFullYear()} - ${dob.getFullYear()} = ${years} years}`
        ),
        type: 'equation',
      },

      {
        value: `<b>Final Answer:</b>`,
        type: 'span',
      },
      {
        value: putSpace(`Age = \\bold{${age}}`),
        type: 'equation',
      },
    ];

    const solutionRender = renderSteps(steps);
    setSolution(solutionRender);
  }, [dateOfBirth, calculationDate, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, []);

  const toggleSteps = useCallback(() => setShowSteps((prev) => !prev), []);

  const clear = useCallback(() => {
    setDateOfBirth(new Date());
    setCalculationDate(new Date());
    setShowResult(false);
    setShowSteps(false);
  }, []);

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
            Please enter valid dates for the calculation.
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Date of Birth (DOB):</div>
            <div className="col-8">
              <input
                type="date"
                placeholder="Enter your date of birth"
                className="col-12 form-control"
                value={getFormattedDate(dateOfBirth)}
                onChange={(e) => setDateOfBirth(new Date(e.target.value))}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Calculate Age on Date:</div>
            <div className="col-8">
              <input
                type="date"
                placeholder="Enter the calculation date"
                className="col-12 form-control"
                value={getFormattedDate(calculationDate)}
                onChange={(e) => setCalculationDate(new Date(e.target.value))}
                disabled={false}
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
          Clear
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
            <strong>Note :-</strong> If you find any computational or logical
            errors in this calculator, please share your suggestions in the
            comment box.
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

export default AgeCalculator;
