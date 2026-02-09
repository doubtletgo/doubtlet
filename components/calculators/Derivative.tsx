'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import { convertFromLatex, convertIntoLatex } from '@/helpers/matrixHelper';
import 'nerdamer/Calculus';
import { pluralise, putSpace } from '@/helpers/general';
import { create, all, MathNode } from 'mathjs';
import Algebrite from 'algebrite';
import { convertFromLaTeX as cf } from 'nerdamer-prime';
import { convertFromLaTeX } from 'nerdamer';

const config = {};
const math = create(all, config);

const variables = [
  { label: 'x', katexValue: 'x' },
  { label: 'y', katexValue: 'y' },
  { label: 't', katexValue: 't' },
  { label: 'u', katexValue: 'u' },
  { label: 'v', katexValue: 'v' },
  { label: 'θ (theta)', katexValue: '\\theta' },
  { label: 'φ (phi)', katexValue: '\\phi' },
  { label: 'λ (lambda)', katexValue: '\\lambda' },
  { label: 'a', katexValue: 'a' },
  { label: 'b', katexValue: 'b' },
  { label: 'c', katexValue: 'c' },
  { label: 'd', katexValue: 'd' },
  { label: 'f', katexValue: 'f' },
  { label: 'g', katexValue: 'g' },
  { label: 'h', katexValue: 'h' },
  { label: 'i', katexValue: 'i' },
  { label: 'j', katexValue: 'j' },
  { label: 'k', katexValue: 'k' },
  { label: 'l', katexValue: 'l' },
  { label: 'm', katexValue: 'm' },
  { label: 'n', katexValue: 'n' },
  { label: 'o', katexValue: 'o' },
  { label: 'p', katexValue: 'p' },
  { label: 'q', katexValue: 'q' },
  { label: 'r', katexValue: 'r' },
  { label: 's', katexValue: 's' },
  { label: 'w', katexValue: 'w' },
  { label: 'z', katexValue: 'z' },
];

function fixFunctionPatterns(expression: string) {
  const functions = [
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'log',
    'ln',
    'sqrt',
    'exp',
  ];

  // Regex patterns for the cases
  const funcNoParentheses = new RegExp(
    `\\b(${functions.join('|')})([a-zA-Z])\\b`,
    'g'
  ); // sinx => sin(x)
  const funcWithExponentOutside = new RegExp(
    `\\b(${functions.join('|')})([a-zA-Z])(\\^\\d+)`,
    'g'
  ); // sinx^2 => sin(x^2)
  const funcWithExponentInside = new RegExp(
    `\\b(${functions.join('|')})\\^(\\d+)\\((.*?)\\)`,
    'g'
  ); // sin^2(x) => (sin(x))^2

  // Apply replacements
  expression = expression.replace(
    funcWithExponentInside,
    (match, func, exp, inner) => {
      return `(${func}(${inner}))^${exp}`;
    }
  );

  expression = expression.replace(
    funcWithExponentOutside,
    (match, func, variable, exponent) => {
      return `${func}(${variable}${exponent})`;
    }
  );

  expression = expression.replace(
    funcNoParentheses,
    (match, func, variable) => {
      return `${func}(${variable})`;
    }
  );

  return expression;
}

function replaceLogWithRandomL(expression: string) {
  // Regex to match the log function with one or two arguments
  const regex = /log\(([^,]+)(?:,([^\\)]+))?\)/g;

  let updatedExpression = expression;
  let replacedPart = null;

  // Find all matches for log and process them
  const matches = [...expression.matchAll(regex)];

  // Process each match
  matches.forEach((match) => {
    const firstArg = match[1]; // The first argument (before the comma)
    const secondArg = match[2]; // The second argument (after the comma), if it exists

    if (secondArg) {
      replacedPart = secondArg; // Store the second argument for further use
      updatedExpression = updatedExpression.replace(
        match[0],
        `log(${firstArg}, L)`
      ); // Replace with 'L'
    }
  });

  return { updatedExpression, replacedPart }; // Return both updated expression and the replaced part
}
const replaceInverse = (s: string) => {
  return s
    .replaceAll('\\sin^{-1}', 'asin')
    .replaceAll('\\cos^{-1}', 'acos')
    .replaceAll('\\tan^{-1}', 'atan')
    .replaceAll('\\sec^{-1}', 'asec')
    .replaceAll('\\cosec^{-1}', 'acosec')
    .replaceAll('\\cot^{-1}', 'acot');
};

const Derivative = () => {
  const [expression, setExpression] = useLocalStorage('Derivative_expression', '\\log(x,10)');
  const [variable, setVariable] = useLocalStorage('Derivative_variable', 'x');
  const [order, setOrder] = useLocalStorage('Derivative_order', '1');
  const [equation, setEquation] = useLocalStorage('Derivative_equation', '');
  const [solution, setSolution] = useLocalStorage('Derivative_solution', '');
  const [result, setResult] = useLocalStorage('Derivative_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Derivative_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('Derivative_showSteps', false);
  const [note, setNote] = useLocalStorage('Derivative_note', undefined);
  const ref = useRef(null);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `\\LARGE{Find the ${pluralise(
              +order
            )} derivative of expression ${expression} with respect to ${variable}}\\LARGE`
          ),
          type: 'equation',
        },
      ])
    );
  }, [order, variable, expression]);
  useEffect(() => {
    const isInvalid = [order, variable, expression].some((x) => !x);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `\\LARGE{{\\frac{d}{d${variable}}}\\bigg({${expression}}\\bigg)}\\LARGE`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid) return;

    const exprsn = convertFromLatex(replaceInverse(expression));
    try {
      const parsedExpression = cf(expression);
      console.log(`
       ${expression}
       PRIME --> ${parsedExpression} \n
       NORMAL --> ${convertFromLaTeX(expression)}
     `);
    } catch {}
    const { updatedExpression, replacedPart } = replaceLogWithRandomL(exprsn);

    function getDerivativeOfOrder(order: number) {
      let derivative: MathNode;
      for (let i = 0; i < order; i++) {
        derivative = math.derivative(
          i == 0
            ? updatedExpression
              ? fixFunctionPatterns(updatedExpression)
              : exprsn
            : derivative,
          variable
        );
      }
      return derivative;
    }

    const d = getDerivativeOfOrder(+order);
    const t = replacedPart ? d.toString().replace('L', replacedPart) : d;
    const derivative = Algebrite.simplify(t.toString()).toString();
    if (!showSteps) return;

    const steps = [
      {
        value: putSpace(`\\LARGE{Final Answer}\\LARGE`),
        type: 'equation',
      },
      'br',
      {
        value: putSpace(
          `\\LARGE{\\frac{d}{d${variable}}\\bigg(${expression}\\bigg)}\\LARGE = ${
            convertIntoLatex(derivative).replaceAll('\\cdot', '') ||
            d?.toTex()?.replaceAll('\\cdot', '') ||
            '0'
          }`
        ),
        type: 'equation',
      },
    ];

    const eqRender = renderSteps(steps);
    setResult(eqRender);

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [order, variable, expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeVariable = (e: ChangeEvent<HTMLSelectElement>) => {
    setVariable(e.target.value);
  };

  const clear = useCallback(() => {
    setShowSteps(false);
    setShowResult(false);
    setOrder('1');
    setExpression('');
    setVariable('x');
    if (ref.current) ref.current.latex('');
  }, [setShowResult]);

  const hasValue = [order, variable, expression].some(
    (v) => (!!v && !isNaN(+v)) || +v == 0
  );

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
            Your input can be in form of Real Number
          </div>
          <div className="text-left mb-2">Use brackets for multiplication</div>
          <div className="row mb-2 align-items-center gap-2">
            <div className="row">
              <div className="col-4 text-left">Expression :</div>
              <div className="col-8">
                <MathInput
                  setMathfieldRef={(rf) => (ref.current = rf)}
                  tabShouldSkipKeys
                  setValue={setExpression}
                  initialLatex={expression?.toString() || ''}
                  numericToolbarKeys={[
                    'sqrtCub',
                    'cube',
                    'log',
                    'ln',
                    'epower',
                    'sin',
                    'cos',
                    'tan',
                    'sec',
                    'cosec',
                    'cot',
                    'arccos',
                    'arcsin',
                    'arctan',
                    'arccsc',
                    'alpha',
                    'beta',
                    'delta',
                    'Delta',
                    'sigma',
                    'theta',
                    'tau',
                    'pi',
                    'phi',
                    'Omega',
                    'lambda',
                    'mu',
                    'gamma',
                    'omega',
                  ]}
                  allowAlphabeticKeyboard={true}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4 text-left">Variable:</div>
              <div className="col-4 ms-auto">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={variable}
                  onChange={onChangeVariable}
                >
                  {variables.map((v) => (
                    <option
                      key={v.label}
                      className="fs-xl"
                      value={v.katexValue}
                    >
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-6 text-left">Order :</div>
              <Input
                placeholder="RH"
                disabled={false}
                className="col-4 ms-auto"
                value={order.toString()}
                setVal={setOrder}
                min={0}
                max={16}
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
      {showResult && !showSteps && (
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

export default Derivative;
