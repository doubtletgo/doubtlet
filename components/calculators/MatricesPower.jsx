'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace } from '../../helpers/general';

import {
  printMatrix,
  printPower,
  convertFromLatex,
  convertIntoLatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import { abs } from '../../helpers/decimal';
import { isMatValid } from '../../helpers/Validations';
import { ExpressionParser } from '@yaffle/expression/index';

const createIdentityMatrix = (row) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? '1' : el)));
};

function parseArrayToString(mat) {
  return `{${mat.map((itm) => `{${itm.toString()}}`).toString()}}`;
}
function parseArray(valueStr) {
  return valueStr.map((itm) =>
    itm
      ?.replace(/[\{\}]/g, '')
      .replace(/(\d+)\^0.5/g, 'sqrt($1)')
      .split(',')
  );
}

function parseMatrixToLatex(mat) {
  if (!mat.length) return null;
  if (!Array.isArray(mat)) mat = stringToArray(mat);
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) =>
    Array.isArray(itm) ? parseMatrixToLatex(itm) : convertIntoLatex(itm)
  );
}

function matrixPower(a, pow) {
  try {
    var matrix = ExpressionParser.parse(a).matrix;
    return matrix.pow(pow).toString();
  } catch {
    return [[]];
  }
}
function inverseOfMat(mat) {
  try {
    var matrix = ExpressionParser.parse(mat).matrix;
    return matrix.inverse().toString();
  } catch {
    return [[]];
  }
}

function stringToArray(str) {
  if (!str) return [];
  const rows = str.toString().split('},{');
  return parseArray(rows);
}

const MatricesPower = () => {
  const [row, setRow] = useState('2');
  const [frstMatrix, setFrstMatrix] = useState([
    ['1.5', '\\frac{2}{3}'],
    ['3', '\\frac{-2}{3}'],
  ]);
  const [power, setPower] = useState('3');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const repeatChar = (char, times) => char.repeat(times).split('').join('.');
  //end function
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the value of the expression (A)^{${
              power || 0
            }} of the given matrix as `
          ),
          type: 'equation',
        },
        {
          value: `A =${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, power, row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space   ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
        {
          value: putSpace(`Index Power:  \\bigg<\\bold{${power || 0}}\\bigg>`),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !power || !row || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const multiplySteps = [];
    const tempFirst = frstMatrix.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );

    const arrAsString = parseArrayToString(tempFirst);
    let multiplyWith = arrAsString;
    try {
      let i = 1;
      let tempPower = Math.abs(power);
      while (i < tempPower) {
        let multiplyResult = matrixPower(arrAsString, i + 1);
        let firstText = [
          {
            value: `To find the power ${tempPower} of a given matrix, we need to multiply the given matrix <br>
          by itself ${tempPower - 1} times`,
            type: 'span',
          },
          {
            value: putSpace(
              power < 0
                ? `Here to find the value of A^{${power}} = (${repeatChar(
                    'A',
                    tempPower
                  )})^{-1}  `
                : `Here first we will find ${printPower(
                    'A',
                    tempPower
                  )} = ${repeatChar('A', tempPower)} `
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `First, we will find ${printPower(
                'A',
                power < 0 ? tempPower : tempPower - 1
              )}`
            ),
            type: 'equation',
          },
        ];
        let otherText = [
          {
            value: putSpace(
              `Now we will multiply ${printPower(
                'A',
                i
              )} by A to find ${printPower('A', i + 1)}`
            ),
            type: 'equation',
          },
        ];
        let textToShow = i == 1 ? firstText : otherText;
        let step = [
          {
            value: `<b>Step-${i}</b>`,
            type: 'span',
            className: 'text-decoration-underline',
          },
          'br',
          ...textToShow,
          {
            value: `${printPower('A', i + 1)}=${printPower('A', i)}.A
          =${printMatrix(parseMatrixToLatex(multiplyWith))}.${printMatrix(
              frstMatrix
            )}
          =${printMatrix(parseMatrixToLatex(multiplyResult))}
          
          `,
            type: 'equation',
          },
          {
            value: `<a href="/calculator/matrix-multiplication/?a=${parseMatrixToLatex(
              multiplyWith
            )}&b=${frstMatrix}&c=${row}&d=${row}&e=${row}"  target="_blank">to see Steps for multiplication  click here </a>`,
            type: 'span',
          },
          'br',
        ];
        multiplySteps.push(...step);
        multiplyWith = multiplyResult;
        i += 1;
      }
    } catch {
      return;
    }
    const inverse = inverseOfMat(multiplyWith);
    const determinant =
      ExpressionParser.parse(arrAsString).matrix.determinant();
    const inversOfmatrix = printMatrix(parseMatrixToLatex(inverse));
    const matInDecimals = matrixInDecimals(stringToArray(inverse));
    const identity = createIdentityMatrix(row);
    // negative Power steps
    const detZero = [
      {
        value: putSpace(
          `Since the Determinant of the matrix obtained in the above step is ZERO, hence `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Inverse can’t be obtained and Result cannot be concluded.”`
        ),
        type: 'equation',
      },
    ];
    const detNotZero = [
      {
        value: `(A^${abs(power)})^{-1} = ${printMatrix(
          parseMatrixToLatex(multiplyWith)
        )} = ${inversOfmatrix}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/inverse-of-a-matrix/?a=${parseMatrixToLatex(
          multiplyWith
        )}&b=${row}"  target="_blank">to see Steps to find the inverse of a matrix, click here</a>`,
        type: 'span',
      },
      'br',
    ];
    const detStep = determinant == 0 ? detZero : detNotZero;
    let negativeStep = [
      {
        value: `<b>Step-${abs(power)}
        </b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we will find the inverse of matrix A<sup>${abs(
          power
        )}</sup>`,
        type: `span`,
      },
      ...detStep,
    ];

    let negativePowerstep = power < 0 ? negativeStep : '';
    const positivePowerAns = `${printMatrix(
      parseMatrixToLatex(multiplyWith)
    )} or  ${printMatrix(matrixInDecimals(stringToArray(multiplyWith)))} `;
    const zeroPowerAns = `${printMatrix(identity)}`;

    const NegativePowerAnswer = `${inversOfmatrix} or ${printMatrix(
      matInDecimals
    )}`;

    const finalValue =
      power < 0
        ? NegativePowerAnswer
        : power == 0
        ? zeroPowerAns
        : positivePowerAns;

    const finalAnswer = [
      {
        value: putSpace(`The result of the expression \\bold{A}^{${power}}  `),
        type: 'equation',
      },
      {
        value: ` = ${finalValue}`,
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
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that Power of the given Matrix as A^n is only valid if given`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `matrix is a square matrix (Number of rows = Number of column). `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          power < 0
            ? `Power of a matrix A^{-n} is solved as (A.A.A…...n times)^{-1}  where n is an integer.`
            : `Power of a matrix A^n is solved as A.A.A…... (n times) where n is an integer`
        ),
        type: 'equation',
      },
      ...multiplySteps,
      ...negativePowerstep,
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
  }, [frstMatrix, power, showSteps, row]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setFrstMatrix([
      ['', ''],
      ['', ''],
    ]);
    setRow('2');
    setPower('');
    setShowResult(false);
  }, [setShowResult]);
  const hasValue = !!power && !!row && isMatValid(frstMatrix);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mb-4 mb-md-0">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of an Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Size of the matrix:</div>
            <div className="col-3">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={11}
                pattern={/^((\d)*)\d*$/}
                className="col-12"
              />
            </div>
            <div className="col-3">
              <Input value={row} disabled className="col-12" />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Power of Index:</div>
            <div className="col-6">
              <Input
                value={power}
                setVal={setPower}
                pattern={/^-?((\d)*)\d*$/}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix: -</div>
          <div>
            {row && (
              <MatrixInput
                rows={row}
                columns={row}
                className="col-6"
                onUpdate={setFrstMatrix}
                value={frstMatrix}
              />
            )}
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

export default MatricesPower;
