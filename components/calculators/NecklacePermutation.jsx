'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { factorial } from 'mathjs';

const NecklacePermutation = () => {
  const [p, setP] = useLocalStorage('NecklacePermutation_p', '3');
  const [equation, setEquation] = useLocalStorage('NecklacePermutation_equation', '');
  const [solution, setSolution] = useLocalStorage('NecklacePermutation_solution', '');
  const [result, setResult] = useLocalStorage('NecklacePermutation_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('NecklacePermutation_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NecklacePermutation_showSteps', true);
  const [note, setNote] = useLocalStorage('NecklacePermutation_note', undefined);
  // const ourArray = [""];
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate the number of Necklace Circular permutations of ${parseNumber(
            p || 'n'
          )} different 
          things taken all at a time`,
          type: 'span',
        },
      ])
    );
  }, [p]);

  useEffect(() => {
    const isInvalid_p = [p].some((x) => isNaN(x));
    setEquation(
      renderSteps([
        {
          value: ` <b>Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Value of n: - < ${parseNumber(p || 'n')} >  `,
          type: 'span',
        },
      ])
    );

    const invalid_entry = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        value: `Invalid Input`,
        type: 'span',
      },
    ];

    if (parseNumber(p) < 1) {
      setShowResult(false);
      setResult(renderSteps(invalid_entry));
    }

    let finalAnswerVal = 0;
    if (parseNumber(p) >= 1) {
      finalAnswerVal = factorial(p - 1) / 2;
    }

    if (isInvalid_p) return;

    const DefaultSolution = () => {
      const numArr = [];
      for (let i = p; i >= 1; i--) {
        numArr.push(i);
      }

      const finalAnswer = [
        {
          value: `The number of Necklace circular permutations of ${parseNumber(
            p || 'n'
          )} things taken 
          all at a time is <b>${finalAnswerVal}</b>`,
          type: 'span',
        },
      ];

      const equations = [
        {
          type: 'h6',
          value: `Answer`,
        },
        ...finalAnswer,
      ];

      let invalidCase;
      if (!invalidCase) {
        const eqRender = renderSteps(equations);
        setResult(eqRender);
      } else {
        setResult(renderSteps(invalid_entry));
      }

      if (!showSteps) return;
      const steps = [
        {
          value: `<b>Step By Step Solution :-</b>`,
          type: 'span',
        },
        'br',
        {
          value: `The number of possible ways of necklace circular arrangements of n </br> different things  taken all
          at a time is represented as below`,
          type: 'span',
        },
        {
          value: ` Number \\space of \\space Arrangements = \\bold{\\frac{(n-1)!}{2}}`,
          type: 'equation',
        },
        {
          value: `Value of n can be a Natural number only i.e. n > 1. </br> Necklace circular Permutation represents the condition where Clockwise &amp; </br> Anticlockwise
          arrangements are considered as <b>Same</b>.`,
          type: 'span',
        },
        'br',
        {
          value: `Step-1`,
          type: 'h6',
          className: 'text-decoration-underline',
        },
        {
          value: `Given number n = ${parseNumber(p)}`,
          type: 'span',
        },
        'br',
        {
          value: `The \\space number \\space of \\space Permutations \\space = 
          \\frac{(${parseNumber(p)} - 1)!}{2} \\space \\space 
        = \\frac{${parseNumber(p - 1)}!}{2} = ${finalAnswerVal}`,
          type: 'equation',
        },
        {
          value: `<a href="/calculator/factorial-calculator" target="_blank">to see steps factorial click here</a>`,
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
      return steps;
    };

    const getCase1Solution = () => {
      return [
        {
          value: `Factorial of 0 is 1 hence number of possible arrangement is 1`,
          type: 'span',
        },
      ];
    };

    const InvalidCase = () => {
      return [
        {
          value: `Value of n can be a whole number only`,
          type: 'span',
        },
      ];
    };

    let steps;

    const case1 = p === '0';

    let invalidCase;

    if (!invalidCase) {
      if (case1) {
        steps = getCase1Solution();
      } else {
        steps = DefaultSolution();
      }
    } else {
      steps = InvalidCase();
    }
    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [p, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setP('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p].some((v) => !!v && !isNaN(v) && v != 0);
  const hasAllValue = [p].every((v) => !!v && !isNaN(v) && v != 0);

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
          <div className="text-left mb-3">
            Your input can be in form of only be whole number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter value for n:</div>
            <div className="col-9">
              <Input
                placeholder="Enter a whole number only"
                autoComplete="off"
                className="col-12"
                value={p}
                setVal={setP}
                pattern={/^((\d)*)\d*$/}
                max={10000}
                min={0}
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

export default NecklacePermutation;
