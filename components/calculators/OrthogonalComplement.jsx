'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace } from '../../helpers/general';
import { getSearchParams } from '../../helpers/general';
import {
  printMatrix,
  transposeOfMatrix,
  convertFromLatex,
  convertIntoLatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';

const findNullVectors = (mat, mat2 = []) => {
  try {
    const matrix = JSON.parse(JSON.stringify(transposeOfMatrix(mat)));
    const matrix2 = JSON.parse(JSON.stringify(mat2));
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;
    for (let row = 0; row < numRows; row++) {
      if (lead >= numCols) {
        return [matrix, matrix2];
      }

      let i = row; //0
      while (matrix[i][lead] == 0) {
        i++;
        if (i == numRows) {
          i = row;
          lead++;
          if (lead == numCols) {
            return [matrix, matrix2];
          }
        }
      }

      [matrix[i], matrix[row]] = [matrix[row], matrix[i]];
      [matrix2[i], matrix2[row]] = [matrix2[row], matrix2[i]];

      let leadingCoefficient = matrix[row][lead];
      for (let k = 0; k < numRows; k++) {
        if (k > row) {
          const factor = matrix[k][lead];
          for (let j = 0; j < numCols; j++) {
            let res = algebrite
              .simplify(
                `${matrix[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            let res2 = algebrite
              .simplify(
                `${matrix2[row][j]} * (${factor})/(${leadingCoefficient})`
              )
              .toString();
            matrix[k][j] = algebrite
              .simplify(`${matrix[k][j]} - (${res})`)
              .toString();
            matrix2[k][j] = algebrite
              .simplify(`${matrix2[k][j]} - (${res2})`)
              .toString();
          }
        }
      }
      lead++;
    }
    return [matrix, matrix2];
  } catch (error) {
    console.log(error, mat, mat2);
    return [[], []];
  }
};
const createIdentityMatrix = (row) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? '1' : el)));
};
function parseMatrixToLatex(mat) {
  if (!mat.length) return null;
  if (!Array.isArray(mat)) mat = stringToArray(mat);
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) =>
    Array.isArray(itm) ? parseMatrixToLatex(itm) : convertIntoLatex(itm)
  );
}
const findNullSpace = (matrix) => {
  if (!matrix.length) return [];
  let row = matrix.length;
  let col = matrix?.[0]?.length;
  let identityMatrix = createIdentityMatrix(row >= col ? row : col);
  let [mat, nullSpace] = findNullVectors(matrix, identityMatrix);
  let zeroes =
    mat.map((itm, i) => {
      if (itm.every((el) => el == '0')) return i;
    }) || [];
  let final = nullSpace.filter((_, i) => zeroes.includes(i));
  if (final.length) return final;
  return identityMatrix.slice(0, 1).map((itm) => itm.map(() => '0'));
};
const OrthogonalComplement = () => {
  const [row, setRow] = useState('2');
  const [column, setColumn] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    ['1', '2', '3'],
    ['4', '1', '7'],
    ['0', '0', '0'],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const vectorsArr = Array.from({ length: row }, () => '');
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
          value: putSpace(
            `Find the orthogonal complement of the subspace spanned by the vectors `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `${frstMatrix.map(
              (itm, i) =>
                ` V_{${i + 1}} = ${printMatrix(itm.map((el) => [el]))}`
            )}`
          ),
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
          value: putSpace(
            `Given Vectors: ${frstMatrix.map(
              (itm) => `${printMatrix(itm.map((el) => [el]))}`
            )}`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix) || !column;
    if (isInvalid) return;

    const tempFirst = frstMatrix.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );
    const nullSpace = findNullSpace(tempFirst);
    const nullSpaceInKatex = parseMatrixToLatex(transposeOfMatrix(nullSpace));

    const finalAnswer = [
      {
        value: `The basis for the orthogonal complement is `,
        type: 'span',
      },
      {
        value: putSpace(
          `{${printMatrix(nullSpaceInKatex)}} or {${printMatrix(
            matrixInDecimals(transposeOfMatrix(nullSpace))
          )}}`
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
        value: `The orthogonal complement is defined as the subspace spanned by the set of all<br>
        vectors that are perpendicular to the vectors in that subspace and can be <br>
        found by identifying vectors that have a dot product of zero with all vectors<br>
         in the original subspace.`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `We need to find the nullspace of the ${printMatrix(frstMatrix)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Thus the basis of the null space is {${printMatrix(
            nullSpaceInKatex
          )}}`
        ),
        type: 'equation',
      },

      {
        value: `<a href="/calculator/null-space-or-kernel-or-nulity-calculator/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see Steps to find Null Space, click here </a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Hence, we have obtained orthogonal complement of the subspace spanned by the vectors.`
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
            <div className="col-5 text-left mb-2">Number of the Vectors:</div>
            <div className="col-5 mb-2">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={11}
                pattern={/^((\d)*)\d*$/}
                className="col-12"
              />
            </div>
            <div className="col-5 text-left">Size of the Vectors:</div>
            <div className="col-5">
              <Input
                value={column}
                setVal={setColumn}
                min={1}
                pattern={/^((\d)*)\d*$/}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-12 " />
          <div className="row">
            <div className="col-2">
              <table>
                <tbody>
                  {vectorsArr.map((_, i) => (
                    <tr key={i}>
                      <td className="customInputLabel">
                        <Equation
                          className="paddingZero overflow-hidden m-0"
                          equation={renderSteps([
                            {
                              value: `\\overrightarrow{V}_${i + 1} :`,
                              type: 'equation',
                            },
                          ])}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-10">
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

export default OrthogonalComplement;
