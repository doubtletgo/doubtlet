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
  makePivotElementsOne,
  makeUpperTriangularZero,
  findRowEchelonForm,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const findRank = (mat = []) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.filter((itm) => !itm.every((el) => el == '0'))?.length;
};
const RankOfAMatrix = () => {
  const [row, setRow] = useLocalStorage('RankOfAMatrix_row', '3');
  const [column, setColumn] = useLocalStorage('RankOfAMatrix_column', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('RankOfAMatrix_frstMatrix', [
    [1, 2, 3],
    [2, 5, 7],
    [4, 9, 13],
  ]);
  const [equation, setEquation] = useLocalStorage('RankOfAMatrix_equation', '');
  const [solution, setSolution] = useLocalStorage('RankOfAMatrix_solution', '');
  const [answer, setAnswer] = useLocalStorage('RankOfAMatrix_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('RankOfAMatrix_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('RankOfAMatrix_showSteps', true);
  const [note, setNote] = useLocalStorage('RankOfAMatrix_note', undefined);

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
          value: putSpace(`Find the rank of the Matrix given as`),
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
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Given Matrix : ${printMatrix(frstMatrix)}`),
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
    const rank = findRank(upperMatrix);
    const finalAnswer = [
      {
        value: putSpace(
          `The rank of the given matrix  ${printMatrix(frstMatrix)} is ${rank}`
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
        value: `The rank of a matrix is equal to number of non-zero rows or columns<br> obtained after applying row or column transformation to reduce<br> it in row echelon form.`,
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
        value: 'First, we will find the row echelon form of the given matrix.',
        type: 'span',
      },
      {
        value: putSpace(
          `The row echelon form (ref) = ${printMatrix(echelonForm)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/row-echelon-form-of-a-matrix/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see the Steps to calculate the Row Echelon Form, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value:
          'Since the rank of the matrix is equal to number of non-zero rows<br> in the above row echelon form of matrix.',
        type: 'span',
      },
      'br',
      'br',
      {
        value: `Number of non-zero rows are ${rank}.`,
        type: 'span',
      },
      'br',
      {
        value: `So, the rank of the matrix is ${rank}`,
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

export default RankOfAMatrix;
