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
import { getSearchParams } from '../../helpers/general';
import {
  printMatrix,
  convertFromLatex,
  convertIntoLatex,
  transposeOfMatrix,
  matrixInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import Vector from '../../helpers/Vectors';
import { ExpressionParser } from '@yaffle/expression/index';
import { isMatValid } from '../../helpers/Validations';

function parseArrayToString(mat) {
  return `{${mat.map((itm) => `{${itm.toString()}}`).toString()}}`;
}
function parseMatrixToLatex(mat) {
  if (!mat.length) return null;
  if (!Array.isArray(mat)) mat = stringToArray(mat);
  const matrix = JSON.parse(JSON.stringify(mat));
  return matrix.map((itm) =>
    Array.isArray(itm) ? parseMatrixToLatex(itm) : convertIntoLatex(itm)
  );
}

function parseArray(valueStr) {
  return valueStr.map((itm) =>
    itm
      ?.replace(/[\{\}]/g, '')
      .replace(/(\d+)\^0.5/g, 'sqrt($1)')
      .split(',')
  );
}
function stringToArray(str) {
  if (!str) return [];
  const rows = str.toString().split('},{');
  return parseArray(rows);
}
function transposeOfMat(str) {
  try {
    const matrix = ExpressionParser.parse(str).matrix;
    return matrix.transpose().toString();
  } catch (err) {
    console.log(err.message);
    return [[]];
  }
}
function multiplyMats(a, b) {
  try {
    const matrix = ExpressionParser.parse(a).matrix;
    const matrix2 = ExpressionParser.parse(b).matrix;
    return matrix.multiply(matrix2).toString();
  } catch {
    return [[]];
  }
}
const QRFactorization = () => {
  const [numberOfVectors, setNumberOfVectors] = useLocalStorage('QRFactorization_numberOfVectors', '3');
  const [sizeOfVectors, setSizeOfVectors] = useLocalStorage('QRFactorization_sizeOfVectors', '3');
  const [vectors, setVectors] = useLocalStorage('QRFactorization_vectors', [
    ['1', '3', '5'],
    ['1', '3', '1'],
    ['2', '-1', '7'],
  ]);
  const [equation, setEquation] = useLocalStorage('QRFactorization_equation', '');
  const [solution, setSolution] = useLocalStorage('QRFactorization_solution', '');
  const [result, setResult] = useLocalStorage('QRFactorization_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('QRFactorization_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('QRFactorization_showSteps', true);
  const [note, setNote] = useLocalStorage('QRFactorization_note', undefined);

  const vectorsArr = Array.from({ length: numberOfVectors }, () => '');
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      let arr = vals.a.split(',');
      let temp = listToMatrix(arr, b);
      setNumberOfVectors(b);
      setVectors(temp);
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
            `Find the QR factorization of the given matrix A as `
          ),
          type: 'equation',
        },
        {
          value: putSpace(`${printMatrix(vectors)} `),
          type: 'equation',
        },
      ])
    );
  }, [JSON.stringify(vectors.flat()), numberOfVectors, sizeOfVectors]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space  ${printMatrix(vectors)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !numberOfVectors || !isMatValid(vectors);
    if (isInvalid) return;

    const tempFirst = vectors.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );
    const arrAsString = parseArrayToString(tempFirst);
    const allVectors = transposeOfMatrix(vectors).map((itm) => new Vector(itm));
    if (!tempFirst || !allVectors.length) return;
    const answers = [allVectors[0]];
    const finals = [allVectors[0].unitVector()];
    allVectors.map((itm, i) => {
      let vectorA = itm;
      if (i > 0) {
        let projArr = [];
        for (let j = 0; j < i; j++) {
          projArr.push(allVectors[j]);
        }
        let subtractionVector = vectorA;
        projArr.map((_, m) => {
          subtractionVector = subtractionVector.subtract(
            vectorA.projection(answers[m])
          );
        });
        answers.push(subtractionVector);
        finals.push(subtractionVector.unitVector());
      }
    });
    const finalAsStr = parseArrayToString(finals.map((itm) => itm._components));
    const qMatrix = transposeOfMat(finalAsStr);
    const qDecimal = matrixInDecimals(stringToArray(qMatrix));
    const qMatrixLatex = parseMatrixToLatex(qMatrix);
    const qTranspose = transposeOfMat(qMatrix);
    const qTransposeLatex = parseMatrixToLatex(qTranspose);
    const rMatrix = multiplyMats(qTranspose, arrAsString);
    const rDecimal = matrixInDecimals(stringToArray(rMatrix));
    const rMatrixLatex = parseMatrixToLatex(rMatrix);
    const finalAnswer = [
      {
        value: putSpace(
          `Q =  ${printMatrix(qMatrixLatex)} or ${printMatrix(qDecimal)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `R = ${printMatrix(rMatrixLatex)} or ${printMatrix(rDecimal)} `
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
          `The QR Factorization method gives us two different matrices i.e. Q and R.`
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
          `First, we will orthonormalize the set of vectors for the given matrix by the Gram-Schmidt method to find the matrix Q.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Q =  ${printMatrix(qMatrixLatex)}`),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/gram-schmidt-calculator/?a=${transposeOfMatrix(
          vectors
        )}&b=${numberOfVectors}&c=${sizeOfVectors}"  target="_blank">to see Steps to solve the matrix by Grahm Schmidt method, click here </a>`,
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
        value: putSpace(`Now we will find the transpose of Q.`),
        type: 'equation',
      },
      {
        value: putSpace(`Q^T = ${printMatrix(qTransposeLatex)}`),
        type: 'equation',
      },
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now we will find the matrix R by multiplying transpose of matrix Q by A matrix itself.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `R = Q^t\\cdot A = ${printMatrix(qTransposeLatex)}\\cdot${printMatrix(
            vectors
          )} = ${printMatrix(rMatrixLatex)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/matrix-multiplication/?a=${qTransposeLatex}&b=${vectors}&c=${sizeOfVectors}&d=${numberOfVectors}&e=${sizeOfVectors}" target="_blank">to see the Steps for matrix multiplicatoin, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Hence, we have obtained the Q and R matrices.`),
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
  }, [vectors, numberOfVectors, showSteps, sizeOfVectors]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setVectors([
      ['', ''],
      ['', ''],
    ]);
    setSizeOfVectors('2');
    setNumberOfVectors('2');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = !!numberOfVectors && isMatValid(vectors);

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
            <div className="col-4 text-left">Order of matrix:</div>
            <div className="col-4">
              <Input
                value={numberOfVectors}
                setVal={setNumberOfVectors}
                min={1}
                max={11}
                pattern={/^((\d)*)\d*$/}
                className="col-12"
              />
            </div>

            <div className="col-4">
              <Input
                value={sizeOfVectors}
                setVal={setSizeOfVectors}
                min={1}
                pattern={/^((\d)*)\d*$/}
                max={11}
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
              {' '}
              {numberOfVectors > 0 && (
                <MatrixInput
                  rows={numberOfVectors}
                  columns={sizeOfVectors}
                  className="col-6"
                  onUpdate={setVectors}
                  value={vectors}
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

export default QRFactorization;
