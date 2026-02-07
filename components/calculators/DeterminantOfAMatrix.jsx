'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { addSpace, putSpace } from '../../helpers/general';
import { create, all } from 'mathjs';
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';
import {
  katexArrToSimpleArr,
  decimalToKatexFraction,
  printMatrix,
  coFactor,
  determinant,
  simpleArrToKatexArr,
  cofactorsOfARow,
  printDeterminant,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';
const config = {};
const math = create(all, config);

const DeterminantOfAMatrix = () => {
  const [row, setRow] = useState('2');
  const [frstMatrix, setFrstMatrix] = useState([
    ['1.5', '\\frac{2}{3}'],
    ['3', '2.1'],
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
          value: putSpace(`Find the \\bold{Determinant} of the given Matrix `),
          type: 'equation',
        },
        {
          value: printMatrix(frstMatrix),
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
          value: `Given\\space Matrix:\\space  ${printMatrix(frstMatrix)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !row || !isMatValid(frstMatrix);
    if (isInvalid) return;
    const firstArrayValues = frstMatrix?.[0];

    const tempFirst = katexArrToSimpleArr(frstMatrix);
    const coFactorsOfMatrix = firstArrayValues
      ?.map(
        (itm, i) =>
          `${i > 0 ? (i % 2 != 0 ? '-' : '+') : ''}(${itm})  ${printDeterminant(
            simpleArrToKatexArr(coFactor(0, i, tempFirst))
          )}`
      )
      .join(' ');
    const cofactorAnswers = firstArrayValues
      ?.map((itm, i) => {
        itm = decimalToKatexFraction(itm);
        let matrixAns =
          decimalToKatexFraction(
            parseNumber(determinant(coFactor(0, i, tempFirst)), {}, 2)
          ) || 0;
        return `${i > 0 ? (i % 2 != 0 ? '-' : '+') : ''}(${itm})({${matrixAns
          ?.toString()
          .replace('/', '\\above{1pt}')}})`;
      })
      .join(' ');

    const determenenantValue = (arr) => {
      try {
        let result = math.simplify(`${arr.join(' ')}`).toString();
        let decimal = parseNumber(
          math.evaluate(result).toString(),
          {},
          2
        ).toString();
        return `{${result.replace(
          '/',
          '\\above{1pt}'
        )}} \\space or \\space {${decimal}}`;
      } catch {
        return;
      }
    };
    const cofactorsForFirstRow = cofactorsOfARow(frstMatrix);
    const additionExpression =
      addSpace(cofactorsForFirstRow?.join(''), true)
        ?.split(' ')
        .map((itm) => '{' + itm?.toString().replace('/', '\\above{1pt}') + '}')
        .join(' ') || determinant(tempFirst);
    const answer =
      determenenantValue(cofactorsForFirstRow) ||
      algebrite.expand(determinant(tempFirst)).toString().replaceAll('*', '');

    const finalAnswer = [
      {
        value: putSpace(`The determinant of the matrix`),
        type: 'equation',
      },
      {
        value: `${printMatrix(frstMatrix)} \\space is \\space ${answer}`,
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
          `We know that determinant of a matrix is a scalar value obtained from`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the given matrix.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `The determinant is only valid for a \\bold{square} matrix where number`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`of rows and columns are equal.`),
        type: 'equation',
      },

      {
        value: putSpace(
          `We can obtain the determinant of the matrix by expanding it`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`through any row or column.`),
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
          `Now, obtaining the determinant by expanding it through \\bold{first} row`
        ),
        type: 'equation',
      },
      {
        value: `${printDeterminant(frstMatrix)} = ${coFactorsOfMatrix}`,
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `On further Solving`,
        type: 'span',
      },
      {
        value: `${cofactorAnswers}`,
        type: 'equation',
      },
      {
        value: `${additionExpression} =${answer}`,
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

export default DeterminantOfAMatrix;
