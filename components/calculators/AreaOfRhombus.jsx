'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const AreaOfRhombus = () => {
  const [d1, setD1] = useState('\\sqrt{3}');
  const [d2, setD2] = useState('\\pi');
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

    if (vals.x1) setD1(vals.x1);
    if (vals.x2) setD2(vals.x2);
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
            `Find the \\bold{Area(A)} of the \\bold{Rhombus}, Whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Length} of \\bold{Diagonal (d_1  and  d_2)} is \\bold{${
              d1 || 1
            }} and \\bold{${d2 || 1}}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [d2, d1]);

  useEffect(() => {
    isInvalid.current = [d1, d2].some((x) => !x);
    const tempD1 = katexSimplifiedValue(d1);
    const tempD2 = katexSimplifiedValue(d2);
    const d1Value = evalExpression(tempD1);
    const d2Value = evalExpression(tempD2);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Diagonal (d_1)  = \\bold{${d1 || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Diagonal (d_2) = \\bold{${d2 || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let multiple = evalExpression(`(${d1Value}) * (${d2Value})`);
    let area = evalExpression(`(1 / 2) * (${multiple})`);
    const finalAnswer = [
      {
        type: 'equation',
        value:
          putSpace(`The \\bold{Area(A)} of above given \\bold{Rhombus} with \\bold{diagonals} 
     `),
      },
      {
        value: putSpace(
          `d_1 = \\bold{${d1}}, d_2 = \\bold{${d2}} \\enspace is \\enspace \\bold{${valueToKatex(
            area
          )} or ${evalInDecimals(area)} }`
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
          `We know that \\bold{Area(A)} of the \\bold{Rhombus} is given as `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{A={1\\above{1pt}2}(d_1*d_2)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `where, \\bold{d_1} and d_2 are the \\bold{Length} of both the \\bold{diagonals.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`d_1 = ${showVal(d1, d1Value)}`),
        type: 'equation',
      },
      {
        value: putSpace(`d_2 = ${showVal(d2, d2Value)}`),
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
        value: putSpace(`A = {1\\above{1pt}2}(${d1}*${d2})`),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(`A = {1\\above{1pt}2}(${valueToKatex(multiple)}) `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\implies {${valueToKatex(area)}} or \\bold{${evalInDecimals(
            area
          )}} `
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
  }, [d1, d2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setD1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    setD2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [d1, d2].some((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Positive Real Number or any
            Variable
          </div>
          <div className="row mb-3 align-items-center">
            <div className="col-6">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setD1}
                allowAlphabeticKeyboard={false}
                initialLatex={d1}
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
                setValue={setD2}
                allowAlphabeticKeyboard={false}
                initialLatex={d2}
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
export default AreaOfRhombus;
