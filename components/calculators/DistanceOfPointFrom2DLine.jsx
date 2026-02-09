'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';

import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
  valueToKatex,
} from '../../helpers/matrixHelper';
import { convertToKatex } from '../../helpers/SolveRoot';

const DistanceOfPointFrom2DLine = () => {
  const [a, setA] = useLocalStorage('DistanceOfPointFrom2DLine_a', '2');
  const [b, setB] = useLocalStorage('DistanceOfPointFrom2DLine_b', '4');
  const [c, setC] = useLocalStorage('DistanceOfPointFrom2DLine_c', '2');
  const [x, setX] = useLocalStorage('DistanceOfPointFrom2DLine_x', '3');
  const [y, setY] = useLocalStorage('DistanceOfPointFrom2DLine_y', '3');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('DistanceOfPointFrom2DLine_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceOfPointFrom2DLine_solution', '');
  const [showResult, setShowResult] = useLocalStorage('DistanceOfPointFrom2DLine_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceOfPointFrom2DLine_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('DistanceOfPointFrom2DLine_isPointSame', false);
  const [note, setNote] = useLocalStorage('DistanceOfPointFrom2DLine_note', undefined);
  const [result, setResult] = useLocalStorage('DistanceOfPointFrom2DLine_result', '');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Distance (d) of the Point \\bold{P(${parseNumber(
              x || '1'
            )}, ${parseNumber(
              y || '1'
            )})}  from the Line \\bold{L ({${parseNumber(
              a || ''
            )}} x + {${parseNumber(b || '')}}y + {${parseNumber(
              c || 'c'
            )}} = 0).}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, x, y]);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.y1) setC(vals.y1);
    if (vals.x2) setB(vals.x2);
    if (vals.y2) setX(vals.y2);
  }, []);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Line \\space (L) = \\space{ ${a || ''}}x+{${b || ''}}y+{${
            c || '1'
          }} = 0`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Point \\space (P) = \\space x = \\bold{${
            x || '1'
          }}, \\space  y = \\bold{${y || '1'}}`),
          type: 'equation',
        },
      ])
    );
    isInvalid.current = [a, b, c, x, y].some((x) => !x);
    setIsPointSame(a == b && c == x);

    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempX = katexSimplifiedValue(x);
    const tempY = katexSimplifiedValue(y);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const xValue = evalExpression(tempX);
    const yValue = evalExpression(tempY);

    if (isInvalid.current) return;
    let aX = evalExpression(`${aValue} * (${xValue})`);
    let bY = evalExpression(`${bValue} * (${yValue})`);
    let aSquare = evalExpression(`${aValue} *(${aValue})`);
    let bSquare = evalExpression(`${bValue} *(${bValue})`);
    let numeratorAdd = evalExpression(`${aX} +(${bY}) + (${cValue})`);
    let denominatorAdd = evalExpression(`${aSquare} +(${bSquare})`);
    let roundSquareRoot = evalExpression(
      ` ${numeratorAdd} / sqrt(${denominatorAdd})`
    );
    let notRoundSquareRoot = evalExpression(
      `${numeratorAdd}* sqrt(${denominatorAdd}) / (${denominatorAdd})`
    );
    let checkRoot = evalInDecimals(`sqrt(${denominatorAdd})`);
    let numByDenumKatex = convertToKatex(
      valueToKatex(numeratorAdd),
      valueToKatex(denominatorAdd),
      true
    );

    const finalAnswer = [
      {
        value: putSpace(
          `The Distance (d) of the Point P \\bold{(${parseNumber(
            x || ''
          )}, ${parseNumber(y || '')}) } from the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` Line L \\bold{({${parseNumber(a)}}x + {${parseNumber(
            b
          )}}y + {${parseNumber(c || 'c')}} = 0)} is:`
        ),
        type: 'equation',
      },
      {
        value: `{${valueToKatex(numeratorAdd)}\\above{1pt}\\sqrt{${valueToKatex(
          denominatorAdd
        )}}} \\implies ${
          Number.isInteger(checkRoot)
            ? `${valueToKatex(roundSquareRoot)}`
            : `{${valueToKatex(numeratorAdd)}\\above{1pt}${valueToKatex(
                denominatorAdd
              )}}*\\sqrt{${valueToKatex(
                denominatorAdd
              )}} \\implies {${numByDenumKatex}}*\\sqrt{${valueToKatex(
                denominatorAdd
              )}}`
        } `,
        type: 'equation',
      },
      {
        value: `${
          Number.isInteger(checkRoot)
            ? ``
            : `\\implies ${valueToKatex(notRoundSquareRoot)}`
        }`,
        type: 'equation',
      },
    ];
    const eqations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(eqations);
    setResult(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`We know that the Distance (d) of`),
        type: 'equation',
      },
      {
        value: putSpace(`the Point P (x_1, y_1)  from the`),
        type: 'equation',
      },
      {
        value: ` Line L (ax + by + c = 0) is given by the `,
        type: 'span',
      },
      {
        value: putSpace(
          `formula below d = {ax_1+by_1+c\\above{1pt}(\\sqrt{a^2+b^2})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: putSpace(
          `a = ${showVal(a, aValue)}, b = ${showVal(b, bValue)}, c = ${showVal(
            c,
            cValue
          )}, x_1 = ${showVal(x, xValue)}, y_1 = ${showVal(y, yValue)} `
        ),
        type: 'equation',
      },
      {
        value: `Now putting these values in the above`,
        type: 'span',
      },
      'br',
      {
        value: `given formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `d = {({${a}})({${x}})+({${b}})({${y}})+{${c}}\\above{1pt}(\\sqrt{{${a}}^2 + {${b}}^2})}`
        ),
        type: 'equation',
      },
      {
        value: `After Solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `d = {${valueToKatex(aX)}+${valueToKatex(bY)}+${valueToKatex(
            c
          )}\\above{1pt}\\sqrt{${valueToKatex(aSquare)}+${valueToKatex(
            bSquare
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `d = {${valueToKatex(numeratorAdd)}\\above{1pt}\\sqrt{${valueToKatex(
            denominatorAdd
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `d = ${
            Number.isInteger(checkRoot)
              ? `${valueToKatex(roundSquareRoot)}`
              : `{${valueToKatex(numeratorAdd)}\\above{1pt}${valueToKatex(
                  denominatorAdd
                )}}*\\sqrt{${valueToKatex(denominatorAdd)}}`
          } ${
            Number.isInteger(checkRoot)
              ? ``
              : `\\implies ${valueToKatex(notRoundSquareRoot)}`
          }`
        ),
        type: 'equation',
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
  }, [a, b, c, x, y, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    setA('');
    setB('');
    setC('');
    setX('');
    setY('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a, b, c, x, y].some((v) => !!v || v == 0) && b != a;
  const hasAllValue = [a, b, c, x, y].every((v) => !!v || v == 0) && b != a;
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
            <div className="col-4 text-left">Line L:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setA}
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
              allowAlphabeticKeyboard={false}
              initialLatex={a}
              style={{
                width: '20%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setB}
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
              allowAlphabeticKeyboard={false}
              initialLatex={b}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setC}
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
              allowAlphabeticKeyboard={false}
              initialLatex={c}
              style={{
                width: '20%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P(x, y):</div>
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setX}
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
              allowAlphabeticKeyboard={false}
              initialLatex={x}
              style={{
                width: '30%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setY}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y}
              style={{
                width: '30%',
              }}
            />
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue &&
        (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        ) : (
          <div>
            <strong>Note :-</strong> Since initial & final points are the same
            hence points are <strong>Coincident</strong> and distance between
            two coincident points is always <strong>ZERO</strong>.
          </div>
        ))}
      {hasValue && (
        <button
          className="default-btn rounded-pill mt-2 px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
        <>
          <Equation className="mt-3" equation={result} />
          {
            <button
              className="default-btn mt-3 rounded-pill px-5 btn-blue"
              onClick={toggleSteps}
            >
              Show Steps
            </button>
          }
        </>
      )}
      {hasAllValue && !isPointSame && showSteps && (
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

export default DistanceOfPointFrom2DLine;
