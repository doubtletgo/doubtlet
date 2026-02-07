'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { putSpace } from '../../helpers/general';

const DecimalDivison = () => {
  const [divisor, setDivisor] = useState('77.5');
  const [dividend, setDividend] = useState('25');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Divide the given decimal number ${dividend || 'dividend'} by ${
              divisor || 'divisor'
            } `
          ),
          type: 'equation',
        },
      ])
    );
  }, [divisor, dividend]);

  function countDecimal(val) {
    if (!val) return 0;
    return val.toString().split('.')[1]?.length || 0;
  }
  function removeDecimal(val, isNum) {
    if (!val) return 0;
    var str = val.toString().split('.') || val;
    var value = str.join('') || str;
    return isNum ? Number(value) : value;
  }

  const quotient = parseNumber(
    removeDecimal(dividend, 1) / removeDecimal(divisor, 1),
    {},
    6
  );
  console.log('?????????', divisor);
  const multiplier = 10 ** countDecimal(divisor) / 10 ** countDecimal(dividend);
  useEffect(() => {
    const isInvalid = [divisor, dividend].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Numbers:\\bigg< ${parseNumber(divisor) || 'Divisor'}, ${
              parseNumber(dividend) || 'Dividend'
            } \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The result of the division of the decimal number ${dividend} by ${divisor} is \\bold{ ${parseNumber(
            multiplier * quotient
          )}} `
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

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `A decimal number is always represented in the form of some integer value<br> placed after a decimal.`,
        type: 'span',
      },
      'br',
      {
        value: `Given decimal number = ${dividend}, ${divisor} `,
        type: 'span',
      },
      'br',
      {
        value: `To divide the first decimal number by the second,
        <br/> We have to divide the numbers without decimal points, then put<br> the decimal point in the answer.`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
      },
      'br',
      {
        value: `${dividend} has ${countDecimal(dividend)} decimal places`,
        type: 'span',
      },
      'br',
      {
        value: `${divisor} has ${countDecimal(divisor)} decimal places`,
        type: 'span',
      },
      {
        value: `Net \\space decimal \\space places \\space = \\space {${
          10 ** countDecimal(divisor)
        } \\above{1pt} ${
          10 ** countDecimal(dividend)
        }} \\space = \\space ${multiplier}`,
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Now, we have to divide the numbers without decimals i.e.`,
        type: 'span',
      },
      {
        value: `{${removeDecimal(dividend, 0)} \\above{1pt} ${removeDecimal(
          divisor,
          0
        )}} \\space = \\space ${parseNumber(quotient, {}, 6)}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/long-division-calculator-with-remainders/?p=${removeDecimal(
          dividend,
          0
        )}&q=${removeDecimal(
          divisor,
          0
        )}&r=7" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `We need to multiply the above result by ${multiplier} i.e. `,
        type: 'span',
      },
      'br',
      {
        value: `${quotient} x ${multiplier}= ${parseNumber(
          multiplier * quotient,
          {},
          7
        )}`,
        type: 'span',
      },
      'hr',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [dividend, divisor, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setDividend('');
    setDivisor('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [divisor, dividend].some(
    (v) => (!!v && !isNaN(v)) || v === 0
  );
  const hasAllValue = [divisor, dividend].every(
    (v) => (!!v && !isNaN(v)) || v === 0
  );

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
            Your input can be in form of Real Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Numbers</div>
            <div className="col-4">
              <Input
                placeholder="Dividend"
                autoComplete="off"
                className="col-12"
                value={dividend}
                setVal={setDividend}
              />
            </div>
            <div className="col-4">
              <Input
                placeholder="Divisor"
                autoComplete="off"
                className="col-12"
                value={divisor}
                setVal={setDivisor}
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

export default DecimalDivison;
