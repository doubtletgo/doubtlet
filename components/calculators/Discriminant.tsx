'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  removeSymbol,
  evalInDecimals,
  withSign,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { MathField } from '@/types/mathfield.types';

const Discriminant = () => {
  const [a, setA] = useState('1');
  const [b, setB] = useState('9');
  const [c, setC] = useState('20');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef<MathField>(null);
  const mf2 = useRef<MathField>(null);
  const mf3 = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams();
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setC(vals.y1);
    if (vals.x2) setB(vals.x2);
  }, []);

  const parsedA = convertFromLatex(a);
  const parsedB = convertFromLatex(b);
  const parsedC = convertFromLatex(c);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Discriminant} of the quadratic equation : \\bold{ {${withSign(
              a,
              '{x^2}'
            )}} ${addSymbol(evalInDecimals(parsedB))} {${withSign(
              removeSymbol(b),
              '{x}'
            )}}${addSymbol(evalInDecimals(parsedC))}{${
              removeSymbol(c) || '0'
            }}  = 0}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c]);

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
            ` \\bold{ {${withSign(a, '{x^2}')}} ${addSymbol(
              evalInDecimals(parsedB)
            )} {${withSign(removeSymbol(b), '{x}')}}${addSymbol(
              evalInDecimals(parsedC)
            )}{${removeSymbol(c) || '0'}}  = 0}`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [a, b, c].some((i) => !i || i.endsWith('-'));

    if (isInvalid) return;
    const D = evalExpression(`(${parsedB})^2 - 4*(${parsedA})*(${parsedC})`);
    const DInDecimals = evalInDecimals(`${D}`);
    const isSame = D == DInDecimals;

    const finalAnswer = [
      {
        value: putSpace(
          `The Discriminant is : \\bold{${convertIntoLatex(D)} ${
            isSame ? '' : ` or ${DInDecimals}`
          }}`
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
      {
        value: putSpace(
          `The Discriminant of the Quadratic equation ax^2 + bx + c = 0 is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`D = b^2 - 4\\cdot{a}\\cdot{c}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `D = (${convertIntoLatex(parsedB)})^2 - 4\\cdot{(${convertIntoLatex(
            parsedA
          )})}\\cdot{(${convertIntoLatex(parsedC)})} = ${convertIntoLatex(D)}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'hr',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);
    setSolution(solution);
  }, [a, b, c, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    mf1.current?.latex('');
    mf2.current?.latex('');
    mf3.current?.latex('');
    setB('');
    setC('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c].some((v) => !!v || +v == 0);

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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="row mb-3 align-items-center">
            <div className="col-3">
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
            <div className="col-3">
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
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC}
                allowAlphabeticKeyboard={false}
                initialLatex={c}
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

export default Discriminant;
