'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs } from '../../helpers/decimal';
import { putSpace } from '../../helpers/general';

const DecimalToFraction = () => {
  const [a, setA] = useState('345.435');
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
            `Convert the given decimal number \\bold{${
              a || 'a'
            }} to a fraction.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    const isInvalid = [a].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Decimal Numbers:-\\bigg<\\bold{${a || 'a'}}\\bigg>`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    function checkDecimal(n) {
      var isDecimal = n - Math.floor(n) !== 0;
      return isDecimal;
    }
    if (!checkDecimal(a)) return;

    function valueAfterDecimal(val) {
      if (!val) return;
      if (checkDecimal(val)) {
        return val.split('.')[1].length;
      }
    }

    function zeroAfterDecimal(val) {
      if (!val) return;
      if (checkDecimal(val)) {
        return 10 ** val.split('.')[1].length;
      }
    }

    function decimalToFraction(val) {
      if (!val) return;
      if (checkDecimal(val)) {
        return val.replace('.', '');
      }
    }

    //Fraction Reduction
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return { numR, denumR };
        }
      }
      return { numR, denumR };
    }
    let Result;
    if (decimalToFraction(a) === zeroAfterDecimal(a)) {
      Result = { numR: 1, denumR: 1 };
    } else {
      Result = fraction(decimalToFraction(a), zeroAfterDecimal(a));
    }
    const { numR, denumR } = Result;

    //calculation for improper to mixed division
    const remainder = numR % denumR;
    const quotient = Math.floor(numR / denumR);

    const finalAnswer = [
      {
        value: putSpace(
          `The result of the decimal number \\bold{${a}} to a fraction is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{{${numR} \\above{1pt} ${denumR}}} \\space or \\space \\bold{${quotient}{${remainder} \\above{1pt} ${denumR}}}`
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
        value: `A decimal number is always represented in the form of some integer value placed after a decimal.`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`Given decimal number = \\bold{${a}}`),
        type: 'equation',
      },
      'br',
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now first, we have to count the number of digits to the right of the decimal.`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Here no. of digits to the right of the decimal = ${valueAfterDecimal(
            a
          )}`
        ),
        type: 'equation',
      },
      {
        value: `then, Multiply and divide by 10 for every digit after the decimal.`,
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
        value: putSpace(
          `Since there are ${valueAfterDecimal(
            a
          )} digits to the right of the decimal point.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Therefore, we have to multiply and divide by ${zeroAfterDecimal(a)}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{(${a}).(${zeroAfterDecimal(a)}) \\above{1pt} ${zeroAfterDecimal(
            a
          )}} = {${decimalToFraction(a)} \\above{1pt} ${zeroAfterDecimal(a)}}`
        ),
        type: 'equation',
      },
      {
        value: `Reducing the above fraction to its lowest form i.e.,`,
        type: 'span',
      },
      {
        value: putSpace(
          `{${decimalToFraction(a)} \\above{1pt} ${zeroAfterDecimal(
            a
          )}} = {${numR} \\above{1pt} ${denumR}} `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/improper-to-mixed-fraction-calculator/?l= ${decimalToFraction(
          a
        )}/${zeroAfterDecimal(
          a
        )} " target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `Reducing the above-reduced fraction to a mixed fraction i.e.,`,
        type: 'span',
      },
      {
        value: putSpace(
          `{${numR} \\above{1pt} ${denumR}} = ${quotient}{ ${remainder}\\above{1pt} ${denumR}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/improper-to-mixed-fraction-calculator/?a= ${numR}/${denumR} " target="_blank">to see Steps click here</a>`,
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

  const hasValue = [a].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [a].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">A :-</div>
            <div className="col-9">
              <Input
                placeholder="value of a"
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

export default DecimalToFraction;
