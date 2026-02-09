'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';

const FractionComparison = () => {
  const [l, setL] = useLocalStorage('FractionComparison_l', '5,6,7,2,3,4');
  const [equation, setEquation] = useLocalStorage('FractionComparison_equation', '');
  const [solution, setSolution] = useLocalStorage('FractionComparison_solution', '');
  const [result, setResult] = useLocalStorage('FractionComparison_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FractionComparison_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FractionComparison_showSteps', true);
  const [note, setNote] = useLocalStorage('FractionComparison_note', undefined);
  const [order, setOrder] = useLocalStorage('FractionComparison_order', 'Ascending');

  const isAscending = order === 'Ascending';

  let division = l.split(',');

  const upperVal = [];
  const lowerVal = [];
  division.map((item) => {
    const val = item.split('/');
    upperVal.push(val[0] || 1);
    lowerVal.push(val[1] || 1);
  });

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Arrange all the given fractions`,
          type: `span`,
        },
        {
          value: upperVal.map(
            (item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`
          ),
          type: 'equation',
        },
        {
          value: ` in ${
            isAscending ? `<b>Ascending</b>` : `<b>Descending</b>`
          } order.`,
          type: `span`,
        },
      ])
    );
  }, [l, division]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Fractions:`,
          type: 'equation',
        },
        {
          value: upperVal.map(
            (item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`
          ),
          type: 'equation',
        },
      ])
    );

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const answer = lowerVal.reduce(lcm);
    const decimalAnswerArray2 = [];
    const decimalAnswerArray = [];
    const decimalArr = []; //New

    const multiplicationEachFraction = upperVal
      .map((num, index) => {
        let ans = (num / lowerVal[index]) * answer;
        decimalAnswerArray.push(ans);
        decimalArr.push(ans); //New
        return [
          {
            value: `({${num}\\above{1pt}${lowerVal[index]}}).${answer}=${
              (num / lowerVal[index]) * answer
            }`,
            type: 'equation',
          },
        ];
      })
      .flat();
    decimalAnswerArray.sort((a, b) => (isAscending ? a - b : b - a));
    const indexArr = [];
    decimalAnswerArray.forEach((item) => {
      indexArr.push(decimalArr.indexOf(item));
      decimalArr.splice(decimalArr.indexOf(item), 1, 'a');
    }); //New

    const resultDecimalSortedArray2 = decimalAnswerArray2
      .map((val, index) => {
        const katex = decimalAnswerArray2[index];

        if (index === decimalAnswerArray2.length - 1) return katex;
        const prev = decimalAnswerArray2[index];
        const next = decimalAnswerArray2[index + 1];
        const operator = next > prev ? '<' : next < prev ? '>' : '=';
        return `${operator}`;
      })
      .join(' ');

    const finalAnswer = [
      {
        value: `The ${
          isAscending ? `Ascending` : `Descending`
        } order all the given fractions`,
        type: `span`,
      },
      {
        value: upperVal.map(
          (item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`
        ),
        type: 'equation',
      },
      {
        value: `Is`,
        type: `span`,
      },
      //New
      {
        value: [...indexArr]
          .map((val, index) => {
            const isEqual =
              upperVal[val] / lowerVal[val] ===
              upperVal[indexArr[index + 1]] / lowerVal[indexArr[index + 1]];
            const sign = index < indexArr.length - 1;
            return `{${upperVal[val]}\\above{1pt}${lowerVal[val]}}${
              sign ? (isEqual ? '=' : isAscending ? '<' : '>') : ''
            }`;
          })
          .join(''),
        type: 'equation',
      },
      ,
      //New^
      {
        value: resultDecimalSortedArray2,
        type: `equation`,
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

    const resultDecimalSortedArray = decimalAnswerArray
      .map((val, index) => {
        const katex = decimalAnswerArray[index];

        if (index === decimalAnswerArray.length - 1) return katex;
        const prev = decimalAnswerArray[index];
        const next = decimalAnswerArray[index + 1];
        const operator = next > prev ? '<' : next < prev ? '>' : '=';
        return `${katex} ${operator}`;
      })
      .join(' ');

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: ` A fraction is always represented in the form of   where p and q are integers 
        and q ≠ 0.`,
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
        value: `Given fraction =`,
        type: `span`,
      },
      {
        value: upperVal
          .map((item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`)
          .join(' ,'),
        type: 'equation',
      },
      'br',
      {
        value: `Now we have to find the Lowest common multiple of all the denominators.`,
        type: `span`,
      },
      'br',
      {
        value: `${lowerVal} =${answer} `,
        type: `span`,
      },
      'br',
      {
        value: `<a href="/calculator/lcm-calculator/?a=${lowerVal}" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we have to multiply each fraction with the LCM.`,
        type: `span`,
      },
      ...multiplicationEachFraction,
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we have to arrange the obtained numbers in ${
          isAscending ? `Ascending` : `Descending`
        } order `,
        type: `span`,
      },
      'br',
      {
        value: resultDecimalSortedArray,
        type: `equation`,
      },
      {
        value: `Now the order for the fractions will be same as the result obtained from fractions.`,
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
  }, [l, division, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    setL('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [l].some((v) => !!v || v === 0);
  const hasAllValue = [l].every((v) => !!v || v === 0);

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
            <div className="dropdown row mb-2 align-items-center">
              <div className="col-4 text-left">Order</div>
              <div className="col-8">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={order}
                  onChange={onChangeOrder}
                >
                  <option value="Ascending">Ascending</option>
                  <option value="Descending ">Descending</option>
                </select>
              </div>
            </div>
            <div className="col-3 text-left">Fraction:-</div>
            <div className="col-9">
              <Input
                placeholder="Write the (,) seprated fraction value"
                autoComplete="off"
                className="col-12"
                value={l}
                setVal={setL}
                pattern={
                  /^((-?(\d)*)(\/-?([1-9]\d*)*)?)(,(-?(\d)*)(\/-?([1-9]\d*)*)?)*$/
                }
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

export default FractionComparison;
