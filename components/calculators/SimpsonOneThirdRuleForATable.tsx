'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import Input from '../common/input';
import { isMatValid } from '../../helpers/Validations';
import MatrixInput from '../MatrixInput';

const SimpsonOneThirdRuleForATable = () => {
  const [xPoints, setXPoints] = useLocalStorage('SimpsonOneThirdRuleForATable_xPoints', [['0', '2', '4', '6', '8']]);
  const [fPoints, setFPoints] = useLocalStorage('SimpsonOneThirdRuleForATable_fPoints', [['-1', '5', '0', '2', '7']]);
  const [interval, setSubIntervals] = useLocalStorage('SimpsonOneThirdRuleForATable_interval', 5);
  const [equation, setEquation] = useLocalStorage('SimpsonOneThirdRuleForATable_equation', '');
  const [solution, setSolution] = useLocalStorage('SimpsonOneThirdRuleForATable_solution', '');
  const [answer, setAnswer] = useLocalStorage('SimpsonOneThirdRuleForATable_answer', undefined);
  const [invalidInput, setInvalidInput] = useLocalStorage('SimpsonOneThirdRuleForATable_invalidInput', false);
  const [showResult, setShowResult] = useLocalStorage('SimpsonOneThirdRuleForATable_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SimpsonOneThirdRuleForATable_showSteps', true);
  const [note, setNote] = useLocalStorage('SimpsonOneThirdRuleForATable_note', undefined);

  useEffect(() => {
    const sortedF = JSON.parse(JSON.stringify(fPoints.flat()));
    const sortedX = JSON.parse(JSON.stringify(xPoints.flat()));
    for (let i = 0; i < sortedX.length - 1; i++) {
      for (let j = i + 1; j < sortedX.length; j++) {
        if (Number(sortedX[i]) > Number(sortedX[j])) {
          [sortedX[i], sortedX[j]] = [sortedX[j], sortedX[i]];
          [sortedF[i], sortedF[j]] = [sortedF[j], sortedF[i]];
        }
      }
    }
    const formula = `\\bm{\\int_{${sortedX[0] || ''}}^{${
      sortedX[interval - 1] || ''
    }}f(x)dx}`;

    const tableContent = [
      'table',
      'tbody',
      'tr',
      {
        value: `x`,
        type: 'td',
      },
      ...sortedX.map((x) => ({
        value: `${x}`,
        type: 'td',
        className: 'text-right',
      })),
      '/tr',
      'tr',
      {
        value: `f(x)`,
        type: 'td',
      },
      ...sortedF.map((f) => ({
        value: `${f}`,
        type: 'td',
        className: 'text-right',
      })),
      '/tr',
      '/tbody',
      '/table',
    ];

    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Approximate the definite Integral ${formula}  with the Simpson’s one third Rule using the table of points below`
          ),
          type: 'equation',
        },
        ...tableContent,
      ])
    );
  }, [xPoints, fPoints, interval]);

  useEffect(() => {
    const sortedF = JSON.parse(
      JSON.stringify(fPoints.flat().map((i) => convertFromLatex(i)))
    );
    const sortedX = JSON.parse(
      JSON.stringify(xPoints.flat().map((i) => convertFromLatex(i)))
    );
    for (let i = 0; i < sortedX.length - 1; i++) {
      for (let j = i + 1; j < sortedX.length; j++) {
        if (evalInDecimals(sortedX[i]) > evalInDecimals(sortedX[j])) {
          [sortedX[i], sortedX[j]] = [sortedX[j], sortedX[i]];
          [sortedF[i], sortedF[j]] = [sortedF[j], sortedF[i]];
        }
      }
    }
    const formula = `\\bm{\\int_{${convertIntoLatex(sortedX[0]) || ''}}^{${
      convertIntoLatex(sortedX[interval - 1]) || ''
    }}f(x)dx}`;

    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Approximate the definite Intergal ${formula}  with the Simpson’s one third Rule  using the table of points`
          ),
          type: 'equation',
        },
      ])
    );
    const diff = evalInDecimals(`${sortedX[0]}-(${sortedX[1]})`);
    for (let i = 1; i < interval - 1; i++) {
      const res = evalInDecimals(`${sortedX[i]}-(${sortedX[i + 1]})`);
      if (diff != res) {
        setInvalidInput(true);
        return;
      }
    }

    const isInvalid = !interval || !isMatValid(xPoints) || !isMatValid(fPoints);
    setInvalidInput(isInvalid);
    const deltaX = evalExpression(`(${sortedX[1]}-(${sortedX[0]}))/3`);
    const valuesWithoutFrstAndLast = sortedF.slice(1, sortedF.length - 1);
    const { evenValues, oddValues } = valuesWithoutFrstAndLast.reduce(
      (
        acc: { oddValues: string[]; evenValues: string[] },
        curr: string,
        i: number
      ) => {
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
    const result = evalExpression(
      `(${sortedF[0]}) + (${
        sortedF[sortedF.length - 1]
      }) + (${evenSumMultipliedByTwo}) + (${oddSumMultipliedByFour})`
    );
    const finalResult = evalExpression(`(${result})*(${deltaX})`);

    const decimalResult = evalInDecimals(finalResult);
    const isSame = finalResult == decimalResult;
    if (isInvalid) return;
    const decRes = isSame ? '' : `\\space or \\space ${decimalResult}`;
    const finalAnswer = [
      {
        value: putSpace(
          `The approximate value of the ${formula}  with the Simpson’s one third Rule using the table of points `
        ),
        type: 'equation',
      },
      {
        value: `\\approx ${convertIntoLatex(finalResult)} ${decRes}`,
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
        value: `The Simpson’s one third rule uses the points of a subinterval on the parabola for computing the height of the approximating rectangle.`,
        type: 'span',
      },
      'br',
      {
        value: `We can calculate the definite integral by using the Simpson’s 1/3 rule for the given table of points by the formula given below`,
        type: 'span',
      },
      {
        value: `\\int_{a}^{b}\\bm{f(x)dx \\approx \\frac{\\triangle x}{3}. 
           \\{(f(x_0) + f(x_n)) + (4)(f(x_1) + f(x_3) + …. + f(x_{n-1})) + (2)(f(x_2) + f(x_4) + …. + f(x_{n-2}))\\}}`,
        type: 'equation',
      },
      {
        value: `Where,\\space Height \\space = \\mathit{\\frac{\\triangle x}{3} = \\frac{b-a}{3}}`,
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
        value: `Height = \\frac{${convertFromLatex(
          sortedX[1]
        )}-(${convertFromLatex(sortedX[0])})}{3}={${convertIntoLatex(deltaX)}}`,
        type: 'equation',
      },
      ...sortedX.map((x, i) => ({
        value: `x_{${i}} \\space = \\space ${convertIntoLatex(x)}`,
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
      ...sortedX.map((x, i) => ({
        value: `\\bm{f(x_{${i}})} \\space = \\bm{f(${convertIntoLatex(
          x
        )})} \\space = ${convertIntoLatex(sortedF[i])}`,
        type: 'equation',
      })),
      'br',
      {
        value: putSpace(
          `Now, just sum up the above obtained values and multiply it by height = \\frac{\\triangle x}{3} = ${convertIntoLatex(
            deltaX
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${formula} = ${convertIntoLatex(deltaX)}(${sortedF[0]} + (${
            sortedF[sortedF.length - 1]
          }) + (4)(${oddValues
            .map((_) => (_.toString().indexOf('-') == 0 ? `(${_})` : _))
            .join('+')}) + (2)(${evenValues
            .map((_) => (_.toString().indexOf('-') == 0 ? `(${_})` : _))
            .join('+')}))`
        ),
        type: 'equation',
      },
      {
        value: `= \\space {${convertIntoLatex(finalResult)}}`,
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
  }, [xPoints, showSteps, fPoints, interval]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setFPoints([[]]);
    setXPoints([[]]);
    setSubIntervals(2);
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    interval && isMatValid(fPoints) && isMatValid(xPoints) && !invalidInput;

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
            <div className="row mb-2 align-items-center">
              <div className="col-5 text-left">Number Of Points (n) :</div>
              <div className="col-7">
                <Input
                  placeholder="Enter a whole number only"
                  disabled={false}
                  className="col-12"
                  value={interval.toString()}
                  setVal={setSubIntervals}
                  pattern={/^((\d)*)\d*$/}
                  min={1}
                  max={501}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2 border">
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <td className="customInputLabel pt-0">
                      <Equation
                        className="paddingZero overflow-hidden m-0"
                        equation={renderSteps([
                          {
                            value: `x \\space :`,
                            type: 'equation',
                          },
                        ])}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="customInputLabel pt-1">
                      <Equation
                        className="paddingZero overflow-hidden m-0"
                        equation={renderSteps([
                          {
                            value: `f(x) :`,
                            type: 'span',
                          },
                        ])}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-10 border mb-0 pt-0">
              {interval > 0 && (
                <MatrixInput
                  rows={1}
                  columns={interval}
                  customClass="w-100 mb-0 pb-0"
                  onUpdate={setXPoints}
                  value={xPoints}
                />
              )}
              {interval > 0 && (
                <MatrixInput
                  rows={1}
                  columns={interval}
                  customClass="w-100 mt-0 pt-0"
                  onUpdate={setFPoints}
                  value={fPoints}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Equation equation={equation} className="border-primary" />
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
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

export default SimpsonOneThirdRuleForATable;
