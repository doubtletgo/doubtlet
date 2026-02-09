'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';

const ConvertDegreeToRadian = () => {
  const [a, setA] = useLocalStorage('ConvertDegreeToRadian_a', '5');
  const [equation, setEquation] = useLocalStorage('ConvertDegreeToRadian_equation', '4');
  const [solution, setSolution] = useLocalStorage('ConvertDegreeToRadian_solution', '2');
  const [result, setResult] = useLocalStorage('ConvertDegreeToRadian_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('ConvertDegreeToRadian_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('ConvertDegreeToRadian_showSteps', true);
  const [note, setNote] = useLocalStorage('ConvertDegreeToRadian_note', undefined);

  let [p, q = 1] = a.split('/');

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Convert \\space {${parseNumber(p || 'R')} ${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          } \\space degrees \\space to \\space radian.`,
          type: 'equation',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    const isInvalid = [p].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Angle \\space (θ): {${parseNumber(p || 'R')} ${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          }`,
          type: 'equation',
        },
      ])
    );
    if (!a) return;
    if (isInvalid) return;

    //perimeter calculation
    function checkDecimal(n) {
      var isDecimal = n - Math.floor(n) !== 0;

      return isDecimal;
    }
    function decimalToFraction(val) {
      val = val?.toString();
      if (!val) return;
      if (checkDecimal(val)) {
        return (
          val.replace('.', '') +
          `\\above{1pt}` +
          10 ** val.split('.')[1]?.length
        );
      }
      return val + `\\above{1pt}` + 1;
    }

    var numerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[0] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[1] || 1);
    var denumerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[1] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[0] || 1);

    const showUpValuOnly = !checkDecimal(p) && q == 1;

    const decimalCalculation = denumerator * 180;

    //fraction reduction
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return [numR, denumR];
        }
      }
      return [numR, denumR];
    }
    let Result;
    if (numerator === decimalCalculation) {
      Result = [1, 1];
    } else {
      Result = fraction(numerator, decimalCalculation);
    }

    const finalResult = (Result[0] / Result[1]) * (22 / 7);

    const finalAnswer = [
      {
        value: `{${parseNumber(p || 'A')} ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        } \\space degree \\space is \\space equal \\space to \\space {${
          denumerator == 44 / 7
            ? numerator
            : `{${Result[0]}\\pi \\above{1pt} ${Result[1]}}`
        }} \\space or \\space ${parseNumber(finalResult, {}, 4)} \\space Radian
        `,
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
        value: `The angle between two lines is measured either in degrees or radians.`,
        type: 'span',
      },
      {
        value: `To \\space convert \\space degrees \\space into \\space radians, 
        \\space multiply \\space the \\space value \\space by \\space {\\pi \\above{1pt} 180}`,
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
        value: `Given \\space angle = {${parseNumber(p || 'R')} ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        } \\degree {${
          checkDecimal(a)
            ? ` = {${
                showUpValuOnly
                  ? numerator
                  : [numerator, denumerator].join(`\\above{1pt}`)
              }}`
            : ''
        }}`,
        type: 'equation',
      },
      {
        value: `{${
          showUpValuOnly
            ? numerator
            : [numerator, denumerator].join(`\\above{1pt}`)
        }} \\space degrees = ({${
          showUpValuOnly
            ? numerator
            : [numerator, denumerator].join(`\\above{1pt}`)
        }})({\\pi \\above{1pt} 180}) \\space radians`,
        type: 'equation',
      },
      {
        value: ` = {{${
          showUpValuOnly
            ? numerator
            : [numerator, denumerator].join(`\\above{1pt}`)
        }} \\above{1pt} 180}(\\pi) \\space radians`,
        type: 'equation',
      },
      {
        value: `Converting \\space {{${
          showUpValuOnly
            ? numerator
            : [numerator, denumerator].join(`\\above{1pt}`)
        }} \\above{1pt} 180} \\space to \\space its \\space lowest \\space form = 
        {${numerator} \\above{1pt} ${decimalCalculation}}`,
        type: 'equation',
      },
      {
        value: `Reducing \\space the \\space fraction \\space to \\space its \\space lowest \\space form 
        ={${parseNumber(Result[0])} \\above{1pt} ${parseNumber(Result[1])}}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-reduction-calculator/?a= ${numerator}/${decimalCalculation} " target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
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
  }, [a, showSteps, setSolution]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of positive real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Angle (θ):</div>
            <div className="col-8">
              <Input
                placeholder="Angle"
                className="col-12"
                value={a}
                setVal={setA}
                pattern={
                  /^(-?((\d*)|\.|(\d*\.\d*)))(\/-?((\d*)|\.|(\d*\.\d*)|(\d*\.)))?$/
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

export default ConvertDegreeToRadian;
