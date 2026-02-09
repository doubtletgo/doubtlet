'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';

const FractionAdditionSubstraction = () => {
  const [l, setL] = useLocalStorage('FractionAdditionSubstraction_l', '5,6/2,5/2,7/2');
  const [equation, setEquation] = useLocalStorage('FractionAdditionSubstraction_equation', '');
  const [solution, setSolution] = useLocalStorage('FractionAdditionSubstraction_solution', '');
  const [result, setResult] = useLocalStorage('FractionAdditionSubstraction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FractionAdditionSubstraction_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FractionAdditionSubstraction_showSteps', true);
  const [note, setNote] = useLocalStorage('FractionAdditionSubstraction_note', undefined);
  const [order, setOrder] = useLocalStorage('FractionAdditionSubstraction_order', 'Addition');

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.l) setL(vals.l);
    if (vals.type) setOrder(vals.type);
  }, []);

  const isAddition = order === 'Addition';

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
          value: `${isAddition ? `Add` : `Sub`} all the given fractions`,
          type: `span`,
        },
        {
          value:
            '\\bigg (' +
            upperVal
              .map((item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`)
              .join(isAddition ? '+' : '-') +
            '\\bigg )',
          type: 'equation',
        },
      ])
    );
  }, [l, division]);

  useEffect(() => {
    const isInvalid = [l].some((x) => !x && x != 0);
    if (isInvalid) return;
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
          value:
            '\\bigg <' +
            upperVal.map(
              (item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`
            ) +
            '\\bigg >',
          type: 'equation',
        },
      ])
    );

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

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const answer = lowerVal.reduce(lcm);

    const multiple = upperVal.map(
      (item, index) => (item * answer) / lowerVal[index]
    );

    const sumOfAll = multiple.reduce((acc, curr) => {
      return isAddition ? acc + curr : acc - curr;
    });
    const { numR, denumR } = fraction(sumOfAll, answer);

    const finalAnswer = [
      {
        value: `${
          isAddition ? `Addition` : `Subtraction`
        } result of all the given fractions`,
        type: `span`,
      },
      {
        value:
          '\\bigg (' +
          upperVal
            .map((item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`)
            .join(isAddition ? '+' : '-') +
          '\\bigg )' +
          '\\space is' +
          `\\space \\bold{{${numR}\\above{1pt}${denumR}}}`,
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
      {
        value: `Now we have to find the Lowest common multiple of all the denominators.`,
        type: `span`,
      },
      'br',
      {
        value: `LCM of (${parseNumber(lowerVal)}) =${parseNumber(answer)} `,
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
        value: `Now we have to divide the LCM by denominators then multiply the result`,
        type: `span`,
      },
      {
        value: `with numerator respectively and then add all the results`,
        type: `span`,
      },
      {
        value: upperVal
          .map(
            (item, index) =>
              `(${item}).\\bigg({${answer}\\above{1pt}${lowerVal[index]}}\\bigg)`
          )
          .join(isAddition ? '+' : '-'),
        type: 'equation',
      },
      {
        value: `Now after solving`,
        type: `span`,
      },
      {
        value: upperVal
          .map((item, index) => `(${item}).({${answer / lowerVal[index]}})`)
          .join(isAddition ? '+' : '-'),
        type: 'equation',
      },
      {
        value: multiple
          .map((item) => {
            return `(${item})`;
          })
          .join(isAddition ? '+' : '-'),
        type: 'equation',
      },
      {
        value: sumOfAll,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now\\space we\\space  have\\space  to\\space  divide\\space  the\\space  result\\space  by\\space  
        LCM\\space  = {${sumOfAll} \\above{1pt}${parseNumber(answer)}} `,
        type: `equation`,
      },
      {
        value: `Now\\space  reducing\\space  the\\space  above\\space  fraction\\space  to\\space  its\\space  
        lowest\\space  form = \\bold {{${numR}\\above{1pt}${denumR}}}`,
        type: `equation`,
      },
      {
        value: `<a href="/calculator/fraction-reduction-calculator/?a=${sumOfAll}/${answer}" target="_blank">to see Steps 
        click here</a>`,
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
              <div className="col-4 text-left">Add/Sub</div>
              <div className="col-8">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={order}
                  onChange={onChangeOrder}
                >
                  <option value="Addition">Addition</option>
                  <option value="Subtraction">Subtraction</option>
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

export default FractionAdditionSubstraction;
