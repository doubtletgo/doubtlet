'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const SurfaceAreaOfCuboid = () => {
  const [h, setH] = useLocalStorage('SurfaceAreaOfCuboid_h', '4');
  const [b, setB] = useLocalStorage('SurfaceAreaOfCuboid_b', '\\sqrt{3}');
  const [l, setL] = useLocalStorage('SurfaceAreaOfCuboid_l', '5');
  const isInvalid = useRef();
  const [equation, setEquation] = useLocalStorage('SurfaceAreaOfCuboid_equation', '');
  const [solution, setSolution] = useLocalStorage('SurfaceAreaOfCuboid_solution', '');
  const [result, setResult] = useLocalStorage('SurfaceAreaOfCuboid_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('SurfaceAreaOfCuboid_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SurfaceAreaOfCuboid_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('SurfaceAreaOfCuboid_isPointSame', false);
  const [note, setNote] = useLocalStorage('SurfaceAreaOfCuboid_note', undefined);
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
            `Find the \\bold{Surface Area(S.A)} of the \\bold{Cuboid},`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`Whose \\bold{Length, Width} and \\bold{Height}`),
          type: 'equation',
        },
        {
          value: putSpace(
            ` are  \\bold{${l || 1}, ${b || 1}} and \\bold{${
              h || 1
            }} respectively.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [h, b, l]);

  useEffect(() => {
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

    isInvalid.current = [h, b, l].some((x) => !x);
    if (!showSteps) return;
    const tempH = katexSimplifiedValue(h);
    const tempB = katexSimplifiedValue(b);
    const tempL = katexSimplifiedValue(l);
    const hValue = evalExpression(tempH);
    const bValue = evalExpression(tempB);
    const lValue = evalExpression(tempL);

    if (isInvalid.current) return;
    setIsPointSame(h == b && b == l);
    let lb = evalExpression(`${lValue} * (${bValue})`);
    let bh = evalExpression(`${bValue} * (${hValue})`);
    let lh = evalExpression(`${lValue} * (${hValue})`);
    let add = evalExpression(` (${lb} )+ (${bh}) + (${lh})`);
    let area = evalExpression(`2 * (${add})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Surface Area(S.A)} of above given \\bold{Cuboid} with \\bold{Length}(l) = \\bold{${l}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Width}(b) =\\bold{${b}} and \\bold{Height}(h) = \\bold{${h}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is: \\bold{${evalInDecimals(area)}} `),
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

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that \\bold{Surface Area(S.A)} of the \\bold{Cuboid} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{A=(2)(lb+bh+lh)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `where,\\bold{l, b and h} are the \\bold{Length,} \\bold{Width} and \\bold{Height} of the \\bold{Cuboid.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },

      {
        value: putSpace(`l = \\bold{${showVal(l, lValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`b = \\bold{${showVal(b, bValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`h = \\bold{${showVal(h, hValue)}} `),
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
        value: putSpace(
          `S.A = (2)\\lbrace(${l}*${b})+(${b}*${h})+(${l}*${h})\\rbrace`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `S.A=(2)(${valueToKatex(lb)}+${valueToKatex(bh)}+${valueToKatex(
            lh
          )})\\implies \\bold{${evalInDecimals(area)}}`
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
    setShowSteps('');
  }, [setShowResult, setShowSteps]);

  const hasValue = [h, b, l].some((v) => !!v || v == 0);
  const hasAllValue = [h, b, l].every((v) => !!v || v == 0);
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
          <div className="text-left mb-3">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setL}
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
                initialLatex={l}
              />{' '}
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
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
                initialLatex={b}
              />{' '}
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setH}
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
                initialLatex={h}
              />{' '}
            </div>
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

export default SurfaceAreaOfCuboid;
