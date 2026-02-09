'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { putSpace } from '../../helpers/general';

const kSpace = (count = 2) => '\\space'.repeat(count);

const FractionNumberToDecimal = () => {
  const [l, setL] = useLocalStorage('FractionNumberToDecimal_l', '1.00/4');
  let [p, q] = l.split('/');
  const [r, setR] = useLocalStorage('FractionNumberToDecimal_r', '3');
  const [equation, setEquation] = useLocalStorage('FractionNumberToDecimal_equation', '');
  const [solution, setSolution] = useLocalStorage('FractionNumberToDecimal_solution', '');
  const [result, setResult] = useLocalStorage('FractionNumberToDecimal_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FractionNumberToDecimal_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FractionNumberToDecimal_showSteps', true);
  const [note, setNote] = useLocalStorage('FractionNumberToDecimal_note', undefined);
  const [decimalValue, setDecimalValue] = useLocalStorage('FractionNumberToDecimal_decimalValue', '');

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Convert the fractional number {${parseNumber(
              p || '1'
            )}\\above{1pt}${parseNumber(q || '1')}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `to the decimal number up to ${parseNumber(
              r || '1'
            )} digits after decimals.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [p, q, r]);

  useEffect(() => {
    const isInvalid = [p, q, r].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Fractional  Number: \\bigg<{${parseNumber(
              p || '1'
            )}\\above{1pt}${parseNumber(q || '1')} }\\bigg>`
          ),
          type: `equation`,
        },
        {
          value: putSpace(`Decimal up to: <${parseNumber(r || '1')}>`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    //made all the negative inputs to positive
    let a = abs(p);
    let x = abs(q);

    //to check the negative values
    const oneValueNeg = p < 0 || q < 0;
    const bothValueNeg = p < 0 && q < 0;

    //calculation for the calculator
    const division = Math.floor(a / x);
    const remainder = a % x;

    let aString = a.toString();
    let b = Number(x);
    let remain = 0;
    let quotArray = [];
    let remainArray = [];
    let NewDividentArray = [];
    let remainderArray = [];
    let iterations = 1;
    let iterate = 1;

    //Variables to be used into decimal calculation
    let num = remainder;
    let remString = division;
    let number = remainder;
    let decimalRemainder;

    function getDecimalSteps() {
      const decimalSteps = [];
      let string = '';
      for (let i = 1; i <= r; i++) {
        let value = 10 * num;
        let multiplier = Math.floor(value / x);
        string += multiplier;
        let step = `<b>Step ${
          i + 1
        }</b><br>Now, we have to take the next zero and the number will become ${value}<br>${
          i < 2 ? `Such that ${value} > ${x}<br>` : ''
        }We have to repeat the same process again<br>Here ${x} * ${multiplier} = ${
          x * multiplier
        }  < 
         ${value}<br>${'&#160;'.repeat(10)}${x} * ${multiplier + 1} = ${
          x * (multiplier + 1)
        } >  ${value}<br> ${x} ) ${value}  (  ${remString}.${string}<br>${'&#160;'.repeat(
          7
        )}${x * multiplier}<br>${
          '&#160;'.repeat(7) + '-'.repeat(5)
        }<br>${'&#160;'.repeat(11)}${value - x * multiplier}<br>`;
        decimalSteps.push(step);
        num = value - x * multiplier;
        if (i == r) decimalRemainder = num;
        else decimalRemainder = 0;
        if (num === 0) {
          setDecimalValue(`${remString}.${string}`);
          return decimalSteps;
        }
      }
      setDecimalValue(`${remString}.${string}`);
      return decimalSteps;
    }

    const decimalSteps = getDecimalSteps();
    for (let i = 0; i < aString.length + r; i++) {
      let NewDivident = Number(remain + aString.slice(i, aString.length));
      NewDividentArray.push(NewDivident);

      let num = Number(remain + aString[i]);
      remainArray.push(num);
      let quot = Math.floor(num / b);
      quotArray.push(quot * b);
      remain = num % b;
      remainderArray.push(remain);
    }
    const decimalArr = [...quotArray];
    const decimalRemainArr = [...remainArray];
    for (let i = 1; i <= r; i++) {
      let value = 10 * number;
      let multiplier = Math.floor(value / x);
      number = value - x * multiplier;
      decimalRemainArr.push(value);
      decimalArr.push(x * multiplier);
    }

    NewDividentArray.filter(
      (item, index) => NewDividentArray.indexOf(item) === index
    );
    let decimalResult = decimalArr
      .map((num, index) => {
        if (!num) return [];
        const space = `\\hspace{${iterate * 10 + 8}px}`;
        const space2 = `\\hspace{${iterate * 10}px}`;
        return [
          iterate++ > 1
            ? {
                value: `${space} ${decimalRemainArr[index]}`,
                type: 'equation',
              }
            : undefined,
          {
            value: `${space2} -${num}`,
            type: 'equation',
          },
          { value: `${space2} \\rule{70pt}{1pt}`, type: 'equation' },
        ].filter((a) => !!a);
      })
      .flat();

    let result = quotArray
      .map((num, index) => {
        if (!num) return [];
        const space = `\\hspace{${iterations * 10 + 8}px}`;
        const space2 = `\\hspace{${iterations * 10}px}`;
        return [
          iterations++ > 1
            ? {
                value: `${space} ${remainArray[index]}`,
                type: 'equation',
              }
            : undefined,
          {
            value: `${space2} -${num}`,
            type: 'equation',
          },
          {
            value: `${space2} \\rule{70pt}{1pt}`,
            type: 'equation',
          },
        ].filter((a) => !!a);
      })
      .flat();

    const finalAnswer = [
      {
        value: `The value of fractional number`,
        type: 'equation',
      },
      {
        value: `{${p}\\above{1pt}${q}}`,
        type: 'equation',
      },
      {
        value:
          putSpace(`to the decimal number up to ${r} digits after decimals is shown below
        `),
        type: 'equation',
      },
      'br',

      {
        value: putSpace(
          `${x} ) ${a + '.' + '0'.repeat(r)} ( ${
            decimalValue ? decimalValue : ''
          }`
        ),
        type: 'equation',
      },
      ...decimalResult,
      {
        value: putSpace(`${kSpace(iterations * 8)} ${decimalRemainder || 0}`),
        type: 'equation',
      },
      { value: '</div></div>', type: 'raw' },
      {
        value: putSpace(
          `\\implies Quotient = ${
            bothValueNeg
              ? `${division}`
              : `${oneValueNeg ? `-${division}` : `${division}`}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\implies Remainder =  ${
            bothValueNeg
              ? `${remainder}`
              : `${oneValueNeg ? `-${remainder}` : `${remainder}`}`
          }`
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

    const normalizeInput = [];

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Here, we have to perform the long division method to convert`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the fraction {p\\above{1pt}q}`),
        type: 'equation',
      },
      {
        value:
          putSpace(`into a decimal number where p and q are integers and q ≠ 0.
       `),
        type: 'equation',
      },

      {
        value: putSpace(`After decimal, we have to consider \\bold{zeroes}`),
        type: 'equation',
      },

      {
        value: putSpace(`such that the remainder will be greater than`),
        type: 'equation',
      },
      {
        value: putSpace(
          `the divisor and then multiply \\bold{q} to such a positive integer that`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `its value is less than or equal to the \\bold{ remainder with zeroes.}`
        ),
        type: 'equation',
      },
      {
        value: `${p < 0 ? `Let ${p} = ${abs(p)}` : ''}
        ${q < 0 ? `<br> Let ${q} = ${abs(q)}` : ''}`,
        type: 'span',
      },
      'br',
      {
        value: "<div className='card mt-4'><div className='card-body'>",
        type: 'raw',
      },
      ...normalizeInput,
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      'br',
      {
        value: `${x} ) ${a} ( ${division}`,
        type: 'span',
      },
      ...result,
      {
        value: `${kSpace(12)} ${remainder}`,
        type: 'equation',
      },
      {
        value: `Quotient = ${
          bothValueNeg
            ? `${division}`
            : `${oneValueNeg ? `-${division}` : `${division}`}`
        }`,
        type: 'span',
      },
      'br',
      {
        value: `Remainder =  ${
          bothValueNeg
            ? `${remainder}`
            : `${oneValueNeg ? `-${remainder}` : `${remainder}`}`
        }`,
        type: 'span',
      },
      'br',
      {
        value: decimalSteps.join(''),
        type: 'span',
      },

      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },

      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [p, q, r, showSteps, decimalValue]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setL('');
    setR('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p, q, r].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p, q, r].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            <div className="col-3 text-left">Fractional Number:-</div>
            <div className="col-9">
              <Input
                placeholder="Enter / seprated values"
                autoComplete="off"
                className="col-12"
                value={l}
                setVal={setL}
                pattern={/^(-?(\d)*)(\/-?(\d)*)?$/}
                prohibited={[0]}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Decimal up to:- </div>
            <div className="col-9">
              <Input
                placeholder="Number of decimals"
                autoComplete="off"
                className="col-12"
                value={r}
                setVal={setR}
                pattern={/^((\d)*)$/}
                prohibited={[0]}
                max={11}
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

export default FractionNumberToDecimal;
