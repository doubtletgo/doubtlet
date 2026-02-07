'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace } from '../../helpers/general';
import { create, all } from 'mathjs';
import {
  printMatrix,
  katexArrToSimpleArr,
  valueToKatex,
} from '../../helpers/matrixHelper';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

function evalLatex(expression) {
  try {
    const parsedExpression = math.parse(expression);
    const evaluatedResult = parsedExpression.evaluate();
    return evaluatedResult;
  } catch {
    return null;
  }
}
const TraceOfAMatrix = () => {
  const [row, setRow] = useState('2');

  const [frstMatrix, setFrstMatrix] = useState([
    ['1.5', '\\frac{2}{3}'],
    ['3', '-\\frac{2}{3}'],
  ]);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the Trace of the given matrix A = `),
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
    //function diagonalValue And diagonalvalueAddtion
    const diagonalArray = (arr, isVal) => {
      try {
        let temp = [];
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          for (let j = 0; j < element.length; j++) {
            if (i == j) {
              if (!!isVal) {
                if (element[j].toString().indexOf('-') > -1) {
                  temp.push(`(${element[j]})`);
                } else {
                  temp.push(element[j]);
                }
              } else {
                temp.push(`a_{${i + 1}${j + 1}}`);
              }
            }
          }
        }
        return temp;
      } catch {
        return;
      }
    };

    let diagonalvalueStep = diagonalArray(frstMatrix, true).join('+');
    let diagonalValue = diagonalArray(frstMatrix, false).join('+');

    // Answer function
    function trace(matrix) {
      try {
        matrix = katexArrToSimpleArr(matrix);
        const rows = matrix.length;
        let trace = 0;
        for (let i = 0; i < rows; i++) {
          trace = math.simplify(`(${trace}) + (${matrix[i][i]})`).toString();
        }
        return trace;
      } catch {
        return;
      }
    }
    let traceValue = trace(frstMatrix);
    let result = valueToKatex(traceValue);
    let decimalResult = parseNumber(evalLatex(traceValue), {}, 3);
    const finalAnswer = [
      {
        value: putSpace(
          `The trace of the Matrix A  is ${result} or ${decimalResult}`
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
        value: `We know that the Trace of a matrix can be obtained by adding all <br>the diagonal elements of the given matrix. It is denoted by Tr(A).
        `,
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
        value: `Given the matrix A`,
        type: 'span',
      },
      {
        value: frstMatrix
          .map((itm, i) =>
            itm.map((el, j) => `a_{${i + 1}${j + 1}} = ${el}`).join(',')
          )
          .join(','),
        type: 'equation',
      },
      {
        value: `To obtain the trace of the matrix we will add the diagonal entries`,
        type: 'span',
      },

      {
        value: `Tr(A) \\space = \\space ${frstMatrix
          .map((_, i) => `a_{${i + 1}${i + 1}}`)
          .join(' \\space + \\space ')}`,
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `${diagonalValue}=${diagonalvalueStep} =${result}`,
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
            <div className="col-4 text-left">Order of the matrix:</div>
            <div className="col-4">
              <Input
                value={row}
                setVal={setRow}
                min={1}
                max={10}
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

export default TraceOfAMatrix;
