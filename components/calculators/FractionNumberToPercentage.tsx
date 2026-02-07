'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { MathField } from '@/types/mathfield.types';
import { isInputInvalid } from '@/helpers/Validations';
import {
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';
import { MdErrorOutline } from 'react-icons/md';

const FractionNumberToPercentage = () => {
  const [fraction, setFraction] = useState('\\frac{-7}{4}');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Convert ${fraction} into a percent value`),
          type: 'equation',
        },
      ])
    );
  }, [fraction]);

  useEffect(() => {
    const isInvalid =
      isInputInvalid(fraction) ||
      /[a-zA-z]$/.test(fraction) ||
      /^[a-zA-Z]/.test(fraction);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Fractional  Number: \\bigg<{${fraction}}\\bigg>`),
          type: `equation`,
        },
      ])
    );

    if (isInvalid) {
      setInvalid(true);
      return;
    }

    const matches = fraction.match(/-?\d*\.?\d+/g).map(Number);
    if (matches.some((s) => isNaN(s))) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    const isMixed = matches.length == 3;
    const multiplier = isMixed ? matches[0] : 0;
    const num = isMixed ? matches[1] : matches[0];
    const denominator = isMixed ? matches[2] : matches[1];
    const numerator = num + denominator * multiplier;

    const numInto100 = Number(numerator) * 100;
    const valueIntoHundred = evalExpression(
      `(${numerator}/${denominator}) * 100`
    );
    const inDecimals = evalToDecimals(valueIntoHundred);
    const isSame = inDecimals == valueIntoHundred;

    const finalAnswer = [
      {
        value: putSpace(
          `(${fraction}) = {${valueIntoHundred}}\\% ${
            isSame ? '' : ` or ${inDecimals} \\%`
          }`
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
          `To convert a fraction into a percent, we need to multiply the numerator by 100.`
        ),
        type: 'equation',
      },
      ...(isMixed
        ? [
            {
              value: putSpace(
                `Proper fraction = \\frac{${numerator}}{${denominator}}`
              ),
              type: 'equation',
            },
            {
              value: `<a href="/calculator/mixed-number-to-improper-fraction-calculator/?x1=${multiplier}&x2=${num}/${denominator}" target="_blank">to see steps for mixed to proper fraction click here</a>`,
              type: 'span',
            },
          ]
        : []),
      {
        value: putSpace(
          `Product = \\frac{${numerator}}{${denominator}} x 100 =\\frac{${numInto100}}{${denominator}}\\% =   ${convertIntoLatex(
            valueIntoHundred
          )}\\% `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-multiplication-calculator/?a=${numerator}/${denominator},100" target="_blank">to see steps for fraction multiplication click here</a>`,
        type: 'span',
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },

      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [showSteps, fraction]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = !invalid;

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
            Your input can be in the form of Integer, Fraction, or any Real
            Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Fractional Number:-</div>
            <div className={`col-8 position-relative`}>
              <MathInput
                setValue={setFraction}
                numericToolbarKeys={[]}
                setMathfieldRef={(ref: MathField) => (inputRef.current = ref)}
                allowAlphabeticKeyboard={false}
                initialLatex={fraction}
                style={{
                  border: invalid ? `2px solid #dc3545` : `0.5px solid blue`,
                  borderRadius: '6px',
                }}
              />
              {invalid && (
                <div
                  style={{
                    position: 'absolute',
                    right: '5%',
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MdErrorOutline size={'1.5rem'} color="#dc3545" />
                </div>
              )}
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

export default FractionNumberToPercentage;
