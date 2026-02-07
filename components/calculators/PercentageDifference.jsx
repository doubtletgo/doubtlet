'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const PercentageDifference = () => {
  const [a, setA] = useState('2');
  const [b, setB] = useState('\\pi');

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the percentage (\\%) difference between the numbers \\bold{{${a}}} of \\bold{{${b}}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`A: \\bold{${a || '1'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`B: \\bold{${b || '1'}}`),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b].some((x) => !x && x != 0);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);

    if (isInvalid) return;
    const aSubB = evalInDecimals(evalExpression(`(${aValue}) - (${bValue})`));
    const aAddB = evalInDecimals(evalExpression(`(${aValue}) + (${bValue})`));
    const into2 = evalInDecimals(evalExpression(`(${aSubB}) * 2`));
    const into = evalInDecimals(evalExpression(`${into2}*100`));
    const res = evalInDecimals(`${into}/${aAddB}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The Percentage (\\%) difference between the numbers {${valueToKatex(
            aValue
          )}} and  {${valueToKatex(bValue)}}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `is  {{${evalInDecimals(into)}}\\above{1pt} {${evalInDecimals(
            aAddB
          )}} } or {${evalInDecimals(res)}}\\% `
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
        value: putSpace(`Percentage difference between two numbers can`),
        type: 'equation',
      },
      {
        value: putSpace(`be obtained by using the formula`),
        type: 'equation',
      },
      {
        value: `Percentage \\space (\\%) \\space difference = {\\lvert A-B \\rvert \\above{1pt}
        ({\\large A+B \\above{1pt} 2})}*100`,
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
        value: putSpace(`A=\\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`B = \\bold{${showVal(b, bValue)} }`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we have to put the above-given values in the formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A - B = {${valueToKatex(aValue)}} - {${valueToKatex(
            bValue
          )}} = {${valueToKatex(aSubB)}} `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-addition-substraction-calculator/?l=${a},${b}&type=Subtraction" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      {
        value: putSpace(
          `A + B = {${valueToKatex(aValue)}} + {${valueToKatex(
            bValue
          )}} = {${valueToKatex(aAddB)}} `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-addition-substraction-calculator/?l=${a},${b}" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Percentage (\\%) difference = {\\lvert {${valueToKatex(
            aSubB
          )}} \\rvert \\above{1pt} \\bigg({\\large {${valueToKatex(
            aAddB
          )}} \\above{1pt} 2}\\bigg)}*100 `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `= {{${valueToKatex(aSubB)}}\\above{1pt}{{${valueToKatex(
            aAddB
          )}}\\above{1pt}2}}*100 `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `Percentage (\\%) difference = {{${evalInDecimals(
            into
          )}}\\above{1pt} {${evalInDecimals(aAddB)}} } `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-division-calculator/?${into2},${aSubB}" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'hr',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [a, b, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    setA('');
    setB('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b].some((v) => !!v || v == 0);
  const hasAllValue = [a, b].every((v) => !!v || v == 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">A : - </div>
            <div className="col-8">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
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
                initialLatex={a}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3  text-left">B : - </div>
            <div className="col-8">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
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
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-2"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
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
      {hasAllValue && showSteps && (
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

export default PercentageDifference;
