'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';

import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { parseNumber } from '../../helpers/decimal';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams } from '../../helpers/general';

const ArithmeticMean = () => {
  const [n, setN] = useLocalStorage('arithmeticMean_n', '5,6,7,3,2');
  const [parsedNum, setParsedNum] = useLocalStorage('arithmeticMean_parsedNum', []);

  const [equation, setEquation] = useLocalStorage('arithmeticMean_equation', '');
  const [solution, setSolution] = useLocalStorage('arithmeticMean_solution', '');
  const [result, setResult] = useLocalStorage('arithmeticMean_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('arithmeticMean_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('arithmeticMean_showSteps', true);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setN(vals.a);
  }, []);

  useEffect(() => {
    const numbers = n
      .split(`,`)
      .map((s) => s.trim())
      .map((s) => Number(s));
    setParsedNum(numbers);
  }, [n]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Numbers = \\bold{${
            parsedNum.length ? parsedNum.join(', ') : '0'
          }}`,
          type: 'equation',
        },
      ])
    );

    const len = parsedNum.length; // 5
    const sum = parsedNum.reduce((total, a) => total + a, 0);
    const parsed = parsedNum.join(',');
    const res = sum / len;

    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        type: 'equation',
        value: `The \\space \\bold{Arithmetic \\space mean(\\mu)} \\space of \\space \\bold{${parsed}} \\space is \\space \\bold{${
          Number.isInteger(res)
            ? res
            : `{${parseNumber(
                sum
              )} \\above{1pt} ${len}}} \\space or \\space \\bold{${parseNumber(
                res
              )}`
        }}`,
      },
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
        value: `We \\space know \\space  that \\space \\bold{Arithmetic \\space  Mean(\\mu) \\space  or \\space  Average \\space  
        of }`,
        type: 'equation',
      },
      {
        value: `\\bold{(X_1,X_2,X_3,....,X_n)} \\space is \\space given \\space by \\space sum \\space of \\space all \\space the`,
        type: 'equation',
      },
      {
        value: `numbers \\space divided \\space by \\space number \\space of \\space input \\space values(n)`,
        type: 'equation',
      },
      {
        value: `\\bold{\\mu = \\bigg\\lbrace{(X_1+X_2+X_3+.....+X_n)\\above{1pt}n}\\bigg\\rbrace}`,
        type: 'equation',
      },
      {
        value: `From \\space the \\space above \\space input \\space it \\space is \\space given \\space that 
        \\space values \\space are \\space \\bold{${parsed}}`,
        type: 'equation',
      },
      {
        value: `Now, \\space sum \\space of \\space these \\space value \\space is \\space \\bold{(${parsedNum.join(
          '+'
        )})} = ${Number.isInteger(sum) ? sum : parseNumber(sum)}`,
        type: 'equation',
      },
      {
        value: `And \\space Number \\space of \\space values(n) \\space is \\space = \\space ${len}`,
        type: 'equation',
      },
      {
        value: `Then by applying the above formula of`,
        type: 'span',
      },
      'br',
      {
        value: `Arithmetic mean for given input values`,
        type: 'span',
      },
      {
        value: `\\mu \\space = \\space ${
          Number.isInteger(res)
            ? res
            : `{${parseNumber(
                sum
              )} \\above{1pt} ${len}} \\space or \\space \\bold{${parseNumber(
                res
              )}}`
        }`,
        type: 'equation',
      },
      {
        value: `<hr />`,
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The \\space \\bold {Arithmetic \\space mean(\\mu)} \\space of \\space \\bold{${parsed}} \\space is \\space \\bold{${
          Number.isInteger(res)
            ? res
            : `{${parseNumber(
                sum
              )} \\above{1pt} ${len}}} \\space or \\space \\bold{${parseNumber(
                res
              )}`
        }}`,
        type: 'equation',
      },
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [parsedNum, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setN('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = parsedNum.some((v) => !!v && v != '0');

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seprated values"
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
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
          className="default-btn rounded-pill px-5 btn btn-danger"
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

export default ArithmeticMean;
