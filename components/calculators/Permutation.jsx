'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { factorial } from 'mathjs';

const Permutation = () => {
  const [p, setP] = useLocalStorage('Permutation_p', '8');
  const [q, setQ] = useLocalStorage('Permutation_q', '3');
  const [equation, setEquation] = useLocalStorage('Permutation_equation', '');
  const [solution, setSolution] = useLocalStorage('Permutation_solution', '');
  const [result, setResult] = useLocalStorage('Permutation_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Permutation_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('Permutation_showSteps', true);
  const [note, setNote] = useLocalStorage('Permutation_note', undefined);
  const [order, setOrder] = useLocalStorage('Permutation_order', 'Without-Repetition');
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
          value: `Calculate the number of possible permutations of <b>${parseNumber(
            p || 'n'
          )} </b>
          things taken <b>${parseNumber(
            q || 'r'
          )}</b> at a time <b>${order}</b>`,
          type: 'span',
        },
      ])
    );
  }, [p, q, order]);

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
          value: `Value of n = < <b>${parseNumber(p || 'p')}</b>>`,
          type: 'span',
        },
        'br',
        {
          value: `Value of r = < <b>${parseNumber(q || 'r')}</b>>`,
          type: 'span',
        },
        'br',
        {
          value: `Type  = <b>${order}</b>`,
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
      function arrangements(n, r) {
        n = parseNumber(n);
        r = parseNumber(r);
        if (r == 0) return 1;
        else {
          var result = 1;
          for (var i = 0; i < r; i++) {
            result = n * result;
          }
          return result;
        }
      }
      let finalAnswer = [];
      if (order == 'Without-Repetition') {
        finalAnswer = [
          {
            value: `The value of <sup>${parseNumber(
              p
            )}</sup>P<sub>${parseNumber(q)}</sub> 
          is <b>${npr_calculation(parseNumber(p), parseNumber(q))}</b>`,
            type: 'span',
          },
        ];
      } else {
        finalAnswer = [
          {
            value: `The value of ${parseNumber(p)}<sup>${parseNumber(q)}</sup> 
          is <b>${arrangements(parseNumber(p), parseNumber(q))}</b>`,
            type: 'span',
          },
        ];
      }

      const equations = [
        {
          type: 'h6',
          value: `Answer`,
        },
        ...finalAnswer,
      ];
      const invalid_entry = [
        {
          type: 'h6',
          value: `Answer`,
        },
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

      let msg_combination = ``;
      let soln_step = ``;
      //let n =

      if (order == 'Without-Repetition') {
        soln_step = `The \\space value \\space of  {${parseNumber(
          p
        )} \\choose ${parseNumber(q)}}  
= {${parseNumber(p)}!\\above{1pt}(${p + '-' + q})!}
= {${parseNumber(p)}!\\above{1pt}(${p - q})!}
= {${factorial(p)}\\above{1pt}(${factorial(p - q)})}
\\space \\space = ${npr_calculation(p, q)}`;
        msg_combination = `<sup>n</sup> P <sub>r</sub> where or <sup>n</sup> P <sub>r</sub>`;
      } else if (order == 'With-Repetition') {
        soln_step = `Number \\space of \\space such \\space permutations
        \\space \\def\\sqr#1{#1^${q}} \\sqr{${p}}
\\space \\space = ${arrangements(parseNumber(p), parseNumber(q))}`;
        msg_combination = `n.n.n.n...........n(r times)  = n<sup>r</sup> ways`;
      }
      const steps = [
        {
          value: `<b>Step By Step Solution :-</b>`,
          type: 'span',
        },
        'br',
        {
          value: `The number of possible ways of arrangements of n things taken r at a time </br> ${order} repetition is represented as ${msg_combination}`,
          type: 'span',
        },
        'br',
        {
          value: `Value of n and r can be a whole number only &amp; n ≥ r ≥ 0.`,
          type: 'span',
        },
        'br',
        {
          value: `Permutation includes the selection of things such that order of arrangements
          matters.`,
          type: 'span',
        },
        'br',
        {
          value: `Step-1`,
          type: 'h6',
          className: 'text-decoration-underline',
        },
        {
          value: `Given number n = ${parseNumber(p)} , r = ${parseNumber(q)}`,
          type: 'span',
        },
        'br',
        {
          value: `${soln_step}`,
          type: 'equation',
        },

        {
          value: `<a href="/calculator/npr-calculator" target="_blank">to see steps for npr calculation click here</a>`,
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
          value: `Mathematical Limitations..! Unable to calculate <b>0<sup>${parseNumber(
            q
          )}</sup></b>`,
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
        setShowSteps(false);
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
  }, [p, q, showSteps, order]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

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
                min={0}
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
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Constraint:</div>
            <div className="col-9">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Without-Repetition">Without Repetition</option>
                <option value="With-Repetition">With Repetition</option>
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

export default Permutation;
