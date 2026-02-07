'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';

const LowestCommonMultiple = () => {
  const [a, setA] = useState('53,6,3,4,1');
  const [parsedNum, setParsedNum] = useState([]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [method, setMethod] = useState('PrimeFactors');

  const isPrimeFactors = method === 'PrimeFactors';
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setA(vals.a);
  }, []);
  useEffect(() => {
    const numbers = a
      .split(`,`)
      .map((s) => s.trim())
      .map(Number);
    setParsedNum(numbers);
  }, [a]);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Findthe <b>LCM</b>  of the give  numbers  i.e., <b>${
            parsedNum.length ? parsedNum.join(', ') : '0'
          }</b> by  using  ${
            isPrimeFactors ? `<b>Prime factors</b>` : `<b>multipliers </b>`
          }  method.`,
          type: 'span',
        },
      ])
    );
  }, [isPrimeFactors, setNote, parsedNum]);
  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: ` 
            Numbers : - <<b>${
              parsedNum.length ? parsedNum.join(', ') : '0'
            }</b>>
          `,
          type: 'span',
        },
      ])
    );

    const arr = a.split(',');
    let divisionArr = [];
    let arrTemp = arr || [];
    function factor(a) {
      if (isNaN(a) || !isFinite(a) || a % 1 != 0 || a == 0) return '' + a;
      if (a < 0) return '-' + factor(-a);
      var minFactor = leastFactor(a);
      let val = { minFactor, a };
      divisionArr = [...divisionArr, val];
      if (a == minFactor) return '' + a;
      return minFactor + '*' + factor(a / minFactor);
    }
    function leastFactor(a) {
      arrTemp = [...arrTemp, a];
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

    function getTable(value, length) {
      const arrTable = [];
      for (let i = 1; i <= length; i++) {
        arrTable.push(i * value);
      }
      return arrTable;
    }

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const answer = arr.reduce(lcm);

    const finalAnswer = [
      {
        value: `The LCM of the given numbers i.e., <b>${
          parsedNum.length ? parsedNum.join(', ') : '0'
        }</b> by using ${
          isPrimeFactors ? `<b>Prime factors</b>` : `<b>multipliers </b>`
        } is <b>${parseNumber(answer)}</b>`,
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
        value: `We know that the LCM of (a, b, c) is the <b>Smallest Positive</b> number that is <b>divisible</b> by all the given numbers.`,
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
        value: `Given set of numbers =${
          parsedNum.length ? parsedNum.join(', ') : '0'
        }`,
        type: 'span',
      },
      'br',
      ...arr.map((value) => {
        return {
          value: isPrimeFactors
            ? `Find the prime factors of 
          ${parseNumber(value)} = ${factor(value)} <br>
          <a href = "/calculator/prime-factorization-calculator/?a=${parseNumber(
            value
          )}" target="_blank">to see Steps click here</a> <br>`
            : `The multipliers of  ${value} =${getTable(
                value,
                answer / value
              )}.... <br>`,
          type: 'span',
        };
      }),
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: isPrimeFactors
          ? `Now we have to compute a number comprised of factors that appear in at least one of the following <br>`
          : `Now we have to compute a smallest common multiple from above values
        Smallest common multiple is ${answer}`,
        type: 'span',
      },
      {
        value: isPrimeFactors ? `${factor(answer)}=${parseNumber(answer)}` : '',
        type: 'span',
      },
      'br',
      {
        value: `Hence, LCM of ${
          parsedNum.length ? parsedNum.join(', ') : '0'
        } is <b>${parseNumber(answer)}.</b>`,
        type: 'span',
      },
      'hr',
      {
        value: `Final Answer `,
        type: 'h6',
      },
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [parsedNum, a, showSteps, isPrimeFactors]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeMethod = (event) => {
    setMethod(event.target.value);
  };

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = parsedNum.some((v) => !!v && v != '0');

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
            Your input can be in form of only Positive Integer values.
          </div>
          <div className="row mb-4 align-items-center">
            <div className="dropdown row mb-2 align-items-center">
              <div className="col-4 text-left">Select Method Type:</div>
              <div className="col-8">
                <select
                  className="form-select border-primary "
                  aria-label="Default select example"
                  value={method}
                  onChange={onChangeMethod}
                >
                  <option value="PrimeFactors">By using Prime factors</option>
                  <option value="Multipliers">By using Multipliers</option>
                </select>
              </div>
            </div>
            Enter the Values in Box:
            <div className="col-8 ">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seprated values"
                value={a}
                onChange={(e) => setA(e.target.value)}
              />{' '}
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
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger"
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
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default LowestCommonMultiple;
