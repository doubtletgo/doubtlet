'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import {
  getSearchParams,
  pluralise,
  putSpace,
  simplifyKatex,
} from '../../helpers/general';
import {
  matrixInDecimals,
  printMatrix,
  coFactor,
  cofactorOfMatrix,
  katexArrToSimpleArr,
  printDeterminant,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const MatrixOfMinors = () => {
  const [row, setRow] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    ['1.5', '\\frac{2}{3}', '-2'],
    ['3', '2.1', '-\\frac{2}{3}'],
    ['1', '4', '\\frac{2}{5}'],
  ]);

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  // List to matrix funtion
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
  //to get values from other calculator
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

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Minor} Matrix of the given matrix as${printMatrix(
              frstMatrix
            )}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [frstMatrix, row]);
  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space   \\begin{bmatrix} ${
            frstMatrix.map((itm) => itm.join(' & ')).join('\\\\ \\\\') || 0
          } \\end{bmatrix}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const tempFirst = katexArrToSimpleArr(frstMatrix);

    let cofactorAnswers = cofactorOfMatrix(tempFirst);
    let temp = cofactorAnswers.map((itm) => itm.map((el) => simplifyKatex(el)));
    const decimalMatrix = matrixInDecimals(temp);
    const finalAnswer = [
      {
        value: `The matrix of the minors of `,
        type: 'span',
      },
      {
        value: `${printMatrix(
          frstMatrix
        )} \\space is \\space \\bold{${printMatrix(
          cofactorAnswers
        )}} or \\bold{${printMatrix(decimalMatrix)}} `,
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
          `Minor of matrix for a particular element is defined as the determinant `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `of the matrix obtained after deleting the row and column of the matrix`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`in which the particular element lies. `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Minor of the element \\bold{a_{ij}} is denoted by \\bold{M_{ij}.}`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `Minor is only calculated for a \\bold{square} matrix.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Minor Matrix consists of all minors of each element of the given matrix.`
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
        value: putSpace(
          `Now calculating the minors of each element as given below`
        ),
        type: 'equation',
      },
      ...cofactorAnswers
        ?.map((itm, i) =>
          itm
            ?.map((el, j) => [
              {
                value: `M_{${1 + i}${
                  j + 1
                }} =\\space determinant\\space of\\space the\\space matrix\\space after\\space  deleting\\space \\bold{${pluralise(
                  i + 1
                )}}\\space Row\\space \\bold{${pluralise(
                  j + 1
                )}} \\space Column = ${printDeterminant(
                  coFactor(i, j, frstMatrix)
                )}= {${cofactorAnswers[i][j]}} `,

                type: 'equation',
              },
              {
                value: `<a href="/calculator/determinant-of-a-matrix/?a=${coFactor(
                  i,
                  j,
                  frstMatrix
                )}&b=${
                  row - 1
                }"  target="_blank">to see the steps for above determinant, click here</a>`,
                type: 'span',
              },
            ])
            .flat()
        )
        .flat(),
      'br',
      {
        value: `Now, we can easily create the minor matrix from the above calculated minors.
`,
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
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of integer, FRACTION or Real Number
          </div>

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Order of the matrix:</div>
            <div className="col-2">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={11}
                className="col-12"
              />
            </div>{' '}
            X
            <div className="col-2">
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

export default MatrixOfMinors;
