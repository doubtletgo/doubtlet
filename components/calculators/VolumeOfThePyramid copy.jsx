'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
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

const VolumeOfThePyramid = () => {
  const [a, setA] = useLocalStorage('VolumeOfThePyramid copy_a', '\\sqrt{3}');
  const [h, setH] = useLocalStorage('VolumeOfThePyramid copy_h', '\\pi');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('VolumeOfThePyramid copy_equation', '');
  const [solution, setSolution] = useLocalStorage('VolumeOfThePyramid copy_solution', '');
  const [result, setResult] = useLocalStorage('VolumeOfThePyramid copy_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('VolumeOfThePyramid copy_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('VolumeOfThePyramid copy_showSteps', true);
  const [note, setNote] = useLocalStorage('VolumeOfThePyramid copy_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
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
            `Find the \\bold{Volume (V)} of the \\bold{Pyramid}, whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` base area (a) is \\bold{${a || 'a'}} and Height (h) is \\bold{${
              h || 'h'
            }.}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [h, a]);

  useEffect(() => {
    isInvalid.current = [a, h].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempH = katexSimplifiedValue(h);
    const aValue = evalExpression(tempA);
    const hValue = evalExpression(tempH);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Base area (a) :-\\bold{< ${a || 'a'} >}`),
          type: `equation`,
        },
        {
          value: putSpace(`Height (h) :- \\bold{< ${h || 'h'} >}`),
          type: `equation`,
        },
      ])
    );
    if (isInvalid.current) return;
    const v = evalExpression(`${hValue} * ${aValue}`);

    const finalAnswer = [
      {
        value: putSpace(`The Volume (V) of the Pyramid, whose`),
        type: 'equation',
      },
      {
        value: putSpace(
          `base area is \\bold{{${valueToKatex(
            aValue
          )}}} and Height is \\bold{{${valueToKatex(h)}}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{${evalInDecimals(v)}}\\above{1pt}3} Cubic units.`
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
          `We know that the \\bold{Volume} of the \\bold{Pyramid} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `V = {1\\above{1pt}3} (Area\\space of\\space base).\\space(Height) ={1\\above{1pt}3} (a.h)`
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
        value: `From the above input, it is given that `,
        type: 'span',
      },
      {
        value: putSpace(`Area of base (a) = {${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Height of the Pyramid (h) = {${showVal(h, hValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above-given formula,`),
        type: 'equation',
      },
      {
        value: putSpace(`we can calculate the Volume of the Pyramid.`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `V = {1\\above{1pt}3}({${valueToKatex(aValue)}})({${valueToKatex(
            hValue
          )}})  `
        ),
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      'br',
      {
        value: `V = {{${evalInDecimals(v)}}\\above{1pt}3}`,
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
  }, [a, h, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    setH('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, h].some((v) => !!v || v == 0);
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
            <div className="col-3 text-left">Base area(a):- </div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                allowAlphabeticKeyboard={false}
                initialLatex={a}
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
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Height (h):- </div>
            <div className="col-9">
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
export default VolumeOfThePyramid;
