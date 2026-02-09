'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, pluralise, putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  valueToKatex,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import { create, all } from 'mathjs';
import AdComponent from '../AdSense';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';

const config = {};
const math = create(all, config);
const RowEchelonForm = () => {
  const [row, setRow] = useLocalStorage('RowEchelonForm_row', '3');
  const [column, setColumn] = useLocalStorage('RowEchelonForm_column', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('RowEchelonForm_frstMatrix', [
    [0, 1, 2],
    [-4, 6, 7],
    [2, 8, 9],
  ]);
  const [equation, setEquation] = useLocalStorage('RowEchelonForm_equation', '');
  const [solution, setSolution] = useLocalStorage('RowEchelonForm_solution', '');
  const [answer, setAnswer] = useLocalStorage('RowEchelonForm_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('RowEchelonForm_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RowEchelonForm_showSteps', true);
  const [note, setNote] = useLocalStorage('RowEchelonForm_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      let arr = vals.a.split(',');
      let temp = listToMatrix(arr, vals.c);
      setRow(b);
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
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Row echelon form (ref) of the Matrix given as`
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
          value: `<b>Formatted User Input Display</b>`,
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
    const rowSteps = [];
    const stepByStep = [];

    function findRowEchelonForm(mat) {
      try {
        const matrix = JSON.parse(JSON.stringify(mat));
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        let lead = 0;
        let done = true;
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
          done = false;
        }
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
          if (i > row) {
            let swapStep = [
              {
                value: putSpace(
                  `Since the first non-zero element is present in ${pluralise(
                    i + 1
                  )} row i.e.  a_{${i + 1}${lead + 1}} = ${valueToKatex(
                    matrix[row][lead]
                  )} ≠ 0`
                ),
                type: 'equation',
              },
              {
                value: putSpace(
                  `So, swap \\bold{R_{${row + 1}} ↔ R_{${i + 1}}}`
                ),
                type: 'equation',
              },
              {
                value: putSpace(
                  `So, the new obtained matrix is ${printMatrix(
                    simpleArrToKatexArr(matrix)
                  )}`
                ),
                type: 'equation',
              },
            ];
            if (done) rowSteps.push(...swapStep);
            else stepByStep.push(...swapStep);
            done = true;
          }
          let leadingCoefficient = matrix[row][lead];
          for (let k = 0; k < numRows; k++) {
            if (k !== row && k > row) {
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
              operationStep.push({
                value: putSpace(
                  `Perform Row Operation : \\bold{R_{${k + 1}} → R_{${
                    k + 1
                  }} - (\\frac{${valueToKatex(factor)}}{${valueToKatex(
                    leadingCoefficient
                  )}})R_{${row + 1}} = ${printMatrix(
                    simpleArrToKatexArr(matrix)
                  )}}`
                ),
                type: 'equation',
              });
              if (factor == 0) continue;
              rowSteps.push(...operationStep);
            }
          }
          lead++;
        }

        return matrix;
      } catch (error) {
        console.log(error.message);
        return null;
      }
    }

    const simpleMatrix = katexArrToSimpleArr(frstMatrix);
    const echelonForm = findRowEchelonForm(simpleMatrix);
    const oneNonZero = frstMatrix.every((val) => val.some((i) => i != '0'));
    const echelonKatexArr = simpleArrToKatexArr(echelonForm);

    const finalAnswer = [
      {
        value: putSpace(
          `The row echelon form (ref) of the given matrix  ${printMatrix(
            frstMatrix
          )}  is ${printMatrix(echelonKatexArr)}`
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
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The row echelon form a matrix is obtained by applying series `,
        type: 'span',
      },
      {
        value: putSpace(
          `of row or column operation on the given matrix. It is used to find`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the inverse of a matrix and to solve system of linear equations.`
        ),
        type: 'equation',
      },
      ...stepByStep,
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value:
          echelonForm?.[0]?.[0] == '0'
            ? ` `
            : putSpace(
                `Since Pivot element a_{11} = ${valueToKatex(
                  echelonForm?.[0]?.[0]
                )} ≠ 0 so there is no need to interchange 1st row.`
              ),
        type: echelonForm?.[0]?.[0] == '0' ? 'span' : 'equation',
      },
      {
        value: oneNonZero
          ? `Since all rows contains at least one non zero element so no need <br>to interchange any row.`
          : '',
        type: 'span',
      },
      ...rowSteps,
      {
        value: `Since matrix obtained in the above step satisfies all the necessary conditions </br> for row echelon form of a matrix.`,
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
  }, [frstMatrix, row, column, showSteps]);

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
    setColumn('2');
    setShowResult(false);
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

export default RowEchelonForm;
