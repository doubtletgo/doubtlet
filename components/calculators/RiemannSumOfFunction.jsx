'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace, refValue } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
} from '../../helpers/matrixHelper';
import { create, all } from 'mathjs';
import Input from '../common/input';
import { isInputInvalid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const evaluateWithConstant = (value = '') => {
  try {
    return math.evaluate(`${value}`).toString();
  } catch {
    return '0';
  }
};

function hasMultipleVariables(expression) {
  if (!expression) return false;
  expression = expression
    .replace(/sqrt/g, '')
    .replace(/sin/g, '')
    .replace(/cos/g, '')
    .replace(/log/g, '')
    .replace(/ln/g, '')
    .replace(/tan/g, '')
    .replace(/sqrt/g, '')
    .replace(/right/g, '')
    .replace(/left/g, '')
    .replace(/e/g, '')
    .replaceAll('\\frac', '')
    .replaceAll('\\pi', '');
  const variables = expression.match(/[a-zA-Z]/g);

  // If there are no variables or only one variable, return false
  if (!variables || new Set(variables).size <= 1) {
    return false;
  }
  return true;
}

const RiemannSumOfFunction = () => {
  const [expression, setExpression] = useLocalStorage('RiemannSumOfFunction_expression', 'e^x');
  const [lowerKatex, setLowerKatex] = useLocalStorage('RiemannSumOfFunction_lowerKatex', '1');
  const [upperKatex, setUpperKatex] = useLocalStorage('RiemannSumOfFunction_upperKatex', '3');
  const [interval, setSubIntervals] = useLocalStorage('RiemannSumOfFunction_interval', '4');
  const [equation, setEquation] = useLocalStorage('RiemannSumOfFunction_equation', '');
  const [solution, setSolution] = useLocalStorage('RiemannSumOfFunction_solution', '');
  const [answer, setAnswer] = useLocalStorage('RiemannSumOfFunction_answer', undefined);
  const [invalidInput, setInvalidInput] = useLocalStorage('RiemannSumOfFunction_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('RiemannSumOfFunction_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RiemannSumOfFunction_showSteps', true);
  const [note, setNote] = useLocalStorage('RiemannSumOfFunction_note', undefined);
  const [sumType, setSumType] = useLocalStorage('RiemannSumOfFunction_sumType', 'left');

  const left_Right = sumType == 'left' ? 'Left' : 'Right';
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Approximate the definite Intergal \\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} with n={${interval}} using the ${left_Right} Riemann Sum.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression, upperKatex, lowerKatex, interval, left_Right]);

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
            `Approximate the definite Intergal \\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} with n={${interval}} using the ${left_Right} Riemann Sum.`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid =
      !expression ||
      !lowerKatex ||
      !upperKatex ||
      !interval ||
      isInputInvalid(expression);
    setInvalidInput(hasMultipleVariables(expression));
    let simpleExp = convertFromLatex(expression);
    const lower = convertFromLatex(lowerKatex);
    const upper = convertFromLatex(upperKatex);
    const deltaX = evalExpression(`(${upper}-(${lower}))/${interval}`);
    const tempArray = Array.from({ length: interval }, () => lower).map(
      (itm, i) =>
        evalExpression(
          `${itm} + (${deltaX}) * ${sumType == 'left' ? i : i + 1}`
        )
    );
    const valuesArray = tempArray.map((itm) =>
      evaluateWithConstant(simpleExp.replaceAll('x', `(${itm})`))
    );
    const sumOfValues = evaluateWithConstant(
      `${valuesArray.map((_) => `(${_})`).join('+')}`
    );
    const result = evaluateWithConstant(`${sumOfValues}*(${deltaX})`);
    if (isInvalid || !deltaX || !result) return;
    const finalAnswer = [
      {
        value: putSpace(
          `The approximate value of the \\bm{\\int_{${lowerKatex}}^{${upperKatex}}${expression}dx} by ${left_Right} Riemann sum is `
        ),
        type: 'equation',
      },
      {
        value: `\\approx ${result}`,
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
        value: `Step-by-step-Solution`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `The ${left_Right} Riemann sum uses the ${left_Right} endpoint of a subinterval for computing<br>
           the height of the approximating rectangle.`,
        type: 'span',
      },
      'br',
      {
        value: `We can calculate the ${left_Right} Riemann sum by the formula given below`,
        type: 'span',
      },
      {
        value: `\\int_{a}^{b}\\bm{f(x)dx \\approx \\triangle x. ${
          sumType == 'left'
            ? '{f(x_0) + f(x_1) + f(x_2) + f(x_3) + …. + f(x_{n-2}) + f(x_{n-1})}}'
            : '{f(x_1) + f(x_2) + f(x_3) + …. + f(x_{n-1}) + f(x_{n})}}'
        }`,
        type: 'equation',
      },
      {
        value: `Where, \\space \\mathit{\\triangle x = \\frac{b-a}{n}}`,
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
        value: putSpace(`Now by putting the values in the above give formula`),
        type: 'equation',
      },
      {
        value: `\\mathit{\\triangle x} = \\frac{${upperKatex}-${lowerKatex}}{${interval}}={${convertIntoLatex(
          deltaX
        )}}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Divide the interval [${lowerKatex},${upperKatex}] into ${interval} subintervals of length ${convertIntoLatex(
            deltaX
          )}`
        ),
        type: 'equation',
      },
      ...tempArray.map((itm, i) => ({
        value: putSpace(
          `x_{${sumType == 'left' ? i : i + 1}}= {${convertIntoLatex(itm)}}`
        ),
        type: 'equation',
      })),
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now, we will evaluate the function at all the endpoints of the subintervals`
        ),
        type: 'equation',
      },
      ...tempArray.map((itm, i) => {
        let tempval = convertIntoLatex(simpleExp.replaceAll('x', `(${itm})`));

        return {
          value: putSpace(
            `\\bm{f(x_{${
              sumType == 'left' ? i : i + 1
            }})} = \\bm{f(${convertIntoLatex(itm)})}= {${tempval}} \\approx ${
              valuesArray[i]
            }`
          ),
          type: 'equation',
        };
      }),
      {
        value: `<a href="/calculator/evaluate-function-value-calculator/?a=${encodeURIComponent(
          expression
        )}&b=x&c=${refValue(
          tempArray[1]
        )}"  target="_blank">to evaluate value of function at a point, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Now just some up the values and multiply it by \\triangle x= ${convertIntoLatex(
            deltaX
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} = ${convertIntoLatex(
            deltaX
          )}(${valuesArray
            .map((_) => (_.toString().indexOf('-') == 0 ? `(${_})` : _))
            .join('+')})`
        ),
        type: 'equation',
      },
      {
        value: `= \\space {${result}}`,
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
  }, [
    expression,
    showSteps,
    upperKatex,
    lowerKatex,
    interval,
    sumType,
    left_Right,
  ]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );
  const onChangeSumType = (e) => {
    setSumType(e.target.value);
  };
  const clear = useCallback(() => {
    setLowerKatex('');
    setUpper('');
    setExpression('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !isInputInvalid(expression) &&
    !!lowerKatex &&
    !!upperKatex &&
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
            <div className="col-4 text-left">Function f(x):</div>
            <div className={`col-8 ${invalidInput ? 'invalid' : ''}`}>
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
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Lower limit:</div>
            <div className="col-8">
              <MathInput
                initialLatex={lowerKatex}
                setValue={setLowerKatex}
                numericToolbarKeys={['ln', 'log', 'dot']}
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Upper limit:</div>
            <div className="col-8">
              <MathInput
                initialLatex={upperKatex}
                setValue={setUpperKatex}
                numericToolbarKeys={['ln', 'log', 'dot']}
                allowAlphabeticKeyboard={true}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">SubIntervals (n) :</div>
            <div className="col-8">
              <Input
                placeholder="Enter a whole number only"
                autoComplete="off"
                className="col-12"
                value={interval}
                setVal={setSubIntervals}
                pattern={/^((\d)*)\d*$/}
                min={1}
                max={501}
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={sumType}
                onChange={onChangeSumType}
              >
                <option value="left">Left Riemann Sum</option>
                <option value="right">Right Riemann Sum</option>
              </select>
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

export default RiemannSumOfFunction;
