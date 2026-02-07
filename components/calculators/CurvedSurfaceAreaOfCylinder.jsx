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

const CurvedSurfaceAreaOfCylinder = () => {
  const [r, setR] = useState('\\sqrt{3}');
  const [h, setH] = useState('\\pi');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setR(vals.x1);
    if (vals.x2) setH(vals.x2);
  }, []);

  //Question
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Curved Surface Area(C.S.A)} of the`),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Cylinder}, Whose \\bold{Radius} is \\bold{${
              r || 1
            }} and  \\bold{Height(h)} is \\bold{${h || 1}}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [h, r]);

  useEffect(() => {
    isInvalid.current = [r, h].some((x) => !x);
    const tempR = katexSimplifiedValue(r);
    const tempH = katexSimplifiedValue(h);
    const rValue = evalExpression(tempR);
    const hValue = evalExpression(tempH);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          Radius  (r)  = \\bold{${r || '1'}}`,
          type: 'equation',
        },
        {
          value: `
          Height  (h) = \\bold{${h || '1'}}`,
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let twoPi = (2 * 22) / 7;
    let twoPiR = evalExpression(`${twoPi} * (${rValue})`);
    let multiple = evalExpression(`${rValue} * ${hValue}`);
    let twoMultiple = evalExpression(`2 * ${multiple}`);
    let area = evalExpression(`${twoPiR} * ${hValue}`);
    let multiplePi = evalExpression(`22 * ${twoMultiple}`);

    const finalAnswer = [
      {
        value: putSpace(`The \\bold{Curved Surface Area(C.S.A)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` of above given \\bold{Cylinder} with (r) =\\bold{{${r}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `and (h) = \\bold{{${h}}} is \\bold{({${valueToKatex(
            twoMultiple
          )}} π)} or \\bold{{${evalInDecimals(area)}}}`
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
          `We know that \\bold{Curved Surface} x\\bold{Area(C.S.A)} of the \\bold{Cylinder}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given as`),
        type: 'equation',
      },

      {
        value: putSpace(
          `\\bold{C.S.A =\\lbrace{2*\\pi*r*h}\\rbrace} where \\bold{r and h} are the \\bold{Radius and}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Height} of the \\bold{Cylinder}.`),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `r =\\bold{{${showVal(r, rValue)}}} and h =\\bold{{${showVal(
            h,
            hValue
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(`First  we  calculate  the  value  of`),
        type: 'equation',
      },
      {
        value: putSpace(`C.S.A = (2*\\pi)(${r}*${h})`),
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: `C.S.A = {(2*\\pi)({${valueToKatex(
          multiple
        )}})}= {${valueToKatex(twoMultiple)}}\\pi`,
        type: 'equation',
      },
      {
        value: `C.S.A = {{${valueToKatex(
          multiplePi
        )}}\\above{1pt}7} \\implies {${evalInDecimals(area)}}`,
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
  }, [r, h, showSteps]);

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
    mf2?.current.latex('');
    setH('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [r, h].some((v) => !!v || v == 0);
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
          <div className="row mb-3 align-items-center">
            <div className="col-6">
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
            <div className="col-6">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setH}
                allowAlphabeticKeyboard={false}
                initialLatex={h}
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
              {''}
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
          AreaOfParallelogram
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
export default CurvedSurfaceAreaOfCylinder;
