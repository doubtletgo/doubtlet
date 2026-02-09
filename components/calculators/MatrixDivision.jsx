'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace, simplifyKatex } from '../../helpers/general';
import { create, all } from 'mathjs';
import {
  printMatrix,
  katexArrToSimpleArr,
  cofactorOfMatrix,
  transposeOfMatrix,
  simpleArrToKatexArr,
  matrixInDecimals,
  cofactorsOfARow,
  multiplyMatrices,
} from '../../helpers/matrixHelper';
import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const MatrixDivision = () => {
  const [row, setRow] = useLocalStorage('MatrixDivision_row', '2');
  const [clm, setClm] = useLocalStorage('MatrixDivision_clm', '2');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MatrixDivision_frstMatrix', [
    ['1.5', '\\frac{2}{3}'],
    ['3', '2.1'],
  ]);
  const [scndMatrix, setScndMatrix] = useLocalStorage('MatrixDivision_scndMatrix', [
    ['2', '\\frac{2}{3}'],
    ['4', '2'],
  ]);
  const [equation, setEquation] = useLocalStorage('MatrixDivision_equation', '');
  const [solution, setSolution] = useLocalStorage('MatrixDivision_solution', '');
  const [result, setResult] = useLocalStorage('MatrixDivision_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MatrixDivision_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MatrixDivision_showSteps', true);
  const [note, setNote] = useLocalStorage('MatrixDivision_note', undefined);

  const dtrmntValue = (arr) => {
    try {
      let result = math.simplify(`${arr.join(' ')}`).toString();
      return '{' + result.replace('/', '\\above{1pt}') + '}';
    } catch {
      return;
    }
  };
  function multiplyMatrixByValue(matrix, value) {
    try {
      matrix = katexArrToSimpleArr(matrix);
      value = simplifyKatex(value);
      let temp = matrix.map((itm) =>
        itm.map((el) => math.simplify(`1/(${value})*(${el})`))
      );
      return simpleArrToKatexArr(temp);
    } catch {
      return;
    }
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
            `Find the division of the matrices as \\frac{A}{B}  i.e.  `
          ),
          type: 'equation',
        },
        {
          value: ` \\frac{${printMatrix(frstMatrix)}}{${printMatrix(
            scndMatrix
          )}}`,
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, scndMatrix, clm, row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Matrix  \\space A:\\space ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
        {
          value: `Matrix  \\space B:\\space ${printMatrix(scndMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid =
      !clm || !row || !isMatValid(frstMatrix) || !isMatValid(scndMatrix);
    if (isInvalid) return;

    const adjointB = transposeOfMatrix(cofactorOfMatrix(scndMatrix));
    const dtrmntArrB = cofactorsOfARow(scndMatrix, 0);
    const dtrmntOfB = dtrmntValue(dtrmntArrB);
    const inverseOfB = multiplyMatrixByValue(adjointB, dtrmntOfB);
    const aIntoBInverse = simpleArrToKatexArr(
      multiplyMatrices(frstMatrix, inverseOfB)
    );
    const decimalResult = matrixInDecimals(aIntoBInverse);
    const dtrmntZero = [
      {
        value: `Since det(B) = |B| = 0 hence we can’t find the Inverse matrix of B, 
        hence division is not possible.`,
        type: 'span',
      },
    ];
    const dtrmntNotZero = [
      {
        value: putSpace(
          `So Inverse of B is B^{-1} = ${printMatrix(inverseOfB)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/inverse-of-a-matrix/?a=${scndMatrix}&b=${row}"  target="_blank">to see Steps to find the inverse of a matrix, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, we have to multiply matrix A with B<sup>-1</sup> `,
        type: 'span',
      },
      {
        value: `A.B^{-1} = ${printMatrix(frstMatrix)}.${printMatrix(
          inverseOfB
        )} = ${printMatrix(aIntoBInverse)}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/matrix-multiplication/?a=${frstMatrix}&b=${inverseOfB}&c=${row}&d=${row}&e=${row}"  target="_blank">to see Steps to find multiplicaiton of two matrices click here</a>`,
        type: 'span',
      },
      'br',
    ];
    const isZero = dtrmntOfB.replace(/[{}]/g, '') == '0';
    const inverseSteps = isZero ? dtrmntZero : dtrmntNotZero;
    const finalAnswer = isZero
      ? dtrmntZero
      : [
          {
            value: putSpace(
              `The result of the division of the above two order matrices A \\& B is order as`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `\\frac{A}{B} = \\frac{${printMatrix(frstMatrix)}}{${printMatrix(
                scndMatrix
              )}} = ${printMatrix(aIntoBInverse)} or ${printMatrix(
                decimalResult
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
        value: putSpace(
          `We know that division of two matrix is only possible for square matrices of same order.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`If |B| = 0 then division is not possible.
      `),
        type: 'equation',
      },
      {
        value: putSpace(
          `To perform the division process, first We need to find the Inverse matrix of B.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `And then A matrix should be multiplied to the inverse matrix of B.`
        ),
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
        value: `Now, to find the inverse matrix of B first we need to find the determinant of B.`,
        type: 'span',
      },
      {
        value: `So, |B| = ${dtrmntOfB} ${isZero ? '=' : '≠'} 0`,
        type: 'equation',
      },
      ...inverseSteps,
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
  }, [frstMatrix, scndMatrix, row, clm, showSteps]);

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
    setClm('2');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!row && !!clm && isMatValid(frstMatrix) && isMatValid(scndMatrix);
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Order of matrix A:</div>
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
          <div className="col-3 text-left">Given matrix A: -</div>
          <div>
            {row > 0 && (
              <MatrixInput
                rows={row}
                columns={clm}
                className="col-6"
                onUpdate={setFrstMatrix}
                value={frstMatrix}
              />
            )}
          </div>
          <div className="dropdown col   row mb-2 align-items-center">
            <div className="col-4 text-left">Order of matrix B:</div>
            <div className="col-4">
              <Input value={row} disabled className="col-12" />
            </div>
            <div className="col-4">
              <Input value={clm} disabled className="col-12" />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix B: -</div>
          <div>
            {row > 0 && (
              <MatrixInput
                rows={row}
                columns={clm}
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

export default MatrixDivision;
