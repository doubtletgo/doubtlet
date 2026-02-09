'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { parseNumber } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';

const DecimalNumberAddition = () => {
  const [a, setA] = useLocalStorage('DecimalNumberAddition_a', '13.719,94.850,6.020');
  const [value, setValue] = useLocalStorage('DecimalNumberAddition_value', []);
  const [equation, setEquation] = useLocalStorage('DecimalNumberAddition_equation', '');
  const [solution, setSolution] = useLocalStorage('DecimalNumberAddition_solution', '');
  const [result, setResult] = useLocalStorage('DecimalNumberAddition_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DecimalNumberAddition_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DecimalNumberAddition_showSteps', true);
  const [note, setNote] = useLocalStorage('DecimalNumberAddition_note', undefined);

  useEffect(() => {
    const numbers = a
      .split(`,`)
      .map((s) => s.trim())
      .map(Number);
    setValue(numbers);
  }, [a]);
  const addition = value.reduce((a, c) => a + c, 0);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Add the given decimal numbers ${parseNumber(
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
  Decimal\\space Numbers:-\\space  \\bigg< \\bold{${parseNumber(a)}}\\bigg>`,
          type: 'equation',
        },
      ])
    );

    if (!a || !value) return;
    function putZero(arr) {
      const lenDecimal = arr.map(
        (item) => item.toString().split('.')[0]?.length || item.length
      );
      const lenNormal = arr.map(
        (item) => item.toString().split('.')[1]?.length || 0
      );
      let maxBeforePoint = Math.max(...lenDecimal);
      let maxAfterPoint = Math.max(...lenNormal);
      var newArr = arr.map((item) => {
        let start = item.toString()?.split('.')[0] || item;
        let end = item.toString()?.split('.')[1] || '';
        return (
          '0'.repeat(maxBeforePoint - start.length) +
          start +
          '.' +
          end +
          '0'.repeat(maxAfterPoint - end.length)
        );
      });
      return newArr;
    }
    const vals = putZero(value);

    if (!vals) return;
    const allSteps = () => {
      let useIndex = vals[0]?.length - 1;

      let carry = 0;
      let steps = [];
      let addResult = [...addition.toString()].join('');
      let len = addResult.length - 1;
      for (let i = 0; i < vals[0]?.length; i++) {
        if (vals[0][useIndex] != '.') {
          let join = vals.map((a) => a[useIndex]).join('+');
          let add = vals
            .map((a) => Number(a[useIndex]))
            .reduce((acc, curr) => acc + curr, 0);
          let addAll = addResult.slice(len, addResult.length);
          if (carry != 0) add += carry;

          let step = `<br>
                <b>Step-${i + 1}</b><br>
                Now first, we have to add the digits of the bold column i.e. <br>
               ${carry == 0 ? join : carry + '+' + join}
                &#160;=&#160;<b className="text-success"> ${add}</b><br>
              Here &#160;<b className="text-danger">${carry}</b> will go as a carry to be added in the next step.<br>
              <b className="text-danger">
             ${['&#160;'.repeat(useIndex * 2.6), carry].join('&#160;')}</b>
               <br>
               ${vals.map((item) => [...item].join(' ')).join('<br>')}
              <br>
                ${'-'.repeat(vals[0].length + 10)}<br>
              <b className="text-primary">
              ${[
                '&#160;'.repeat(useIndex * 3),
                useIndex == 0
                  ? [...addResult].join(' ')
                  : [...addAll].join(' '),
              ].join('&#160;')}</b>`;
          carry = Math.floor(add / 10);
          steps.push(step);
        }
        useIndex--;
        len--;
      }
      return steps;
    };
    const finalAnswer = [
      {
        value: `The result of the Addition of the given decimal numbers ${parseNumber(
          value.join(',')
        )} is <b className="text-primary">${parseNumber(addition) || '0'}</b>`,
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
        value: `A decimal number is always represented in the form of some integer value placed after a decimal.`,
        type: 'span',
      },
      'br',
      {
        value: ` Given decimal number =  ${value.join(',')}`,
        type: 'span',
      },
      'br',
      {
        value: `To add these numbers `,
        type: 'span',
      },
      'br',
      {
        value: `• Write all the given numbers one under the other by lining up the decimal poin`,
        type: 'span',
      },
      'br',
      {
        value: `• Add trailing zeroes so that all the numbers should have the same length.<br> `,
        type: 'span',
      },
      {
        value: vals.map((item) => [...item].join(' ')).join('<br>'),
        type: 'span',
      },
      'br',
      {
        value: parseNumber(allSteps().join('<br>') || '0'),
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
  }, [showSteps, addition]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setValue('');
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
            Your input can be in form of only positive numbers with decimals
          </div>
          <div className="col-4 text-left">Decimal Numbers: -</div>
          <div
            className="row mb-2 
          align-items-center"
          >
            <div className="col-12">
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
          className="default-btn rounded-pill px-5 btn btn-danger "
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

export default DecimalNumberAddition;
