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

const FractionDivision = () => {
  const [x, setX] = useLocalStorage('FractionDivision_x', '1/4');
  const [y, setY] = useLocalStorage('FractionDivision_y', '5/4');
  const [equation, setEquation] = useLocalStorage('FractionDivision_equation', '');
  const [solution, setSolution] = useLocalStorage('FractionDivision_solution', '');
  const [result, setResult] = useLocalStorage('FractionDivision_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('FractionDivision_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FractionDivision_showSteps', true);
  const [note, setNote] = useLocalStorage('FractionDivision_note', undefined);

  let [a, b] = x.split('/');
  let [c, d] = y.split('/');

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x) setX(vals.x);
    if (vals.y) setY(vals.y);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Divide  the  fraction  {${parseNumber(
              a || '1'
            )}\\above{1pt}${parseNumber(b || '1')}} by {${parseNumber(
              c || '1'
            )}\\above{1pt}${parseNumber(d || '1')}}  or`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `or \\bold{{\\Large{ ${parseNumber(a || '1')}\\above{1pt}${
              parseNumber(b) || '1'
            }}\\above{1pt}{\\Large ${parseNumber(c || '1')}\\above{1pt}${
              parseNumber(d) || '1'
            }}}}`
          ),
          type: `equation`,
        },
      ])
    );
  }, [x, a, b, y, c, d]);

  useEffect(() => {
    const isInvalid = [a, b, c, d].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Fractions: - \\bigg<{${parseNumber(
              a || '1'
            )}\\above{1pt}${parseNumber(b || '1')}},{${parseNumber(
              c || '1'
            )}\\above{1pt}${parseNumber(d || '1')}} \\bigg>`
          ),
          type: `equation`,
        },
      ])
    );

    //solution for multiplication of the division values

    const aIntoD = (a || 1) * (d || 1);
    const bIntoC = (b || 1) * (c || 1);

    //fraction reduction
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
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
    if (aIntoD === bIntoC) {
      Result = { numR: 1, denumR: 1 };
    } else {
      Result = fraction(aIntoD, bIntoC);
    }
    const { numR, denumR } = Result;

    //condition for negative values
    const checkBothValues = numR < 0 && denumR < 0;
    const checkSingleValue = numR < 0 || denumR < 0;

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: `The result of Division of the fraction`,
        type: `span`,
      },
      {
        value: `{${parseNumber(a || 'a')}\\above{1pt}${
          parseNumber(b) || 'b'
        }} by
          { ${parseNumber(c) || 'c'}\\above{1pt}${
          parseNumber(d) || 'd'
        }}  or  \\bold{{{\\Large ${parseNumber(a || 'a')}\\above{1pt}${
          parseNumber(b) || 'b'
        }}\\above{1pt} {\\Large ${parseNumber(c || 'c')}\\above{1pt}${
          parseNumber(d) || 'd'
        }}}}   is  ${
          checkBothValues ? '' : `${checkSingleValue ? `(-)` : ''}`
        }{${parseNumber(abs(numR))}\\above{1pt}${parseNumber(abs(denumR))}}`,
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
        value: putSpace(
          `A  fraction  is always represented  in the form of {p\\above{1pt}q}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`where p and q are integers and q ≠ 0.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Apply the fraction rule =\\bold{{{a\\above{1pt}b}\\above{1pt} {c\\above{1pt}d}}}= {a.d\\above{1pt}b.c}`
        ),
        type: `equation`,
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given fraction =\\bigg<{${parseNumber(a) || '1'}\\above{1pt}${
          parseNumber(b) || '1'
        }},{${parseNumber(c) || '1'}\\above{1pt}${
          parseNumber(d) || '1'
        }} \\bigg >`,
        type: `equation`,
      },
      {
        value: `Where a = ${parseNumber(a || '1')}, b = ${parseNumber(
          b || '1'
        )} , c = ${parseNumber(c || '1')}, d = ${parseNumber(d || '1')}  `,
        type: `span`,
      },
      'br',
      {
        value: `a.d = (${parseNumber(a || '1')}).(${parseNumber(d || '1')})`,
        type: `span`,
      },
      'br',
      {
        value: `b.c = (${parseNumber(b || '1')}).(${parseNumber(c || '1')})`,
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
        value: `Now we have to apply the fraction rule `,
        type: `span`,
      },
      {
        value: `={${parseNumber(a || '1')}.${parseNumber(
          d || '1'
        )}\\above {1pt}${parseNumber(b || '1')}.${parseNumber(
          c || '1'
        )}} = {${parseNumber(aIntoD)}\\above {1pt}${parseNumber(bIntoC)}}`,
        type: `equation`,
      },
      {
        value: `Now reducing the above fraction to its lowest form `,
        type: `span`,
      },
      {
        value: `=${
          checkBothValues ? '' : `${checkSingleValue ? `(-)` : ''}`
        }{${parseNumber(abs(numR))}\\above{1pt}${parseNumber(abs(denumR))}}`,
        type: `equation`,
      },
      {
        value: `<a href="/calculator/fraction-reduction-calculator/?a=${aIntoD}/${bIntoC}" target="_blank">to see Steps click here</a>`,
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
  }, [x, a, b, y, c, d, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setX('');
    setY('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a, b, c, d].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [a, b, c, d].every((v) => (!!v && !isNaN(v)) || v === 0);

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
                placeholder="Input values as a/b"
                autoComplete="off"
                className="col-12"
                value={x}
                setVal={setX}
                pattern={/^(-?(\d)*)(\/-?(\d)*)?$/}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-9">
              <Input
                placeholder="Input values as c/d"
                autoComplete="off"
                className="col-12"
                value={y}
                setVal={setY}
                pattern={/^(-?(\d)*)(\/-?(\d)*)?$/}
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

export default FractionDivision;
