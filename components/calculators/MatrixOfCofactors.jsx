'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import {
  getSearchParams,
  putSpace,
  simplifyKatex,
} from '../../helpers/general';
import {
  matrixInDecimals,
  printMatrix,
  coFactor,
  printDeterminant,
  cofactorOfMatrix,
  katexArrToSimpleArr,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const MatrixOfCofactors = () => {
  const [row, setRow] = useLocalStorage('MatrixOfCofactors_row', '3');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('MatrixOfCofactors_frstMatrix', [
    ['1.5', '\\frac{2}{3}', '2'],
    ['3', '2.1', '-\\frac{2}{3}'],
    ['1', '4', '\\frac{2}{5}'],
  ]);
  const [equation, setEquation] = useLocalStorage('MatrixOfCofactors_equation', '');
  const [solution, setSolution] = useLocalStorage('MatrixOfCofactors_solution', '');
  const [result, setResult] = useLocalStorage('MatrixOfCofactors_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('MatrixOfCofactors_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('MatrixOfCofactors_showSteps', true);
  const [note, setNote] = useLocalStorage('MatrixOfCofactors_note', undefined);
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let arrA = vals.a.split(',');
      let b = vals.b;
      let tempA = listToMatrix(arrA, b);
      setRow(b);
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
            `Find the matrix of \\bold{cofactors} for the given matrix as`
          ),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, row]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `Formatted User Input  Display`,
          type: 'span',
        },
        {
          value: `Given\\space Matrix:\\space   ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const tempFirst = katexArrToSimpleArr(frstMatrix);

    let cofactorAnswers = cofactorOfMatrix(tempFirst);
    const temp = cofactorAnswers.map((itm) =>
      itm.map((el) => simplifyKatex(el))
    );
    const decimalMatrix = matrixInDecimals(temp);
    const finalAnswer = [
      {
        value: putSpace(`The matrix of the Cofactors of`),
        type: 'equation',
      },
      {
        value: `${printMatrix(frstMatrix)} \\space is \\space ${printMatrix(
          cofactorAnswers
        )} or ${printMatrix(decimalMatrix)} `,
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
          `Cofactor of matrix for a particular element is defined as`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the product of the minor of the element and -1 to the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`power of the positional value of the element.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Cofactor of the element a_{ij} is denoted by \\bold{C_{ij}.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{C_{ij}} = (-1)^{(i + j)} \\bold{M_{ij}} where \\bold{M_{ij}} is the minor of the element a_{ij}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Cofactor is only calculated for a square matrix.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Cofactor Matrix consists of all Cofactors of each element of the given matrix.`
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
        value: putSpace(`Now calculating the`),
        type: 'equation',
      },
      'br',
      ...cofactorAnswers
        ?.map((itm, i) =>
          itm
            ?.map((el, j) => [
              {
                value: `C_{${i + 1}${j + 1}} = (-1)^{(${i + 1}+${
                  j + 1
                })} \\space M_{${i + 1}${j + 1}} =${
                  (i + j) % 2 == 0 ? '' : '-'
                } M_{${i + 1}${j + 1}} =${
                  (i + j) % 2 == 0 ? '' : '-'
                } ${printDeterminant(coFactor(i, j, frstMatrix))}= {${
                  cofactorAnswers[i][j]
                }}`,
                type: 'equation',
              },
              'br',
              {
                value: `<a href="/calculator/matrix-of-minors/?a=${frstMatrix}&b=${row}"  target="_blank">to see the steps for Minor Matrix, click here</a>`,
                type: 'span',
              },
            ])
            .flat()
        )
        .flat(),
      {
        value: putSpace(`Now, we can easily create the cofactor matrix from`),
        type: 'equation',
      },
      {
        value: putSpace(`the above calculated Cofactors.`),
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
              <Input value={row} disabled className="col-12" />
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

export default MatrixOfCofactors;
