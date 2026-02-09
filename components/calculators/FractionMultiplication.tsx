'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import { putSpace } from '../../helpers/general';
import { convertIntoLatex } from '@/helpers/matrixHelper';

const FractionMultiplication = () => {
  const [l, setL] = useLocalStorage('FractionMultiplication_l', '1/3,3/5');
  const [equation, setEquation] = useLocalStorage('FractionMultiplication_equation', '');
  const [solution, setSolution] = useLocalStorage('FractionMultiplication_solution', '');
  const [result, setResult] = useLocalStorage('FractionMultiplication_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FractionMultiplication_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FractionMultiplication_showSteps', true);
  const [note, setNote] = useLocalStorage('FractionMultiplication_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false) as { a: string };
    if (vals.a) setL(vals.a);
  }, []);

  const fractions = l.split(',');

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Multiply all the given fractions `),
          type: `equation`,
        },
        {
          value: putSpace(
            `${fractions.map((i) => convertIntoLatex(i)).join(' \\cdot ')}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [fractions]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Fractions:`,
          type: 'equation',
        },
        {
          value: putSpace(
            `${fractions.map((i) => convertIntoLatex(i)).join(' \\cdot ')}`
          ),
          type: 'equation',
        },
      ])
    );

    const upperVal = fractions.map((i) => Number(i.split('/')?.[0] || i));
    const lowerVal = fractions.map((i) => Number(i.split('/')?.[1] || 1));
    const numerator = upperVal.reduce((multi, current) => multi * current, 1);

    const denominator = lowerVal.reduce((multi, current) => multi * current, 1);

    function fraction(numR: number, denumR: number) {
      const max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return { numR, denumR };
        }
      }
      return { numR, denumR };
    }
    let Result;
    if (denominator === numerator) {
      Result = { numR: 1, denumR: 1 };
    } else {
      Result = fraction(numerator, denominator);
    }

    const { numR, denumR } = Result;
    const finalAnswer = [
      {
        value: putSpace(`Multiplication of all the given fractions =`),
        type: `equation`,
      },
      {
        value: putSpace(
          `${fractions
            .map((i) => convertIntoLatex(i))
            .join(' \\cdot ')} is  \\bold{\\frac{${numR}}{${denumR}}}`
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
      {
        value: putSpace(`A fraction is always represented in the form of 
        {p\\above{1pt}q} `),
        type: `equation`,
      },
      {
        value: ` where p and q are integers and q ≠ 0.`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Given fraction = ${upperVal
            .map((item, index) => `{${item}\\above{1pt}${lowerVal[index]}}`)
            .join(' ,')}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `Now we have to multiply all the numerators \\& denominators separately`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `Product of all Numerators = ${upperVal.join(
            ' \\cdot '
          )} = ${parseNumber(numerator)}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `Product of all Denominators = ${lowerVal.join(
            ' \\cdot '
          )} = ${parseNumber(denominator)}`
        ),
        type: `equation`,
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `Now we have to write the obtained fraction ={ ${parseNumber(
            parseNumber(numerator)
          )}\\above{1pt}${parseNumber(denominator)} }`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `Now reducing the above fraction to its lowest form=\\frac{${parseNumber(
            numR
          )}}{${parseNumber(denumR)}} `
        ),
        type: `equation`,
      },

      {
        value: `<a href="/calculator/Fraction-Reduction/?a=${numerator}/${denominator}" target="_blank">to see Steps click here</a>`,
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

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [fractions, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setL('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [fractions].some((v) => !!v || +v == 0);
  const hasAllValue = [fractions].every((v) => !!v || +v == 0);

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
            <div className="col-3 text-left">Fraction:-</div>
            <div className="col-9">
              <Input
                placeholder="Write the (,) seprated fraction value"
                className="col-12"
                value={l}
                setVal={setL}
                pattern={
                  /^((-?(\d)*)(\/-?([1-9]\d*)*)?)(,(-?(\d)*)(\/-?([1-9]\d*)*)?)*$/
                }
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

export default FractionMultiplication;
