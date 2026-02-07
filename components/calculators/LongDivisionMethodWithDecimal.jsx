'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import { abs, parseNumber } from '../../helpers/decimal';

const kSpace = (count = 1) => '\\space'.repeat(count);

const LongDivisionMethodWithDecimal = () => {
  const [p, setP] = useState('32');
  const [q, setQ] = useState('2');
  const [r, setR] = useState('5');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [decimalValue, setDecimalValue] = useState('');

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
            `Perform the long division method when  ${parseNumber(
              p || '1'
            )} is divided by ${parseNumber(q || '1')} or`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `{${parseNumber(p || '1')}\\above{1pt}${parseNumber(q || '1')}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `up to ${parseNumber(r || '1')} digits after decimals.`
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
          value: `Formatted User Input Display`,
          type: `h6`,
        },

        {
          value: `Dividend: - < ${parseNumber(p || '1')} >`,
          type: 'span',
        },
        'br',
        {
          value: `Divisor: - < ${parseNumber(q || '1')} >`,
          type: 'span',
        },
        'br',
        {
          value: `Decimal up to: - < ${parseNumber(r || '1')} >`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    //made all the negative inputs to positive
    let a = abs(p);
    let x = abs(q);

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
      if (remainder === 0) return decimalSteps;
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
        } >  ${value}<br> ${x} ) ${value}  ( ${remString}.<b className="text-success">${string}</b><br>${'&#160;'.repeat(
          7
        )}${x * multiplier}<br>${
          '&#160;'.repeat(7) + '-'.repeat(5)
        }<br>${'&#160;'.repeat(11)}<b className="text-primary">${
          value - x * multiplier
        }</b><br>`;
        decimalSteps.push(step);
        num = value - x * multiplier;
        if (i == r) {
          decimalRemainder = num;
        } else {
          decimalRemainder = 0;
        }
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
          { value: `${space2} ..............`, type: 'equation' },
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
          { value: `${space2} ..............`, type: 'equation' },
        ].filter((a) => !!a);
      })
      .flat();
    //decimalRemainder Indentation
    const space3 = `\\hspace{${iterate * 10}px}`;
    const finalAnswer = [
      {
        value: `The steps of the long division method when`,
        type: 'span',
      },
      'br',
      {
        value: `${p} is divided by ${q} or`,
        type: 'span',
      },
      {
        value: `{${p}\\above{1pt}${q}}`,
        type: 'equation',
      },
      {
        value: `up to ${r} digits after decimals are shown below
        `,
        type: 'span',
      },
      'br',

      {
        value: `${x} ) ${a + '.' + '0'.repeat(r)} ( ${
          decimalValue ? decimalValue : division
        }`,
        type: 'span',
      },
      ...decimalResult,

      { value: `${space3} ${decimalRemainder || 0}`, type: 'equation' },
      { value: '</div></div>', type: 'raw' },
      {
        value: `\\implies Quotient = ${division}`,
        type: 'equation',
      },
      {
        value: `\\implies Remainder =  ${remainder}`,
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
      'br',
      {
        value: `First, we have to write the question in the form of a long division`,
        type: 'span',
      },
      'br',
      {
        value: `format where p and q are integers and q ≠ 0.`,
        type: 'span',
      },
      'br',
      {
        value: `q) p (`,
        type: 'span',
      },
      'br',
      {
        value: `After decimal, we have to consider <b>zeroes</b> such`,
        type: 'span',
      },
      'br',
      {
        value: `that the remainder will be greater than the divisor and then multiply <b>q</b>`,
        type: 'span',
      },
      'br',
      {
        value: `to such a positive integer such that`,
        type: 'span',
      },
      'br',
      {
        value: `its value is less than or equal to the <b>remainder with zeroes.
        </b>`,
        type: 'span',
      },
      'br',
      {
        value: `${p < 0 ? `Let ${p} = ${abs(p)}` : ''}
        ${q < 0 ? `<br> Let ${q} = ${abs(q)}` : ''}`,
        type: 'span',
      },
      {
        value: "<div className='card mt-4'><div className='card-body'>",
        type: 'raw',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `${x} ) ${a + '.' + '0'.repeat(r)} ( ${division}`,
        type: 'span',
      },
      ...result,
      {
        value: `${kSpace(12)} ${remainder}`,
        type: 'equation',
      },
      {
        value: decimalSteps.join(''),
        type: 'span',
      },
      {
        value: `Quotient = ${division}`,
        type: 'span',
      },
      'br',
      {
        value: `Remainder =  ${remainder}`,
        type: 'span',
      },
      { value: '</div></div>', type: 'raw' },
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
  }, [p, q, r, showSteps, decimalValue]);

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
            <div className="col-3 text-left">Dividend: -</div>
            <div className="col-9">
              <Input
                placeholder="Dividend"
                autoComplete="off"
                className="col-12"
                value={p}
                setVal={setP}
                prohibited={[0]}
                pattern={/^((\d)*)\d*$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Divisor: - </div>
            <div className="col-9">
              <Input
                placeholder="Divisor"
                autoComplete="off"
                className="col-12"
                value={q}
                setVal={setQ}
                prohibited={[0]}
                pattern={/^((\d)*)\d*$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Decimal up to: - </div>
            <div className="col-9">
              <Input
                placeholder="Decimal up to"
                autoComplete="off"
                className="col-12"
                value={r}
                setVal={setR}
                prohibited={[0]}
                max={11}
                pattern={/^((\d)*)\d*$/}
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

export default LongDivisionMethodWithDecimal;
