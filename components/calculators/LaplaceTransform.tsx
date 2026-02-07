'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { MathField } from '@/types/mathfield.types';
import nerdamer, { convertFromLaTeX } from 'nerdamer-prime';
import 'nerdamer-prime/Extra';

const LaplaceTransform = () => {
  const [expression, setExpression] = useState(
    'e^{-2t}\\left(sin\\left({3t}\\right)\\right)'
  );
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Calculate the Laplace Transform  of f(t)`),
          type: 'equation',
        },
        {
          value: expression,
          type: 'equation',
        },
      ])
    );
  }, [expression]);

  useEffect(() => {
    if (
      expression.endsWith(',') ||
      expression.endsWith('/') ||
      expression.endsWith('-')
    )
      return;

    const isInvalid = !expression;

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
      ])
    );

    if (isInvalid) return;

    let laplace;

    try {
      const parsedExpression = convertFromLaTeX(expression);
      laplace = nerdamer(`laplace(${parsedExpression}, t, s)`).evaluate();
    } catch {}

    const finalAnswer = [
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\LARGE{The L_{t}(${expression}) = \\bold{${laplace?.toTeX()}}}`
        ),
        type: 'equation',
        className: 'h2',
      },
      {
        value: `<a href="https://doubtlet.com/blog-post/laplace-transform-cheat-sheet-blog/" target="_blank">For Laplace transform cheat sheet, Click here</a>`,
        type: 'span',
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

    const steps = [...finalAnswer];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression('');
    if (inputRef.current) inputRef.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = !!expression;
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
            Your input can be in the form of Positive Real Number
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-12 text-left">Enter Set of Values:-</div>
            <div className="col-12">
              <MathInput
                setValue={setExpression}
                setMathfieldRef={(ref: MathField) => (inputRef.current = ref)}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={false}
                initialLatex={expression}
              />
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
          className="btn default-btn px-5 rounded-pill mr-3 mt-2 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 mt-2 btn btn-danger"
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

export default LaplaceTransform;
