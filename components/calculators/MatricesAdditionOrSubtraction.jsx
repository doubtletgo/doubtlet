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
import {
  katexArrToSimpleArr,
  matrixInDecimals,
  printMatrix,
  simpleArrToKatexArr,
} from '../../helpers/matrixHelper';

import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';

function showAddEquation(arr1, arr2, add) {
  return arr1.map((a, i) =>
    a.map((b, j) => `{${b}}${add ? '+' : '-'}({${arr2[i][j]}})`)
  );
}

const MatricesAdditionOrSubtraction = () => {
  const [row, setRow] = useLocalStorage('MatricesAdditionOrSubtraction_row', '2');
  const [column, setColumn] = useLocalStorage('MatricesAdditionOrSubtraction_column', '2');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MatricesAdditionOrSubtraction_frstMatrix', [
    ['1.5', '\\frac{2}{3}'],
    ['3', '\\sqrt{2}'],
  ]);
  const [scndMatrix, setScndMatrix] = useLocalStorage('MatricesAdditionOrSubtraction_scndMatrix', [
    ['1.5', '\\frac{2}{3}'],
    ['3', '\\sqrt{2}'],
  ]);
  const [equation, setEquation] = useLocalStorage('MatricesAdditionOrSubtraction_equation', '');
  const [solution, setSolution] = useLocalStorage('MatricesAdditionOrSubtraction_solution', '');
  const [result, setResult] = useLocalStorage('MatricesAdditionOrSubtraction_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MatricesAdditionOrSubtraction_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MatricesAdditionOrSubtraction_showSteps', true);
  const [note, setNote] = useLocalStorage('MatricesAdditionOrSubtraction_note', undefined);
  const [order, setOrder] = useLocalStorage('MatricesAdditionOrSubtraction_order', 'Addition');
  const isAddition = order === 'Addition';
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the  \\bold{${
              isAddition ? 'Addition' : 'Subtraction'
            }} of the given matrices as below`
          ),
          type: 'equation',
        },
        {
          value: `${printMatrix(frstMatrix)} ${
            isAddition ? '+' : '-'
          } ${printMatrix(scndMatrix)}
           `,
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, scndMatrix, row, column, isAddition]);

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
      !column || !row || !isMatValid(frstMatrix) || !isMatValid(scndMatrix);
    if (isInvalid) return;
    const resultMatrix = (matrixA, matrixB) => {
      try {
        if (!matrixA?.length && !matrixB?.length) return [];
        let resultArr = [];
        matrixA = katexArrToSimpleArr(matrixA);
        matrixB = katexArrToSimpleArr(matrixB);
        for (let i = 0; i < matrixA?.length; i++) {
          let row = [];
          for (let j = 0; j < matrixA?.[i].length; j++) {
            let valA = matrixA?.[i]?.[j];
            let valB = matrixB?.[i]?.[j];
            let result = algebrite
              .simplify(`(${valA || 0})${isAddition ? '+' : '-'}(${valB || 0})`)
              .toString();
            row.push(result);
          }
          resultArr.push(row);
        }
        return simpleArrToKatexArr(resultArr);
      } catch {
        return [];
      }
    };
    const addResult = resultMatrix(frstMatrix, scndMatrix);
    const finalAnswer = [
      {
        value: ` ${printMatrix(frstMatrix)} ${
          isAddition ? '+' : '-'
        }    ${printMatrix(scndMatrix)} = ${printMatrix(addResult)}
       or  ${printMatrix(matrixInDecimals(addResult))} `,
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
        value: `We know that Addition & Subtraction of Matrices is only valid if<br> both have same dimension. `,
        type: 'span',
      },
      'br',
      {
        value: `Two matrices A and B can only be added if and only if they have<br> the same number of rows and columns.  `,
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
        value: `${
          isAddition ? `To add two matrices` : `To Subtract two matrices`
        }, we need to add their corresponding elements.`,
        type: 'span',
      },
      {
        value: `${printMatrix(frstMatrix)} ${
          isAddition ? '+' : '-'
        } ${printMatrix(scndMatrix)}`,
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `${printMatrix(
          showAddEquation(frstMatrix, scndMatrix, isAddition)
        )}
        =${printMatrix(addResult)}`,
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
  }, [frstMatrix, scndMatrix, row, column, showSteps, isAddition]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    setFrstMatrix([
      ['', ''],
      ['', ''],
    ]);
    setScndMatrix([
      ['', ''],
      ['', ''],
    ]);
    setColumn('');
    setRow('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!row && !!column && isMatValid(frstMatrix) && isMatValid(scndMatrix);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mb-4 mb-md-0">
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
            <div className="col-4 text-left">Operation</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Addition">Addition</option>
                <option value="Subtraction">Subtraction</option>
              </select>
            </div>
          </div>
          {/* <div className="dropdown row mb-2 align-items-center"> */}
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
          <div className="col-3 text-left">First Matrix: -</div>
          <div>
            {row > 0 && column > 0 && (
              <MatrixInput
                rows={row}
                columns={column}
                className="col-6"
                value={frstMatrix}
                onUpdate={setFrstMatrix}
              />
            )}
          </div>
          <div className="col-3 text-left">Second Matrix:-</div>
          <div>
            {row > 0 && column > 0 && (
              <MatrixInput
                rows={row}
                columns={column}
                className="col-6"
                value={scndMatrix}
                onUpdate={setScndMatrix}
              />
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
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

export default MatricesAdditionOrSubtraction;
