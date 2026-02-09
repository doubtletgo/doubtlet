'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace } from '../../helpers/general';
import { getSearchParams } from '../../helpers/general';
import { ExpressionParser, Expression } from '@yaffle/expression/index';
import {
  printMatrix,
  convertFromLatex,
  convertIntoLatex,
  evalInDecimals,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import { convertToLaTeX } from 'nerdamer';

const createDiagonal = (row, arr) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? arr[i] : el)));
};
function parseArrayToString(mat) {
  return `{${mat.map((itm) => `{${itm.toString()}}`).toString()}}`;
}
function parseValues(valueStr) {
  return valueStr.toString().split(',');
}
function transposeOfMat(str) {
  try {
    var matrix = ExpressionParser.parse(str).matrix;
    return matrix.transpose().toString();
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}

function parseMatrixToLatex(mat) {
  if (!mat.length) return null;
  if (!Array.isArray(mat)) mat = stringToArray(mat);
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) =>
    Array.isArray(itm) ? parseMatrixToLatex(itm) : convertIntoLatex(itm)
  );
}
function stringToArray(str) {
  if (!str) return [];
  const rows = str.toString().split('},{');
  return parseArray(rows);
}

function parseArray(valueStr) {
  return valueStr.map((itm) =>
    itm
      ?.replace(/[\{\}]/g, '')
      .replace(/(\d+)\^0.5/g, 'sqrt($1)')
      .split(',')
  );
}

function eigen(mat) {
  try {
    const matrix = ExpressionParser.parse(parseArrayToString(mat)).matrix;
    var eigenValues = Expression.getEigenvalues(matrix);
    var eigenVectors = Expression.getEigenvectors(matrix, eigenValues)
      .map((itm) => itm?.toString())
      .filter((itm) => !!itm);

    return [parseValues(eigenValues), parseArray(eigenVectors)];
  } catch (err) {
    console.log(err.message);
    return ['', ''];
  }
}
const DiagonalizeMatrix = () => {
  const [row, setRow] = useLocalStorage('DiagonalizeMatrix_row', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('DiagonalizeMatrix_frstMatrix', [
    ['1', '1', '3'],
    ['1', '5', '7'],
    ['3', '1', '1'],
  ]);
  const [equation, setEquation] = useLocalStorage('DiagonalizeMatrix_equation', '');
  const [solution, setSolution] = useLocalStorage('DiagonalizeMatrix_solution', '');
  const [result, setResult] = useLocalStorage('DiagonalizeMatrix_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('DiagonalizeMatrix_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('DiagonalizeMatrix_showSteps', true);
  const [note, setNote] = useLocalStorage('DiagonalizeMatrix_note', undefined);
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      let arr = vals.a.split(',');
      let temp = listToMatrix(arr, b);
      setRow(b);
      setFrstMatrix(temp);
    }
  }, []);
  function listToMatrix(list, elementsPerSubArray) {
    var matrix = [],
      i,
      k;

    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    return matrix;
  }
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the diagonalization of the given matrix`),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
          type: 'equation',
        },
      ])
    );
  }, [JSON.stringify(frstMatrix.flat()), row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space  ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const tempFirst = frstMatrix.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );
    const [eigenValues, eigenVectors] = eigen(tempFirst);
    if (!eigenValues || !eigenValues.length) return;
    const isDiagonizable = eigenValues.length == eigenVectors.length;
    for (let i = 0; i < eigenValues.length; i++) {
      let el1 = eigenValues[i];
      for (let j = i + 1; j < eigenValues.length; j++) {
        let el2 = eigenValues[j];
        let val1 = evalInDecimals(el1);
        let val2 = evalInDecimals(el2);
        if (val1 < val2) {
          [eigenValues[i], eigenValues[j]] = [eigenValues[j], eigenValues[i]];
          [eigenVectors[i], eigenVectors[j]] = [
            eigenVectors[j],
            eigenVectors[i],
          ];
        }
      }
    }
    const roots = eigenValues.map((itm) =>
      itm.replace(/(\d+)\^0.5/, 'sqrt($1)')
    );
    const diagonalMatrix = createDiagonal(row, roots);
    const dMatrix = parseMatrixToLatex(diagonalMatrix);
    const eVectors = eigenVectors.map((itm) =>
      parseMatrixToLatex(itm.map((el) => [el]))
    );
    const tempMat = parseArrayToString(eigenVectors);
    const pMatrix = parseMatrixToLatex(transposeOfMat(tempMat));
    if (!pMatrix?.length) return;

    const finalAnswer = isDiagonizable
      ? [
          {
            value: `The matrices P & D are as given below: - `,
            type: 'span',
          },
          {
            value: putSpace(
              `P = ${printMatrix(pMatrix)} or P = ${printMatrix(
                matrixInDecimals(pMatrix)
              )}`
            ),
            type: 'equation',
          },
          {
            value: `\\& \\space D = ${printMatrix(
              dMatrix
            )} \\& D = ${printMatrix(matrixInDecimals(dMatrix))}`,
            type: 'equation',
          },
        ]
      : [
          {
            value: `The matrix is not diagonalizable`,
            type: 'span',
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

    const step2 = [
      {
        value: '<b>Step-2</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, we will form a matrix P, whose column will represent the eigenvectors of<br>
        the above given matrix.`,
        type: 'span',
      },
      {
        value: putSpace(`P = ${printMatrix(pMatrix)}`),
        type: 'equation',
      },
      {
        value: `Now, we will form a diagonal matrix D whose diagonal elements represents the<br>
        eigenvalues of the above given matrix.`,
        type: 'span',
      },
      {
        value: putSpace(`D = ${printMatrix(dMatrix)}`),
        type: 'equation',
      },
      {
        value: `The above obtained matrices P & D are such that `,
        type: 'span',
      },
      {
        value: putSpace(`PDP^{-1} = ${printMatrix(frstMatrix)}`),
        type: 'equation',
      },
    ];

    const notDiagonalizable = [
      {
        value: `Since the number of the eigenvectors is less than the dimension of the matrix,<br>
         the matrix is not diagonalizable.`,
        type: 'span',
      },
    ];
    const nextSteps = isDiagonizable ? step2 : notDiagonalizable;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Diagonalizing a matrix means finding a new matrix that is diagonal means<br>
        all its elements except diagonal elements are zero, while representing the<br>
        same linear transformation as the original matrix. It involves finding a<br>
        diagonal matrix D and an invertible matrix P such that A = PDP⁻¹, where A <br>
        is the original matrix. It is only applicable for a square matrix`,
        type: 'span',
      },
      'br',
      {
        value: '<b>Step-1</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `First, we will find the eigenvalues and eigenvectors of the given matrix`,
        type: 'span',
      },
      ...roots.map((itm, i) => ({
        value: putSpace(
          `EigenValue = ${convertToLaTeX(itm)} ${
            eigenVectors?.[i]
              ? `,EigenVector = ${printMatrix(eVectors[i])}`
              : ''
          }`
        ),
        type: 'equation',
      })),
      {
        value: `<a href = "/calculator/eigen-value-and-eigen-vector-calculator/?a=${frstMatrix}&b=${row}&c=${row}" target="_blank">to see the Steps for eigen values and eigen vectors, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...nextSteps,
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
  }, [frstMatrix, row, showSteps]);

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
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = !!row && isMatValid(frstMatrix);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mb-4 mb-md-0">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of an Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Order of the matrix:</div>
            <div className="col-4">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
            <div className="col-4">
              <Input value={row} disabled className="col-12" />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix: -</div>
          <div>
            {row > 0 && (
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

export default DiagonalizeMatrix;
