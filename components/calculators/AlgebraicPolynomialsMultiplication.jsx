'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import MathInput from 'react-math-keyboard';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import {
  addSpace,
  pluralise,
  putSpace,
  simplifyLatex,
} from '../../helpers/general';

import algebrite from 'algebrite';

const AlgebraicPolynomialsMultiplication = () => {
  const [firstPoly, setFirstPoly] = useState('x^2 + 2');
  const [secondPoly, setSecondPoly] = useState('-2x + 5');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState();
  const [note, setNote] = useState();
  const [firstInvalid, setFirstInvalid] = useState(false);
  const [secondInvalid, setSecondInvalid] = useState(false);

  function solve(expression) {
    if (!expression) return '';
    let expr = expression.toString();
    expr = expr
      .replace(/([a-z])/gi, '*$1')
      .toString()
      .replace(/\s/, '')
      .replaceAll('-*', '*-')
      .replaceAll('+*', '+');
    if (expr?.indexOf('*') == 0 || expr?.indexOf('-') == 0)
      expr = expr.replace('*', '');
    if (expr.endsWith('*')) expr = expr.replace('*', '');
    expr = expr.replace(/([a-z]\^[-]?\d)/gi, '($1)');
    return expr;
  }

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the step wise result of the multiplication of \\bigg(${
              firstPoly || 'I Polynomial'
            }\\bigg) and \\bigg(${secondPoly || 'II Polynomial'}\\bigg)  `
          ),
          type: 'equation',
        },
      ])
    );
  }, [secondPoly, firstPoly]);

  useEffect(() => {
    const isInvalid = [secondPoly, firstPoly].some(
      (i) =>
        i.indexOf('sqrt') != -1 ||
        i.endsWith('+') ||
        i.endsWith('-') ||
        i.endsWith('*') ||
        i.endsWith('/')
    );
    if (firstPoly.indexOf('sqrt') != -1) setFirstInvalid(true);
    else setFirstInvalid(false);
    if (secondPoly.indexOf('sqrt') != -1) setSecondInvalid(true);
    else setSecondInvalid(false);
    if (isInvalid) return;
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `I Polynomial: - \\bigg<${firstPoly || 'I Polynomial'}\\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `II Polynomial: - \\bigg<${secondPoly || 'II Polynomial'}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    let simpleOne = simplifyLatex(
      firstPoly.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2')
    )
      .replaceAll(')/(', '/')
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '')
      .replaceAll('(', '')
      .replaceAll(')', '');
    let simpleTwo = simplifyLatex(
      secondPoly.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2')
    )
      .replaceAll(')/(', '/')
      .replaceAll('\\text', '')
      .replaceAll('\\times', '')
      .replaceAll('\\', '')
      .replaceAll('(', '')
      .replaceAll(')', '');
    const firstValues = addSpace(simpleOne)?.split(' ');
    const secondValues = addSpace(simpleTwo)?.split(' ');
    const arr = [];
    let stepsLen = firstValues?.length;
    if (!stepsLen) return;
    let answers = [];
    let i = 1;
    let simplifiedExp;
    try {
      //Create Steps
      while (i <= stepsLen) {
        let multiplier = firstValues[i - 1]?.replace('+', '');
        let termAddition = secondValues
          .map((itm, i) => {
            let ans = algebrite
              .eval(`(${solve(multiplier)})*(${solve(itm).replace('+', '')})`)
              .toString();
            if (ans.indexOf('-') == 0 || i == 0) return ans;
            else return '+' + ans;
          })
          .join('')
          .replaceAll('*', '');
        multiplier = multiplier
          .replaceAll(/(\^)\(?(\d*\/?\d*)\)?/gi, `$1{$2}`)
          .replace(/(\d*)\/(\d*)/i, `{$1\\above{1pt}$2}`);

        answers.push(termAddition);
        termAddition = termAddition
          .replaceAll(/(\^)\(?(\d*\/?\d*)\)?/gi, `$1{$2}`)
          .replaceAll(/(\d*)\/(\d*)/gi, `{$1\\above{1pt}$2}`);
        let step = [
          {
            value: putSpace(
              `${i == 1 ? 'First' : 'Than,'} multiplying the \\bold{${pluralise(
                i
              )}} term of the first polynomial by second term completely`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `({${multiplier}})({${simpleTwo
                .replaceAll(/(\^)\(?(\d*\/?\d*)\)?/gi, `$1{$2}`)
                .replace(
                  /(\d*)\/(\d*)/i,
                  `{$1\\above{1pt}$2}`
                )}}) =${secondValues
                .map((itm) => `(${multiplier})(${itm.replace('+', '')})`)
                .join('+')} = ${termAddition}`
            ),
            type: 'equation',
          },
        ];
        arr.push(...step);
        i++;
      }

      //Solve the final result
      simplifiedExp = algebrite
        .eval(`(${answers.join(')+(')})`)
        ?.toString()
        .replaceAll('*', '')
        .replaceAll(/(\^)\(?(\d*\/?\d*)\)?/gi, `$1{$2}`)
        .replaceAll(/(\d*)\/(\d*)/gi, `{$1\\above{1pt}$2}`);
    } catch {
      return;
    }

    answers = answers.map((itm) => {
      let reg = /(\^)\(?(\d*\/?\d*)\)?/gi;
      return itm
        .replaceAll(reg, `$1{$2}`)
        .replaceAll(/(\d*)\/(\d*)/gi, `{$1\\above{1pt}$2}`);
    });
    const finalAnswer = [
      {
        value:
          putSpace(`The result of the multiplication of above given polynomials (${firstPoly
            .replaceAll('\\text', '')
            .replaceAll('\\times', '')}) and (${secondPoly
            .replaceAll('\\text', '')
            .replaceAll('\\times', '')}) is 
        `),
        type: 'equation',
      },
      {
        value: `\\bold{${simplifiedExp}}`,
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
        value: `We can multiply two polynomial expressions by multiplying each term of the first<br> polynomial by every term of the second polynomial and add them after simplifying.`,
        type: 'span',
      },
      'br',
      ...arr,
      {
        value: `Now we have to add all the similar terms of the results obtained above`,
        type: 'span',
      },
      {
        value: putSpace(`=(${answers.join(')+(')})`),
        type: 'equation',
      },
      {
        value: putSpace(`=${simplifiedExp}`),
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
  }, [secondPoly, firstPoly, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setFirstPoly('');
    setSecondPoly('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [secondPoly, firstPoly].every((i) => !!i);
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Integer or any Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">I Polynomial: -</div>
            <div className={`col-8 ${firstInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setFirstPoly}
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
            </div>
          </div>{' '}
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">II Polynomial : -</div>
            <div className={`col-8 ${secondInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setSecondPoly}
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
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
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
          className="default-btn rounded-pill px-5 btn btn-danger  mt-3"
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

export default AlgebraicPolynomialsMultiplication;
