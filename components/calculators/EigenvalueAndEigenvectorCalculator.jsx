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
import { ExpressionParser, Expression } from '@yaffle/expression/index';
import {
  printMatrix,
  simpleArrToKatexArr,
  determinant,
  valueToKatex,
  convertFromLatex,
  convertIntoLatex,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';
import algebrite from 'algebrite';

const createIdentityMatrix = (row) => {
  let mat = Array.from({ length: row }, () =>
    Array.from({ length: row }, () => '0')
  );
  return mat.map((_, i) => _.map((el, j) => (i == j ? '1' : el)));
};
const addTwoMats = (a, b) => {
  try {
    return a.map((itm, i) =>
      itm.map((el, j) => {
        return algebrite
          .eval(`(${el})-(${b[i][j]})`)
          .toString()
          .replace(/(\w+\/\w+)/g, '($1)');
      })
    );
  } catch {
    return [];
  }
};
function sortExpression(expression) {
  if (!expression) return '';
  let terms = expression.split(/(?=[+-])/);

  function getExponent(term) {
    if (!/[a-z]/i.test(term)) {
      return -1;
    }
    const match = term.match(/\^(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  terms.sort((a, b) => getExponent(b) - getExponent(a));
  terms = terms
    .map((itm) => {
      let val = itm.replace(/(\w+\/\w+)/g, '($1)').replace('a', 'λ');
      return valueToKatex(val);
    })
    .map((itm, i) => {
      if (i == 0) return itm.replace('+', '');
      if (itm[1] != '+' && itm[1] != '-') {
        return '+' + itm;
      }
      return itm;
    });
  const sortedExpression = terms.join('');

  return sortedExpression;
}
const multiplyWithVar = (mat = [], value) => {
  try {
    return mat.map((itm) =>
      itm.map((el) => algebrite.simplify(`(${value})*(${el})`).toString())
    );
  } catch (err) {
    console.log(err.message);
    return [];
  }
};

const solveArray = (arr) => {
  try {
    return ExpressionParser.parse(arr).toString();
    // return arr.map((itm) => itm.map((i) => nerdamer(itm).evaluate().toTeX()));
  } catch {
    return [];
  }
};

function parseArrayToString(mat) {
  return `{${mat.map((itm) => `{${itm.toString()}}`).toString()}}`;
}
function parseValues(valueStr) {
  return valueStr.toString().split(',');
}
function parseArray(valueStr) {
  return valueStr.map((itm) =>
    itm
      ?.replace(/[\{\}]/g, '')
      .replace(/(\d+)\^0.5/g, 'sqrt($1)')
      .split(',')
  );
}

function eigen(mat) {
  try {
    const matrix = ExpressionParser.parse(parseArrayToString(mat)).matrix;
    var eigenValues = Expression.getEigenvalues(matrix);
    var eigenVectors = Expression.getEigenvectors(matrix, eigenValues)
      .map((itm) => itm?.toString())
      .filter((itm) => !!itm);

    return [parseValues(eigenValues), parseArray(eigenVectors)];
  } catch (err) {
    console.log(err.message, mat);
    return ['', ''];
  }
}
const EigenValueAndEigenVectorCalculator = () => {
  const [row, setRow] = useLocalStorage('EigenvalueAndEigenvectorCalculator_row', '2');
  const [frstMatrix, setFrstMatrix] = useLocalStorage('EigenvalueAndEigenvectorCalculator_frstMatrix', [
    // ["1", "1", "4"],
    // ["1", "5", "1"],
    // ["3", "1", "1"],
    ['3', '2', '4'],
    ['2', '0', '2'],
    ['4', '2', '3'],
  ]);

  const [equation, setEquation] = useLocalStorage('EigenvalueAndEigenvectorCalculator_equation', '');
  const [solution, setSolution] = useLocalStorage('EigenvalueAndEigenvectorCalculator_solution', '');
  const [result, setResult] = useLocalStorage('EigenvalueAndEigenvectorCalculator_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('EigenvalueAndEigenvectorCalculator_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('EigenvalueAndEigenvectorCalculator_showSteps', true);
  const [note, setNote] = useLocalStorage('EigenvalueAndEigenvectorCalculator_note', undefined);
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
          value: putSpace(
            `Find the eigenvalues and eigenvectors of the matrix given as`
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
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Given\\space Matrix:\\space  ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;

    const tempFirst = frstMatrix.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );
    const identity = createIdentityMatrix(row);
    const lemdaMat = multiplyWithVar(identity, 'a');
    const addResult = addTwoMats(tempFirst, lemdaMat);
    const addLemda = JSON.parse(JSON.stringify(addResult).replaceAll('a', 'λ'));
    const [eigenValues, eigenVectors] = eigen(tempFirst);
    const eqn = determinant(addResult);
    if (!eqn) return;
    const finalResult = (() => {
      try {
        return algebrite
          .expand(
            algebrite
              .simplify(
                eqn
                  ?.replace(/\s+/g, '')
                  .replaceAll('+-', '-')
                  .replaceAll('-+', '-')
              )
              .toString()
          )
          .toString()
          .replaceAll('*', '');
      } catch (error) {
        console.log(error);
        return '';
      }
    })();

    try {
      if (!eigenValues || !eigenValues.length) return;
    } catch (error) {
      console.error('Error:', error.message);
    }

    const nullVectors = {};
    const evalVectors = {};
    eigenValues.map((_, i) => {
      if (nullVectors[_] && eigenVectors[i]) {
        nullVectors[_].push(
          eigenVectors[i]?.map((el) => [convertIntoLatex(el)])
        );
        evalVectors[_].push(eigenVectors[i].map((el) => [evalInDecimals(el)]));
      } else {
        if (eigenVectors[i]) {
          nullVectors[_] = [
            eigenVectors[i].map((el) => [convertIntoLatex(el)]),
          ];
          evalVectors[_] = [eigenVectors[i]?.map((el) => [evalInDecimals(el)])];
        }
      }
    });
    console.log(eigenVectors, eigenValues, nullVectors);

    for (let i = 0; i < eigenValues.length; i++) {
      let el1 = eigenValues[i];
      for (let j = i + 1; j < eigenValues.length; j++) {
        let el2 = eigenValues[j];
        if (evalInDecimals(el1) > evalInDecimals(el2)) {
          [eigenValues[i], eigenValues[j]] = [eigenValues[j], eigenValues[i]];
          [eigenVectors[i], eigenVectors[j]] = [
            eigenVectors[j],
            eigenVectors[i],
          ];
        }
      }
    }

    const roots = eigenValues.map((itm) =>
      itm.replace(/(\d+)\^0.5/, 'sqrt($1)')
    );

    const variableReplacedMat = eigenValues.map((i) =>
      JSON.parse(JSON.stringify(addResult).replaceAll('a', `(${i})`))
    );
    const solvedMatrices = variableReplacedMat.map((itm) =>
      itm.map((el) =>
        el.map((_) => solveArray(_).replace(/(\d+)\^0.5/, 'sqrt($1)'))
      )
    );

    const finalResultWithLemda = sortExpression(finalResult)
      .replaceAll('*', '')
      .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`);

    const finalAnswer = [
      {
        value: `The eigenvalue and eigenvector of the matrix given as`,
        type: 'span',
      },
    ];
    const included = [];

    const uniqueRoots = Array.from(new Set(roots));
    const allSame = uniqueRoots.length == 1;
    roots.map((itm, i) => {
      if (included.includes(i)) return;
      let multiplicity = roots.filter((el, l) => {
        if (el == itm && l != i) included.push(l);
        return el == itm;
      }).length;
      const vectors = nullVectors[eigenValues[i]];
      const evaluatedVectors = evalVectors[eigenValues[i]];
      finalAnswer.push({
        value: putSpace(
          `Eigenvalue = ${convertIntoLatex(itm)}  ${
            itm == evalInDecimals(itm) ? '' : `or ${evalInDecimals(itm)}`
          }, Multiplicity = ${multiplicity}, Eigenvector = \\{${vectors.map(
            (_) => printMatrix(_)
          )}\\  or ${evaluatedVectors?.map((_) => printMatrix(_))}\\}`
        ),
        type: 'equation',
      });
    });

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
        value: `Eigenvalues of a matrix represent the scaling factors by which its<br>
         eigenvectors are stretched.Eigenvectors are non-zero vectors that indicate<br>
          the directions in which a matrix's transformation has no effect other than<br>
         scaling by its associated eigenvalue.<br>It is only applicable for a square matrix`,
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
        value: `First, we will find the Characteristics Polynomial equation of the given matrix`,
        type: 'span',
      },
      {
        value: putSpace(`P(λ) = ${finalResultWithLemda}`),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/characteristic-polynomial-calculator/?a=${frstMatrix}&b=${row}"  target="_blank">to see Steps to find Characteristics equation, click here </a>`,
        type: 'span',
      },
      'br',
      {
        value: `The roots of the above equation are eigen values`,
        type: 'span',
      },
      {
        value: roots.map((itm, i) => `λ_{${i + 1}} = ${convertIntoLatex(itm)}`),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/solving-algebraic-equations-calculator/?a=${encodeURI(
          finalResult.replaceAll('a', 'x')
        )}" target="_blank">to see Steps to solve polynomial equation, click here </a>`,
        type: 'span',
      },
      'br',
      {
        value: `Now, we will find the eigenvectors related to its each eigenvalue.`,
        type: 'span',
      },
      'br',
      ...uniqueRoots
        ?.map((itm, i) => {
          const temp = eigenVectors.map((itm) =>
            itm.map((el) => [convertIntoLatex(el)])
          );
          return [
            {
              value: putSpace(`When λ = ${convertIntoLatex(itm)}`),
              type: 'equation',
            },
            {
              value: putSpace(
                `P(λ) = ${printMatrix(
                  simpleArrToKatexArr(addLemda)
                )} = ${printMatrix(
                  solvedMatrices[i].map((itm) =>
                    itm.map((el) => convertIntoLatex(el))
                  )
                )} `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `eigenvector = null space of the above matrix is \\{${
                  allSame
                    ? temp.map((itm) => printMatrix(itm))
                    : nullVectors[eigenValues[i]]?.map((_) => printMatrix(_))
                } \\}`
              ),
              type: 'equation',
            },
            {
              value: `<a href = "/calculator/null-space-or-kernel-or-nulity-calculator/?a=${simpleArrToKatexArr(
                solvedMatrices[i]
              )}&b=${row}&c=${row}" target="_blank">to see the Steps for null space, click here</a>`,
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
          ];
        })
        .flat(),
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

export default EigenValueAndEigenVectorCalculator;
