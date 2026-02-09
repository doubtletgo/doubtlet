'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  printMatrix,
  simpleArrToKatexArr,
  matrixInDecimals,
  decimalToKatexFraction,
  katexSimplifiedValue,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import { abs, parseNumber } from '../../helpers/decimal';

import algebrite from 'algebrite';

function showMultiplySteps(m1, m2) {
  try {
    if (m1?.[0]?.length !== m2?.length) {
      return [];
    }
    const product = [];
    for (let i = 0; i < m1.length; i++) {
      product.push([]);
      for (let j = 0; j < m2[0].length; j++) {
        product[i].push('');
      }
    }
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        for (let k = 0; k < m1[0].length; k++) {
          product[i][j] = `${
            !!product[i][j] ? `${product[i][j]}+` : ''
          } ({${decimalToKatexFraction(m1[i][k])}}) ({${decimalToKatexFraction(
            m2[k][j]
          )}})`;
        }
      }
    }
    return product;
  } catch {
    return;
  }
}
function checkForSqrt(value) {
  if (!value) return false;
  value = value.toString();
  return value.indexOf('sqrt') > -1 || value.indexOf('^(1/2)') > 0;
}
function checkDecimal(n) {
  var isDecimal = n.toString().indexOf('.') > 0;
  return isDecimal;
}

function fraction(numR, denumR) {
  let max = abs(numR) > abs(denumR) ? numR : denumR;
  for (let i = abs(max); i >= 2; i--) {
    if (numR % i == 0 && denumR % i == 0) {
      numR = numR / i;
      denumR = denumR / i;

      return [numR, denumR];
    }
  }
  return [numR, denumR];
}
function decimalToFraction(val) {
  if (!val) return;
  if (checkDecimal(val)) {
    return fraction(val.replace('.', ''), 10 ** val.split('.')[1].length).join(
      '/'
    );
  }
  return val;
}

function multiplyMatrices(m1, m2) {
  try {
    m1 = m1.map((itm) =>
      itm.map((el) => katexSimplifiedValue(decimalToFraction(el), true))
    );
    m2 = m2.map((itm) =>
      itm.map((el) => katexSimplifiedValue(decimalToFraction(el), true))
    );
    if (m1?.[0]?.length !== m2?.length) {
      return [];
    }
    const product = [];
    for (let i = 0; i < m1.length; i++) {
      product.push([]);
      for (let j = 0; j < m2[0].length; j++) {
        product[i].push(0);
      }
    }
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        for (let k = 0; k < m1[0].length; k++) {
          if (
            checkForSqrt(product[i][j]) ||
            checkForSqrt(m1[i][k]) ||
            checkForSqrt(m2[k][j])
          )
            product[i][j] = algebrite
              .simplify(`${product[i][j]} +(${m1[i][k]}) * (${m2[k][j]})`)
              .toString()
              .replace('...', '');
          else
            product[i][j] = algebrite
              .expand(`${product[i][j]} +(${m1[i][k]}) * (${m2[k][j]})`)
              .toString()
              .replace('...', '');
        }
      }
    }
    return product.map((itm) => itm.map((el) => parseNumber(el, {}, 2)));
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}
const MatrixMultiplication = () => {
  const [row, setRow] = useLocalStorage('MatrixMultiplication_row', '3');
  const [column, setColumn] = useLocalStorage('MatrixMultiplication_column', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MatrixMultiplication_frstMatrix', [
    // ["1.5", "\\frac{2}{3}", "-2"],
    // ["3", "2.1", "-\\frac{2}{3}"],
    ['\\frac{1}{\\sqrt{6}}', '\\frac{1}{\\sqrt{6}}', '\\frac{1}{\\sqrt{6}}'],
    ['\\frac{1}{\\sqrt{3}}', '\\frac{1}{\\sqrt{3}}', '-\\frac{1}{\\sqrt{3}}'],
    ['\\frac{1}{\\sqrt{2}}', '-\\frac{1}{\\sqrt{2}}', '0'],
  ]);
  const [columnB, setColumnB] = useLocalStorage('MatrixMultiplication_columnB', '3');
  const [scndMatrix, setScndMatrix] = useLocalStorage('MatrixMultiplication_scndMatrix', [
    // ["2", "\\frac{2}{3}"],
    // ["4", "2"],
    // ["6", "-3"],
    [1, 3, 5],
    [1, 3, 1],
    [2, 1, 7],
  ]);
  const [equation, setEquation] = useLocalStorage('MatrixMultiplication_equation', '');
  const [solution, setSolution] = useLocalStorage('MatrixMultiplication_solution', '');
  const [result, setResult] = useLocalStorage('MatrixMultiplication_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MatrixMultiplication_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MatrixMultiplication_showSteps', true);
  const [note, setNote] = useLocalStorage('MatrixMultiplication_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let arrA = vals.a.split(',');
      let arrB = vals.b.split(',');
      let c = vals.c;
      let d = vals.d;
      let e = vals.e;
      let tempA = listToMatrix(arrA, d);
      let tempB = listToMatrix(arrB, e);
      setRow(c);
      setColumn(d);
      setColumnB(e);
      setFrstMatrix(tempA);
      setScndMatrix(tempB);
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
            `Find the multiplication of the given matrices as AB =`
          ),
          type: 'equation',
        },
        {
          value: `${printMatrix(frstMatrix)} \\bold{.} ${printMatrix(
            scndMatrix
          )}
           `,
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, scndMatrix, row, column, columnB]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `First \\space Matrix: ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
        {
          value: `Second \\space Matrix:  ${printMatrix(scndMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid =
      !row ||
      !column ||
      !columnB ||
      !isMatValid(frstMatrix) ||
      !isMatValid(scndMatrix);
    if (isInvalid) return;
    const multiplyResult = multiplyMatrices(frstMatrix, scndMatrix).map((itm) =>
      itm.map((el) =>
        el
          .toString()
          .replace(/(\d+)\/(\d+)\*(\d+\^\(?\d*\/?\d*\)?)/g, '($1*$3)/$2')
          .replace(/(\d*)\^\((1\/2)\)/g, 'sqrt($1)')
      )
    );

    const multiplyResultInKatex = simpleArrToKatexArr(multiplyResult);
    const resultInDecimals = matrixInDecimals(multiplyResult);
    const isSame = multiplyResult?.every((itm, i) =>
      itm.every((el, j) => el == resultInDecimals[i][j])
    );
    const finalAnswer = [
      {
        value: `The result of the multiplication of the above two given matrices A & B is given as`,
        type: 'span',
      },
      {
        value: putSpace(
          `AB =${printMatrix(frstMatrix)}\\bold{.}${printMatrix(
            scndMatrix
          )}=${printMatrix(multiplyResultInKatex)} ${
            isSame ? '' : `or ${printMatrix(resultInDecimals)} `
          }`
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
        value: `We know that multiplication of two matrices is only defined when no. of <br>columns of first matrix is equal to number of rows of second matrix.
        `,
        type: 'span',
      },
      {
        value: putSpace(
          `Let order of 1^{st} matrix A is (m x n) \\& of 2^{nd} matrix B is (p x q) then `
        ),
        type: 'equation',
      },
      {
        value: `Order of A x B is <b>m x q</b> and the condition for multiplication is only valid when <br>
         the value of <b>n</b> is equal to p.`,
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
        value: `Now, we need to multiply the respective elements first row of the 1<sup>st</sup> <br>matrix with the first column of the 2<sup>nd</sup> matrix and add them
        <br> and then we have to repeat this process for each row and column.
        `,
        type: 'span',
      },
      {
        value: `${printMatrix(frstMatrix)}\\bold{.} ${printMatrix(scndMatrix)}
         = ${printMatrix(showMultiplySteps(frstMatrix, scndMatrix))}`,
        type: 'equation',
      },
      {
        value: `${printMatrix(frstMatrix)}\\bold{.}${printMatrix(scndMatrix)}
         = ${printMatrix(multiplyResultInKatex)}`,
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
  }, [frstMatrix, scndMatrix, row, column, columnB, showSteps]);

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
    setColumn('2');
    setColumnB('2');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!column &&
    !!columnB &&
    !!row &&
    isMatValid(frstMatrix) &&
    isMatValid(scndMatrix);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-4 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-8 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">
              Order of the <b>First</b> Matrix A :
            </div>
            <div className="col-4">
              <Input
                value={row}
                setVal={setRow}
                min={0}
                max={11}
                className="col-12"
              />
            </div>
            <div className="col-4">
              <Input
                value={column}
                setVal={setColumn}
                min={0}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix A: - </div>
          <div>
            {row > 0 && column > 0 && (
              <MatrixInput
                rows={row}
                columns={column}
                className="col-6"
                onUpdate={setFrstMatrix}
                value={frstMatrix}
              />
            )}
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">
              Order of the <b> Second</b> Matrix B:
            </div>
            <div className="col-4">
              <Input value={column} className="col-12" disabled />
            </div>
            <div className="col-4">
              <Input
                value={columnB}
                setVal={setColumnB}
                min={0}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left">Given Matrix B: - </div>
          <div>
            {column > 0 && columnB > 0 && (
              <MatrixInput
                rows={column}
                columns={columnB}
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
          className="default-btn rounded-pill px-5 btn btn-danger  mt-3"
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

export default MatrixMultiplication;
