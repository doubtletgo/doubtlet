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
import { ExpressionParser, Expression } from '@yaffle/expression/index';
import {
  printMatrix,
  convertFromLatex,
  convertIntoLatex,
  matrixInDecimals,
  evalInDecimals,
  transposeOfMatrix,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import Vector from '../../helpers/Vectors';
import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';

const createDiagonal = (row, arr) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? arr[i] : el)));
};
function rootInLowest(value) {
  try {
    return algebrite
      .simplify(`sqrt(${value})`)
      .toString()
      .replaceAll('...', '');
  } catch {
    return '';
  }
}

function parseArrayToString(mat) {
  return `{${mat
    .map((itm) => `{${itm.toString()}}`)
    .toString()
    .replaceAll('...', '')}}`;
}
function parseValues(valueStr) {
  return valueStr.toString().split(',');
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
function stringToArray(str) {
  if (!str) return [];
  const rows = str.toString().split('},{');
  return parseArray(rows);
}
function transposeOfMat(str) {
  try {
    const matrix = ExpressionParser.parse(str).matrix;
    return matrix.transpose().toString();
  } catch {
    return [[]];
  }
}
function multiplyMats(a, b) {
  try {
    const matrix = ExpressionParser.parse(a).matrix;
    const matrix2 = ExpressionParser.parse(b).matrix;
    return matrix.multiply(matrix2).toString();
  } catch {
    return [[]];
  }
}
function multiplyWithScalar(a, scalar) {
  try {
    const parsed = stringToArray(a);
    const matrix = parsed.map((itm) =>
      itm.map((el) => algebrite.simplify(`(${scalar})*(${el})`).toString())
    );

    return parseArrayToString(matrix);
  } catch {
    return [[]];
  }
}

function eigen(mat) {
  try {
    const matrix = ExpressionParser.parse(mat).matrix;
    const eigenValues = Expression.getEigenvalues(matrix);
    const eigenVectors = Expression.getEigenvectors(matrix, eigenValues)
      .map((itm) => itm?.toString())
      .filter((itm) => !!itm);
    return [parseValues(eigenValues), parseArray(eigenVectors)];
  } catch {
    return ['', ''];
  }
}
const SingularValueDecomposition = () => {
  const [row, setRow] = useState('2');
  const [column, setColumn] = useState('2');
  const [frstMatrix, setFrstMatrix] = useState([
    ['5', '5'],
    ['-1', '7'],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
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
            `Find the Singular value decomposition (SVD) of the given matrix A as `
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
    const transposeInLatex = parseMatrixToLatex(transpose);
    const multiply = multiplyMats(arrAsString, transpose);
    const multiplyInLatex = parseMatrixToLatex(multiply);
    const [eigenValues, eigenVectors] = eigen(multiply);
    const obj = {};
    const vectorObj = {};
    eigenValues.map((el, i) => {
      obj[evalInDecimals(el)] = el;
      vectorObj[evalInDecimals(el)] = eigenVectors[i];
    });
    let tempRoots = Object.keys(obj)
      .reverse()
      .map((itm) => obj[itm]);
    let tempVectors = Object.keys(vectorObj)
      .reverse()
      .map((itm) => vectorObj[itm]);
    const roots = tempRoots.map((itm) => rootInLowest(itm));
    const uMatrix = createDiagonal(eigenValues.length, roots);
    const [x1, y1, z1 = '0'] = new Vector(tempVectors?.[0])._components;
    const uMatrices = tempVectors.map((itm) => new Vector(itm).unitVector());

    const mainUMatrix = transposeOfMatrix([
      ...uMatrices.map((itm) => itm._components),
    ]);
    const mainUInLatex = parseMatrixToLatex(mainUMatrix);
    const vMatrices = uMatrices.map((itm, i) => {
      let withScalar = multiplyWithScalar(transpose, `1/(${roots[i]})`);
      let multiplication = multiplyMats(
        withScalar,
        parseArrayToString(itm._components)
      );
      return multiplication;
    });
    const mainVMatrix = transposeOfMatrix([
      ...vMatrices.map((itm) => stringToArray(itm)),
    ]);
    const mainVInLatex = parseMatrixToLatex(mainVMatrix);
    const uInLatex = parseMatrixToLatex(uMatrix);
    if (!eigenValues || !eigenValues.length) return;
    const finalAnswer = [
      {
        value: `The SVD of the above given matrix is`,
        type: 'span',
      },
      {
        value: putSpace(
          `U = ${printMatrix(mainUInLatex)} or ${printMatrix(
            matrixInDecimals(mainUMatrix)
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\Sigma = ${printMatrix(uInLatex)} or ${printMatrix(
            matrixInDecimals(uMatrix)
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `V = ${printMatrix(mainVInLatex)} or ${printMatrix(
            matrixInDecimals(mainVMatrix)
          )}`
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
        value: `The Singular value decomposition (SVD) of the given matrix can be obtained<br>
         as the multiple of three matrices represented by the formula.`,
        type: 'span',
      },
      {
        value: putSpace(`A =  U\\cdot\\sigma\\cdot V^{T}`),
        type: 'equation',
      },
      {
        value: putSpace(`Where A is the given matrix of any order`),
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `First, we will find the Transpose of the given matrix A as`,
        type: 'span',
      },
      {
        value: putSpace(
          `A^{T} = {${printMatrix(frstMatrix)}}^T = ${printMatrix(
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
        value: `<b>Step-2</b>`,
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
          `W = A\\cdot A^{T} = ${printMatrix(frstMatrix)}\\cdot ${printMatrix(
            transposeInLatex
          )} = ${printMatrix(multiplyInLatex)} `
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
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now we will find the eigenvalues & eigenvectors related to <br>
        matrix W obtained in above step.`,
        type: 'span',
      },
      ...tempRoots.map((itm, i) => ({
        value: putSpace(
          `EigenValue (\\lambda_{${i + 1}}) = {${convertIntoLatex(
            itm
          )}}, Eigenvector = ${printMatrix(tempVectors[i].map((el) => [el]))}`
        ),
        type: 'equation',
      })),
      {
        value: `<a href = "/calculator/eigen-value-and-eigen-vector-calculator/?a=${frstMatrix}&b=${row}&c=${column}" target="_blank">to see the Steps for eigen values and eigen vectors , click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `<b>Step-4</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will find the square roots of the non-zero eigenvalues (\\sigma_i).`
        ),
        type: 'equation',
      },
      ...tempRoots.map((itm, i) => ({
        value: putSpace(
          `\\sigma_{${i + 1}} = \\sqrt{${convertIntoLatex(
            itm
          )}} = {${convertIntoLatex(roots[i]).replace('\\cdot', '')}}`
        ),
        type: 'equation',
      })),
      {
        value: putSpace(
          `Now we can generate the \\Sigma matrix which is a zero matrix with \\sigma_{i} on its diagonals.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\Sigma = ${printMatrix(uInLatex)}`),
        type: 'equation',
      },
      {
        value: `Step-5`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: `Now we can generate the U matrix which is made up of the<br>
         normalised unit vectors related to each eigenvector.`,
        type: 'span',
      },
      ...uMatrices.map((itm, i) => ({
        value: putSpace(`U_{${i + 1}}= ${itm.toArray()}`),
        type: 'equation',
      })),
      {
        value: putSpace(`U = ${printMatrix(mainUInLatex)}`),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/unit-vector-calculator/?x1=${x1}&y1=${y1}&z1=${z1}" target="_blank">to see the Steps to find unit vector , click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Step-6`,
        type: 'h6',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(
          `Now we can generate the V matrix by using the given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `V_i = \\frac{1}{\\sigma_i}{${printMatrix(frstMatrix)}}^T \\cdot U_i`
        ),
        type: 'equation',
      },
      ...vMatrices
        .map((itm, i) => {
          const stepWithAnchor = [
            {
              value: putSpace(
                `V_{${i + 1}} = \\frac{1}{${convertIntoLatex(
                  roots[i]
                )}}{${printMatrix(frstMatrix)}}^T \\cdot {${uMatrices[
                  i
                ].toArray()}} = ${printMatrix(parseMatrixToLatex(itm))}`
              ),
              type: 'equation',
            },
          ];
          if (i == 0)
            stepWithAnchor.push({
              value: `<a href = "/calculator/matrix-scalar-multiplication/?a=${transposeInLatex}&b=${row}&c=${column}&d=1/(${roots[i]})" target="_blank">to see the Steps to find the matrix scalar multiplication , click here</a>`,
              type: 'h6',
              className: 'text-decoration-underline',
            });
          else
            stepWithAnchor.push({
              value: `<a href = "/calculator/matrix-multiplication/?a=${transposeInLatex}&b=${parseMatrixToLatex(
                itm
              )}&c=${row}&d=${column}&e=${row}" target="_blank">to see the Steps for matrix multiplicatoin, click here</a>`,
              type: 'h6',
              className: 'text-decoration-underline',
            });
          return stepWithAnchor;
        })
        .flat(),
      {
        value: putSpace(`Therefore V = {${printMatrix(mainVInLatex)}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Hence, the obtained matrices U, Σ and V are such that the A = U.Σ.V^T`
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

export default SingularValueDecomposition;
