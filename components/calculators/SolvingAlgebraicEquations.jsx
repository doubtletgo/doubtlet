'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import {
  getSearchParams,
  putSpace,
  simplifyLatex,
} from '../../helpers/general';

import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';

import algebrite from 'algebrite';

function hasMultipleVariables(expression) {
  if (!expression) return false;
  const variables = expression.match(/[a-zA-Z]/g);

  // If there are no variables or only one variable, return false
  if (!variables || new Set(variables).size <= 1) {
    return false;
  }
  return true;
}
function getRoots(expression) {
  try {
    return algebrite.simplify(`nroots(${expression})`).toString();
  } catch (err) {
    console.log(err.message);
    return '';
  }
}

const SolvingAlgebraicEquations = () => {
  const [expression, setExpression] = useState('x^5 + 2x +4');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [invalidInput, setInvalidInput] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    const vals = getSearchParams();
    const exp = vals.a;
    if (exp) setExpression(exp);
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
            `Find all the possible real and complex values of x which will satisfy the given equation`
          ),
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
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Given Equation : ${expression}`),
          type: 'equation',
        },
      ])
    );
    if (!expression) return;
    const isInvalid =
      /^(.*[+\-*^])?$/.test(expression) || hasMultipleVariables(expression);
    setInvalidInput(hasMultipleVariables(expression));
    let simpleExp = simplifyLatex(
      expression.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2')
    )
      .replaceAll(')/(', '/')
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '');
    if (isInvalid) return;
    const roots = getRoots(simpleExp)
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map((itm) => itm.replaceAll('...', '').replace('*', ''));
    const finalAnswer = [
      {
        value: putSpace(`The roots of the equation are`),
        type: 'equation',
      },
      ...roots.map((itm) => ({
        value: itm,
        type: 'equation',
      })),
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
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression();
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!expression &&
    !/^(.*[+\-*^])?$/.test(expression) &&
    !hasMultipleVariables(expression);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer,FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-3 text-left">Equation -</div>
            <div className={`col-6 ${invalidInput ? 'invalid' : ''}`}>
              <MathInput
                setValue={setExpression}
                initialLatex={expression}
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
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
        </div>
      </div>
      <Equation equation={equation} className="border-primary" />
      <hr />{' '}
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
            <Equation equation={answer} className="mt-3" />
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

export default SolvingAlgebraicEquations;
