'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';

const Factorial = () => {
  const [p, setP] = useState('3');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.p) setP(vals.p);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Calculate the value of ${parseNumber(p || 'p')}!`,
          type: 'span',
        },
      ])
    );
  }, [p]);

  useEffect(() => {
    const isInvalid = [p].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Number: - < ${parseNumber(p || 'p')} >  `,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    const DefaultSolution = () => {
      const numArr = [];
      for (let i = p; i >= 1; i--) {
        numArr.push(i);
      }
      //factorial
      function factorialize(num) {
        var result = num;
        if (num === 0 || num === 1) return 1;
        while (num > 1) {
          num--;
          result *= num;
        }
        return result;
      }

      const finalAnswer = [
        {
          value: `The value of ${parseNumber(p)}! is ${factorialize(p)}`,
          type: 'span',
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
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: `The Factorial of a non-negative integer n is denoted by n!`,
          type: 'span',
        },
        'br',
        {
          value: `and it is defined as the product of all positive integers less than or equal to n.`,
          type: 'span',
        },
        'br',
        {
          value: `n! = (n).(n-1).(n-2).(n-3)…...(1)`,
          type: 'span',
        },
        'br',
        {
          value: `<b>Step-1</b>`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: `Given number = ${parseNumber(p)}`,
          type: 'span',
        },
        'br',
        {
          value: `${parseNumber(p)}! = ${numArr.join('. \n')}`,
          type: 'span',
        },
        'br',
        {
          value: `${parseNumber(p)}! = ${factorialize(p)}`,
          type: 'span',
        },
        'hr',
        {
          value: `<b>Final Answer</b>`,
          className: 'text-decoration-und',
          type: 'span',
        },
        'br',
        ...finalAnswer,
      ];
      return steps;
    };

    const getCase1Solution = () => {
      return [
        {
          value: `Factorial of 0 is 1 i.e., <b>0! = 1</b>`,
          type: 'span',
        },
      ];
    };

    let steps;

    const case1 = p === '0';
    if (case1) {
      steps = getCase1Solution();
    } else {
      steps = DefaultSolution();
    }
    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [p, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setP('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter a number:</div>
            <div className="col-9">
              <Input
                placeholder="Enter a number"
                autoComplete="off"
                className="col-12"
                value={p}
                setVal={setP}
                pattern={/^((\d)*)\d*$/}
                max={10000}
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

export default Factorial;
