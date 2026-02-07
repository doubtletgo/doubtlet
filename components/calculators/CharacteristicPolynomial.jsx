'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  simpleArrToKatexArr,
  printDeterminant,
  determinant,
  valueToKatex,
} from '../../helpers/matrixHelper';
import { isMatValid } from '../../helpers/Validations';
import NotesHelpButton from '../common/Notes/NotesHelpButton';

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
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
function sortExpression(expression) {
  if (!expression) return '';
  // Split the expression into individual terms
  let terms = expression.split(/(?=[+-])/);

  // Helper function to extract the exponent from a term
  function getExponent(term) {
    if (!/[a-z]/i.test(term)) {
      return -1;
    }
    const match = term.match(/\^(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Sort the terms based on their exponents in decreasing order
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
  // Recreate the sorted expression with the correct sign placement1
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
const CharacteristicPolynomial = () => {
  const [row, setRow] = useState('3');
  const [frstMatrix, setFrstMatrix] = useState([
    ['2', '1', '0'],
    ['5', '5', '2'],
    ['3', '-2', '4'],
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

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the characteristic polynomial of the Matrix given as ${printMatrix(
              frstMatrix
            )}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [JSON.stringify(frstMatrix.flat()), row]);
  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
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
    const identity = createIdentityMatrix(row);
    const lemdaMat = multiplyWithVar(identity, 'a');
    const addResult = addTwoMats(tempFirst, lemdaMat);
    const addLemda = JSON.parse(JSON.stringify(addResult).replaceAll('a', 'λ'));
    const eqn = determinant(addResult);
    let finalResult = algebrite
      .expand(algebrite.simplify(eqn).toString())
      .toString();
    finalResult = sortExpression(finalResult)
      .replaceAll('*', '')
      .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`);
    // .replaceAll("a", "λ");
    const finalAnswer = [
      {
        value: `The characteristic polynomial of the given Matrix`,
        type: 'span',
      },
      {
        value: `${printMatrix(
          frstMatrix
        )} \\space is \\space \\bold{${finalResult}} `,
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
        value: `A characteristic polynomial of a square matrix is defined as a polynomial that<br>
         contains the eigenvalues as roots in the form of a polynomial.`,
        type: 'span',
      },
      'br',
      {
        value: `It is obtained by using the formula`,
        type: 'span',
      },
      'br',
      {
        value: `P(λ)= det (A – λI) = 0`,
        type: 'span',
      },
      'br',
      {
        value: `Where I is the identity matrix of similar order as A.`,
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
        value: putSpace(
          `P(λ) = det(${printMatrix(frstMatrix)} -λ${printMatrix(identity)})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `P(λ) = ${printDeterminant(
            simpleArrToKatexArr(addLemda)
          )} = {${finalResult}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/determinant-of-a-matrix/?a=${addResult}&b=${row}&c=${row}"  target="_blank">to see the Steps to calculate the determinant, click here</a>`,
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
                numericToolbarKeys={['dot', 'epower']}
                allowAlphabeticKeyboard={false}
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

export default CharacteristicPolynomial;
