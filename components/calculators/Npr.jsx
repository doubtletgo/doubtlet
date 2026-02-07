'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { factorial } from 'mathjs';

const NPR = () => {
  const [p, setP] = useState('3');
  const [q, setQ] = useState('2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  // const ourArray = [""];
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate the value of <sup>${parseNumber(
            p || 'n'
          )}</sup>P<sub>${parseNumber(q || 'r')}</sub>`,
          type: 'span',
        },
      ])
    );
  }, [p, q]);

  useEffect(() => {
    const isInvalid_p = [p].some((x) => isNaN(x));
    const isInvalid_q = [q].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: ` <b>Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Value of n: - < <b>${parseNumber(p || 'n')}</b> >  `,
          type: 'span',
        },
        'br',
        {
          value: `Value of r: - <<b> ${parseNumber(q || 'r')} </b>>  `,
          type: 'span',
        },
        'br',
        {
          value: `<sup>n</sup>P<sub>r</sub> : - < <sup><b>${parseNumber(
            p || 'n'
          )}</b></sup>P<sub><b>${parseNumber(q || 'r')}</b></sub> >  `,
          type: 'span',
        },
      ])
    );

    if (isInvalid_p) return;
    if (isInvalid_q) return;

    const DefaultSolution = () => {
      const numArr = [];
      for (let i = p; i >= 1; i--) {
        numArr.push(i);
      }
      const denominatorArr = [];
      for (let i = q; i >= 1; i--) {
        denominatorArr.push(i);
      }
      function npr_calculation(num_n, num_r) {
        num_n = parseNumber(num_n);
        num_r = parseNumber(num_r);
        if (num_n >= num_r) {
          var factorial_n = factorial(num_n);
          var factorial_n_r = factorial(num_n - num_r);
          var result = factorial_n / factorial_n_r;
        } else {
          var result = 'NA';
        }
        return result;
      }

      const finalAnswer = [
        {
          value: `The value of <sup>${parseNumber(p)}</sup>P<sub>${parseNumber(
            q
          )}</sub> is <b>${npr_calculation(
            parseNumber(p),
            parseNumber(q)
          )}</b>`,
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
      const invalid_entry = [
        {
          type: 'span',
          value: `<b>Answer</b>`,
        },
        'br',
        {
          value: `Invalid Input`,
          type: 'span',
        },
      ];

      let invalidCase;
      if (parseNumber(q) > parseNumber(p)) invalidCase = true;
      if (!invalidCase) {
        const eqRender = renderSteps(equations);
        setResult(eqRender);
      } else {
        setResult(renderSteps(invalid_entry));
      }

      if (!showSteps) return;

      const steps = [
        {
          value: `<b>Step By Step Solution :-</b>`,
          type: 'span',
        },
        'br',
        ,
        {
          value: `The \\space value \\space of \\dbinom n r = {n! \\above{1pt} (n-r)!}`,
          type: 'equation',
        },
        'br',
        {
          value: `Value of n and r can be a whole number only &amp; n ≥ r ≥ 0.`,
          type: 'span',
        },
        'br',
        {
          value: `Step-1`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        {
          value: `Given number n = ${parseNumber(p)} , r = ${parseNumber(q)}`,
          type: 'span',
        },
        'br',
        {
          value: `The \\space value \\space of  {${parseNumber(
            p
          )} \\choose ${parseNumber(q)}}  
          = {${parseNumber(p)}!\\above{1pt}(${p + '-' + q})!}
          = {${parseNumber(p)}!\\above{1pt}(${p - q})!}
          = {${factorial(p)}\\above{1pt}(${factorial(p - q)})}
          \\space \\space = ${npr_calculation(p, q)}`,
          type: 'equation',
        },
        'br',
        {
          value: `<a href="/calculator/factorial-calculator?p=${p}" target="_blank" > to see steps factorial click here</a>`,
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

    const InvalidCase = () => {
      return [
        {
          value: `Value of n and r can be a whole number only &amp; n ≥ r ≥ 0.`,
          type: 'span',
        },
      ];
    };

    let steps;

    const case1 = p === '0';
    let invalidCase;
    if (parseNumber(q) > parseNumber(p)) invalidCase = true;

    if (!invalidCase) {
      if (case1) {
        steps = getCase1Solution();
      } else {
        steps = DefaultSolution();
      }
    } else {
      steps = InvalidCase();
    }
    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [p, q, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setP('');
    setQ('');
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
            Your input can be in form of only be whole number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter value for n:</div>
            <div className="col-9">
              <Input
                placeholder="Enter a whole number only"
                autoComplete="off"
                className="col-12"
                value={p}
                setVal={setP}
                pattern={/^((\d)*)\d*$/}
                max={10000}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter value of r:</div>
            <div className="col-9">
              <Input
                placeholder="Enter a whole number only"
                autoComplete="off"
                className="col-12"
                value={q}
                setVal={setQ}
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

export default NPR;
