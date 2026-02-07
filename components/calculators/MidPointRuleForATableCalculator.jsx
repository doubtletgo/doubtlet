'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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

const MidPointRuleForATableCalculator = () => {
  const [xPoints, setXPoints] = useState([['0', '3', '6', '9', '12']]);
  const [fPoints, setFPoints] = useState([['-7', '5', '-9', '10', '-15']]);
  const [interval, setSubIntervals] = useState('5');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [invalidInput, setInvalidInput] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

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
            `Approximate the definite Integral ${formula}  with the Trapezoidal Rule using the table of points below`
          ),
          type: 'equation',
        },
        ...tableContent,
      ])
    );
  }, [xPoints, JSON.stringify(fPoints), interval]);

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
            `Approximate the definite Intergal ${formula}  with the Trapezoidal Rule using the table of points`
          ),
          type: 'equation',
        },
      ])
    );
    const diff = evalInDecimals(`${sortedX[0]}-(${sortedX[1]})`);
    for (let i = 1; i < interval - 1; i++) {
      let res = evalInDecimals(`${sortedX[i]}-(${sortedX[i + 1]})`);
      console.log(diff, res);
      if (diff != res) {
        setInvalidInput(true);
        return;
      }
    }
    if (interval % 2 == 0) {
      setInvalidInput(true);
      return;
    }
    setInvalidInput(false);
    const isInvalid = !interval || !isMatValid(xPoints) || !isMatValid(fPoints);
    setInvalidInput(isInvalid);
    const evens = sortedX.filter((_, i) => i % 2 == 0);
    const odds = sortedX.filter((_, i) => i % 2 != 0);
    const fOdds = sortedF.filter((_, i) => i % 2 != 0);
    const res = evens
      .slice(0, evens.length - 1)
      .map((itm, i) =>
        evalExpression(`(${evens[i + 1]}-(${itm})) * (${fOdds[i]})`)
      );
    const final = res.reduce(
      (acc, curr) => evalInDecimals(`${curr}+(${acc})`),
      0
    );

    if (isInvalid) return;
    const finalAnswer = [
      {
        value: putSpace(
          `The approximate value of the ${formula}  with the Trapezoidal Rule using the table of points `
        ),
        type: 'equation',
      },
      {
        value: `\\approx ${final}`,
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
        value: `The Trapezoidal rule uses the points of a subinterval on the trapezoids for computing the height of the approximating rectangle.`,
        type: 'span',
      },
      'br',
      {
        value: `We can calculate the definite integral by using the trapezoidal rule for the given table of points by the formula given below`,
        type: 'span',
      },
      {
        value: `\\int_{a}^{b}\\bm{f(x)dx \\approx \\sum^{\\frac{n-1}{2}}_{i=1}(x_{2i+1} - x_{2i-1}).f(\\frac{x_{2i-1} + x_{2i+1}}{2}) }, `,
        type: 'equation',
      },
      {
        value: `Where n is the number of points`,
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
        value: putSpace(`Now by putting the values in the above give formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `${formula} = ${evens
            .slice(0, evens.length - 1)
            .map(
              (itm, i) =>
                `(${convertIntoLatex(evens[i + 1])}-(${convertIntoLatex(
                  itm
                )})).f(\\frac{${convertIntoLatex(
                  evens[i + 1]
                )} + (${convertIntoLatex(itm)})}{2})`
            )
            .join('+')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${formula} = ${evens
            .slice(0, evens.length - 1)
            .map(
              (itm, i) =>
                `(${convertIntoLatex(evens[i + 1])}-(${convertIntoLatex(
                  itm
                )})).f(${convertIntoLatex(odds[i])})`
            )
            .join('+')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${formula} = ${evens
            .slice(0, evens.length - 1)
            .map(
              (itm, i) =>
                `(${evalExpression(
                  `${evens[i + 1]}-(${convertIntoLatex(itm)})`
                )}).(${convertIntoLatex(fOdds[i])})`
            )
            .join('+')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `${formula} = ${evens
            .slice(0, evens.length - 1)
            .map(
              (itm, i) =>
                `(${evalExpression(
                  `${evens[i + 1]}-(${convertIntoLatex(itm)})`
                )}).(${convertIntoLatex(fOdds[i])})`
            )
            .join('+')} = ${final}`
        ),
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
    setInterval(2);
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    interval && isMatValid(fPoints) && isMatValid(xPoints) && !invalidInput;

  return (
    <>
      {invalidInput && (
        <div
          className="alert alert-danger w-50 mx-auto text-center"
          role="alert"
        >
          1.Difference between x points must be equal <br />
          2.Interval must be an odd number
        </div>
      )}
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
                  customClass="w-100 mb-0 pb-0"
                  onUpdate={setXPoints}
                  value={xPoints}
                />
              )}
              {interval > 0 && (
                <MatrixInput
                  rows={1}
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

export default MidPointRuleForATableCalculator;
