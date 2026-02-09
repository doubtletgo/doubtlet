'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { putSpace } from '../../helpers/general';

const SquareRootToItsLowestForm = () => {
  const [a, setA] = useLocalStorage('SquareRootToItsLowestForm_a', '400');

  const [equation, setEquation] = useLocalStorage('SquareRootToItsLowestForm_equation', '');
  const [solution, setSolution] = useLocalStorage('SquareRootToItsLowestForm_solution', '');
  const [result, setResult] = useLocalStorage('SquareRootToItsLowestForm_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SquareRootToItsLowestForm_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SquareRootToItsLowestForm_showSteps', true);
  const [note, setNote] = useLocalStorage('SquareRootToItsLowestForm_note', undefined);
  const [arr, setArr] = useLocalStorage('SquareRootToItsLowestForm_arr', []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Reduce the Square root of the number ${parseNumber(
            a || '1'
          )} to its lowest form.`,
          type: 'span',
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
          value: putSpace(
            `Radicand:- \\bold {\\bigg<${parseNumber(a || '1')}\\bigg>}`
          ),
          type: 'equation',
        },
      ])
    );
    if (!a) return;
    //factor function
    if (isInvalid) return;
    let divisionArr = [];
    let arrTemp = arr || [];
    function factor(a) {
      if (isNaN(a) || !isFinite(a) || a % 1 != 0 || a == 0) return '' + a;
      if (a < 0) return '-' + factor(-a);
      var minFactor = leastFactor(a);
      let val = { minFactor, a };
      divisionArr = [...divisionArr, val];
      if (a == minFactor) return '' + a;

      return minFactor + '*' + factor(a / minFactor);
    }
    function leastFactor(a) {
      arrTemp = [...arrTemp, a];
      if (isNaN(a) || !isFinite(a)) return a;
      if (a == 0) {
        return 0;
      }
      if (a % 1 || a * a < 2) {
        return 1;
      }
      if (a % 2 == 0) {
        return 2;
      }
      if (a % 3 == 0) {
        return 3;
      }
      if (a % 5 == 0) {
        return 5;
      }
      var m = Math.sqrt(a);
      for (var i = 7; i <= m; i += 30) {
        if (a % i == 0) return i;
        if (a % (i + 4) == 0) return i + 4;
        if (a % (i + 6) == 0) return i + 6;
        if (a % (i + 10) == 0) return i + 10;
        if (a % (i + 12) == 0) return i + 12;
        if (a % (i + 16) == 0) return i + 16;
        if (a % (i + 22) == 0) return i + 22;
        if (a % (i + 24) == 0) return i + 24;
      }

      return a;
    }

    const result = factor(a);
    setArr(arrTemp);
    const singleArr = [];
    const sqrArr = [];
    const singleValues = [];
    const pairResults = () => {
      let arr = [];
      if (singleArr.length > 0) singleArr.splice(0, singleArr.length);
      if (sqrArr.length > 0) sqrArr.splice(0, sqrArr.length);
      if (singleValues.length > 0) singleValues.splice(0, singleValues.length);
      let newResult = result.split('*');
      for (let i = 0; i < newResult.length; i++) {
        if (newResult[i] == newResult[i + 1]) {
          arr.push(`${newResult[i]}{^2}`);
          sqrArr.push(`${newResult[i]}{^2}`);
          singleValues.push(newResult[i]);
          i++;
        } else {
          arr.push(newResult[i]);
          singleArr.push(newResult[i]);
        }
      }
      return arr;
    };
    pairResults();
    const singleMultiply = singleArr?.reduce(
      (acc, current) => acc * current,
      1
    );
    const sqrMultiply = singleValues?.reduce(
      (acc, current) => acc * current,
      1
    );
    const finalAnswer = [
      {
        value: `The square root of the number ${a} to its lowest form is `,
        type: 'span',
      },
      {
        value: `\\bold{${sqrMultiply == 1 ? '' : sqrMultiply}${
          singleMultiply == 1 ? '' : `\\sqrt{${singleMultiply}}`
        } }`,
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

    const step2 =
      result == a
        ? [
            {
              value: `Since the value is a Prime Number , it can not be simplified further`,
              type: 'span',
            },
          ]
        : [
            {
              value: `<b>Step-2</b>`,
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
            {
              value: `\\sqrt{${a}}= \\sqrt{(${pairResults().join('.')})} `,
              type: 'equation',
            },
            {
              value: `Applying the above given radical rules here`,
              type: 'span',
            },
            {
              value: `\\sqrt{${a}}=${
                sqrArr.length ? `\\sqrt{${sqrArr.join('.')}}` : ''
              }${singleArr.length > 0 ? '\\sqrt' : ''}{${singleArr.join(
                '.'
              )}}= ${singleValues.join('.')}${
                singleMultiply == 1 ? '' : `\\sqrt{${singleMultiply}}`
              } `,
              type: 'equation',
            },
          ];

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        className: 'text-decoration-underline',
        type: 'span',
      },
      'br',
      {
        value:
          'First, we have to find the prime factors of the given number and make <br>the pairs of similar prime factors then Apply radical rules. ',
        type: 'span',
      },
      'br',
      {
        value: `\\sqrt{ab} =\\space  \\sqrt{a} .\\sqrt{b} \\space where\\space a,b \\space  ≥ \\space 0`,
        type: 'equation',
      },
      {
        value: `\\sqrt{a^2}=\\space a\\space   where\\space a   ≥ \\space 0`,
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given number = ${parseNumber(a)}`,
        type: 'span',
      },
      'br',
      {
        value: `Now, the prime factors of ${parseNumber(a)} are `,
        type: 'span',
      },
      'br',
      {
        value: ` ${parseNumber(a)} = ${result}`,
        type: 'span',
      },
      {
        value: ` =${pairResults().join('.')}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/prime-factorization-calculator/?a=${a}" target="_blank">to see Steps to find Prime Factorisation  click here</a>`,
        type: 'span',
      },
      'br',
      ...step2,
      {
        value:
          sqrMultiply == 1
            ? ''
            : `\\sqrt{${a}}=${sqrMultiply}${
                singleMultiply == 1 ? '' : `\\sqrt{${singleMultiply}}`
              } `,
        type: 'equation',
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The square root of the number \\bold{{${a}}} to its lowest form is `
        ),
        type: 'equation',
      },
      {
        value: `\\bold{${sqrMultiply == 1 ? '' : sqrMultiply}${
          singleMultiply == 1 ? '' : `\\sqrt{${singleMultiply}}`
        } }.`,
        type: 'equation',
      },
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
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

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
          <div className="text-left mb-3">
            Your input can be in form of only Positive real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Radicand:-</div>
            <div className="col-9">
              <Input
                placeholder="Dividend"
                autoComplete="off"
                className="col-12"
                value={a}
                min={1}
                setVal={setA}
                prohibited={[0]}
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

export default SquareRootToItsLowestForm;
