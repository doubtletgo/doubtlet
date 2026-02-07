'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace, refValue } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import { create, all } from 'mathjs';
import Input from '../common/input';
import { isInputInvalid } from '../../helpers/Validations';
import AdComponent from '../AdSense';

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

  if (!variables || new Set(variables).size <= 1) {
    return false;
  }
  return true;
}

const SimpsonOneThirdRuleForAFunction = () => {
  const [expression, setExpression] = useState('\\frac{1}{x^2}');
  const [lowerKatex, setLowerKatex] = useState('1');
  const [upperKatex, setUpperKatex] = useState('3');
  const [interval, setSubIntervals] = useState('4');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [invalidInput, setInvalidInput] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Approximate the definite Intergal \\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} with n={${interval}} using the Simpson's Rule.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression, upperKatex, lowerKatex, interval]);

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
            `Approximate the definite Intergal \\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} with n={${interval}} using the Simpson's one third Rule.`
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
    const simpleExp = convertFromLatex(expression);
    const lower = convertFromLatex(lowerKatex);
    const upper = convertFromLatex(upperKatex);
    const deltaX = evalExpression(`(${upper}-(${lower}))/${interval}`);
    const deltaXBy3 = evalExpression(`${deltaX}/3`);
    const tempArray = Array.from({ length: +interval + 1 }, () => lower).map(
      (itm, i) => evalExpression(`${itm} + (${deltaX}) * ${i}`)
    );
    const valuesArray = tempArray.map((itm) =>
      evaluateWithConstant(simpleExp.replaceAll('x', `(${itm})`))
    );
    const valuesWithoutFrstAndLast = valuesArray.slice(
      1,
      valuesArray.length - 1
    );
    const { evenValues, oddValues } = valuesWithoutFrstAndLast.reduce(
      (acc, curr, i) => {
        if (i % 2 === 0) {
          acc.oddValues.push(curr);
        } else {
          acc.evenValues.push(curr);
        }
        return acc;
      },
      { evenValues: [], oddValues: [] }
    ) as { evenValues: string[]; oddValues: string[] };

    const evenSumMultipliedByTwo = evalInDecimals(
      `(2)*(${evenValues.map((_) => `(${_})`).join('+')})`
    );
    const oddSumMultipliedByFour = evalInDecimals(
      `(4)*(${oddValues.map((_) => `(${_})`).join('+')})`
    );
    const sumOfValues = evaluateWithConstant(
      `(${valuesArray[0]}) + (${
        valuesArray[valuesArray.length - 1]
      }) + (${evenSumMultipliedByTwo}) + (${oddSumMultipliedByFour})`
    );

    const result = evaluateWithConstant(`${sumOfValues}*(${deltaXBy3})`);
    if (isInvalid || !deltaX || !result) return;
    const finalAnswer = [
      {
        value: putSpace(
          `The approximate value of the \\bm{\\int_{${lowerKatex}}^{${upperKatex}}${expression}dx} by Simpson's one third Rule is`
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
        value: `The Simpson’s one third rule uses the parabolas in a subinterval for computing the height of the approximating rectangle`,
        type: 'span',
      },
      {
        value: `We can calculate the definite intergal by Simpson's \\frac{1}{3} Rule by using the formula given below.`,
        type: 'equation',
      },
      {
        value: `\\int_{a}^{b}\\bm{f(x)dx \\approx \\frac{\\triangle x}{3}. 
           \\{(f(x_0) + f(x_n)) + (4)(f(x_1) + f(x_3) + …. + f(x_{n-1})) + (2)(f(x_2) + f(x_4) + …. + f(x_{n-2}))\\}}`,
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
        value: putSpace(`x_{${i}}= {${convertIntoLatex(itm)}}`),
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
        const tempval = convertIntoLatex(simpleExp.replaceAll('x', `(${itm})`));

        return {
          value: putSpace(
            `\\bm{f(x_{${i}})} = \\bm{f(${convertIntoLatex(
              itm
            )})}= {${tempval}} \\approx ${valuesArray[i]}`
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
          `Now just some up the values and multiply it by \\frac{\\triangle x}{3}= ${convertIntoLatex(
            deltaXBy3
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} = ${convertIntoLatex(
            deltaXBy3
          )}(${valuesArray[0]} + (${
            valuesArray[valuesArray.length - 1]
          }) + (4)(${oddValues
            .map((_) => (_.toString().indexOf('-') == 0 ? `(${_})` : _))
            .join('+')}) + (2)(${evenValues
            .map((_) => (_.toString().indexOf('-') == 0 ? `(${_})` : _))
            .join('+')}))`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bm{\\int_{${lowerKatex}}^{${upperKatex}}{${expression}}dx} = ${convertIntoLatex(
            deltaXBy3
          )}(${valuesArray[0]} + (${
            valuesArray[valuesArray.length - 1]
          }) + (${convertIntoLatex(
            oddSumMultipliedByFour
          )}) +(${convertIntoLatex(evenSumMultipliedByTwo)}))`
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
  }, [expression, showSteps, upperKatex, lowerKatex, interval]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setLowerKatex('');
    setUpperKatex('');
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
                className="col-12"
                value={interval}
                setVal={setSubIntervals}
                pattern={/^((\d)*)\d*$/}
                min={1}
                max={501}
                disabled={false}
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

export default SimpsonOneThirdRuleForAFunction;
