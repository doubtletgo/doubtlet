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

const AreaOfRegularPentagon = () => {
  const [p, setP] = useState('\\sqrt{3}');
  const [l, setL] = useState('\\pi');
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
    if (vals.x1) setP(vals.x1);
    if (vals.x2) setL(vals.x2);
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
            `Find the \\bold{Area(A)} of the \\bold{Regular Pentagon}, Whose`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Perimeter} is \\bold{${
              p || 1
            }} and \\bold{Length} of \\bold{Apothem(l)} is \\bold{${l || 1}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [l, p]);

  useEffect(() => {
    isInvalid.current = [p, l].some((x) => !x);
    const tempP = katexSimplifiedValue(p);
    const tempL = katexSimplifiedValue(l);
    const pValue = evalExpression(tempP);
    const lValue = evalExpression(tempL);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          Perimeter (p)  = \\bold{${p || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Apothem (l) = \\bold{${l || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let multiple = evalExpression(`(${pValue}) * (${lValue})`);
    let area = evalExpression(`(1 / 2) *(${multiple})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Area(A)} of above given \\bold{Regular Pentagon} with`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `with \\bold{Perimeter}(p) =\\bold{${p}}, and \\bold{Apothem}(l) = \\bold{${l}} \\enspace `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{${valueToKatex(
            multiple
          )}\\above{1pt}2}} or \\bold{${evalInDecimals(area)}}`
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
          `We know that \\bold{Area(A)} of the \\bold{Regular Pentagon} is given as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\bigg\\lbrace A={1\\above{1pt}2}(p)(l)\\bigg\\rbrace}  where,  \\bold{p}  is  the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Perimeter} and \\bold{l} is the \\bold{Apothem} of \\bold{Regular Pentagon}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `p =\\bold{${showVal(p, pValue)}} and L =\\bold{${showVal(
            l,
            lValue
          )}}`
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
        value: putSpace(`A = {1\\above{1pt}2}(${p})(${l})`),
        type: 'equation',
      },
      {
        value: putSpace(`After solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = {1\\above{1pt}2}(${valueToKatex(multiple)}) = {${valueToKatex(
            multiple
          )}\\above{1pt}2} or  \\bold{${evalInDecimals(area)}}`
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
  }, [p, l, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setP('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    setL('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [p, l].some((v) => !!v || v == 0);
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
                setValue={setP}
                allowAlphabeticKeyboard={false}
                initialLatex={p}
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
export default AreaOfRegularPentagon;
