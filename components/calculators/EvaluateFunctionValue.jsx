'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import { evalInDecimals, convertFromLatex } from '../../helpers/matrixHelper';
import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);

function evaluateExpression(expression) {
  try {
    const node = math.parse(expression);
    const parsed = math.simplify(node);
    return [parsed.toTex(), parsed.toString()];
  } catch (err) {
    console.log(err.message);
    return ['0', '0'];
  }
}
const EvaluateFunctionValue = () => {
  const [variables, setVariables] = useLocalStorage('EvaluateFunctionValue_variables', 'x,y');
  const [expression, setExpression] = useLocalStorage('EvaluateFunctionValue_expression', 'x^2 + 2y +4');
  const [values, setValues] = useLocalStorage('EvaluateFunctionValue_values', '5,3');
  const [equation, setEquation] = useLocalStorage('EvaluateFunctionValue_equation', '');
  const [solution, setSolution] = useLocalStorage('EvaluateFunctionValue_solution', '');
  const [answer, setAnswer] = useLocalStorage('EvaluateFunctionValue_answer', undefined);
  const [invalidInput, setInvalidInput] = useLocalStorage('EvaluateFunctionValue_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('EvaluateFunctionValue_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('EvaluateFunctionValue_showSteps', true);
  const [note, setNote] = useLocalStorage('EvaluateFunctionValue_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
    if (vals.b) setVariables(vals.b);
    if (vals.c) setValues(vals.c);
  }, []);

  const allValues = values?.split(',') || [values];
  const allVariables = variables?.split(',') || [variables];
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Evaluate ${expression} at ${allValues
              .map((itm, i) => `${allVariables[i]}={${itm}}`)
              .join(',')}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression, values]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Evaluate ${expression} at ${allValues
              .map((itm, i) => `${allVariables[i]}={${itm}}`)
              .join(',')}`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid =
      !expression ||
      ['\\log', '\\ln', '\\cos', '\\sin', '\\tan'].includes(expression) ||
      allValues.length != allVariables.length;
    setInvalidInput(false);
    let simpleExp = convertFromLatex(expression);
    allVariables.forEach(
      (itm, i) =>
        (simpleExp = simpleExp.replaceAll(
          itm,
          `(${convertFromLatex(allValues[i])})`
        ))
    );
    const [resultInKatex, result] = evaluateExpression(
      simpleExp.replace(/\s+/g, '')
    );
    const valInDecimals = evalInDecimals(result);
    if (isInvalid) return;
    const finalAnswer = [
      {
        value: putSpace(
          `f{(${values})} = {${
            result != valInDecimals && !!valInDecimals
              ? `${resultInKatex} or ${valInDecimals}`
              : resultInKatex
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
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step-by-step-Solution</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `To evaluate the function/expression at the given values of variables,<br>
         we need to directly replace the variables with the given values in<br>
          the given function/expression and the evaluate its value.`,
        type: 'span',
      },
      {
        value: `f(x)=${expression}`,
        type: 'equation',
      },
      {
        value: `f(${values})=${resultInKatex}`,
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [expression, showSteps, values, variables]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setValues('');
    setVariables('');
    setExpression('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = !!expression;

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
            <div className="col-5 text-left">Enter variables :</div>
            <div className={`col-6 ${invalidInput ? 'invalid' : ''}`}>
              <MathInput
                setValue={setVariables}
                initialLatex={variables}
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
          <div className="dropdown row mb-2 d-flex">
            <div className="col-5 text-left">Enter function Expression:</div>
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
                  // "arcsin",
                  // "arccos",
                  // "arctan",
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-5 text-left">Enter Values :</div>
            <div className={`col-6 ${invalidInput ? 'invalid' : ''}`}>
              <MathInput
                setValue={setValues}
                initialLatex={values}
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

export default EvaluateFunctionValue;
