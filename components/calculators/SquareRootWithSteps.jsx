'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { putSpace } from '../../helpers/general';

const SquareRootWithSteps = () => {
  const [a, setA] = useState('73');
  const [b, setB] = useState('5');
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
        'br',

        {
          value: putSpace(
            `Find the Square root of the number \\bold{${parseNumber(
              a || '1'
            )}} up to \\bold{${parseNumber(b || '1')}} digits after decimals.`
          ),

          type: 'equation',
        },
      ])
    );
  }, [a, b]);
  function fixDecimal(val, toPoint) {
    var val = val.toString().split('.');

    if (val[1]?.endsWith('0')) {
      val[1] = val[1]?.slice(0, val[1].length - 1);
    }
    return val[0] + (val[1] ? '.' + val[1]?.slice(0, toPoint) : '');
  }

  useEffect(() => {
    const isInvalid = [a, b].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: putSpace(`Radicand: - <${parseNumber(a || '1')} >`),

          type: 'equation',
        },
        {
          value: putSpace(`Decimal up to: - <${parseNumber(b || '1')}>`),

          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const valueBeforePoint = a.toString().split('.')[0];
    const valueAfterPoint = a.toString().split('.')[1];

    const pairValues = (a, toInclude) => {
      if (valueBeforePoint == null) return;
      let str = a.toString().replace('.', '');
      let arr = [];

      if (valueBeforePoint.length % 2 != 0) {
        str = '0' + str;
      }
      if (valueAfterPoint) {
        var zeroes = valueAfterPoint.length / 2 - b;
        str = str + '00'.repeat(Math.abs(zeroes));
      } else {
        var zeroes = fixDecimal(Math.sqrt(a), b).split('.')[0].length;
        str = str + '00'.repeat(Math.ab);
      }
      var len = valueBeforePoint.length;
      if (len % 2 != 0) len += 1;
      if (str.length % 2 != 0) {
        str += '0';
      }
      for (let i = 0; i < str.length; i += 2) {
        if (toInclude && i === len) {
          arr.push('.');
        }
        arr.push(str.slice(i, i + 2));
      }
      return arr;
    };
    const dividend = fixDecimal(Math.sqrt(a), b);
    const values = pairValues(a, false);

    let divisor = '';
    let nextDivisor = '';
    let value = values[0];
    let divideStepsArr = [];
    var stepCount = 1;
    const pureDividend = dividend.replace('.', '');

    const allSteps = pureDividend.split('').map((item, index) => {
      if (index == pureDividend.length) return;
      divisor += item;
      let nextNum = Number(item) + 1;
      nextDivisor = divisor.slice(0, divisor.length - 1) + nextNum;
      let multiply = divisor * item;
      var newDividend = dividend.slice(0, index + 1);

      //Push the divison steps to array
      let divisionStep = `
      &#160;&#160;${divisor} | 
      ${index == 0 ? pairValues(a, true).join(' ') : value} <br>
     ${'&#160;'.repeat(divisor.length + index)}
      +${item} |  ${multiply}<br>
      ${'---'.repeat(divisor.length + index - 1)}
      ${
        index == pureDividend.length - 1
          ? `<br>  
         ${'&#160;'.repeat(divisor.length + index + 6)}
              ${Number(value) - multiply}`
          : ''
      }
      `;
      divideStepsArr.push(divisionStep);
      //Modify The Dividend Value in first Step
      if (divideStepsArr.length) {
        divideStepsArr.shift();
        let modifiedStep = `<br>&#160;&#160; ${dividend[0]} |  ${pairValues(
          a,
          true
        ).join(' ')} |  ${
          newDividend.indexOf('.') >= 0
            ? dividend.slice(0, index + 2)
            : dividend.slice(0, index + 1)
        }
        <br>
        +${dividend[0]}     |     ${dividend[0] * dividend[0]}<br>
        ${'-'.repeat(divisor.length + 5)}`;
        divideStepsArr.unshift(modifiedStep);
      }

      //Steps
      var step1 = `
      <b>Step ${stepCount}</b><br>

      ${
        stepCount === 1
          ? ` Given number = ${parseNumber(a)}<br>
      After making the pairs = ${pairValues(a, true).join(' ')}<br>
      Now consider the left-handed pair i.e. ${pairValues(a)[0]}.<br>
      Find an integer whose square is less than or equal to ${
        pairValues(a)[0]
      } <br>`
          : ''
      }
      Now consider the Number ${value}<br>
      We know ${divisor} x ${item} = ${multiply} ${
        Number(multiply) === Number(value) ? '==' : '<'
      } ${value}<br>
      ${'&#160;'.repeat(18)}${nextDivisor} x ${nextNum} = ${
        nextDivisor * nextNum
      } > ${value}<hr>
        ${divideStepsArr.join('<br>')}
        <hr>
        `;
      stepCount++;

      //Change values
      divisor = Number(divisor) + Number(item);
      value = Number(value) - multiply + (values[index + 1] || '00');

      return step1;
    });
    const finalAnswer = [
      {
        value: `The square root of the number ${parseNumber(
          a
        )} up to ${parseNumber(b)} digits after decimals is <b>${fixDecimal(
          Math.sqrt(a),
          b
        )}</b>,<br> The steps by step solution is shown below<br> ${divideStepsArr.join(
          '<br>'
        )}`,

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
        value: putSpace(
          `First, we have to write the given number The steps by step in the form`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `of square root format.After the decimal, we have to consider \\bold{zeroes}`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `such that all the numbers are in pairs and the number of pairs after`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `the decimal should be equal to the number of digits required after the decimal.`
        ),

        type: 'equation',
      },
      {
        value: putSpace(`We have to make the pairs of numbers from the`),

        type: 'equation',
      },
      {
        value: putSpace(`Right-hand side to the left-end digit of `),

        type: 'equation',
      },
      {
        value: putSpace(
          `the number before \\& after decimal \\bold{separately.}`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `Make sure all the numbers before \\& after the decimal are in pairs.`
        ),

        type: 'equation',
      },
      ,
      'hr',
      {
        value: [...allSteps].join('<br>'),

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
  }, [a, b, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setB('');
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a, b].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [a, b].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of only Positive real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Radicand: -</div>
            <div className="col-9">
              <Input
                placeholder="Dividend"
                autoComplete="off"
                className="col-12"
                value={a}
                setVal={setA}
                prohibited={[0]}
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
                value={b}
                setVal={setB}
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

export default SquareRootWithSteps;
