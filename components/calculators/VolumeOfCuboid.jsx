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
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const VolumeOfCuboid = () => {
  const [h, setH] = useState('1');
  const [b, setB] = useState('9');
  const [l, setL] = useState('20');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setH(vals.x1);
    if (vals.y1) setL(vals.y1);
    if (vals.x2) setB(vals.x2);
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
            `Find the \\bold{Volume(V)} of the \\bold{Cuboid} Whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`\\bold{Length, Width,} and \\bold{Height} are `),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{${l || 1}, ${b || 1}} and \\bold{${h || 1}} respectively.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [h, b, l]);

  useEffect(() => {
    isInvalid.current = [h, b, l].some((x) => !x);
    const tempH = katexSimplifiedValue(h);
    const tempB = katexSimplifiedValue(b);
    const tempL = katexSimplifiedValue(l);
    const hValue = evalExpression(tempH);
    const bValue = evalExpression(tempB);
    const lValue = evalExpression(tempL);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          Length (l) = \\bold{${l || '1'}}`,
          type: 'equation',
        },
        {
          value: `
          Width (b) = \\bold{${b || '1'}}`,
          type: 'equation',
        },
        {
          value: `
          Height (h) = \\bold{${h || '1'}}`,
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let area = evalExpression(`${lValue} * ${bValue} * ${hValue}`);
    const finalAnswer = [
      {
        value: putSpace(`The \\bold{Volume(V)} of above given \\bold{Cuboid}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `with \\bold{Length}(L) =\\bold{{${l}}}, \\bold{Width}(b) =\\bold{{${b}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `and \\bold{Height}(H) =\\bold{${h}} is: \\bold{{${evalInDecimals(
            area
          )}}} `
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
        value: putSpace(`We know that \\bold{Volume(V)}`),
        type: 'equation',
      },
      {
        value: putSpace(`of the \\bold{Cuboid} is given as`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{V = (l * b * h)}`),
        type: 'equation',
      },
      {
        value: putSpace(`where, \\bold{l, b and h} are the`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Length,} \\bold{Width} and \\bold{Height}`),
        type: 'equation',
      },
      {
        value: putSpace(`of the \\bold{Cuboid.}`),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `l = \\bold{{${showVal(l, lValue)}}}, b = \\bold{{${showVal(
            b,
            bValue
          )}}} and h = \\bold{{${showVal(h, hValue)}}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the`),
        type: 'equation',
      },
      {
        value: putSpace(`above given formula`),
        type: 'equation',
      },
      {
        value: putSpace(`we can calculate the Volume of`),
        type: 'equation',
      },
      {
        value: putSpace(`the Cuboid V=({${l}}*{${b}}*{${h}})`),
        type: 'equation',
      },
      {
        value: `After Solving`,
        type: 'span',
      },
      {
        value: `V={${evalInDecimals(area)}}`,
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
  }, [h, b, l, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setH('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setB('');
    setL('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [h, b, l].some((v) => !!v || v == 0);

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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-3 align-items-center">
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setL}
                allowAlphabeticKeyboard={false}
                initialLatex={l}
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
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
                allowAlphabeticKeyboard={false}
                initialLatex={b}
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
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
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

export default VolumeOfCuboid;
