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
  convertIntoLatex,
  evalExpression,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import Input from '../common/input';
import { isMatValid } from '../../helpers/Validations';
import MatrixInput from '../MatrixInput';

const RiemannSumOfATable = () => {
  const [xPoints, setXPoints] = useLocalStorage('RiemannSumForATableCalculator_xPoints', [['0', '3', '5', '-8', '7']]);
  const [fPoints, setFPoints] = useLocalStorage('RiemannSumForATableCalculator_fPoints', [['2', '-2', '7', '2.1', '3']]);
  const [interval, setInterval] = useLocalStorage('RiemannSumForATableCalculator_interval', '5');
  const [equation, setEquation] = useLocalStorage('RiemannSumForATableCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('RiemannSumForATableCalculator_solution', '');
  const [answer, setAnswer] = useLocalStorage('RiemannSumForATableCalculator_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('RiemannSumForATableCalculator_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RiemannSumForATableCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('RiemannSumForATableCalculator_note', undefined);
  const [sumType, setSumType] = useLocalStorage('RiemannSumForATableCalculator_sumType', 'left');

  const left_Right = sumType == 'left' ? 'Left' : 'Right';

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
            `Approximate the definite Integral ${formula} using the ${left_Right} Riemann Sum.`
          ),
          type: 'equation',
        },
        ...tableContent,
      ])
    );
  }, [xPoints, fPoints, interval, sumType]);

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

    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Approximate the definite Intergal ${formula}  using the ${left_Right} Riemann Sum.`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !interval || !isMatValid(xPoints) || !isMatValid(fPoints);
    if (isInvalid) return;

    const result = sortedX.slice(0, interval - 1)?.reduce((acc, p, i) => {
      let curr = evalExpression(
        `(${sortedX[i + 1]}-(${p}))(${sortedF[sumType == 'left' ? i : i + 1]})`
      );
      return evalExpression(`${curr}+(${acc})`);
    }, 0);
    const decimalResult = evalInDecimals(`${result}`);
    const isSame = decimalResult == result;
    const finalAnswer = [
      {
        value: putSpace(
          `The approximate value of the ${formula} by ${left_Right} Riemann sum is `
        ),
        type: 'equation',
      },
      {
        value: `\\approx ${convertIntoLatex(result)} ${
          isSame ? '' : `or \\space ${decimalResult}`
        }`,
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
        value: `The ${left_Right} Riemann sum uses the ${left_Right} endpoint of a subinterval for computing<br>
           the height of the approximating rectangle.`,
        type: 'span',
      },
      'br',
      {
        value: `We can calculate the ${left_Right} Riemann sum for the given table of points by the formula given below`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\int_{a}^{b}\\bm{f(x)dx \\approx \\sum^{n-1}_{i=1} (x_{i+1} - x_i).(f(x_{i+1}))} , Where n is the number of points`
        ),
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
        value: putSpace(
          `${formula} \\approx ${sortedX
            .slice(0, interval - 1)
            ?.map(
              (p, i) =>
                `(${sortedX[i + 1]}-(${p}))${
                  sortedF[sumType == 'left' ? i : i + 1]
                }`
            )
            .join('+')} \\approx ${convertIntoLatex(result)}`
        ),
        type: 'equation',
      },
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

      'br',
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [showSteps, interval, sumType, xPoints, fPoints]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );
  const onChangeSumType = (e) => {
    setSumType(e.target.value);
  };

  const clear = useCallback(() => {
    setXPoints([
      ['', ''],
      ['', ''],
    ]);
    setFPoints([
      ['', ''],
      ['', ''],
    ]);
    setInterval(2);
    setShowResult(false);
  }, [setShowResult, interval]);

  const hasValue = !!isMatValid(xPoints) && !!isMatValid(fPoints) && !!interval;

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
                  autoComplete="off"
                  className="col-12"
                  value={interval}
                  setVal={setInterval}
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

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={sumType}
                onChange={onChangeSumType}
              >
                <option value="left">Left Riemann Sum</option>
                <option value="right">Right Riemann Sum</option>
              </select>
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
      {/* {hasValue && ( */}
      <button
        className="default-btn rounded-pill px-5 btn btn-danger mt-3"
        onClick={clear}
      >
        clear
      </button>
      {/* )} */}
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

export default RiemannSumOfATable;
