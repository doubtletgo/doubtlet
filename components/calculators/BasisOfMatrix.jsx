'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  printMatrix,
  findRowEchelonForm,
  makePivotElementsOne,
  makeUpperTriangularZero,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  transposeOfMatrix,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const findColSpace = (mat = [], original) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  const realMat = JSON.parse(JSON.stringify(original));
  let nonZeroRow = realMat.filter((itm, i) =>
    itm.some((_, j) => matrix?.[i]?.[j] == '1')
  );
  return nonZeroRow;
};
const findRowSpace = (mat = []) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  let nonZeroRow = matrix.filter((itm) => !itm.every((el) => el == '0'));
  return nonZeroRow;
};
const BasisOfMatrix = () => {
  const [row, setRow] = useState('3');
  const [column, setColumn] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    [1, 9, 5],
    [2, 12, 7],
    [3, 5, 4],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const vectorsArr = Array.from({ length: row }, () => '');
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
          value: putSpace(`Find the basis of the space spanned by the vectors`),
          type: 'equation',
        },
        {
          value: `\\{ ${frstMatrix
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\}`,
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
            `
            \\{ ${frstMatrix
              .map((itm) => printMatrix(itm.map((el) => [el])))
              .join(',')} \\}`
          ),
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !column || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const simpleMatrix = katexArrToSimpleArr(transposeOfMatrix(frstMatrix));
    const echelonForm = findRowEchelonForm(simpleMatrix);

    const diagonalOne = makePivotElementsOne(echelonForm);
    const upperMatrix = makeUpperTriangularZero(diagonalOne);
    const rowSpaceMat = simpleArrToKatexArr(findRowSpace(upperMatrix));
    const colSpaceMat = simpleArrToKatexArr(
      findColSpace(upperMatrix, simpleMatrix)
    );
    const finalAnswer = [
      {
        value: putSpace(`The basis of the given vector matrix are `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\{ ${rowSpaceMat
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\} or \\{ ${colSpaceMat
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\}`
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
        value: `The basis is a representation of vectors that form a set of linearly<br>
         independent vectors which spans the given vector space.`,
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
        value:
          'We can find the basis by row space or column space of the given vector matrix.',
        type: 'span',
      },
      {
        value: putSpace(
          `Thus, the basis by Row space of the matrix is \\{ ${rowSpaceMat
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/row-space-of-a-matrix/?a=${transposeOfMatrix(
          frstMatrix
        )}&b=${row}&c=${column}"  target="_blank">to see the Steps to find row Space , click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Thus, the basis by Column space of the matrix is  \\{ ${colSpaceMat
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/column-space-of-a-matrix/?a=${transposeOfMatrix(
          frstMatrix
        )}&b=${row}&c=${column}"  target="_blank">to see the Steps to find column Space , click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `If two different basis are obtained, then do not worry.<br>
        Both of them are correct answers, as a set of vectors can have<br>
         different basis.We can choose any one of them, here we will choose<br> the either one.`,
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
            <div className="col-4 text-left">Number of the Vectors:</div>
            <div className="col-4">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Size of the Vectors:</div>
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
          <div className="col-12" />
          <div className="row">
            <div className="col-2">
              <table>
                <tbody>
                  {vectorsArr.map((_, i) => (
                    <tr key={i}>
                      <td className="customInputLabel">
                        <Equation
                          className="paddingZero overflow-hidden m-0"
                          equation={renderSteps([
                            {
                              value: `\\overrightarrow{V}_${i + 1} :`,
                              type: 'equation',
                            },
                          ])}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-10">
              {row > 0 && (
                <MatrixInput
                  value={frstMatrix}
                  rows={row}
                  columns={column}
                  // customClass="col-10"
                  onUpdate={setFrstMatrix}
                />
              )}
            </div>
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

export default BasisOfMatrix;
