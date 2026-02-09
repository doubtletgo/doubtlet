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
import { ExpressionParser } from '@yaffle/expression/index';
import {
  printMatrix,
  convertFromLatex,
  convertIntoLatex,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

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
function transposeOfMat(str) {
  try {
    var matrix = ExpressionParser.parse(str).matrix;
    return matrix.transpose().toString();
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}
function inverseOfMat(str) {
  try {
    var matrix = ExpressionParser.parse(str).matrix;
    return matrix.inverse().toString();
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}
function multiplyMats(a, b) {
  try {
    var matrix = ExpressionParser.parse(a).matrix;
    var matrix2 = ExpressionParser.parse(b).matrix;
    return matrix.multiply(matrix2).toString();
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}

function stringToArray(str) {
  if (!str) return [];
  const rows = str.toString().split('},{');
  return parseArray(rows);
}

const MoorePenroseInverse = () => {
  const [row, setRow] = useLocalStorage('MoorePenroseInverse_row', '2');
  const [column, setColumn] = useLocalStorage('MoorePenroseInverse_column', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MoorePenroseInverse_frstMatrix', [
    ['1', '2', '3'],
    ['4', '1', '7'],
  ]);
  const [equation, setEquation] = useLocalStorage('MoorePenroseInverse_equation', '');
  const [solution, setSolution] = useLocalStorage('MoorePenroseInverse_solution', '');
  const [result, setResult] = useLocalStorage('MoorePenroseInverse_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MoorePenroseInverse_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MoorePenroseInverse_showSteps', true);
  const [note, setNote] = useLocalStorage('MoorePenroseInverse_note', undefined);
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
            `Find the Moore-Penrose inverse or Pseudoinverse of the given matrix A as `
          ),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
          type: 'equation',
        },
      ])
    );
  }, [JSON.stringify(frstMatrix.flat()), row, column]);

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
    const arrAsString = parseArrayToString(tempFirst);
    const transpose = transposeOfMat(arrAsString);
    const multiply = multiplyMats(arrAsString, transpose);
    const inverse = inverseOfMat(multiply);
    const finalMultiply = multiplyMats(transpose, inverse);
    const transposeInLatex = parseMatrixToLatex(transpose);
    const inverseInKatex = parseMatrixToLatex(inverse);
    const multiplyInKatex = parseMatrixToLatex(multiply);
    const finalInKatex = parseMatrixToLatex(finalMultiply);
    const finalInDecimals = matrixInDecimals(stringToArray(finalMultiply));
    if (!transpose.length) return;

    const finalAnswer = [
      {
        value: `The Pseudoinverse of the above given matrix is`,
        type: 'span',
      },
      {
        value: putSpace(
          `{${printMatrix(frstMatrix)}}^{+}= ${printMatrix(
            finalInKatex
          )} or ${printMatrix(finalInDecimals)}`
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
        value: `The Moore-Penrose inverse or pseudoinverse of a matrix can be <br>
        obtained by using the given formula.`,
        type: 'span',
      },
      {
        value: putSpace(`A^{+} = A^{T}\\cdot {\\left(AA^{T} \\right)}^{-1}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where A^{+} represents the Pseudoinverse of a matrix.`
        ),
        type: 'equation',
      },
      {
        value: '<b>Step-1</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `First, we will find the Transpose of the given matrix A as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A^{T} = {${printMatrix(frstMatrix)}}^{T} = ${printMatrix(
            transposeInLatex
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/transpose-of-a-matrix/?a=${frstMatrix}&b=${row}&c=${column}" target="_blank">to see the Steps for transpose of matrix, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: '<b>Step-2</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will multiply the original matrix by its transpose.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A\\cdot A^{T} = ${printMatrix(frstMatrix)}\\cdot ${printMatrix(
            transposeInLatex
          )} =${printMatrix(multiplyInKatex)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/matrix-multiplication/?a=${frstMatrix}&b=${transposeInLatex}&c=${row}&d=${column}&e=${row}" target="_blank">to see the Steps for matrix multiplicatoin, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: '<b>Step-3</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will find the inverse of matrix obtained in above step.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{\\left(AA^{T} \\right)}^{-1} = {${printMatrix(
            multiplyInKatex
          )}}^{-1}= ${printMatrix(inverseInKatex)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/inverse-of-a-matrix/?a=${multiplyInKatex}&b=${row}&c=${row}" target="_blank">to see the Steps for inverse of matrix, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: '<b>Step-4</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will finally multiply the matrices obtained in step 1 and 3.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A^{+} = A^{T}\\cdot{\\left(AA^{T} \\right)}^{-1} =${printMatrix(
            transposeInLatex
          )} \\cdot ${printMatrix(inverseInKatex)}= ${printMatrix(
            finalInKatex
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/matrix-multiplication/?a=${transposeInLatex}&b=${inverseInKatex}&c=${column}&d=${row}&e=${row}" target="_blank">to see the Steps for matrix multiplicatoin, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Hence, we have obtained the Pseudoinverse of the given matrix.`
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

export default MoorePenroseInverse;
