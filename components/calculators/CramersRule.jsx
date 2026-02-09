'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { putSpace, simplifyKatex } from '../../helpers/general';
import { create, all, transpose } from 'mathjs';
import { parseNumber, addSymbol } from '../../helpers/decimal';
import {
  cofactorsOfARow,
  convertFromLatex,
  determenenantValue,
  evalInDecimals,
  printMatrix,
  transposeOfMatrix,
  valueToKatex,
} from '../../helpers/matrixHelper';

import { isMatValid } from '../../helpers/Validations';

const config = {};
const math = create(all, config);

const isSame = (a, b) => a.toString().replace(/[{}]/g, '') == b;

const CramersRule = () => {
  const [variables, setVariables] = useLocalStorage('CramersRule_variables', '2');
  const [eqnMatrix, setEqnMatrix] = useLocalStorage('CramersRule_eqnMatrix', [
    ['1.5', '\\frac{2}{3}'],
    ['3', '-\\frac{2}{3}'],
  ]);
  const [resultMatrix, setResultMatrix] = useLocalStorage('CramersRule_resultMatrix', [['2'], ['1']]);
  const [equation, setEquation] = useLocalStorage('CramersRule_equation', '');
  const [solution, setSolution] = useLocalStorage('CramersRule_solution', '');
  const [result, setResult] = useLocalStorage('CramersRule_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('CramersRule_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('CramersRule_showSteps', true);
  const [note, setNote] = useLocalStorage('CramersRule_note', undefined);
  let varArr = ['x', 'y', 'z', 'p', 'q'];
  let abc = ['A', 'B', 'C', 'D', 'E'];

  const withSymbol = (val, symbol) =>
    val ? `${val == 1 ? '' : val == -1 ? '-' : val}${symbol}` : val || 0;

  function selectColumns(mat1 = [], mat2 = [], clm) {
    if (!mat1 || !mat2 || clm < 0) return mat1;
    mat1 = transposeOfMatrix(mat1);
    mat1.splice(clm, 1, mat2.flat());
    return transpose(mat1);
  }
  function removeAdd(val) {
    if (!val) return '';
    if (/^\+/.test(val.replace(/[(){}]/g, ''))) {
      return val.replace('+', '');
    }
    return val;
  }
  const removeSymbol = (val) => {
    val = val?.toString();
    if (val?.toString()[0] == '-') return val.slice(1, val.length);
    return val;
  };
  function createEqn(matrix, i) {
    let vars = ['x', 'y', 'z', 'p', 'q'];

    let a = [...abc];

    return removeAdd(
      matrix
        .map(
          (itm, j) =>
            `${withSymbol(
              !!itm
                ? `${addSymbol(
                    evalInDecimals(convertFromLatex(itm))
                  )}${removeSymbol(itm)}`
                : `+${a[j]}_${i + 1}`,
              vars[j]
            )}`
        )
        .join(' ')
    );
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
            `Solve the given system of equations \\begin{Bmatrix} ${eqnMatrix
              .map(
                (itm, i) =>
                  `${createEqn(itm, i)} = ${
                    !!resultMatrix[i] ? resultMatrix[i] : `d_${i + 1}`
                  }`
              )
              .join('\\\\')}  \\end{Bmatrix} for ${varArr
              .slice(0, variables)
              .join(',')} by using Cramer’s Rule.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [variables, eqnMatrix, resultMatrix]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `No. of variables : ${variables || 0}`,
          type: 'span',
        },
        {
          value: putSpace(
            `System of Equations : \\begin{Bmatrix} ${eqnMatrix
              .map(
                (itm, i) =>
                  `${createEqn(itm, i)} = ${
                    !!resultMatrix[i] ? resultMatrix[i] : `d_${i + 1}`
                  }`
              )
              .join('\\\\')}  \\end{Bmatrix}`
          ),
          type: 'equation',
        },
      ])
    );
    let isInvalid =
      !variables || !isMatValid(eqnMatrix) || !isMatValid(resultMatrix);
    if (isInvalid) return;

    let cofactorsOfEqnMatrix = cofactorsOfARow(eqnMatrix, 0);
    const determinantOfEqnMatrix = determenenantValue(cofactorsOfEqnMatrix);
    const simpleDtrmnt = simplifyKatex(determinantOfEqnMatrix);
    const determinantSteps = [];
    const variableValues = [];
    const decimals = [];
    try {
      let i = 1;
      while (i - 1 < variables) {
        if (isSame(determinantOfEqnMatrix, '0')) break;
        let x = varArr[i - 1];
        let selectedMatrix = selectColumns(eqnMatrix, resultMatrix, i - 1);
        let cofactorEqn = cofactorsOfARow(selectedMatrix, 0);
        let dtrmntOfSelectedMtrx = determenenantValue(cofactorEqn);
        let simpleVal = simplifyKatex(dtrmntOfSelectedMtrx);
        let finalValue = math
          .simplify(`${simpleVal}/(${simpleDtrmnt})`)
          .toString();
        let katexValue = valueToKatex(finalValue);
        let step = [
          {
            value: `<b>Step-${i + 1}</b>`,
            type: 'span',
            className: 'text-decoration-underline',
          },
          'br',
          {
            value: `Now, we will find the determinant of the matrix where ${x} column matrix is replaced by column matrix B.`,
            type: 'span',
          },
          {
            value: `A_${x}= ${printMatrix(selectedMatrix)}`,
            type: 'equation',
          },
          {
            value: `D_${x}=|A_${x}|=${dtrmntOfSelectedMtrx}`,
            type: 'equation',
          },
          {
            value: `<a href="/calculator/determinant-of-a-matrix/?a=${selectedMatrix}&b=${variables}"  target="_blank">to see the Steps to calculate the determinant, click here</a>`,
            type: 'span',
          },
          'br',
          {
            value: `Now we can find the value of ${x} variable as`,
            type: 'span',
          },
          {
            value: `${x}= {D_${x}\\above{1pt}D} = {${dtrmntOfSelectedMtrx}\\above{1pt}(${simpleDtrmnt.replace(
              /[()]/g,
              ''
            )})} = ${katexValue}`,
            type: 'equation',
          },
        ];
        determinantSteps.push(...step);
        variableValues.push(katexValue);
        decimals.push(
          parseNumber(math.evaluate(`${finalValue}`).toString(), {}, 3)
        );
        i++;
      }
    } catch {
      return;
    }
    const finalAnswer = [
      {
        value: isSame(determinantOfEqnMatrix, '0')
          ? putSpace(
              'Since determinant of the coefficient matrix A = 0 then This given system of equations can’t be solved by Cramer’s Rule method.'
            )
          : putSpace(
              `The solution for the given system of equations  \\begin{Bmatrix} ${eqnMatrix
                .map(
                  (itm, i) =>
                    `${createEqn(itm, i)} = ${
                      !!resultMatrix[i] ? resultMatrix[i] : `d_${i + 1}`
                    }`
                )
                .join('\\\\')}  \\end{Bmatrix} by using cramer’s Rule is `
            ),
        type: 'equation',
      },
      {
        value: `${variableValues
          .map(
            (itm, i) =>
              `${varArr[i]} = {${itm}}${
                isSame(itm, decimals[i])
                  ? ''
                  : ` \\space or \\space ${decimals[i]}`
              }`
          )
          .join(' \\space \\& \\space ')}`,
        type: `equation`,
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
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `We know that the Cramer’s rule is the method to solve  <br> 
        system of equations by using determinants by writing the equations in the matrix form as AX = B where`,
        type: 'span',
      },
      'br',
      {
        value: `
        A = the Coefficient matrix (it should be a square matrix)<br>
        X = The column matrix with variables<br>
        B = The column matrix with constants (on the right side of equations)
        `,
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
        value: `From the given equations we can find coefficient matrix as`,
        type: 'span',
      },
      {
        value: `A = ${printMatrix(eqnMatrix)}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `${`First, we have to calculate the determinant of A as D = |A| = ${determinantOfEqnMatrix} ${
            isSame(determinantOfEqnMatrix, '0') ? '=' : '≠'
          } 0`}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/determinant-of-a-matrix/?a=${eqnMatrix}&b=${variables}"  target="_blank">to see the Steps to calculate the determinant, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: isSame(determinantOfEqnMatrix, '0')
          ? 'Since determinant of the coefficient matrix A = 0 then This given system of equations can’t be solved by Cramer’s Rule method.'
          : '',
        type: 'span',
      },
      'br',
      ...determinantSteps,
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
  }, [showSteps, variables, eqnMatrix, resultMatrix]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setEqnMatrix([
      ['', ''],
      ['', ''],
    ]);
    setResultMatrix([[''], ['']]);
    setVariables('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);
  const hasValue =
    !!variables && isMatValid(eqnMatrix) && isMatValid(resultMatrix);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mb-4 mb-md-0">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer, Fraction or Real Number
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-3 text-left">Number of Variables:</div>
            <div className="col-6">
              <Input
                value={variables}
                setVal={setVariables}
                min={1}
                max={11}
                pattern={/^((\d)*)\d*$/}
                className="col-12"
              />
            </div>
          </div>
          <div className="col-3 text-left d-flex">Given Matrix: -</div>
          {variables > 0 && (
            <div className="col-12 d-flex me-3">
              <MatrixInput
                rows={variables}
                columns={variables}
                onUpdate={setEqnMatrix}
                value={eqnMatrix}
              />
              <div className="align-self-center h3">=</div>
              <MatrixInput
                rows={variables}
                columns={1}
                value={resultMatrix}
                onUpdate={setResultMatrix}
              />
            </div>
          )}
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

export default CramersRule;
