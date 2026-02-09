'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';

const DecimalNumberSubtraction = () => {
  const [a, setA] = useLocalStorage('DecimalNumberSubtraction_a', '9.63,4.76');
  const [value, setValue] = useLocalStorage('DecimalNumberSubtraction_value', []);
  const [equation, setEquation] = useLocalStorage('DecimalNumberSubtraction_equation', '');
  const [solution, setSolution] = useLocalStorage('DecimalNumberSubtraction_solution', '');
  const [result, setResult] = useLocalStorage('DecimalNumberSubtraction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DecimalNumberSubtraction_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DecimalNumberSubtraction_showSteps', true);
  const [note, setNote] = useLocalStorage('DecimalNumberSubtraction_note', undefined);
  const [maxDec, setMaxDec] = useLocalStorage('DecimalNumberSubtraction_maxDec', 1);
  const [maxZero, setMaxZero] = useLocalStorage('DecimalNumberSubtraction_maxZero', 1);
  const [isMinus, setIsMinus] = useLocalStorage('DecimalNumberSubtraction_isMinus', false);
  const [tempArr, setTempArr] = useLocalStorage('DecimalNumberSubtraction_tempArr', []);

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
    if (value[0] < value[1]) {
      var temp = [value[1], value[0]];
      if (tempArr.length > 0) tempArr.slice(0, tempArr.length);
      setTempArr(value);
      setValue([]);
      setValue(temp);
      setIsMinus(true);
    } else {
      if (tempArr.length > 0) tempArr.slice(0, tempArr.length);
      setTempArr(value);
    }
  }, [value]);
  const subtraction = value.reduceRight((a, b) => b - a, 0);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Subtract\\space the\\space given\\space decimal\\space numbers\\space  \\bigg(\\bold{${parseNumber(
            tempArr.join('-')
          )}}\\bigg)`,
          type: 'equation',
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
          Decimal\\space Numbers: -\\space \\bigg<\\bold{${parseNumber(
            tempArr.join('-')
          )}}\\bigg>`,
          type: 'equation',
        },
      ])
    );
    function putZero(arr) {
      const lenDecimal = arr.map(
        (item) => item.toString().split('.')[0]?.length || item.length
      );
      const lenNormal = arr.map(
        (item) => item.toString().split('.')[1]?.length || 0
      );
      let maxBeforePoint = Math.max(...lenDecimal);
      let maxAfterPoint = Math.max(...lenNormal);
      if (maxAfterPoint > 0) setMaxDec(maxAfterPoint);
      setMaxZero(maxBeforePoint);
      let con = arr.some((item) => item.toString().indexOf('.') > 0);
      var newArr = arr.map((item) => {
        let start = item.toString()?.split('.')[0] || item;
        let end = item.toString()?.split('.')[1] || '';

        return (
          '0'.repeat(maxBeforePoint - start.length) +
          start +
          (con ? '.' : '') +
          end +
          '0'.repeat(maxAfterPoint - end.length)
        );
      });
      return newArr;
    }
    if (value.length <= 1) return;
    const vals = putZero(value);
    let useIndex = vals[0]?.length - 1;
    let carry = 0;
    if (vals.length <= 0 || !maxZero || !maxDec) return;

    let subResult =
      '0'.repeat(maxZero - 1 || 1) +
      [...parseNumber(abs(subtraction), {}, maxDec).toString()].join('');
    let len = subResult.length - 1;
    let step = '';
    let stepCount = 1;
    const allSteps = () =>
      [...vals[0]]?.map(() => {
        if (vals[0][useIndex] != '.') {
          let join = vals?.map((a) => Number(a[useIndex]));
          let condition = join[0] > join[1];
          let subAll = subResult.slice(len, subResult.length);
          join[0] -= carry;
          var equal = join[0] == join[1];
          step = [
            {
              value: `<b>Step-${stepCount}</b>`,
              type: 'span',
            },
            'br',
            {
              value: `We have to subtract the right-end lower digit from the above ${join.join(
                '-'
              )}`,
              type: 'span',
            },
            'br',
            {
              value: `Since ${join[0]} ${equal ? '=' : condition ? '>' : '<'} ${
                join[1]
              } so the bottom digit is ${
                equal ? 'equal to' : condition ? 'smaller than' : 'greater than'
              }  the above digit. <br> So here we will ${
                condition ? 'not borrow' : 'borrow 1'
              } from the left column of digits.`,
              type: 'span',
            },
            'br',
            {
              value:
                condition || equal
                  ? ''
                  : `<b>Borrow</b> 1 from ${
                      vals[0][useIndex - 1]
                    }. The remainder will be 1, 10 + ${join[0]} = ${
                      10 + join[0]
                    }`,
              type: 'span',
            },
            {
              value: `<br>Subtracting (${
                (condition || equal ? '0' : '1') + vals[0][useIndex] - carry
              }-${join[1]}) = ${subResult[useIndex]}`,
              type: 'span',
            },
            'br',
            {
              value:
                condition || equal
                  ? ''
                  : `${'&#160;&#160;'.repeat(
                      abs(vals[0].length - subAll.length - 1) * 2
                    )}${
                      vals[0][useIndex - 1] == '.'
                        ? vals[0][useIndex - 2] - 1
                        : vals[0][useIndex - 1] - 1
                    }&#160;&#160;${'1' + vals[0][useIndex] - carry}`,
              type: 'span',
              className: 'text-danger',
            },
            'br',
            vals
              .map((item) => {
                return [
                  [...item].map((a, ind) => {
                    return {
                      value: `${a}&#160;&#160;`,
                      type: 'span',
                      className: useIndex == ind ? 'text-success ' : '',
                    };
                  }),
                  'br',
                ].flat();
              })
              .flat(),
            {
              value: '-'.repeat(vals[0].length * 3),
              type: 'span',
            },
            'br',
            {
              value:
                '&#160;&#160;'.repeat(abs(vals[0].length - subAll.length) * 2) +
                [...subAll].join('&#160;&#160;'),
              className: 'text-primary',
              type: 'span',
            },
          ].flat();
          stepCount++;
          carry = condition || equal ? 0 : 1;
        } else {
          step = '<br>';
        }
        useIndex--;
        len--;
        return step;
      });
    const finalAnswer = [
      {
        value: `The result of the Subtraction of the given decimal numbers <font size="+1">(${parseNumber(
          tempArr.join('-')
        )})  </font> is <b className="text-primary"> ${
          parseNumber(isMinus ? -subtraction : subtraction) || '0'
        }</b>`,
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
        value: ` Given decimal number =  ${tempArr.join(',')}`,
        type: 'span',
      },
      'br',
      {
        value: `To Subtract these numbers `,
        type: 'span',
      },
      'br',
      {
        value: `• Write all the given numbers one under the other by lining up the decimal point.`,
        type: 'span',
      },
      'br',
      {
        value: `• Add trailing zeroes so that all the numbers should have the same length.`,
        type: 'span',
      },
      'br',

      {
        value: vals.map((item) => [...item].join(' ')).join('<br>'),
        type: 'span',
      },
      'br',
      {
        value: '-'.repeat(vals[0].length * 2.4),
        type: 'span',
      },
      'br',
      {
        value: `•Subtract each column of the digit, starting from the right side towards the left.`,
        type: 'span',
      },
      'br',
      {
        value: `•If the digit being subtracted is larger than the above-placed digit, borrow a digit from the next column to the left. `,
        type: 'span',
      },
      'br',
      'br',
      ...allSteps().flat(),

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
  }, [showSteps, subtraction]);

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
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger  mt-3"
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

export default DecimalNumberSubtraction;
