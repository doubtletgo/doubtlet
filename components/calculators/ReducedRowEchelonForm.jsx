'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  valueToKatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);

const findRowEchelonForm = (mat) => {
  try {
    const matrix = JSON.parse(JSON.stringify(mat));
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;
    for (let row = 0; row < numRows; row++) {
      if (lead >= numCols) {
        return matrix;
      }

      let i = row; //0
      while (matrix[i][lead] == 0) {
        i++;
        if (i == numRows) {
          i = row;
          lead++;
          if (lead == numCols) {
            return matrix;
          }
        }
      }

      [matrix[i], matrix[row]] = [matrix[row], matrix[i]];

      let leadingCoefficient = matrix[row][lead];
      for (let k = 0; k < numRows; k++) {
        if (k !== row && k > row) {
          const factor = matrix[k][lead];
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
    return matrix;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
function makePivotElementsOne(mat) {
  let matrix = JSON.parse(JSON.stringify(mat));
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const oneStep = [];
  try {
    let row = 0;
    if (matrix[0][0] == '1') {
      row = 1;
      oneStep.push(
        {
          value: putSpace(`Checking the pivot element in row 1`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Since a_{11} ≠ 0 , hence it is a pivot element in row 1`
          ),
          type: 'equation',
        }
      );
    }
    for (row; row < numRows; row++) {
      oneStep.push({
        value: putSpace(`Now, checking the pivot element in row ${row + 1}`),
        type: 'equation',
      });

      let pivotFound = false;
      for (let col = 0; col < numCols; col++) {
        if (matrix[row][col] != 0) {
          if (matrix[row][col] == 1) {
            if (!pivotFound)
              oneStep.push({
                value: putSpace(
                  `Since a_{${row + 1}${
                    col + 1
                  }} ≠ 0,hence it is a pivot element in row ${row + 1}`
                ),
                type: 'equation',
              });

            pivotFound = true;
          }
          if (!pivotFound) {
            const pivotValue = matrix[row][col];
            oneStep.push(
              {
                value: putSpace(
                  `Since a_{${row + 1}${
                    col + 1
                  }} ≠ 0 hence it is a pivot element in row ${row + 1} `
                ),
                type: 'equation',
              },
              {
                value: putSpace(
                  `then \\bold{R_{${row + 1}} → (\\frac{1}{${valueToKatex(
                    pivotValue
                  )}}).R_{${row + 1}}}`
                ),
                type: 'equation',
              }
            );
            // Make the first non-zero element in the row the pivot

            for (let j = 0; j < numCols; j++) {
              matrix[row][j] = math
                .simplify(`(${matrix[row][j]})/ (${pivotValue})`)
                .toString();
            }

            oneStep.push({
              value: putSpace(
                `Now the obtained matrix is  ${printMatrix(
                  simpleArrToKatexArr(matrix)
                )}`
              ),
              type: 'equation',
            });
            pivotFound = true;
          }
        } else {
          oneStep.push({
            value: putSpace(
              `Since a_{${row + 1}${
                col + 1
              }} = 0 , hence it is not a pivot element in row ${row + 1}.`
            ),
            type: 'equation',
          });
          if (col + 1 != numCols) {
            oneStep.push({
              value: putSpace(
                `Then move to the next element in row ${row + 1}`
              ),
              type: 'equation',
            });
          }
        }

        if (row + 1 == numRows && col + 1 == numCols) {
          oneStep.push({
            value: `As we can see there exists no such entry further.`,
            type: 'span',
          });
        }
      }
    }
    return [matrix, oneStep];
  } catch (err) {
    console.log(err.message);
    return [[], []];
  }
}
function makeUpperTriangularZero(mat) {
  const matrix = JSON.parse(JSON.stringify(mat));
  const numRows = matrix.length;
  const numCols = matrix[0]?.length;
  const steps = [];
  try {
    for (let row = 0; row < numRows; row++) {
      steps.push({
        value: putSpace(
          `${row == 0 ? '' : 'Now ,'}Considering the row ${row + 1}`
        ),
        type: 'equation',
      });
      if (row + 1 == numRows) {
        steps.push({
          value: putSpace(`We will not apply any operation in the last row.`),
          type: 'equation',
        });
        break;
      }
      for (let col = row + 1; col < numCols; col++) {
        if (matrix[row][col] != 0) {
          steps.push(
            {
              value: putSpace(
                `Since a_{${row + 1}${
                  col + 1
                }}  ≠ 0 ,we will check the first non-zero element in column ${
                  col + 1
                } `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `below a_{${row + 1}${
                  col + 1
                }}, which has all zero elements to the left of it.`
              ),
              type: 'equation',
            }
          );
          // Find the first non-zero element in column 'col' below the current element
          let nonZeroRow = -1;
          for (let i = row + 1; i < numRows; i++) {
            if (matrix[i][col] == 1) {
              let leftZero = true;
              for (let j = 0; j < col; j++) {
                if (matrix[i][j] != 0) {
                  leftZero = false;
                  break;
                }
              }
              if (leftZero) {
                nonZeroRow = i;
                break;
              }
            }
          }

          if (nonZeroRow != -1) {
            steps.push({
              value: putSpace(
                `As we can see, there exists such an element in row ${
                  nonZeroRow + 1
                } below a_{${row + 1}${col + 1}}`
              ),
              type: 'equation',
            });
            // Subtract a multiple of the row 'nonZeroRow' from the current row to make the element zero

            const lead = matrix[row][col];
            for (let j = col; j < numCols; j++) {
              let subtract = math.simplify(
                `${lead} * (${matrix[nonZeroRow][j]})`
              );
              matrix[row][j] = math
                .simplify(`${matrix[row][j]} -1*(${subtract})`)
                .toString();
            }

            steps.push(
              {
                value: putSpace(
                  `then \\bold{R_{${row + 1}} → R_{${
                    row + 1
                  }} - (\\frac{${valueToKatex(lead)}}{${
                    matrix[nonZeroRow][col]
                  }}).R_{${nonZeroRow + 1}}} `
                ),
                type: 'equation',
              },
              {
                value: putSpace(
                  `Now the obtained matrix is ${printMatrix(
                    simpleArrToKatexArr(matrix)
                  )}`
                ),
                type: 'equation',
              }
            );

            if (col + 1 != numCols)
              steps.push({
                value: putSpace(`Move to next column in row ${row + 1}. `),
                type: 'equation',
              });
          } else {
            steps.push({
              value: putSpace(`There is no such entry exists in the column.`),
              type: 'equation',
            });
            if (col + 1 != numCols)
              steps.push({
                value: putSpace(`Move to next column in row ${row + 1}. `),
                type: 'equation',
              });
          }
        }
      }
    }
    return [matrix, steps];
  } catch (err) {
    console.log(err.message);
    return [[], []];
  }
}
const ReducedRowEchelonForm = () => {
  const [row, setRow] = useState('2');
  const [column, setColumn] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    [1, 5, 1],
    [2, 11, 5],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      let arr = vals.a.split(',');
      setRow(b);
      let temp = listToMatrix(arr, vals.c);
      setColumn(vals.c);
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
          value: `<span>Question</span>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Reduced Row echelon form (ref) of the Matrix given as`
          ),
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
          value: `<span> Formatted User input Display</span>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Given Matrix : ${printMatrix(frstMatrix)}`),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !column || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const simpleMatrix = katexArrToSimpleArr(frstMatrix);
    const echelonForm = findRowEchelonForm(simpleMatrix);

    const [diagonalOne, oneSteps = []] = makePivotElementsOne(echelonForm);
    const echelonKatexArr = simpleArrToKatexArr(echelonForm);
    const [upperMatrix, upperSteps] = makeUpperTriangularZero(diagonalOne);
    const finalMat = simpleArrToKatexArr(upperMatrix);
    if (finalMat) setShowResult(true);
    const finalAnswer = [
      {
        value: `The Reduced row echelon form (rref) of the given matrix is`,
        type: 'span',
      },
      {
        value: `${printMatrix(finalMat)} \\space or \\space ${printMatrix(
          matrixInDecimals(finalMat)
        )}`,
        type: 'equation',
      },
    ];

    const equations = [
      {
        type: 'span',
        value: `<span>Answer</span>`,
      },
      'br',
      ...finalAnswer,
    ];

    const eqRender = renderSteps(equations);
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<span>Step By Step Solution :-</span>`,
        type: 'span',
      },
      'br',
      {
        value: `The reduced row echelon form a matrix is obtained by applying<br/> series of row or column operation on the given matrix.It is used<br/> to find the inverse of a matrix and to solve system of linear equations.`,
        type: 'span',
      },
      {
        value: `<span>Step-1</span>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: 'First, we will find the row echelon form of the given matrix.',
        type: 'span',
      },
      {
        value: putSpace(
          `The Row Echelon Form = ${printMatrix(echelonKatexArr)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/row-echelon-form-of-a-matrix/?a=${frstMatrix}&span=${row}&c=${column}"  target="_blank">to see the Steps to calculate the Row Echelon Form, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: 'Step-2',
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: 'We will make all the pivot elements value equal to 1.',
        type: 'span',
      },
      ...oneSteps,
      {
        value: '<span>Step-3</span>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we will make all the upper triangular elements equal to 0.`,
        type: 'span',
      },
      {
        value: putSpace(
          `The obtained matrix is ${printMatrix(
            simpleArrToKatexArr(diagonalOne)
          )}`
        ),
        type: 'equation',
      },
      ...upperSteps,
      {
        value: `Since matrix obtained in the above step satisfies all the necessary</br> conditions  for reduced row echelon form of a matrix.`,
        type: 'span',
      },

      'hr',
      {
        value: `<span>Final Answer</span>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [frstMatrix, row, column, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(() => setShowSteps(true), [setShowSteps]);

  const clear = useCallback(() => {
    setFrstMatrix([
      ['', ''],
      ['', ''],
    ]);
    setRow('2');
    setColumn('2');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = !!row && !!column && isMatValid(frstMatrix);

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
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Size of the matrix:</div>
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
                value={frstMatrix}
                rows={row}
                columns={column}
                className="col-6"
                onUpdate={setFrstMatrix}
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

export default ReducedRowEchelonForm;
