'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';

const FactorsOfANumber = () => {
  const [a, setA] = useLocalStorage('FactorsOfANumber_a', '12');
  const [equation, setEquation] = useLocalStorage('FactorsOfANumber_equation', '');
  const [solution, setSolution] = useLocalStorage('FactorsOfANumber_solution', '');
  const [result, setResult] = useLocalStorage('FactorsOfANumber_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FactorsOfANumber_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FactorsOfANumber_showSteps', true);
  const [note, setNote] = useLocalStorage('FactorsOfANumber_note', undefined);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.a) setA(vals.a);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Find the <b>All the possible factors</b> of the number <b>${parseNumber(
            a || '1'
          )}</b>.`,
          type: 'span',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    const isInvalid = isNaN(a);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Number:- <b>< ${parseNumber(a || '1')} ></b>`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    function factor(a) {
      if (isNaN(a) || !isFinite(a) || a % 1 != 0 || a == 0) return '' + a;
      if (a < 0) return '-' + factor(-a);
      var minFactor = leastFactor(a);
      if (a == minFactor) return '' + a;

      return minFactor + '*' + factor(a / minFactor);
    }

    function leastFactor(a) {
      if (isNaN(a) || !isFinite(a)) return a;
      if (a == 0) {
        return 0;
      }
      if (a % 1 || a * a < 2) {
        return 1;
      }
      if (a % 2 == 0) {
        return 2;
      }
      if (a % 3 == 0) {
        return 3;
      }
      if (a % 5 == 0) {
        return 5;
      }
      var m = Math.sqrt(a);
      for (var i = 7; i <= m; i += 30) {
        if (a % i == 0) return i;
        if (a % (i + 4) == 0) return i + 4;
        if (a % (i + 6) == 0) return i + 6;
        if (a % (i + 10) == 0) return i + 10;
        if (a % (i + 12) == 0) return i + 12;
        if (a % (i + 16) == 0) return i + 16;
        if (a % (i + 22) == 0) return i + 22;
        if (a % (i + 24) == 0) return i + 24;
      }

      return a;
    }

    let sqrt = Math.pow(a, 0.5);
    const fact1 = [];
    const fact2 = [];
    for (let i = 1; i < sqrt; i++) {
      if (a % i === 0) {
        fact1.push(i);
        fact2.push(a / i);
      }
    }
    if (sqrt % 1 === 0) {
      fact2.push(sqrt);
    }
    const allFactors = [...fact1, ...fact2.reverse()];

    const result = factor(a);

    const finalAnswer = [
      {
        value: `All the possible factors of the number ${parseNumber(a)} are:`,
        type: 'span',
      },
      'br',
      {
        value: `<b>${allFactors}</b>`,
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
      },
      'br',
      {
        value: `Given Number = ${parseNumber(a)}`,
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
        value: `Find the prime factors of ${parseNumber(a)}`,
        type: 'span',
      },
      'br',
      {
        value: `<a href = "/calculator/prime-factorization-calculator/?a=${a}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `The Prime factorization of the number ${parseNumber(
          a
        )} is <b>${result}</b>`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Multiply all the prime factors of ${parseNumber(a)}`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `1 and Number ${parseNumber(
          a
        )} itself are also considered in the factors.`,
        type: 'span',
      },
      'br',
      {
        value: `Hence, Factors of ${parseNumber(a)} are ${allFactors}`,
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
  }, [a, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a].some((v) => !!v && v != '0');

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
            Your input can be in form of only Integer
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Number:</div>
            <div className="col-9">
              <Input
                placeholder="a"
                autoComplete="off"
                className="col-12"
                value={a}
                setVal={setA}
                min={0}
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

export default FactorsOfANumber;
