'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '@/helpers/matrixHelper';

const validateInput = (input: string) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};

const QuadraticRegression = () => {
  const [xValues, setXValues] = useState('5,-8,1,7');
  const [yValues, setYValues] = useState('2,7,6,-2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    const xVals: Record<string, string> = getSearchParams(false);
    if (xVals.a) setXValues(xVals.a);
  }, []);

  useEffect(() => {
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');

    // TODO: MAKE THE ERROR MESSAGE BETTER AT LINE NUMBER 60
    const isLenSame = xVals.length == yVals.length;
    setNote(
      renderSteps(
        isLenSame
          ? [
              {
                value: `<b>Question</b>`,
                type: 'span',
              },
              {
                value: putSpace(
                  `Find the equation of parabola of best fit for:`
                ),
                type: 'equation',
              },
              {
                value: `\\bold{\\{${xVals
                  .map(
                    (x, i) =>
                      `(${convertIntoLatex(x)},${convertIntoLatex(yVals?.[i])})`
                  )
                  .join(',')}\\}}`,
                type: 'equation',
              },
            ]
          : [
              {
                value: putSpace(`Number of X and Y values must be same`),
                type: 'equation',
              },
            ]
      )
    );
  }, [xValues, yValues]);

  useEffect(() => {
    if (xValues.endsWith(',') || xValues.endsWith('/') || xValues.endsWith('-'))
      return;
    const xVals = xValues.split(',');
    const yVals = yValues.split(',');
    if (xVals.length !== yVals.length) return;
    const isInvalid = xVals.some((a) => !a) || yVals.some((a) => !a);
    const len = xVals.length;

    const xyMultiplication = xVals.map((x, i) =>
      evalExpression(`${x}*(${yVals?.[i]})`)
    );
    const xSquare = xVals.map((x) => evalExpression(`(${x})^2`));
    const ySquare = yVals.map((y) => evalExpression(`(${y})^2`));
    const xCube = xVals.map((x) => evalExpression(`(${x})^3`));
    const xQuad = xVals.map((x) => evalExpression(`(${x})^4`));
    const xSqrIntoY = xVals.map((x, i) =>
      evalExpression(`(${yVals[i]})*(${x})^2`)
    );
    const xSqrIntoYSum = xSqrIntoY.reduce(
      (sum, value) => evalExpression(`${sum} + (${value})`),
      0
    );
    const xCubeSum = xCube.reduce(
      (sum, value) => evalExpression(`${sum} + (${value})`),
      0
    );
    const xQuadSum = xQuad.reduce(
      (sum, value) => evalExpression(`${sum} + (${value})`),
      0
    );

    const xyMultiplicationSum = xyMultiplication.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const xValsSum = xVals.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const yValsSum = yVals.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const xSquareSum = xSquare.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );
    const ySquareSum = ySquare.reduce(
      (sum, value) => evalExpression(`${sum} +(${value})`),
      0
    );

    const pNum = evalExpression(
      `(${len} * (${xSqrIntoYSum}) - (${xSquareSum}) * (${yValsSum})) *((${len}) * (${xSquareSum}) - (${xValsSum})^2) -((${len}) * (${xyMultiplicationSum}) - (${xValsSum}) * (${yValsSum})) *((${len}) * (${xCubeSum}) - (${xSquareSum}) * (${xValsSum}))`
    );

    const pDenum = evalExpression(
      `(${len}*(${xQuadSum})- (${xSquareSum})^2)*((${len}) * (${xSquareSum}) - (${xValsSum})^2) - ((${len})*(${xCubeSum}) - (${xSquareSum}) * (${xValsSum}))^2`
    );
    const pAnswer = evalExpression(`${pNum}/(${pDenum})`);

    const qNum = evalExpression(
      `(${len} * (${xyMultiplicationSum}) - (${xValsSum}) * (${yValsSum})) *  ((${len}) * (${xQuadSum}) - (${xSquareSum})^2) -  ((${len}) * (${xSqrIntoYSum}) - (${xSquareSum}) * (${yValsSum})) *  ((${len}) * (${xCubeSum}) - (${xSquareSum}) * (${xValsSum}))`
    );
    const qDenum = evalExpression(
      `(${len} * (${xQuadSum}) - (${xSquareSum})^2) * ((${len}) * (${xSquareSum}) - (${xValsSum})^2) - ((${len}) * (${xCubeSum}) - (${xSquareSum}) * (${xValsSum}))^2`
    );
    const qAnswer = evalExpression(`${qNum} / (${qDenum})`);

    const rAnswer = evalExpression(
      `(${yValsSum} - ${qAnswer} * ${xValsSum} - ${pAnswer} * ${xSquareSum}) / ${len}`
    );

    const pInDecimal = evalToDecimals(pAnswer);
    const qInDecimal = evalToDecimals(qAnswer);
    const rInDecimal = evalToDecimals(rAnswer);

    const tableRows = xVals.map((x, i) => {
      const y = yVals[i];
      const xSquare = evalExpression(`(${x})^2`);
      const ySquare = evalExpression(`(${y})^2`);
      const xy = evalToDecimals(
        `(${evalExpression(x)}) * (${evalExpression(y)})`
      );
      const xSquareY = evalExpression(`${xSquare} * (${y})`);
      const xCube = evalExpression(`(${x})^3`);
      const xQuad = evalExpression(`(${x})^4`);
      return `& ${convertIntoLatex(x)} & ${convertIntoLatex(
        y
      )} & ${convertIntoLatex(xy)} & ${convertIntoLatex(
        xSquare
      )} & ${convertIntoLatex(xSquareY)} & ${convertIntoLatex(
        xCube
      )} & ${convertIntoLatex(xQuad)} & ${convertIntoLatex(
        ySquare
      )} \\\\ \\hline`;
    });

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `X-Values \\space = \\space ${xVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
        {
          value: `Y-Values \\space = \\space ${yVals
            .map((i) => convertIntoLatex(i))
            .join(',')}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    const finalAnswer = [
      {
        value: putSpace(
          `The Parabola of best fit is: \\bold{(${convertIntoLatex(
            pAnswer
          )})x^2 + (${convertIntoLatex(qAnswer)})x + (${convertIntoLatex(
            rAnswer
          )})}`
        ),
        type: 'equation',
      },
      {
        value: `or \\space \\bold{(${pInDecimal})x^2 + (${qInDecimal})x + (${rInDecimal})}`,
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
        value: putSpace(`The equation of best line fit is: y = px^2+qx+r`),
        type: 'equation',
      },
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      'br',
      {
        value: `First, we will count number of input points.`,
        type: 'span',
      },
      'br',
      {
        value: `The number of Points is n = ${len}`,
        type: 'span',
      },
      'br',
      {
        value: `Now generate the following table:`,
        type: 'span',
      },
      {
        value: `\\begin{array}{|c|c|c|c|c|c|c|c|c|}
        \\hline
        & \\textbf{x} & \\textbf{y} & \\textbf{xy} & \\textbf{X}^2 & \\textbf{X}^2y & \\textbf{X}^3 & \\textbf{X}^4 & \\textbf{Y}^2 \\\\
        \\hline
        ${tableRows.join('\n')}
        \\Sigma & {${convertIntoLatex(xValsSum)}} & {${convertIntoLatex(
          yValsSum
        )}} & {${convertIntoLatex(xyMultiplicationSum)}} & {${convertIntoLatex(
          xSquareSum
        )}} & {${convertIntoLatex(xSqrIntoYSum)}} & {${convertIntoLatex(
          xCubeSum
        )}} & {${convertIntoLatex(xQuadSum)}} & {${convertIntoLatex(
          ySquareSum
        )}} \\\\
        \\hline
        \\end{array}`,
        type: 'equation',
      },
      {
        value: `We can rename the variables as:`,
        type: 'span',
      },
      {
        value: `\\Sigma x = a = ${convertIntoLatex(xValsSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma y = b = ${convertIntoLatex(yValsSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma xy = c = ${convertIntoLatex(xyMultiplicationSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma x^2 = d = ${convertIntoLatex(xSquareSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma x^2 y = e = ${convertIntoLatex(xSqrIntoYSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma x^3 = f = ${convertIntoLatex(xCubeSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma x^4 = g = ${convertIntoLatex(xQuadSum)}`,
        type: 'equation',
      },
      {
        value: `\\Sigma y^2 = h = ${convertIntoLatex(ySquareSum)}`,
        type: 'equation',
      },
      {
        value: `We can calculate the value of a, b and c by using given formulas:`,
        type: 'span',
      },
      {
        value: `p = \\frac{(n.e-d.b).(n.d-a^2)-(n.c-a.b).(n.f-d.a)}{(n.g-d^2)(n.d-a^2)-(n.f-d.a)^2}`,
        type: 'equation',
      },
      {
        value: `p = \\frac{((${len}).(${convertIntoLatex(
          xSqrIntoYSum
        )})-(${convertIntoLatex(xSquareSum)}).(${convertIntoLatex(
          yValsSum
        )})).((${len}).(${convertIntoLatex(xSquareSum)})-(${convertIntoLatex(
          xValsSum
        )})^2)-((${len}).(${convertIntoLatex(
          xyMultiplicationSum
        )})-(${convertIntoLatex(xValsSum)}).(${convertIntoLatex(
          yValsSum
        )})).((${len}).(${convertIntoLatex(xCubeSum)})-(${convertIntoLatex(
          xSquareSum
        )}).(${convertIntoLatex(xValsSum)}))}{((${len}).(${convertIntoLatex(
          xQuadSum
        )})-(${convertIntoLatex(xSquareSum)})^2)((${len}). (${convertIntoLatex(
          xSquareSum
        )})-(${convertIntoLatex(xValsSum)})^2)-((${len}).(${convertIntoLatex(
          xCubeSum
        )})-(${convertIntoLatex(xSquareSum)}).(${convertIntoLatex(
          xValsSum
        )}))^2}`,
        type: 'equation',
      },
      {
        value: `= ${convertIntoLatex(pAnswer)}`,
        type: 'equation',
      },
      {
        value: `q = \\frac{(n.c-a.b).(n.g-d^2)-(n.e-d.b).(n.f-d.a)}{(n.g-d^2)(n.d-a^2)-(n.f-d.a)^2}`,
        type: 'equation',
      },
      {
        value: `q = \\frac{((${len}).(${convertIntoLatex(
          xyMultiplicationSum
        )})-(${convertIntoLatex(xValsSum)}).(${convertIntoLatex(
          yValsSum
        )})).((${len}).(${convertIntoLatex(xQuadSum)})-(${convertIntoLatex(
          xSquareSum
        )})^2)-((${len}).(${convertIntoLatex(
          xSqrIntoYSum
        )})-(${convertIntoLatex(xSquareSum)}).(${convertIntoLatex(
          yValsSum
        )})).((${len}).(${convertIntoLatex(xCubeSum)})-(${convertIntoLatex(
          xSquareSum
        )}).(${convertIntoLatex(xValsSum)}))}{((${len}).(${convertIntoLatex(
          xQuadSum
        )})-(${convertIntoLatex(xSquareSum)})^2)((${len}).(${convertIntoLatex(
          xSquareSum
        )})-(${convertIntoLatex(xValsSum)})^2)-((${len}).(${convertIntoLatex(
          xCubeSum
        )})-(${convertIntoLatex(xSquareSum)}).(${convertIntoLatex(
          xValsSum
        )}))^2}`,
        type: 'equation',
      },
      {
        value: `= ${convertIntoLatex(qAnswer)}`,
        type: 'equation',
      },
      {
        value: `r = \\frac{(b-q.a-p.d)}{n} = \\frac{((${convertIntoLatex(
          yValsSum
        )})-(${convertIntoLatex(qAnswer)}). (${convertIntoLatex(
          xValsSum
        )})-(${convertIntoLatex(pAnswer)}).(${convertIntoLatex(
          xSquareSum
        )}))}{(${len})}`,
        type: 'equation',
      },
      {
        value: ` = ${convertIntoLatex(rAnswer)}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Hence, the Parabola of best fit is: (${convertIntoLatex(
            pAnswer
          )})x^2 + (${convertIntoLatex(qAnswer)})x + (${convertIntoLatex(
            rAnswer
          )})`
        ),
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
  }, [xValues, yValues, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setXValues('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue =
    (xValues.split(',').some((v) => !!v || +v == 0) ||
      yValues.split(',').some((v) => !!v || +v == 0)) &&
    xValues.split(',').length == yValues.split(',').length;

  const hasAllValue =
    xValues.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !xValues.endsWith(e)) &&
    yValues.split(',').every((v) => !!v || +v == 0) &&
    ['-', '/', '.', ','].every((e) => !yValues.endsWith(e));

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
            Your input can be in the form of any Real Number.
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-12 text-left">Enter X-Values:</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seperated Values"
                value={xValues}
                onBlur={(e) => {
                  if (!validateInput(e.target.value)) {
                    e.currentTarget.className =
                      'form-control border-danger col-4 min-height';
                    setShowSteps(false);
                    setShowResult(true);
                  } else {
                    e.currentTarget.className =
                      'form-control border-primary col-4 min-height';
                  }
                }}
                onChange={(e) => {
                  const input = e.target.value;

                  const validPartialInput =
                    /^(-?\d*(\.\d*)?(\/-?\d*)?)(,\s*-?\d*(\.\d*)?(\/-?\d*)?)*,?$/;

                  if (input === '' || validPartialInput.test(input)) {
                    setXValues(input);
                  }
                }}
              />
            </div>
            <div className="col-12 text-left">Enter Y-Values:</div>
            <div className="col-12">
              <textarea
                className="form-control border-primary col-4 min-height"
                placeholder="Enter Comma Seperated Values"
                value={yValues}
                onBlur={(e) => {
                  if (!validateInput(e.target.value)) {
                    e.currentTarget.className =
                      'form-control border-danger col-4 min-height';
                    setShowSteps(false);
                    setShowResult(true);
                  } else {
                    e.currentTarget.className =
                      'form-control border-primary col-4 min-height';
                  }
                }}
                onChange={(e) => {
                  const input = e.target.value;

                  const validPartialInput =
                    /^(-?\d*(\.\d*)?(\/-?\d*)?)(,\s*-?\d*(\.\d*)?(\/-?\d*)?)*,?$/;

                  if (input === '' || validPartialInput.test(input)) {
                    setYValues(input);
                  }
                }}
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

export default QuadraticRegression;
