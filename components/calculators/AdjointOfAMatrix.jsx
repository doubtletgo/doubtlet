'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace, simplifyKatex } from '../../helpers/general';
import { getSearchParams } from '../../helpers/general';

import {
  katexArrToSimpleArr,
  matrixInDecimals,
  printMatrix,
  cofactorOfMatrix,
  transposeOfMatrix,
} from '../../helpers/matrixHelper';
import { isMatValid } from '../../helpers/Validations';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';

const AdjointOfAMatrix = () => {
  const [row, setRow] = useLocalStorage('AdjointOfAMatrix_row', 2);
  const [frstMatrix, setFrstMatrix] = useLocalStorage('AdjointOfAMatrix_frstMatrix', [
    ['\\sqrt{3}', '7'],
    ['4', '2'],
  ]);
  const [equation, setEquation] = useLocalStorage('AdjointOfAMatrix_equation', '');
  const [solution, setSolution] = useLocalStorage('AdjointOfAMatrix_solution', '');
  const [result, setResult] = useLocalStorage('AdjointOfAMatrix_result', '');
  const [showResult, setShowResult] = useLocalStorage('AdjointOfAMatrix_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('AdjointOfAMatrix_showSteps', true);
  const [note, setNote] = useLocalStorage('AdjointOfAMatrix_note', '');

  //to get values from other calculator
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
          value: putSpace(`Find the \\bold{Adjoint} of the given Matrix `),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
          type: 'equation',
        },
      ])
    );
  }, [JSON.stringify(frstMatrix.flat()), row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space   ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const tempFirst = katexArrToSimpleArr(frstMatrix);
    const cofactorArr = cofactorOfMatrix(frstMatrix);
    const transpose = transposeOfMatrix(cofactorArr);
    const temp = transpose.map((itm) => itm.map((el) => simplifyKatex(el)));
    const simplifiedTranspose = matrixInDecimals(temp);
    const finalAnswer = [
      {
        value: `The Adjoint of the given matrix`,
        type: 'span',
      },
      {
        value: `${printMatrix(frstMatrix)} \\space is \\space ${printMatrix(
          transpose
        )} \\space or \\space ${printMatrix(simplifiedTranspose)} `,
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
          `Adjoint of matrix A is obtained by taking the transpose of the cofactor matrix of A.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`It is denoted by adj(A) \\& `),
        type: 'equation',
      },
      {
        value: putSpace(`Adjoint is only calculated for a square matrix.`),
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
        value: putSpace(
          `Now to find the Adjoint of the given matrix, first find the cofactor matrix of A`
        ),
        type: 'equation',
      },
      {
        value: `Cofactor \\space Matrix \\space of \\space A  \\space = ${printMatrix(
          cofactorOfMatrix(tempFirst)
        )}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/matrix-of-cofactors/?a=${frstMatrix}&b=${row}"  target="_blank">to see the steps for matrix of cofactors, click here</a>`,
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
        value: putSpace(
          `Now, we need to take the transpose of above given cofactor matrix`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Transpose of Cofactor Matrix of A  = ${printMatrix(transpose)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/transpose-of-a-matrix/?a=${cofactorOfMatrix(
          tempFirst
        )}&b=${row}"  target="_blank">to see the steps for transpose of a matrix, click here</a>`,
        type: 'span',
      },
      'br',
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
    setRow(2);
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
            {/* <NotesHelpButton /> */}
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of an Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Order of the matrix:</div>
            <div className="col-4">
              <Input
                value={row.toString()}
                setVal={setRow}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
            <div className="col-4">
              <Input value={row.toString()} disabled className="col-12" />
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
          <Link href="#commentbox">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default AdjointOfAMatrix;
