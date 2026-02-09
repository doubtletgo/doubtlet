'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import {
  convertFromLatex,
  evalExpression,
  evalInDecimals,
  removeSymbol,
  showVal,
  valueToKatex,
} from '../../helpers/matrixHelper';
import { create, all } from 'mathjs';
import { minusSymbol } from '../../helpers/decimal';
import { convertToLaTeX } from 'nerdamer';
import { isInputInvalid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const evaluateWithConstant = (value = '') => {
  try {
    return math.simplify(`${value}`).toString();
  } catch {
    return '';
  }
};

const replaceAndEvaluate = (expression, value) => {
  const newExp = expression.replaceAll('x', `(${convertFromLatex(value)})`);
  return evaluateWithConstant(newExp);
};

const AverageRateOfChange = () => {
  const [expression, setExpression] = useLocalStorage('AverageRateOfChange_expression', 'x^2 + 1');
  const [values, setValues] = useLocalStorage('AverageRateOfChange_values', '-2,5');
  const [equation, setEquation] = useLocalStorage('AverageRateOfChange_equation', '');
  const [solution, setSolution] = useLocalStorage('AverageRateOfChange_solution', '');
  const [answer, setAnswer] = useLocalStorage('AverageRateOfChange_answer', undefined);
  const [invalidInput, setInvalidInput] = useLocalStorage('AverageRateOfChange_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('AverageRateOfChange_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('AverageRateOfChange_showSteps', true);
  const [note, setNote] = useLocalStorage('AverageRateOfChange_note', undefined);

  const allValues = values?.split(',') || [values];
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the average rate of change of the function f(x) = {${expression}} on the interval [${values}].`
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
            `Function \\space f(x) \\space = \\space {${expression}},`
          ),
          type: 'equation',
        },
        {
          value: ` Interval \\space[${values}]`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = allValues.length != 2 || isInputInvalid(expression);
    setInvalidInput(false);
    if (isInvalid) return;
    let simpleExp = convertFromLatex(expression);
    const answers = allValues.map((itm) =>
      simpleExp.replaceAll('x', `(${convertFromLatex(itm)})`)
    );
    const [lower, upper] = allValues;
    const [lowerAns, upperAns] = answers.map((itm, i) => {
      return replaceAndEvaluate(itm, allValues[i]);
    });
    const numR = evalExpression(`${upperAns}-(${lowerAns})`);
    const denumR = evalExpression(`${upper}-(${lower})`);
    const result = evalExpression(`${numR}/(${denumR})`);
    const decimalAns = evalInDecimals(`${result}`);

    if (!numR || !denumR) return;
    const finalAnswer = [
      {
        value: putSpace(
          `The Average rate of change is {${showVal(result, decimalAns)}}`
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
        value: putSpace(
          `Average rate of change for function f(x) over an interval [a, b] is defined as \\frac{f(b)-f(a)}{(b-a)}`
        ),
        type: 'equation',
      },
      {
        value: 'Now given',
        type: 'span',
      },
      {
        value: `f(x)=${expression}`,
        type: 'equation',
      },
      {
        value: putSpace(`Lower limit(a) = ${lower}`),
        type: 'equation',
      },
      {
        value: putSpace(`Upper limit(b) = ${upper}`),
        type: 'equation',
      },
      {
        value: 'Now evaluate the function at lower and upper limit values',
        type: 'span',
      },
      ...allValues.map((itm, i) => {
        let dmm = convertToLaTeX(answers[i]);
        return {
          value: `f(${itm})= ${dmm} = ${valueToKatex(
            replaceAndEvaluate(simpleExp, itm)
          )}`,
          type: 'equation',
        };
      }),
      {
        value: `<a href="/calculator/evaluate-function-value-calculator/?a=${encodeURIComponent(
          expression
        )}&b=x&c=${upper}"  target="_blank">to evaluate value of function at a point, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `Now, average rate of change can be calculated by using the formula given above`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\frac{f(${upper})-f(${lower})}{((${upper})-(${lower}))} =\\frac{(${valueToKatex(
            upperAns
          )})-(${valueToKatex(lowerAns)})}{(${valueToKatex(upper)}${minusSymbol(
            evalInDecimals(lower)
          )}${valueToKatex(removeSymbol(lower))})}= \\frac{${convertToLaTeX(
            numR
          )}}{${convertToLaTeX(denumR)}} = {${showVal(result, decimalAns)}}`
        ),
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
  }, [expression, showSteps, values]);

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

  const hasValue = !isInputInvalid(expression);

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
                  'sin',
                  'cos',
                  'tan',
                ]}
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-5 text-left">Enter The Interval :</div>
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

export default AverageRateOfChange;
