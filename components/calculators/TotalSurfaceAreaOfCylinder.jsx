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

const TotalSurfaceAreaOfCylinder = () => {
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
          value: putSpace(
            `Find the \\bold{Total Surface Area(T.S.A)} of the \\bold{Cylinder}, Whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Radius(r)} is \\bold{${
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
          value: putSpace(`
          Radius (r)  = \\bold{${r || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Height (h) = \\bold{${h || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let add = evalExpression(`(${rValue}) + (${hValue})`);
    let twoPi = (2 * 22) / 7;
    let twoPiR = evalExpression(`${twoPi} * (${rValue})`);
    let twoMultiple = evalExpression(`2 * (${rValue})`);
    let multiple = evalExpression(`2 * ${rValue} * (${add})`);
    let area = evalExpression(`${twoPiR} * (${add})`);
    let multiplePi = evalExpression(`22 * (${multiple})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Total surface area(V)} of above given \\bold{Cylinder}`
        ),

        type: 'equation',
      },
      {
        value: putSpace(
          `with (r) =\\bold{${r}}, and (h) = \\bold{${h}} is \\bold{\\bigg({${valueToKatex(
            multiple
          )}} \\pi\\bigg)} or \\bold{{${evalInDecimals(area)}}}`
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
          `We know that \\bold{Total Surface} \\bold{Area(T.S.A)} of the \\bold{Cylinder} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A = \\lbrace{2*\\pi*r(r+h)}\\rbrace} where, \\bold{r and h} are `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the \\bold{Radius and} \\bold{Height} of the \\bold{Cylinder}.`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `r = \\bold{{${showVal(r, rValue)}}} and h = \\bold{{${showVal(
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
        value: putSpace(`First we calculate the value of`),
        type: 'equation',
      },
      {
        value: putSpace(`T.S.A = (2*\\pi*${r})(${r}+${h})`),
        type: 'equation',
      },

      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: `T.S.A = {({${valueToKatex(twoMultiple)}}\\pi)({${valueToKatex(
          add
        )}})} = {${valueToKatex(multiple)}}\\pi`,
        type: 'equation',
      },
      {
        value: `T.S.A = {{${valueToKatex(
          multiplePi
        )}}\\above{1pt}7} \\implies {${evalInDecimals(area)}} `,
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
export default TotalSurfaceAreaOfCylinder;
