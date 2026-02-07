'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const AreaOfCircle = () => {
  const [r, setR] = useState('\\sqrt{4}');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setR(vals.x1);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Area (A) of the \\bold{Circle}, Whose \\bold{Radius(r)} is: \\bold{${
              r || 1
            }}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [r]);

  useEffect(() => {
    isInvalid.current = [r].some((x) => !x);
    const tempR = katexSimplifiedValue(r);
    const rValue = evalExpression(tempR);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Radius of circle (r) = \\bold{${r || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let rSquare = evalExpression(`${rValue} * ${rValue}`);
    let area = evalExpression(`(22 / 7) * ${rSquare}`);
    let multiple = evalExpression(`22 * ${rSquare}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Circle} with \\bold{Radius} r = \\bold{{${valueToKatex(
            rValue
          )}}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is\\enspace\\bold{${valueToKatex(
            rSquare
          )}\\pi}\\enspace or\\enspace\\bold{${evalInDecimals(
            area
          )}} square units.`
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
          `We know that \\bold{Area(A)} of the \\bold{Circle} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A=(\\pi)(r)^2} Where, \\bold{r} is the \\bold{Radius}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that `),
        type: 'equation',
      },
      {
        value: `r = \\bold{${showVal(r, rValue)}}`,
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = (\\pi)({${valueToKatex(rValue)}})^2 = ${valueToKatex(
            rSquare
          )}\\pi`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = {${valueToKatex(multiple)}\\above{1pt}7} or ${evalInDecimals(
            area
          )}`
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
  }, [r, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setR('');
    mf1?.current.latex('');

    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [r].some((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Positive Real Number or any
            Variable
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Side (a):</div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setR}
                allowAlphabeticKeyboard={false}
                initialLatex={r}
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
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
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

export default AreaOfCircle;
