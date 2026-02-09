'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { pluralise, putSpace } from '../../helpers/general';
import { create, all } from 'mathjs';
import { getSearchParams } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  valueToKatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);
const addVerticalLine = (mat, row) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) => {
    return [
      ...itm.slice(0, itm.length - row),
      '|',
      ...itm.slice(itm.length - row),
    ];
  });
};

const printBoth = (mat1 = [], mat2 = []) => {
  if (!mat1.length || !mat2.length) return '';
  let index = mat1.length;
  const resultMat = mat1.map((itm, i) => [...itm, ...mat2[i]]);
  const result = addVerticalLine(resultMat, index);
  const resultInKatex = simpleArrToKatexArr(result);
  return printMatrix(resultInKatex);
};

function matrixToRowEchelon(mat, mat2) {
  const matrix = JSON.parse(JSON.stringify(mat));
  const matrix2 = JSON.parse(JSON.stringify(mat2));
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const stepByStep = [];
  try {
    let lead = 0; // The leading entry in each row
    if (matrix[0][0] == 0) {
      stepByStep.push(
        ...[
          {
            value: putSpace(
              `Since pivot element a_{11} = 0, so first we need to swap 1st row`
            ),
            type: 'equation',
          },
          {
            value: `First find the first non-zero element in column 1 under pivot element`,
            type: 'span',
          },
        ]
      );
    }

    for (let row = 0; row < numRows; row++) {
      if (numCols <= lead) {
        return [stepByStep, matrix, matrix2];
      }

      let i = row;

      while (matrix[i][lead] == 0) {
        i++;

        if (row == i) {
          i = row;
          lead++;

          if (numCols == lead) {
            return [stepByStep, matrix, matrix2];
          }
        }
      }

      [matrix[i], matrix[row]] = [matrix[row], matrix[i]];
      [matrix2[i], matrix2[row]] = [matrix2[row], matrix2[i]];
      if (i > row) {
        let swapStep = [
          {
            value: putSpace(
              `First non-zero element is present in ${pluralise(i + 1)} row`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `So, we need to swap the rows \\bold{R_{${row + 1}} ↔ R_{${
                i + 1
              }}}`
            ),
            type: 'equation',
          },
          {
            value: putSpace(`Obtained matrix is ${printBoth(matrix, matrix2)}`),
            type: 'equation',
          },
        ];
        stepByStep.push(...swapStep);
      }

      // Scale the pivot row to have a leading 1

      const pivot = matrix[row][lead];
      stepByStep.push(
        {
          value: putSpace(
            `Since a_{${row + 1}${lead + 1}}=${valueToKatex(
              matrix[row][lead]
            )}  ≠ 0 `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Hence a_{${row + 1}${lead + 1}} is a pivot element in row ${
              row + 1
            }`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Since a_{${row + 1}${lead + 1}}=${valueToKatex(
              matrix[row][lead]
            )}  ≠ 1 `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Perform Row Opertaion: \\bold{R_{${
              row + 1
            }} → (\\frac{1}{${valueToKatex(pivot)}}).R_{${lead + 1}}}`
          ),
          type: 'equation',
        }
      );
      for (let col = 0; col < numCols; col++) {
        matrix[row][col] = math
          .simplify(`(${matrix[row][col]})/ (${pivot})`)
          .toString();
        matrix2[row][col] = math
          .simplify(`(${matrix2[row][col]})/ (${pivot})`)
          .toString();
      }
      stepByStep.push({
        value: putSpace(
          `Now the obtained matrix is  ${printBoth(matrix, matrix2)}`
        ),
        type: 'equation',
      });
      // Eliminate other entries in the current column

      let leadingCoefficient = matrix[row][lead];
      for (let k = 0; k < numRows; k++) {
        if (k != row && k > row) {
          const factor = matrix[k][lead];
          const operationStep = [
            {
              value: putSpace(
                `Now we need to check the value of a_{${k + 1}${
                  lead + 1
                }} = ${valueToKatex(factor)} ≠ 0,`
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `So we need to apply row operation to R_{${
                  k + 1
                }} to make it zero.`
              ),
              type: 'equation',
            },
          ];
          for (let j = 0; j < numCols; j++) {
            let res = math
              .simplify(
                `${matrix[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            let res2 = math
              .simplify(
                `${matrix2[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            matrix[k][j] = math
              .simplify(`${matrix[k][j]} - (${res})`)
              .toString();

            matrix2[k][j] = math
              .simplify(`${matrix2[k][j]} - (${res2})`)
              .toString();
          }
          operationStep.push({
            value: putSpace(
              `Perform Row Operation : \\bold{R_{${k + 1}} → R_{${
                k + 1
              }} - (\\frac{${valueToKatex(factor)}}{${valueToKatex(
                leadingCoefficient
              )}})R_{${row + 1}} = ${printBoth(matrix, matrix2)}}`
            ),
            type: 'equation',
          });
          if (factor == 0) continue;
          stepByStep.push(...operationStep);
        }
      }

      lead++;
    }
    return [stepByStep, matrix, matrix2];
  } catch (error) {
    console.log(error);
    return [[], [], []];
  }
}

function makeUpperTriangularZero(mat, mat2) {
  const matrix = JSON.parse(JSON.stringify(mat));
  const matrix2 = JSON.parse(JSON.stringify(mat2));
  const numRows = matrix.length;
  const numCols = matrix[0]?.length;
  const steps = [];
  try {
    for (let row = 0; row < numRows; row++) {
      steps.push({
        value: putSpace(`${row == 0 ? '' : 'Now ,'}Checking in row ${row + 1}`),
        type: 'equation',
      });
      if (row + 1 == numRows) {
        steps.push({
          value: putSpace(`No further such elements exist.`),
          type: 'equation',
        });
        break;
      }
      for (let col = row + 1; col < numCols; col++) {
        if (matrix[row][col] != 0) {
          steps.push({
            value: putSpace(
              `Since a_{${row + 1}${col + 1}} = ${valueToKatex(
                matrix[row][col]
              )}  ≠ 0  `
            ),
            type: 'equation',
          });
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
            const lead = matrix[row][col];
            for (let j = 0; j < numCols; j++) {
              let subtract = math.simplify(
                `${lead} * (${matrix[nonZeroRow][j]})`
              );
              let subtract2 = math.simplify(
                `${lead} * (${matrix2[nonZeroRow][j]})`
              );
              matrix[row][j] = math
                .simplify(`${matrix[row][j]} -1*(${subtract})`)
                .toString();
              matrix2[row][j] = math
                .simplify(`${matrix2[row][j]} -1*(${subtract2})`)
                .toString();
            }

            steps.push(
              {
                value: putSpace(
                  `Perform Row operation : \\bold{R_{${row + 1}} → R_{${
                    row + 1
                  }} - (\\frac{${valueToKatex(lead)}}{${
                    matrix[nonZeroRow][col]
                  }}).R_{${nonZeroRow + 1}}} `
                ),
                type: 'equation',
              },
              {
                value: putSpace(
                  `Now the obtained matrix is ${printBoth(matrix, matrix2)}`
                ),
                type: 'equation',
              }
            );
          }
        }
      }
    }
    return [steps, matrix, matrix2];
  } catch (err) {
    console.log(err.message);
    return [[], [], []];
  }
}
const TransitionMatrix = () => {
  const [row, setRow] = useLocalStorage('TransitionMatrix_row', '2');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('TransitionMatrix_frstMatrix', [
    ['-3', '4'],
    ['2', '-2'],
  ]);
  const [scndMatrix, setScndMatrix] = useLocalStorage('TransitionMatrix_scndMatrix', [
    ['0', '2'],
    ['3', '-2'],
  ]);
  const [equation, setEquation] = useLocalStorage('TransitionMatrix_equation', '');
  const [solution, setSolution] = useLocalStorage('TransitionMatrix_solution', '');
  const [result, setResult] = useLocalStorage('TransitionMatrix_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('TransitionMatrix_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('TransitionMatrix_showSteps', true);
  const [note, setNote] = useLocalStorage('TransitionMatrix_note', undefined);

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
      if (i % elementsPerSubArray == 0) {
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
          value: putSpace(
            `Find the transition matrix from the basis ${printMatrix(
              frstMatrix
            )} to the basis ${printMatrix(scndMatrix)}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, scndMatrix, row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `First\\space Matrix:\\space  ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
        {
          value: `Second\\space Matrix:\\space  ${printMatrix(scndMatrix)}`,
          type: 'equation',
        },
      ])
    );

    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const simpleFirst = katexArrToSimpleArr(frstMatrix);
    const simpleScnd = katexArrToSimpleArr(scndMatrix);

    const [reduceSteps, first, scnd] = matrixToRowEchelon(
      simpleScnd,
      simpleFirst
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [oneSteps, _, finalScnd] = makeUpperTriangularZero(first, scnd);

    const finalAnswer = [
      {
        value: putSpace(
          `The Transition matrix is ${printMatrix(
            simpleArrToKatexArr(finalScnd)
          )} or  ${printMatrix(matrixInDecimals(finalScnd))}`
        ),
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
        value: `A transition matrix is a square matrix used in the context of Markov chains<br>and stochastic processes. It describes the probabilities of transitioning<br>from one state to another in a system over a certain period of time<br> or number of steps.`,
        type: 'span',
      },
      'br',
      {
        value: `We will make an Augmented matrix of the Second bases with the first bases.`,
        type: 'span',
      },
      {
        value: putSpace(
          `Augmented Matrix A = ${printBoth(simpleScnd, simpleFirst)} `
        ),
        type: 'equation',
      },
      {
        value: `Now, we will make the first bases matrix to an Identity matrix by applying<br>some row transformations.`,
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
        value: `First we will make all the pivot elements one`,
        type: 'span',
      },
      ...reduceSteps,
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: 'Now we will make all the all elements above diagonal to zero.',
        type: 'span',
      },
      ...oneSteps,
      {
        value: `Since the left matrix obtained in the above step is an Identity matrix.We are done.`,
        type: 'span',
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
  }, [frstMatrix, row, showSteps, scndMatrix]);

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
    setScndMatrix([
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
          <div className="col-3 text-left">First Matrix: -</div>
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
          <div className="col-3 text-left">Second Matrix: -</div>
          <div>
            {row > 0 && (
              <MatrixInput
                rows={row}
                columns={row}
                className="col-6"
                onUpdate={setScndMatrix}
                value={scndMatrix}
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

export default TransitionMatrix;
