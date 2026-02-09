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
import { create, all } from 'mathjs';
import { getSearchParams } from '../../helpers/general';
import {
  printMatrix,
  convertFromLatex,
  convertIntoLatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const createIdentity = (row) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? '1' : el)));
};

function parseMatrixToLatex(mat) {
  if (!mat?.length) return null;
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) =>
    Array.isArray(itm) ? parseMatrixToLatex(itm) : convertIntoLatex(itm) || '0'
  );
}
const findRowEchelonForm = (mat) => {
  const steps = [];
  const obj = {};
  const swaps = [];
  try {
    const matrix = JSON.parse(JSON.stringify(mat));
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;
    for (let row = 0; row < numRows; row++) {
      if (lead >= numCols) {
        return [matrix, steps, obj, swaps];
      }

      let i = row; //0
      while (matrix[i][lead] == 0) {
        i++;
        if (i == numRows) {
          i = row;
          lead++;
          if (lead == numCols) {
            return [matrix, steps, obj, swaps];
          }
        }
      }

      [matrix[i], matrix[row]] = [matrix[row], matrix[i]];
      if (i > row) {
        steps.push({
          value: putSpace(`Swap \\bold{R_{${row + 1}} ↔ R_{${i + 1}}}`),
          type: 'equation',
        });
        swaps.push(`${row}${i}`);
      }

      let leadingCoefficient = matrix[row][lead];
      let pushed = false;
      for (let k = 0; k < numRows; k++) {
        if (k !== row && k > row) {
          const factor = matrix[k][lead] || '0';
          if (!pushed) {
            steps.push({
              value: putSpace(`Considering the column ${lead + 1} elements :`),
              type: 'equation',
            });
            pushed = true;
          }
          obj[`${k}${lead}`] = math
            .simplify(`${factor}/(${leadingCoefficient})`)
            .toString();
          steps.push({
            value: putSpace(
              `For the element A_{${k + 1}${lead + 1}}:-  \\bold{R_{${
                k + 1
              }} → R_{${k + 1}} - (\\frac{${convertIntoLatex(
                factor
              )}}{${convertIntoLatex(leadingCoefficient)}})R_{${row + 1}}} `
            ),
            type: 'equation',
          });
          for (let j = lead; j < numCols; j++) {
            let res = math
              .simplify(
                `${matrix[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            matrix[k][j] = math
              .simplify(`${matrix[k][j]} - (${res})`)
              .toString();
          }
        }
      }
      lead++;
    }
    return [matrix, steps, obj, swaps];
  } catch (error) {
    console.log(error);
    return [[], [], [], []];
  }
};
const replaceMat = (mat = [], obj = {}) => {
  if (
    !Array.isArray(mat) ||
    !mat.length ||
    !mat[0].length ||
    typeof obj !== 'object'
  ) {
    return [[]];
  }

  // Clone the matrix to avoid mutating the original
  const matrix = mat.map((row) => [...row]);
  // Iterate over each key-value pair in the object
  Object.entries(obj).forEach(([key, value]) => {
    const indices = key.split('').map(Number); // Assuming the key format "i,j"

    // Validate the indices and update the matrix if valid
    if (
      indices.length === 2 &&
      indices[0] >= 0 &&
      indices[0] < matrix.length &&
      indices[1] >= 0 &&
      indices[1] < matrix[indices[0]].length
    ) {
      matrix[indices[0]][indices[1]] = value;
    }
  });

  return matrix;
};

const LUDecompositionCalculator = () => {
  const [row, setRow] = useLocalStorage('LUDecompositionCalculator_row', '4');
  const [column, setColumn] = useLocalStorage('LUDecompositionCalculator_column', '5');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('LUDecompositionCalculator_frstMatrix', [
    // ["1", "4", "-3"],
    // ["-2", "8", "5"],
    // ["3", "4", "7"],
    // ["1", "1", "1"],
    // ["1", "1", "2"],
    // ["3", "-5", "2"],
    // [0, -7, -2, 2],
    // [0, 5, 1, 0],
    // [6, -4, 0, -5],
    // [-9, 5, -5, 12],
    // [0, 2, 5, 6] ,[1 ,4, 5, -2], [5, 3, 0, 7]
    [2, 0, -1, 5, -2],
    [-4, 0, 0, -8, 1],
    [0, -5, -5, 1, 8],
    [-6, 0, 7, -3, 1],
    // [0, 5, 6, 8, 5],
    // [0, -3, 6, 4, 1],
    // [-2, 7, 3, 6, 4],
    // [11, 5, 0, 0, 7],
    // [0, 2, 5, 6],
    // [1, 4, 5, -2],
    // [5, 3, 0, 7],
  ]);
  const [equation, setEquation] = useLocalStorage('LUDecompositionCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('LUDecompositionCalculator_solution', '');
  const [result, setResult] = useLocalStorage('LUDecompositionCalculator_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('LUDecompositionCalculator_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('LUDecompositionCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('LUDecompositionCalculator_note', undefined);
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
          value: putSpace(`Find the LU decomposition of the given matrix A as`),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, row, column]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
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
    console.log(tempFirst, '++');
    const [rowEchelon, operationStep, obj, swaps] =
      findRowEchelonForm(tempFirst);
    const uMatrix = parseMatrixToLatex(rowEchelon);
    const uInDecimals = matrixInDecimals(rowEchelon);

    const identity = createIdentity(row);
    const l = replaceMat(identity, obj);
    const lMatrix = parseMatrixToLatex(l);
    const lInDecimals = matrixInDecimals(l);
    const tempL = JSON.parse(JSON.stringify(lMatrix));
    const p = createIdentity(row);

    swaps?.map((itm, i) => {
      let [a, b] = itm.split('');
      console.log(a, b, i, i != 0 && a != 0 && b != 0);
      if (a != 0 && b != 0) {
        [tempL[a], tempL[b]] = [tempL[b], tempL[a]];
        [lInDecimals[a], lInDecimals[b]] = [lInDecimals[b], lInDecimals[a]];
      }
      [p[a], p[b]] = [p[b], p[a]];
    });

    if (!uInDecimals || !l) return;
    const finalAnswer = [
      {
        value: `The LU decomposition of the given matrix is`,
        type: 'span',
      },
      {
        value: putSpace(
          `L = ${printMatrix(tempL)} or ${printMatrix(lInDecimals)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `U = ${printMatrix(uMatrix)} or ${printMatrix(uInDecimals)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`${swaps?.length ? ` and P=${printMatrix(p)}` : ''}`),
        type: `${swaps?.length ? 'equation' : 'span'}`,
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
        value: `LU decomposition for a matrix A is defined as the decomposition of a<br>
        matrix A into the product of two lower and upper triangular matrices<br>
         denoted as L and U.<br>A = LU`,
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
        value: `Given the number of rows of matrix A = ${row}`,
        type: 'span',
      },
      {
        value: putSpace(
          `Assume an Identity matrix of order ${row} as L \\& P = ${printMatrix(
            identity
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now we will find the row echelon form (ref) of the given matrix A`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Row echelon form of the matrix A will be considered as upper triangular matrix.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`So U = {${printMatrix(uMatrix)}}`),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/row-echelon-form-of-a-matrix/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see the Steps to calculate the Row Echelon Form, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `List of the row operations used to obtain above matrix U are`
        ),
        type: 'equation',
      },
      ...operationStep,
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now, we will replace the same position element in the matrix L with the `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `negative of the multiplier coefficient used in the row operations `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `L = {${printMatrix(lMatrix)}} ${
            swaps?.length ? ` and P=${printMatrix(identity)}` : ''
          }`
        ),
        type: 'equation',
      },
      ...swaps
        ?.map((itm, i) => {
          let [a, b] = itm.split('');
          if (i !== 0) [lMatrix[a], lMatrix[b]] = [lMatrix[b], lMatrix[a]];
          return [
            {
              value: putSpace(
                `Swap R_{${a}} ↔ R_{${b}} (consider elements below the diagonal for left matrix)`
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `L = {${printMatrix(lMatrix)}} ${
                  swaps?.length ? ` and P=${printMatrix(p)}` : ''
                }`
              ),
              type: 'equation',
            },
          ];
        })
        .flat(),
      {
        value: putSpace(`And we have obtained both matrices L and U.`),
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
  }, [frstMatrix, row, showSteps, column]);

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
    setColumn('2');
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
              <Input
                value={column}
                setVal={setColumn}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix: -</div>
          <div>
            {row > 0 && (
              <MatrixInput
                rows={row}
                columns={column}
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

export default LUDecompositionCalculator;
