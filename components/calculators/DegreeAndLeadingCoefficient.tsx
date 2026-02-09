'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { MathField } from '@/types/mathfield.types';
import { isInputInvalid } from '@/helpers/Validations';
import ExpressionInput from '../expression-input';

const sortPolynomial = (expr: string): string => {
  // Split the expression into individual terms, preserving the signs
  const terms =
    expr
      .match(/[+-]?[^+-]+/g) // Match terms with their signs
      ?.map((term) => term.trim()) // Trim whitespace around terms
      .filter(Boolean) || []; // Remove empty terms

  // Helper function to extract the power of x
  const getPower = (term: string): number => {
    const match = term.match(/x\^(\d+)/); // Match explicit powers like x^2
    if (match) return parseInt(match[1], 10); // Return the parsed power
    if (term.includes('x')) return 1; // Linear terms like "3x" have a power of 1
    return 0; // Constant terms have a power of 0
  };

  // Sort the terms by power in descending order
  const sortedTerms = terms.sort((a, b) => getPower(b) - getPower(a));

  // Join the sorted terms into a single expression
  return sortedTerms
    .map((term, index) =>
      index === 0
        ? term // First term as-is (no extra '+' needed)
        : term.startsWith('-') // If the term starts with '-', keep it
        ? ` ${term}`
        : ` + ${term}` // Otherwise, add ' + ' before the term
    )
    .join('') // Combine all terms
    .replace(/\+\s*\+/g, '+') // Remove duplicate '+' signs
    .trim(); // Remove any extra spaces
};

const getHighestPower = (expr: string): number => {
  // Split the expression into individual terms
  const terms =
    expr
      .match(/[+-]?[^+-]+/g) // Match terms with their signs
      ?.map((term) => term.trim()) || []; // Trim whitespace and ensure no null terms

  // Helper function to extract the power of x from a term
  const getPower = (term: string): number => {
    const match = term.match(/x\^(\d+)/); // Match explicit powers like x^2
    if (match) return parseInt(match[1], 10); // Return the parsed power
    if (term.includes('x')) return 1; // Linear terms like "3x" have a power of 1
    return 0; // Constant terms have a power of 0
  };

  // Get the highest power from all terms
  const highestPower = Math.max(...terms.map(getPower));
  return highestPower;
};
const DegreeAndLeadingCoefficient = () => {
  const [expression, setExpression] = useLocalStorage('DegreeAndLeadingCoefficient_expression', '2x^2-x^5-4x^3+x+15');
  const [equation, setEquation] = useLocalStorage('DegreeAndLeadingCoefficient_equation', '');
  const [solution, setSolution] = useLocalStorage('DegreeAndLeadingCoefficient_solution', '');
  const [result, setResult] = useLocalStorage('DegreeAndLeadingCoefficient_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DegreeAndLeadingCoefficient_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DegreeAndLeadingCoefficient_showSteps', true);
  const [note, setNote] = useLocalStorage('DegreeAndLeadingCoefficient_note', undefined);
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the degree, leading coefficient and the leading term of`),
          type: 'equation',
        },
        {
          value: `P(x) = ${expression}`,
          type: 'equation',
        },
      ])
    );
  }, [expression]);

  useEffect(() => {
    const isInvalid = isInputInvalid(expression);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Polynomial = ${expression}`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const sortedExpression = sortPolynomial(expression);
    const terms = expression.replace(/\s+/g, '').split(/(?=[+-])/g);

      const getLeadingCoefficient = (expr: string): number => {
        // Split the expression into individual terms, preserving their signs
        const terms =
          expr
            .match(/[+-]?[^+-]+/g) // Match terms, keeping their signs
            ?.map((term) => term.trim()) || []; // Trim each term
      
        // Helper function to extract the power of x
        const getPower = (term: string): number => {
          const match = term.match(/x\^(\d+)/); // Match explicit powers like x^2
          if (match) return parseInt(match[1], 10); // Return the power
          if (term.includes('x')) return 1; // For terms like "3x", power is 1
          return 0; // For constants, power is 0
        };
      
        // Find the leading term (term with the highest power)
        const leadingTerm = terms.reduce((highest, current) => {
          const highestPower = getPower(highest);
          const currentPower = getPower(current);
          return currentPower > highestPower ? current : highest;
        });
      
        // Extract the coefficient from the leading term
        let coefficient: number;
        if (leadingTerm.includes('x')) {
          const coeffPart = leadingTerm.split('x')[0]; // Get the part before 'x'
          coefficient =
            coeffPart === '' || coeffPart === '+' // If it's empty or '+', assume 1
              ? 1
              : coeffPart === '-' // If it's '-', assume -1
              ? -1
              : parseFloat(coeffPart); // Otherwise, parse the coefficient
        } else {
          // If the term is a constant, the coefficient is the term itself
          coefficient = parseFloat(leadingTerm);
        }
      
        return coefficient;
      };      
  
    const leadingTerm = terms
      .map((term) => term.trim())
      .reduce((highest, current) => {
        const highestPower = parseInt(
          highest.match(/x\^(\d+)/)?.[1] || '1',
          10
        );
        const currentPower = parseInt(
          current.match(/x\^(\d+)/)?.[1] || '1',
          10
        );

        if (current.includes('x') && currentPower > highestPower) {
          return current;
        }
        return highest;
      }, '0');


    const highestPower = getHighestPower(expression);
    const leadingCoefficientValue = getLeadingCoefficient(expression);

    const finalAnswer = [
      {
        value: putSpace(`Degree = ${highestPower}`),
        type: 'equation',
      },
      {
        value: putSpace(`Leading Term = ${leadingTerm}`),
        type: 'equation',
      },
      {
        value: putSpace(`Leading Coefficient = ${leadingCoefficientValue}`),
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
        value: putSpace(`Given Function = ${sortedExpression}`),
        type: 'equation',
      },
      {
        value: `The degree of the polynomial is the highest degree among all the polynomial's individual terms.
`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`So, degree = ${highestPower}`),
        type: 'equation',
      },
      {
        value: putSpace(`The leading term is the term with the highest degree.`),
        type: 'equation',
      },
      {
        value: putSpace(`So, leading term = ${leadingTerm}`),
        type: 'equation',
      },
      {
        value: `The leading coefficient is the coefficient of the leading term.`,
        type: 'span',
      },
      {
        value: putSpace(`So, leading coefficient = ${leadingCoefficientValue}`),
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
  }, [expression, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression('');
    setShowResult(false);
    setShowSteps(false);
    if (inputRef.current) inputRef.current.latex('');
  }, [setShowResult]);

  const hasValue = expression.split(',').some((v) => !!v || +v == 0);
  const hasAllValue =
    expression.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !expression.endsWith(e));

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
            Your input can be in the form of Positive Real Number
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-12 text-left">Enter Set of Values:-</div>
            <div className="col-12">
              <ExpressionInput
                label={'Value'}
                value={expression}
                setValue={setExpression}
                setMathfieldRef={(ref) => (inputRef.current = ref)}
                validate={(exp) => {
                  return !isInputInvalid(exp);
                }}
                labelCol="col-3"
                inputCol="col-9"
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

export default DegreeAndLeadingCoefficient;
