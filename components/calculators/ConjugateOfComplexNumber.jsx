'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState, useRef } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  evalInDecimals,
  convertFromLatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import MathInput from 'react-math-keyboard';

const ConjugateOfComplexNumber = () => {
  const [a, setA] = useState('5');
  const [b, setB] = useState('3');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setB(vals.y1);
  }, []);

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
            `Find the conjugate of the given Complex Number (\\bold{{${
              a || 'a'
            }} ${addSymbol(evalInDecimals(tempB))}{${removeSymbol(
              b || 'b'
            )}}i})`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Complex Number  (Z): \\bigg< \\bold{{${a || 'a'}} ${addSymbol(
              evalInDecimals(tempB)
            )}{${removeSymbol(b || 'b')}}i} \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    //Final Answer
    const finalAnswer = [
      {
        value: putSpace(
          `The (\\bar{Z}) Conjugate of the given Complex Number ({${valueToKatex(
            aValue
          )}} ${addSymbol(evalInDecimals(bValue))} {${removeSymbol(
            valueToKatex(bValue)
          )}}i)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{({${valueToKatex(aValue)}} ${minusSymbol(
            evalInDecimals(bValue)
          )} {${removeSymbol(
            valueToKatex(bValue)
          )}}i)} or \\bold{({${evalInDecimals(aValue)}} ${minusSymbol(
            evalInDecimals(bValue)
          )} {${removeSymbol(evalInDecimals(bValue))}}i)} `
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
        value: putSpace(
          `To find the conjugate of a complex numers, we need to change the sign`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `of the Imaginary part. It is represented by \\bold{\\bar{Z}}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Let \\bold{Z = a + ib} then \\bold{\\bar{Z}} = a - ib`
        ),
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
        value: putSpace(`\\bold{Given input :}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Z = {${valueToKatex(aValue)}} + ({${valueToKatex(bValue)}})i `
        ),
        type: 'equation',
      },

      {
        value: putSpace(`then`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Conjugate of Z = \\bold{(${valueToKatex(aValue)} ${minusSymbol(
            evalInDecimals(bValue)
          )} {${removeSymbol(valueToKatex(bValue))}}i)}`
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
  }, [a, b, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    mf1.current.latex('');
    mf2.current.latex('');

    setA('');
    setB('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [1].every((v) => (!!v && !isNaN(v)) || v === 0);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>{' '}
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Complex Number Z:</div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                initialLatex={a}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                initialLatex={b}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
              />
            </div>
            <div className="col-3"></div>
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

export default ConjugateOfComplexNumber;
