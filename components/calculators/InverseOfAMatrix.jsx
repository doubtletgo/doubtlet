'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import {
  getSearchParams,
  putSpace,
  simplifyKatex,
} from '../../helpers/general';
import { create, all } from 'mathjs';
import {
  printMatrix,
  katexArrToSimpleArr,
  cofactorOfMatrix,
  transposeOfMatrix,
  simpleArrToKatexArr,
  matrixInDecimals,
  cofactorsOfARow,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const InverseOfAMatrix = () => {
  const [row, setRow] = useState('2');
  const [frstMatrix, setFrstMatrix] = useState([
    ['1.5', '\\frac{2}{3}'],
    ['3', '\\frac{-2}{3}'],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

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
          value: putSpace(`Find the \\bold{Inverse} of the Matrix given as `),
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
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const adjointMatrix = transposeOfMatrix(cofactorOfMatrix(frstMatrix));
    const dtrmntArr = cofactorsOfARow(frstMatrix, 0);
    const dtrmnt = dtrmntValue(dtrmntArr);
    const dtrmntIntoAdjoint = multiplyMatrixByValue(adjointMatrix, dtrmnt);
    const decimalMatrix = matrixInDecimals(dtrmntIntoAdjoint);
    const dtrmntZero = [
      {
        value: `Since |A| = 0 , Inverse of the matrix doesn't exist`,
        type: 'span',
      },
    ];
    const dtrmntNotZero = [
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, by using the above formula of inverse of a matrix A <sup>-1</sup> `,
        type: 'span',
      },
      {
        value: `= {1\\above{1pt}({${dtrmnt})}} \\space ${printMatrix(
          adjointMatrix
        )} `,
        type: 'equation',
      },
      {
        value: putSpace(
          `After solving A^{-1} = ${printMatrix(dtrmntIntoAdjoint)}`
        ),
        type: 'equation',
      },
    ];
    const isZero = dtrmnt.replace(/[{}]/g, '') == '0';
    const inverseSteps = isZero ? dtrmntZero : dtrmntNotZero;
    const finalAnswer = isZero
      ? dtrmntZero
      : [
          {
            value: putSpace(
              `The Inverse of the matrix ${printMatrix(frstMatrix)} is`
            ),
            type: 'equation',
          },
          {
            value: putSpace(
              `${printMatrix(dtrmntIntoAdjoint)} or ${printMatrix(
                decimalMatrix
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
        value: putSpace(`Inverse of matrix A is denoted by \\bold{A^{-1}}`),
        type: 'equation',
      },
      {
        value: `Inverse is only calculated for a <b>square</b> matrix  whose determinant is not<br> equal to Zero.`,
        type: 'span',
      },

      {
        value: putSpace(
          `\\bold{A^{-1}}= \\bold{{adj(A)\\above{1pt} |A|}}, Where |A| ≠ 0 `
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
        value: `Now to find the Inverse of the given matrix, first find the adjoint matrix of A`,
        type: 'span',
      },
      {
        value: `Adjoint\\space Matrix\\space of\\space A =\\space adj(A)\\space = ${printMatrix(
          adjointMatrix
        )}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/adjoint-of-a-matrix/?a=${frstMatrix}&b=${row}"  target="_blank">to see Steps for adjoint of the given matrix click here</a>`,
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
        value: `Now, we need to find the determinant of the given matrix`,
        type: 'span',
      },
      {
        value: `Det(A) = |A| = ${dtrmnt} `,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/determinant-of-a-matrix/?a=${frstMatrix}&b=${row}"  target="_blank">to see Steps for determinant of the given matrix click here</a>`,
        type: 'span',
      },
      'br',
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
            Your input can be in the form of Integer, Fraction or Real Number
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

export default InverseOfAMatrix;
