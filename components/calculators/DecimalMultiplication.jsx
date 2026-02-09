'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';

const DecimalMultiplication = () => {
  const [a, setA] = useLocalStorage('DecimalMultiplication_a', '15,6.5');
  const [value, setValue] = useLocalStorage('DecimalMultiplication_value', []);
  const [equation, setEquation] = useLocalStorage('DecimalMultiplication_equation', '');
  const [solution, setSolution] = useLocalStorage('DecimalMultiplication_solution', '');
  const [result, setResult] = useLocalStorage('DecimalMultiplication_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DecimalMultiplication_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DecimalMultiplication_showSteps', true);
  const [note, setNote] = useLocalStorage('DecimalMultiplication_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setA(vals.a);
  }, []);

  useEffect(() => {
    const numbers = a
      .split(`,`)
      .map((s) => s.trim())
      .map(Number);
    setValue(numbers);
  }, [a]);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Multiply the given decimal numbers ${parseNumber(
            value.join(',')
          )}`,
          type: 'span',
        },
      ])
    );
  });

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
             Numbers:-\\space  \\bigg< \\bold{${parseNumber(a || '0')}}\\bigg>`,
          type: 'equation',
        },
      ])
    );
    function getDecimalLength(num) {
      var str = num.toString();
      if (str.indexOf('.') > 0) return str.length - str.indexOf('.') - 1;
      return 0;
    }
    let pureValue = value.map((item) => {
      var str = item.toString();
      while (str[0] == '0' && str.length > 1) str = str.slice(1, str.length);
      return str?.split('.').join('') || str;
    });
    const result = value.reduce((a, b) => a * b, 1);
    const pureResult = pureValue.reduce((a, b) => Number(a) * Number(b), 1);

    let lenArr = value.map((item) => getDecimalLength(item));
    let sumOfLength = lenArr.reduce((a, b) => a + b, 0);
    const finalAnswer = [
      {
        value: `The result of the Multiplication of the given decimal numbers ${parseNumber(
          value.join(',')
        )}  is <b>${parseNumber(result, {}, sumOfLength)}</b>`,
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
        value: `A decimal number is always represented in the form of some integer<br> value placed after a decimal.`,
        type: 'span',
      },
      'br',
      {
        value: ` Given decimal number =  ${value.join(', ')}`,
        type: 'span',
      },
      'br',
      {
        value: `To multiply these numbers, multiply all the numbers without decimal points,`,
        type: 'span',
      },
      'br',
      {
        value: `then put the decimal point in the answer.`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...value
        .map((item, i) => {
          return [
            {
              value: `${item} has ${lenArr[i]} decimal places`,
              type: 'span',
            },
            'br',
          ];
        })
        .flat(),
      'br',
      {
        value: `Total decimal places = ${lenArr.join(' + ')} = ${sumOfLength}`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, we have to multiply all the numbers without decimals i.e.`,
        type: 'span',
      },
      'br',
      {
        value: `${pureValue.join(' x ')} = ${pureResult}`,
        type: 'span',
      },
      'br',
      {
        value: `We need to place the decimal point 6 places from the right i.e. `,
        type: 'span',
      },
      'br',
      {
        value: parseNumber(result, {}, sumOfLength),
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
  }, [showSteps, a, value]);

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
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = value.some((v) => !!v && v != '0');

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            Your input can be in form of real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Decimal Numbers:</div>
            <div className="col-9">
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
      <div className="mt-3 mb-3">
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

export default DecimalMultiplication;
