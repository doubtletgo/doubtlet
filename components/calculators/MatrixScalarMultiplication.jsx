'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import Input from '../common/input';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  matrixInDecimals,
  decimalToKatexFraction,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import MatrixInput from '../MatrixInput';
import MathInput from 'react-math-keyboard';
import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';

function multiplyMatrixByValue(matrix, value) {
  try {
    matrix = katexArrToSimpleArr(matrix);
    value = convertFromLatex(value);
    let temp = matrix.map((itm) =>
      itm.map((el) => algebrite.simplify(`(${value})*(${el})`))
    );
    return simpleArrToKatexArr(temp);
  } catch (err) {
    console.log(err);
    return;
  }
}
function matrixWithValues(matrix, value) {
  return matrix.map((itm) =>
    itm.map(
      (el) => `(${decimalToKatexFraction(value)})(${convertIntoLatex(el)})`
    )
  );
}

const MatrixScalarMultiplication = () => {
  const [row, setRow] = useLocalStorage('MatrixScalarMultiplication_row', '2');
  const [column, setColumn] = useLocalStorage('MatrixScalarMultiplication_column', '2');
  const [scalar, setScalar] = useLocalStorage('MatrixScalarMultiplication_scalar', '\\frac{4}{7}');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MatrixScalarMultiplication_frstMatrix', [
    ['1.5', '\\frac{2}{3}'],
    ['3', '-\\frac{2}{3}'],
  ]);
  const [equation, setEquation] = useLocalStorage('MatrixScalarMultiplication_equation', '');
  const [solution, setSolution] = useLocalStorage('MatrixScalarMultiplication_solution', '');
  const [result, setResult] = useLocalStorage('MatrixScalarMultiplication_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MatrixScalarMultiplication_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MatrixScalarMultiplication_showSteps', true);
  const [note, setNote] = useLocalStorage('MatrixScalarMultiplication_note', undefined);
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      let c = vals.c;
      let d = vals.d;
      let arr = vals.a.split(',');
      let temp = listToMatrix(arr, c);
      setScalar(convertIntoLatex(d));
      setRow(b);
      setColumn(c);
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
            `Find the multiplication of scalar value ${scalar}  with the given matrix`
          ),
          type: 'equation',
        },
        {
          value: `A \\space = \\space ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, row, column, scalar]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
        {
          value: putSpace(`Scalar Value : ${scalar}`),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [row, column, scalar, isMatValid(frstMatrix)].some(
      (i) => !i
    );
    if (isInvalid) return;
    const valueMultiplyStep = matrixWithValues(frstMatrix, scalar);
    const matrixIntoScalar = multiplyMatrixByValue(frstMatrix, scalar);
    const decimalMatrix = matrixInDecimals(matrixIntoScalar);
    const finalAnswer = [
      {
        value: putSpace(
          `The result of the multiplication of scalar value ${scalar}  with the given matrix`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `A = ${printMatrix(frstMatrix)} is ${printMatrix(
            matrixIntoScalar
          )} or ${printMatrix(decimalMatrix)}`
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
          `We know that to multiply any scalar with a matrix, we need `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `to multiply each element of the matrix with the scalar value.`
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
        value: putSpace(`Given the scalar value = ${scalar}`),
        type: 'equation',
      },
      {
        value: `So, \\space (${scalar}).${printMatrix(
          frstMatrix
        )} = ${printMatrix(valueMultiplyStep)}  = ${printMatrix(
          matrixIntoScalar
        )}`,
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
  }, [frstMatrix, row, column, scalar, showSteps]);

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
    setScalar('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [row, column, scalar, isMatValid(frstMatrix)].every(
    (v) => !!v
  );

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
          <div className="col-12 d-flex matrixCell">
            <div className="col-4 text-left">Scalar Value : -</div>
            <MathInput
              setValue={setScalar}
              initialLatex={scalar}
              size={'small'}
              allowAlphabeticKeyboard={false}
            />
          </div>

          <div className="col-3 text-left">Given Matrix: -</div>
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

export default MatrixScalarMultiplication;
