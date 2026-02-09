'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { pluralise, putSpace } from '../../helpers/general';
import { removeSymbol } from '../../helpers/RootSolver';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import Input from '../common/input';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
  evalToDecimals,
} from '../../helpers/matrixHelper';

import MathInput from 'react-math-keyboard';

const RootOfAComplexNumbers = () => {
  const [a, setA] = useLocalStorage('RootOfAComplexNumbers_a', '1');
  const [b, setB] = useLocalStorage('RootOfAComplexNumbers_b', '2');
  const [n, setN] = useLocalStorage('RootOfAComplexNumbers_n', '4');
  const [equation, setEquation] = useLocalStorage('RootOfAComplexNumbers_equation', '');
  const [solution, setSolution] = useLocalStorage('RootOfAComplexNumbers_solution', '');
  const [result, setResult] = useLocalStorage('RootOfAComplexNumbers_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('RootOfAComplexNumbers_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('RootOfAComplexNumbers_showSteps', true);
  const [note, setNote] = useLocalStorage('RootOfAComplexNumbers_note', undefined);
  const isInvalid = useRef();
  const mf1 = useRef();
  const mf2 = useRef();

  isInvalid.current = [a, b, n].some((x) => !x);

  const tempA = convertFromLatex(a);
  const tempB = convertFromLatex(b);
  const aValue = evalExpression(tempA);
  const bValue = evalExpression(tempB);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{${
              n || 'n'
            }}^{th}root of the Complex Number (\\bold{{${a || 'a'}} ${addSymbol(
              evalToDecimals(tempB, 1)
            )} {${removeSymbol(b || 'b')}}i})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [b, a, n]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Complex Number(Z): \\bigg<\\bold{{${a || 'a'}} ${addSymbol(
              evalToDecimals(tempB, 1)
            )} {${removeSymbol(b || 'b')}}i} \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Value of n(n^{th} root): \\bigg<\\bold{${n || 'n'}}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    const polar = evalExpression(`(${aValue})^2 + (${bValue})^2`);

    if (!aValue || !bValue) return;

    let stepRoot = [];
    let i = 0;
    while (i < n) {
      const isMinus = i % 2 != 0;
      const pi = 2 * i == 0 ? '' : `{${2 * i}}\\pi +`;
      stepRoot.push(
        {
          value: putSpace(`\\bold{(k = ${i}):-}`),
          type: 'equation',
        },
        {
          value: putSpace(
            `=(\\sqrt{{${convertIntoLatex(
              polar
            )}}}})^{1\\above{1pt}{${n}}} {(cos\\bigg({ 2\\pi(${i}) + tan^{-1}(2) \\above{1pt} {${n}}}\\bigg) + i sin\\bigg( {2\\pi(${i}) + tan^{-1} (2)) \\above{1pt} {${n}}} \\bigg)) `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `=({${convertIntoLatex(polar)}})^{1\\above{1pt}{${
              n * 2
            }}} Cos({{${pi} tan^{-1}(2)}\\above{1pt}${convertIntoLatex(
              n
            )}}) + i({${convertIntoLatex(polar)}})^{1\\above{1pt}{${
              n * 2
            }}} sin ({${pi} tan^{-1}({2})\\above{1pt} {${n}}}) `
          ),
          type: 'equation',
        }
      );
      if (i > 0) {
        stepRoot.push({
          value: putSpace(
            `={${isMinus ? '-' : ''}} ({${convertIntoLatex(
              polar
            )}})^{1\\above{1pt}{${
              n * 2
            }}} Cos({{tan^{-1}(2)}\\above{1pt}${convertIntoLatex(
              n
            )}}) + i({${convertIntoLatex(polar)}})^{1\\above{1pt}{${
              n * 2
            }}} sin ({${pi} tan^{-1}({2})\\above{1pt} {${n}}}) `
          ),
          type: 'equation',
        });
      }
      i++;
    }

    const tanInRadian = evalExpression(`atan(${bValue})`);
    const Dived = evalExpression(`${tanInRadian}/(${n})`);
    const sin = evalExpression(`sin(${Dived})*((${polar})^(1/${n * 2}))`);
    const cos = evalExpression(`cos(${Dived})*(${polar}^(1/${n * 2}))`);

    let answerStep = [];
    let k = 0;
    while (k <= n) {
      switch (k) {
        case 1:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                ` ({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) + i (${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },

            {
              value: putSpace(
                `\\approx  {${removeSymbol(
                  evalToDecimals(cos, 6)
                )}} ${addSymbol(evalInDecimals(sin))}  {${evalToDecimals(
                  removeSymbol(sin),
                  6
                )}}i`
              ),
              type: 'equation',
            }
          );
          break;
        case 2:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `-({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) + i (${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx ${minusSymbol(evalInDecimals(sin))}{${evalToDecimals(
                  sin,
                  6
                )}} ${addSymbol(evalInDecimals(cos, 2))} {${removeSymbol(
                  evalToDecimals(cos, 6)
                )}}i`
              ),
              type: 'equation',
            }
          );
          break;

        case 3:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `-({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg)${minusSymbol(
                  polar
                )} i(${convertIntoLatex(polar)})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx ${minusSymbol(evalInDecimals(cos))}${evalToDecimals(
                  removeSymbol(cos),
                  6
                )} ${minusSymbol(evalInDecimals(sin))} {${evalToDecimals(
                  removeSymbol(sin),
                  6
                )}}i`
              ),
              type: 'equation',
            }
          );
          break;
        case 4:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) - i(${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx {${evalToDecimals(
                  removeSymbol(sin),
                  6
                )}}${minusSymbol(evalInDecimals(cos))}${removeSymbol(
                  evalToDecimals(cos, 6)
                )}i`
              ),
              type: 'equation',
            }
          );
          break;
        case 5:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                ` ({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) + i (${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx  {${removeSymbol(
                  evalToDecimals(cos, 6)
                )}} ${addSymbol(evalInDecimals(sin))}  ({${evalToDecimals(
                  removeSymbol(sin),
                  6
                )}})i`
              ),
              type: 'equation',
            }
          );
          break;
        case 6:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `-({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) + i (${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx ({${evalToDecimals(sin, 6)}}) + ({${evalToDecimals(
                  cos,
                  6
                )}})i`
              ),
              type: 'equation',
            }
          );
          break;

        case 7:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `-({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg)${minusSymbol(
                  polar
                )} i(${convertIntoLatex(polar)})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx (${evalToDecimals(
                  removeSymbol(cos),
                  6
                )}) - ({${evalToDecimals(removeSymbol(sin), 6)}})i`
              ),
              type: 'equation',
            }
          );
          break;
        case 8:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) - i(${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx ({${evalToDecimals(
                  removeSymbol(sin),
                  6
                )}})${addSymbol(cos)}(${removeSymbol(evalToDecimals(cos, 6))})i`
              ),
              type: 'equation',
            }
          );
          break;
        case 9:
          answerStep.push(
            {
              value: putSpace(`\\bold{${pluralise(k)} root:}`),
              type: 'equation',
            },
            {
              value: putSpace(
                ` ({${convertIntoLatex(polar)}})^{1\\above{1pt}${
                  n * 2
                }} cos\\bigg({tan^{-1}({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt}${n} }\\bigg) + i (${convertIntoLatex(
                  polar
                )})^{1\\above{1pt}${
                  n * 2
                }} sin\\bigg({tan^{-1} ({${convertIntoLatex(
                  bValue
                )}}) \\above{1pt} ${n}}\\bigg)  `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\approx  ({${removeSymbol(
                  evalToDecimals(cos, 6)
                )}}) +  ({${evalToDecimals(removeSymbol(sin, 6))}})i`
              ),
              type: 'equation',
            }
          );
          break;
        default:
          answerStep.push({
            value: ``,
            type: 'span',
          });
      }
      k++;
    }

    const finalAnswer = [
      {
        value: putSpace(
          `The ${n}^{th} root of the Complex Number ({${convertIntoLatex(
            aValue
          )}} ${addSymbol(evalToDecimals(bValue))} {${removeSymbol(
            convertIntoLatex(bValue)
          )}}i) are as given below  `
        ),
        type: 'equation',
      },
      ...answerStep,
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
          `We know that the Polar form of the Complex Number (a+i b) is `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `r(cos(\\alpha) + i sin(\\alpha)) then n^{th} roots of the Complex Number`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `z = (a + ib) can be obtained by the De Moivre's Formula i.e. `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `(a + ib)^{{1\\above{1pt}n}} = (r(cos \\alpha + i sin \\alpha)^{{1\\above{1pt}n}} = r^{{1\\above{1pt}n}} (cos\\bigg({2\\pi k + \\alpha \\above{1pt} n}\\bigg) + sin\\bigg({2\\pi k + \\alpha \\above{1pt} n}\\bigg)i)`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`where k = 0,1,2...(n-1)`),
        type: 'equation',
      },

      {
        value: `<b>Step -1</b>`,
        type: 'span',
        className: 'texp-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Given input`),
        type: 'equation',
      },
      {
        value: putSpace(`Z = 1 + 2i`),
        type: 'equation',
      },
      {
        value: putSpace(`Polar form of Z = r(cos(\\alpha) + i sin(\\alpha)) `),
        type: 'equation',
      },
      {
        value: putSpace(
          `= \\sqrt{${convertIntoLatex(
            polar
          )}} (cos(tan^{-1}({${convertIntoLatex(
            bValue
          )}}) + i sin(tan^{-1}({${convertIntoLatex(bValue)}})) `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/polar-form-of-a-complex-number/?a=${a}, b =${b}" target="_blank">to see the Steps for polar form calculation, click here</a>`,
        type: `span`,
      },
      {
        value: putSpace(`Now we can say that`),
        type: 'equation',
      },
      {
        value: `<b>Step -2</b>`,
        type: 'span',
        className: 'texp-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will put the above given values in De Moivre’s Formula for each value of k.`
        ),
        type: 'equation',
      },
      ...stepRoot,
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
  }, [b, a, n, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    setB('');
    setN('');
    setA('');
    setShowResult(false);
    setShowSteps('');
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="d-flex mb-2 align-items-center">
            <div className="col-4   text-left">Complex Number (Z):</div>
            <div className={`col-3 me-2`}>
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                initialLatex={a}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  'sin',
                  'cos',
                  'tan',
                ]}
              />
            </div>
            <div className={`col-3 `}>
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                initialLatex={b}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  'sin',
                  'cos',
                  'tan',
                ]}
              />
            </div>
          </div>
          <div className="d-flex mb-2 align-items-center">
            <div className="col-4 text-left">
              Value of n (n<sup>th</sup>):
            </div>
            <div className={`col-3`}>
              <Input
                value={n}
                setVal={setN}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
          </div>
        </div>
      </div>
      <Equation equation={equation} className="border-primary" />
      <hr />{' '}
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
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
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
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

export default RootOfAComplexNumbers;
