'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  findRowEchelonForm,
  makePivotElementsOne,
  makeUpperTriangularZero,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';

import { isMatValid } from '../../helpers/Validations';

const findRowSpace = (mat = []) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  let nonZeroRow = matrix.filter((itm) => !itm.every((el) => el == '0'));
  return nonZeroRow;
};
const LinearIndependenceOfVectors = () => {
  const [row, setRow] = useState('3');
  const [column, setColumn] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    [3, 1, 2],
    [-4, 6, 7],
    [2, 8, 9],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [answer, setAnswer] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const vectorsArr = Array.from({ length: row }, () => '');

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Are vectors \\{ ${frstMatrix
              .map((itm) => printMatrix(itm.map((el) => [el])))
              .join(',')} \\}  linearly independent?`
          ),
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
            `Given Vectors : \\{ ${frstMatrix
              .map((itm) => printMatrix(itm.map((el) => [el])))
              .join(',')} \\}`
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
    const basisMat = simpleArrToKatexArr(findRowSpace(upperMatrix));
    const isDependent = basisMat.length < row;
    const finalAnswer = [
      {
        value: putSpace(
          `The given set of vectors is linearly \\bold{${
            isDependent ? 'dependent' : 'independent'
          }}.`
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
        value: `We can check the linear dependency of a set of vectors by finding its basis.<br>
        If ‘(dimension of the basis) < (dimension of the set of vectors)’<br>
        set is linearly dependent.`,
        type: 'span',
      },
      {
        value: `Else`,
        type: 'span',
      },
      'br',
      {
        value: `It is linearly independent.`,
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
        value: 'Given the dimension of the set of vectors = 3',
        type: 'span',
      },
      'br',
      {
        value: `We will first find the basis of the given vector matrix.`,
        type: 'span',
      },
      {
        value: putSpace(
          `Thus, the basis of set of vectors is \\{ ${basisMat
            .map((itm) => printMatrix(itm.map((el) => [el])))
            .join(',')} \\}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/basis-of-a-matrix-calculator/?a=${frstMatrix}&b=${row}&c=${column}"  target="_blank">to see the Steps to find basis , click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `Dimension of the basis ${
          isDependent ? '<' : row == basisMat.length ? '=' : '>'
        } number of non-zero rows ${row == basisMat.length ? `= ${row}` : ''}`,
        type: 'span',
      },
      'br',
      {
        value: `Since ‘dimension of the basis ${
          isDependent ? '<' : row == basisMat.length ? '=' : '>'
        } dimension of the set of vectors’`,
        type: 'span',
      },
      'br',
      {
        value: `The set is linearly ${
          isDependent ? 'dependent' : 'independent'
        }.`,
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
                pattern={/^((\d)*)\d*$/}
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
                pattern={/^((\d)*)\d*$/}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-12 " />
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
                  className="col-6"
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

export default LinearIndependenceOfVectors;
