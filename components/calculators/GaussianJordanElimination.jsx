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
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  matrixInDecimals,
  findRowEchelonForm,
  makePivotElementsOne,
  makeUpperTriangularZero,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const addVerticalLine = (mat) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) => {
    return [...itm.slice(0, itm.length - 1), '|', ...itm.slice(itm.length - 1)];
  });
};

const GaussianJordanElimination = () => {
  const [row, setRow] = useLocalStorage('GaussianJordanElimination_row', '3');
  const [column, setColumn] = useLocalStorage('GaussianJordanElimination_column', '4');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('GaussianJordanElimination_frstMatrix', [
    [2, 3, 1, 9],
    [1, 2, 3, 8],
    [3, 1, 2, 3],
  ]);
  const [equation, setEquation] = useLocalStorage('GaussianJordanElimination_equation', '');
  const [solution, setSolution] = useLocalStorage('GaussianJordanElimination_solution', '');
  const [answer, setAnswer] = useLocalStorage('GaussianJordanElimination_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('GaussianJordanElimination_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('GaussianJordanElimination_showSteps', true);
  const [note, setNote] = useLocalStorage('GaussianJordanElimination_note', undefined);

  useEffect(() => {
    const vals = getSearchParams(false);

    if (vals.a) {
      let arrA = vals.a.split(',');
      let c = vals.c;
      let d = vals.d;
      let tempA = listToMatrix(arrA, d);
      setRow(c);
      setColumn(d);
      setFrstMatrix(tempA);
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
            `Perform the Gauss-Jordan elimination (reduce completely) on the Matrix given as `
          ),
          type: 'equation',
        },
        {
          value: printMatrix(addVerticalLine(frstMatrix)),
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
            `Given Matrix : ${printMatrix(addVerticalLine(frstMatrix))}`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !column || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const simpleMatrix = katexArrToSimpleArr(frstMatrix);
    const echelonForm = findRowEchelonForm(simpleMatrix);

    const diagonalOne = makePivotElementsOne(echelonForm);
    const upperMatrix = makeUpperTriangularZero(diagonalOne);
    const finalMat = simpleArrToKatexArr(upperMatrix);
    const decimalMat = matrixInDecimals(upperMatrix);
    const finalAnswer = [
      {
        value: putSpace(`The reduced matrix is `),
        type: 'equation',
      },
      {
        value: putSpace(
          `${printMatrix(addVerticalLine(finalMat))} or ${printMatrix(
            addVerticalLine(decimalMat)
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
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The Gauss-Jordan elimination on a matrix is performed to transform the matrix<br>
        into the reduced row-echelon form, where all entries above and below the leading<br>
        ones are zero, and the leading ones (pivot) are equal to one. This method is particularly<br>
        useful for finding the inverse of a matrix or solving systems of equations when you<br>
         want to find not just one solution but all possible solutions.`,
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
          `The reduced row echelon form (rref) = ${printMatrix(
            addVerticalLine(finalMat)
          )}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/reduced-row-echelon-form-of-a-matrix/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see the Steps to calculate the Reduced Row Echelon Form, click here</a>`,
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
          <div className="col-3 text-left">Coefficient Matrix: -</div>
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

export default GaussianJordanElimination;
