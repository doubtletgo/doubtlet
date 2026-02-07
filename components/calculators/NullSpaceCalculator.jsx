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
  findRowEchelonForm,
  makePivotElementsOne,
  makeUpperTriangularZero,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  transposeOfMatrix,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);

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
        }
      }
      lead++;
    }
    return [matrix, matrix2];
  } catch {
    return [[], []];
  }
};
const createIdentityMatrix = (row) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? '1' : el)));
};
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
/**
 * @param {Array<Array<string>>} A  - The input matrix A with all values as strings
 * @returns {boolean} - Whether all the cell values are zero
 */
const isAllCellZero = (matrix) => {
  if (!Array.isArray(matrix)) return null;
  return matrix.every((row) => row.every((cell) => cell == '0'));
};

/**
 * Function to assign variables in terms of t, s etch
 * @param {Array<Array<string>>} A - The input matrix A with all values as strings
 * @returns {Array<string>} - The System of variable equations in string format
 */

const assignVariables = (mat) => {
  try {
    let matrix = mat;

    const variableNames = ['t', 's', 'u', 'v', 'w', 'x', 'y', 'z'];
    const equationInTermsOfVariableNames = {};
    const vectors = { t: [], s: [], s: [], v: [], w: [], x: [], y: [], z: [] };
    let assumed = {};
    const areAllcellZero = isAllCellZero(matrix);
    if (areAllcellZero) {
      for (let i = 0; i < matrix[0].length; i++) {
        assumed[`x_{${i + 1}}`] = variableNames[i];
      }
      return { assumed, evaluated: equationInTermsOfVariableNames };
    }
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    for (let row = 0; row < numRows; row++) {
      let isFirstNonZeroProcessed = false; //To Check for lhs and rhs variables
      let currentIndexForVariableNames = 0; //Index to keep track of variable names
      //To store rhs and lhs of equation for a row
      let equationForRow = {
        lhs: ``,
        rhs: ``,
      };
      //If a row has all zero cells then skip this row
      const isAllCellZeroInRow = matrix[row].every((cell) => cell == 0);
      if (isAllCellZeroInRow) continue;
      for (let col = 0; col < numCols; col++) {
        //Current value of the cell
        let currentCellValue = matrix[row][col];
        let x_Variable = `x_{${col + 1}}`;
        if (currentCellValue != 0 && !isFirstNonZeroProcessed) {
          //1.Check the Current Column Index and assign the varaibe like x_{n}
          equationForRow.lhs = x_Variable;
          //2 Set the isFirstNoZero To false
          isFirstNonZeroProcessed = true;
        } else if (currentCellValue != 0 && isFirstNonZeroProcessed) {
          //1.Check for the current sign and revert it
          let sign = currentCellValue.toString().startsWith('-')
            ? equationForRow.rhs
              ? '+'
              : ''
            : '-';
          //2. Remove the sign from the current value and reaasign the value
          currentCellValue = currentCellValue.toString().replace('-', '');
          currentCellValue = currentCellValue == 1 ? '' : currentCellValue;
          //3. Get the current available variable name and create term with this
          let currentVariableName = variableNames[currentIndexForVariableNames];
          vectors[`${currentVariableName}`]?.push(`${sign}${currentCellValue}`);
          let termWithVariableName =
            sign +
            convertIntoLatex(`${currentCellValue}`) +
            currentVariableName;
          //4. Append the term variable to the rhs
          equationForRow.rhs += termWithVariableName;
          //5. Store the variable name and variable to the assumed object
          assumed[`${x_Variable}`] = currentVariableName;
          //6. Increment the variable name index by 1
          currentIndexForVariableNames++;
        }
      }
      //Add equation for the current row into the equation object
      equationInTermsOfVariableNames[equationForRow.lhs] =
        equationForRow.rhs || '0';
    }
    return { evaluated: equationInTermsOfVariableNames, assumed };
  } catch {
    return { evaluated: {}, assumed: {} };
  }
};
/**
 * Function to create a system of linear equations from the matrix A * x = 0
 * @param {Array<Array<string>>} A - The input matrix A with all values as strings
 * @returns {Array<string>} - The system of equations in string format compatible with KaTeX
 */
function generateEquationsFromMatrixInKatex(matrix) {
  const numberOfRows = matrix.length;
  const numberOfColumns = matrix[0].length;
  let equations = [];

  // let isMatrixNull = isAllCellZero(matrix);
  // if (isMatrixNull) {
  //   for (let col = 0; col < matrix[0].length; col++) {
  //     equations.push(`x_{${col + 1}} = 0`);
  //   }
  //   return equations;
  // }
  for (let row = 0; row < numberOfRows; row++) {
    let equationTerms = [];
    for (let column = 0; column < numberOfColumns; column++) {
      if (matrix[row][column] != 0) {
        let cellAsCofficient = matrix[row][column];
        let variable = `x_{${column + 1}}`;
        let term;

        // Check if the cofficient is fractional (e.g., 0.5)
        if (cellAsCofficient.toString().indexOf('/') < 0) {
          term =
            cellAsCofficient == 1
              ? `${variable}`
              : cellAsCofficient == -1
              ? `-${variable}`
              : `${cellAsCofficient}${variable}`;
        } else {
          cellAsCofficient = convertIntoLatex(cellAsCofficient);
          term = `${cellAsCofficient}${variable}`;
        }

        equationTerms.push(term);
      }
    }
    if (equationTerms.length > 0) {
      let equation = equationTerms[0];
      for (let i = 1; i < equationTerms.length; i++) {
        if (equationTerms[i].startsWith('-')) {
          equation += ` - ${equationTerms[i].substring(1)}`;
        } else {
          equation += ` + ${equationTerms[i]}`;
        }
      }
      equations.push(equation + ' = 0');
    }
  }

  return equations.map((eq) => `{${eq}}`);
}

/**
 * Function to split terms and group them by their variables.
 * @param {string} term - The term to split and group.
 * @returns {Array} - An array of terms grouped by variables.
 */
const splitTermsIntoVariables = (term) => {
  let value = convertFromLatex(term);
  const valueArr = value
    .toString()
    .replaceAll(' ', '')
    .match(/(\(?[+|-]?(\(?\d+\/\d+\)?|\d+)?\*?\w+\)?|[+|-]?\d+)/g);
  return valueArr?.map((val) => val.replace('*', ''));
};

/**
 * Function to simplify vector matrix by extracting common variables.
 * @param {Array<Array<string>>} matrix - The input matrix with terms containing common variables.
 * @returns {string} - The simplified form in LaTeX format.
 */
const simplifyVectorMatrix = (matrix) => {
  const variableVectors = {};
  const variableOrder = ['t', 's', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const terms = splitTermsIntoVariables(matrix[row][col]);
      terms?.forEach((term) => {
        const variableMatch = term.match(/[a-zA-Z]+$/);
        if (variableMatch) {
          const variable = variableMatch[0];
          if (!variableVectors[variable]) {
            variableVectors[variable] = Array(matrix.length).fill('0');
          }
          let replaced = term.replace(variable, '').trim();
          variableVectors[variable][row] =
            replaced == '-' ? '-1' : replaced == '+' ? '1' : replaced || '1';
        }
      });
    }
  }

  const result = [];
  Object.keys(variableVectors)
    .sort((a, b) => variableOrder.indexOf(a) - variableOrder.indexOf(b))
    .forEach((variable) => {
      const vector = variableVectors[variable];
      const vectorStr = vector
        .map((el) => convertIntoLatex(el == '0' ? el : el.replace(/--/g, '+')))
        .join('\\\\');
      result.push(`\\begin{bmatrix}${vectorStr}\\end{bmatrix} ${variable}`);
    });

  return result.join(' + ');
};

const NullSpaceOfAMatrix = () => {
  const [row, setRow] = useState('2');
  const [column, setColumn] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    [6, 12, 18],
    [3, 6, 9],
    // [1, 2, 3],
    // [4, 1, 7],
    // [0, 0, 0],
    // [0, 0, 0],
    // [-5, 2, 4],
    // [2, -8, 2],
    // [4, 2, -5],
    // [4, 2, 4],
    // [2, 1, 2],
    // [4, 2, 4],
    // [1, -1, -1],
    // [2, -2, 1],
    // ["1", "3", "6", "0"],
    // ["0", "1", "4", "-5"],
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
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the null space of the Matrix given as`),
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
          value: putSpace(`Cofficient Matrix : ${printMatrix(frstMatrix)}`),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !column || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const simpleMatrix = katexArrToSimpleArr(frstMatrix);
    const nullSpaceMat = findNullSpace(simpleMatrix);
    const echelonForm = findRowEchelonForm(simpleMatrix);

    const diagonalOne = makePivotElementsOne(echelonForm);
    const upperMatrix = makeUpperTriangularZero(diagonalOne);
    const finalMat = simpleArrToKatexArr(upperMatrix);
    const isAllZero = nullSpaceMat.every((itm) => itm.every((el) => el == '0'));
    const nullity = isAllZero ? '0' : nullSpaceMat.length;
    const vectorMat = Array.from({ length: column }, (_, i) =>
      Array.from({ length: 1 }, () => `x_${i + 1}`)
    );
    const nullMat = Array.from({ length: row }, () =>
      Array.from({ length: 1 }, () => `0`)
    );

    if (!diagonalOne.length || !upperMatrix.length) return;
    const equationss = generateEquationsFromMatrixInKatex(finalMat);
    const { assumed, evaluated } = assignVariables(upperMatrix);
    const allVariablesObj = { ...assumed, ...evaluated };
    const variablesMatrix = vectorMat.map((_, i) => [
      allVariablesObj[`x_{${i + 1}}`],
    ]);

    const finalAnswer = [
      {
        value: putSpace(`The null space of the given matrix is`),
        type: 'equation',
      },
      {
        value: `\\bigg\\{${nullSpaceMat.map((itm) =>
          printMatrix(simpleArrToKatexArr(itm.map((el) => [el])))
        )} \\bigg \\}`,
        type: 'equation',
      },
      {
        value: `The nullity of the matrix is ${nullity}`,
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
    setAnswer(eqRender);
    if (!showSteps) return;
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The null space (kernel) of a matrix is the set of all vectors that, when<br>
         multiplied by the matrix, result in the zero vector. In other words, it is<br> the
          collection of all solutions to the homogeneous system of linear<br> equations Ax = 0,
           where A is the given matrix. Here, x represents a<br> vector, A is the matrix, and 0
            is the zero vector of appropriate dimension`,
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
        value: 'First, we will find the rref of the given matrix. ',
        type: 'span',
      },
      {
        value: putSpace(
          `The reduced row echelon form (rref) = ${printMatrix(finalMat)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/reduced-row-echelon-form-of-a-matrix/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see the Steps to calculate the Reduced Row Echelon Form, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: 'Now, to find the null space, solve the matrix equation',
        type: 'span',
      },
      {
        value: `${printMatrix(finalMat)} ${printMatrix(
          vectorMat
        )}= ${printMatrix(nullMat)}`,
        type: 'equation',
      },
      {
        value: putSpace(`After solving, we get`),
        type: 'equation',
      },
      ...equationss.map((equation) => ({
        value: equation,
        type: 'equation',
      })),
      {
        value:
          Object.keys(assumed).length > 0
            ? putSpace(
                `So we Assume ${Object.entries(assumed).map(
                  (itm) => `${itm[0]} = ${itm[1]}`
                )}`
              )
            : '',
        type: Object.keys(assumed).length > 0 ? 'equation' : 'span',
      },
      {
        value:
          Object.keys(evaluated).length > 0
            ? putSpace(
                `Then ${Object.entries(evaluated).map(
                  (itm) => `${itm[0]} = ${itm[1]}`
                )}`
              )
            : '',
        type: Object.keys(evaluated).length > 0 ? 'equation' : 'span',
      },
      {
        value: putSpace(
          `Thus, \\overrightarrow{X} = ${printMatrix(
            vectorMat
          )} = ${printMatrix(variablesMatrix)} ${
            isAllZero ? '' : '='
          } ${simplifyVectorMatrix(variablesMatrix)}`
        ),
        type: 'equation',
      },
      {
        value:
          nullity == 0
            ? `Since the system has a unique solution, the null space only has a zero vector.`
            : `Since the system does not have a unique solution, the null space is represented by above vector`,
        type: 'span',
      },
      'br',
      {
        value: `The nullity of a matrix is the dimension of the basis for the null space.`,
        type: 'span',
      },
      'br',
      {
        value: `Hence the nullity of the matrix is ${nullity}`,
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
                max={6}
                className="col-12"
              />
            </div>
            <div className="col-4">
              <Input
                value={column}
                setVal={setColumn}
                min={1}
                max={6}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left">Cofficient Matrix: -</div>
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

export default NullSpaceOfAMatrix;
