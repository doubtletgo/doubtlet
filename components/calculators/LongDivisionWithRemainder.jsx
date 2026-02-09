'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';

const space = (count = 1) => {
  return '&nbsp;'.repeat(count);
};
const kSpace = (count = 1) => '\\space'.repeat(count);

const LongDivisionWithRemainder = () => {
  const [p, setP] = useLocalStorage('LongDivisionWithRemainder_p', '487');
  const [q, setQ] = useLocalStorage('LongDivisionWithRemainder_q', '32');
  const [equation, setEquation] = useLocalStorage('LongDivisionWithRemainder_equation', '');
  const [solution, setSolution] = useLocalStorage('LongDivisionWithRemainder_solution', '');
  const [result, setResult] = useLocalStorage('LongDivisionWithRemainder_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('LongDivisionWithRemainder_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('LongDivisionWithRemainder_showSteps', true);
  const [note, setNote] = useLocalStorage('LongDivisionWithRemainder_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.p) setP(vals.p);
    if (vals.q) setQ(vals.q);
  }, []);

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
            `Perform the long division method when \\bold{${
              p || 'Dividend'
            }} is divided by \\bold{${q || 'Divisor'}} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Or \\bold{${parseNumber(
              p || 'Dividend'
            )} \\above{1pt} ${parseNumber(q || 'Divisor')}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [p, q]);

  useEffect(() => {
    const isInvalid = [p, q].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: putSpace(
            `Dividend : < \\bold{${parseNumber(p || 'Dividend')}} >`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Divisor : < \\bold{${parseNumber(q || 'Divisor')}}>`
          ),
          type: 'equation',
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

    for (let i = 0; i < aString.length; i++) {
      let NewDivident = Number(remain + aString.slice(i, aString.length));
      NewDividentArray.push(NewDivident);

      let num = Number(remain + aString[i]);
      remainArray.push(num);
      let quot = Math.floor(num / b);
      quotArray.push(quot * b);
      remain = num % b;
      remainderArray.push(remain);
    }

    NewDividentArray.filter(
      (item, index) => NewDividentArray.indexOf(item) === index
    );

    function getNextDigit(name) {
      return name[name.length - 1];
    }

    let StepsOfSolution = quotArray
      .map((number, index) => {
        return `${` <b>Step ${iterate++}</b> <br> 
          ${
            iterate > 2
              ? `Now, the previous remainder is ${
                  remainderArray[index - 1]
                } and we have to take the next digit ${getNextDigit(
                  (quotArray[index] + remainderArray[index]).toString()
                )} and the number will become ${
                  !number
                    ? quotArray[index] + remainderArray[index]
                    : NewDividentArray[index]
                }.
                <br>We have to repeat the same process again<br>
              `
              : ''
          }
          Here ${b} * ${quotArray[index] / b} = ${quotArray[index]} ${
          quotArray[index] === quotArray[index] + remainderArray[index]
            ? '='
            : '<'
        } ${quotArray[index] + remainderArray[index]} <br>
        
          ${
            !number
              ? '<br>'
              : `${space(4)} & ${b} * ${quotArray[index] / b + 1} = ${
                  quotArray[index] + b
                }
            > ${quotArray[index] + remainderArray[index]}<br>
            ${b} ) ${NewDividentArray[index]} ( ${quotArray[index] / b} <br> 
            ${space(3 + b.toString().length * 2)}${quotArray[index]}<br>
            ${space(2 + b.toString().length * 2)} ${
                  quotArray[index].toString().length > 2
                    ? '-'.repeat(quotArray[index].toString().length * 1.8)
                    : '............'
                }<br>
            ${space(3 + b.toString().length * 2)}${
                  remainderArray[index]
                }<br><br>`
          }
        `}`;
      })
      .join('');
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
          { value: `${space2} \\rule{70pt}{1pt}`, type: 'equation' },
        ].filter((a) => !!a);
      })
      .flat();
    //decimalRemainder Indentation
    const space3 = `\\hspace{${iterations * 10}px}`;
    const finalAnswer = [
      {
        value: `So according to the inputs`,
        type: 'span',
      },
      'br',
      {
        value: `\\implies Quotient = ${Math.floor(a / x)}`,
        type: 'equation',
      },
      {
        value: `\\implies Remainder = ${a % x}`,
        type: 'equation',
      },
    ];

    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        value: "<div className='card'><div className='card-body'>",
        type: 'raw',
      },
      {
        value: `${x} ) ${a} ( ${division}`,
        type: 'span',
      },
      ...result,
      { value: `${space3} ${remainder || 0}`, type: 'equation' },
      ...finalAnswer,
      { value: '</div></div>', type: 'raw' },
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
        value: putSpace(
          `First, we have to write the question in the form of a long division format`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`where p and q are integers, p ≥ q, and q ≠ 0.`),
        type: 'equation',
      },
      {
        value: 'q ) p (',
        type: 'span',
      },
      {
        value: putSpace(
          `We have to multiply q to such a positive integer such that its value is less than or equal to p.`
        ),
        type: 'equation',
      },
      {
        value: ` ${p < 0 ? `Let ${p} = ${a}` : ''}
        ${q < 0 ? `<br> and ${q} = ${x}` : ''}`,
        type: 'span',
      },
      'br',
      {
        value: StepsOfSolution,
        type: 'span',
      },
      {
        value: `<b>Step ${iterate}</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Here ${x} * 1 = ${x} > ${
          a % x
        }<br>Since the remainder is less than the divisor, it means the division process is complete.
        `,
        type: 'span',
      },
      'br',
      {
        value: `${x} ) ${a % x} ( 0`,
        type: 'span',
      },
      {
        value: `${kSpace(1 + b.toString().length * 2)} -0`,
        type: 'equation',
      },
      {
        value: `${space(2 + b.toString().length * 2)}${
          b.toString().length < 3
            ? '----<br>'
            : `${'-'.repeat(b.toString().length * 2)}<br>`
        }`,
        type: 'span',
      },
      {
        value: `${space(3 + b.toString().length * 2)}${a % x}`,
        type: 'span',
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: "<div className='card'><div className='card-body'>",
        type: 'raw',
      },
      {
        value: `${x} ) ${a} ( ${division}`,
        type: 'span',
      },
      ...result,
      {
        value: `${space3}${remainder}`,
        type: 'equation',
      },
      ...finalAnswer,
      { value: '</div></div>', type: 'raw' },
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
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

  const hasValue = [p, q].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p, q].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            <div className="col-3 text-left">Dividend:</div>
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
            <div className="col-3 text-left">Divisor:</div>
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

export default LongDivisionWithRemainder;
