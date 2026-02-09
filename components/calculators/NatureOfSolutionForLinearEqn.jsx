'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MatrixInput from '../MatrixInput';
import { putSpace } from '../../helpers/general';
import {
  printMatrix,
  katexArrToSimpleArr,
  findRowEchelonForm,
} from '../../helpers/matrixHelper';
import { addSymbol } from '../../helpers/decimal';
import { isMatValid } from '../../helpers/Validations';
import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);

const findRank = (mat = []) => {
  const matrix = JSON.parse(JSON.stringify(mat));
  let arr = findRowEchelonForm(matrix);
  return arr.filter((itm) => !itm.every((el) => el == '0'))?.length;
};
const NatureOfSolutionForLinearEqn = () => {
  const [variables, setVariables] = useLocalStorage('NatureOfSolutionForLinearEqn_variables', '2');
  const [eqnMatrix, setEqnMatrix] = useLocalStorage('NatureOfSolutionForLinearEqn_eqnMatrix', [
    ['1', '2'],
    ['3', '4'],
  ]);
  const [resultMatrix, setResultMatrix] = useLocalStorage('NatureOfSolutionForLinearEqn_resultMatrix', [['3'], ['8']]);
  const [equation, setEquation] = useLocalStorage('NatureOfSolutionForLinearEqn_equation', '');
  const [solution, setSolution] = useLocalStorage('NatureOfSolutionForLinearEqn_solution', '');
  const [result, setResult] = useLocalStorage('NatureOfSolutionForLinearEqn_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('NatureOfSolutionForLinearEqn_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('NatureOfSolutionForLinearEqn_showSteps', true);
  const [note, setNote] = useLocalStorage('NatureOfSolutionForLinearEqn_note', undefined);
  let abc = ['A', 'B', 'C', 'D', 'E', 'F'];

  const withSymbol = (val, symbol) =>
    val ? `${val == 1 ? '' : val == -1 ? '-' : val}${symbol}` : val || 0;
  function compareRatios(mat) {
    let arr = JSON.parse(JSON.stringify(mat));
    try {
      let numCols = arr[0].length;
      let eqnArray = [];
      let ratioArray = [];
      const [rowOne, rowTwo] = mat;
      let frst = true;
      let val = '';
      for (let j = 0; j < numCols; j++) {
        ratioArray.push(`\\frac{${rowOne[j]}}{${rowTwo[j]}}`);
        let temp = math.simplify(`${rowOne[j]}/(${rowTwo[j]})`).toString();
        if (frst) {
          val = temp;
          frst = false;
        } else {
          eqnArray.push(temp == val ? '=' : '≠');
        }
      }
      return [ratioArray, eqnArray];
    } catch {
      return [[], []];
    }
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
    let vars = ['x', 'y', 'z', 'p', 'q', 'r'];
    let a = [...abc];
    return removeAdd(
      matrix
        .map(
          (itm, j) =>
            `${itm == '1' ? '+' : ''}${withSymbol(
              !!itm
                ? `${addSymbol(itm)}${removeSymbol(itm)}`
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
            `Find the nature of solution for the system of equation \\begin{Bmatrix} ${eqnMatrix
              .map(
                (itm, i) =>
                  `${createEqn(itm, i)} = ${
                    !!resultMatrix[i] ? resultMatrix[i] : `d_${i + 1}`
                  }`
              )
              .join('\\\\')}  \\end{Bmatrix} `
          ),
          type: 'equation',
        },
      ])
    );
  }, [eqnMatrix, resultMatrix, variables]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
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
    const isInvalid =
      !variables || !isMatValid(eqnMatrix) || !isMatValid(resultMatrix);
    if (isInvalid) return;
    const simpleEqn = katexArrToSimpleArr(eqnMatrix);
    const simpleResult = katexArrToSimpleArr(resultMatrix);
    const fullMat = simpleEqn.map((itm, i) => [...itm, ...simpleResult[i]]);
    let [values, signs] = compareRatios(fullMat);
    let rankA = findRank(eqnMatrix);
    let rankAB = findRank(fullMat);
    let isIndependent = signs[0] == '≠';
    let isDependent = signs.every((i) => i == '=');
    if (Number(variables) >= 3) {
      isIndependent = rankA == rankAB && rankA == variables;
      isDependent = rankA == rankAB && rankA < variables;
    }
    values = values?.map((itm, i) => [itm, signs[i]].join(''));
    const representaionType = isIndependent
      ? `Above given equations represents a pair of <b>Intersecting ${
          variables > 2 ? 'planes' : 'lines'
        }</b>.`
      : isDependent
      ? `Above given equations represents a pair of <b>Coincident ${
          variables > 2 ? 'planes' : 'lines'
        }</b>.`
      : `Above given equations represents a pair of <b>Parallel ${
          variables > 2 ? 'planes' : 'lines'
        }</b>.`;
    let solutionType = isIndependent
      ? '<b>Consistent</b> & has a <b>Unique</b> Solution.'
      : isDependent
      ? '<b>Consistent</b> & has<b> Infinite</b> number of Solutions'
      : '<b>Inconsistent</b> & has<b> No</b> Solution';

    const twoVariableStep = [
      {
        value: `
            We will check the ratios of the coefficients of the given equations.`,
        type: 'span',
      },
      {
        value: putSpace(`(${values.join(' ')})`),
        type: 'equation',
      },
      {
        value: `${representaionType}`,
        type: 'span',
      },
      'br',
      {
        value: `Hence, the system of equation is ${solutionType}`,
        type: 'span',
      },
    ];
    const threeVariableStep = [
      {
        value: `
           Given No. of Variables = ${variables}`,
        type: 'span',
      },
      'br',
      {
        value:
          'Write the coefficient & augmented matrix for the given system of equation.',
        type: 'span',
      },
      {
        value: putSpace(
          `A = ${printMatrix(eqnMatrix)} \\& AB = ${printMatrix(fullMat)}`
        ),
        type: 'equation',
      },
      {
        value: `Now, we will find the reank of both the matrices.`,
        type: 'span',
      },
      'br',
      {
        value: `Rank(A) = ${rankA}`,
        type: 'span',
      },
      {
        value: `<a href="/calculator/rank-of-a-matrix/?a=${eqnMatrix}&b=${variables}&c=${variables}"  target="_blank">to see the Steps to calculate the rank, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `Rank(AB) = ${rankAB}`,
        type: 'span',
      },
      {
        value: `<a href="/calculator/rank-of-a-matrix/?a=${fullMat}&b=${variables}&c=${
          Number(variables) + 1
        }"  target="_blank">to see the Steps to calculate the rank, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `Since, Rank(A) ${rankA == rankAB ? '=' : '≠'} Rank(AB)`,
        type: 'span',
      },
      'br',
      {
        value: `${representaionType}`,
        type: 'span',
      },
      'br',
      {
        value:
          rankA == rankAB
            ? `Since,( Rank(A)= ${rankA} )${
                rankA == variables ? '=' : '<'
              }(No. of variables =${variables})<br>`
            : '',
        type: 'span',
      },
      {
        value: `The system of equation will have ${solutionType}`,
        type: 'span',
      },
    ];
    let stepToShow = variables == '2' ? twoVariableStep : threeVariableStep;
    const finalAnswer = [
      {
        value: `Nature of solution for the system of equation is: -`,
        type: 'span',
      },
      'br',
      {
        value: `${representaionType}`,
        type: 'span',
      },
      'br',
      {
        value: `System is ${solutionType}`,
        type: 'span',
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
        value: `The nature of solutions for a system of ${
          variables == '2' ? 'two' : 'three'
        }-variable equations<br> can be one
         of three types:
         <ul>
           <li> Consistent and Independent (a unique solution)</li>
           <li> Consistent and Dependent (infinitely many solutions)</li>
            <li>Inconsistent (no solution)</li></ul>`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...stepToShow,
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
  }, [eqnMatrix, resultMatrix, variables, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );
  const onChangeVariables = (e) => {
    setVariables(e.target.value);
  };
  const clear = useCallback(() => {
    setEqnMatrix([
      ['', ''],
      ['', ''],
    ]);
    setResultMatrix([[''], ['']]);
    setVariables('2');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!variables && isMatValid(eqnMatrix) && isMatValid(resultMatrix);
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Number of Variables :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer, FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-4 text-left">Number of Variables:- </div>
            <div className="col-4">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={variables}
                onChange={onChangeVariables}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
          <div className="col-3 text-left d-flex">Equation Matrix: -</div>
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

export default NatureOfSolutionForLinearEqn;
