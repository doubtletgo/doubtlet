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
  printCurlyMatrix,
} from '../../helpers/matrixHelper';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import Vector from '../../helpers/Vectors';
import { isMatValid } from '../../helpers/Validations';

const GramSchmidt = () => {
  const [numberOfVectors, setNumberOfVectors] = useLocalStorage('GramSchmidt_numberOfVectors', '3');
  const [sizeOfVectors, setSizeOfVectors] = useLocalStorage('GramSchmidt_sizeOfVectors', '3');
  const [vectors, setVectors] = useLocalStorage('GramSchmidt_vectors', [
    ['0', '3', '4'],
    ['1', '0', '1'],
    ['1', '1', '3'],
  ]);
  const [equation, setEquation] = useLocalStorage('GramSchmidt_equation', '');
  const [solution, setSolution] = useLocalStorage('GramSchmidt_solution', '');
  const [result, setResult] = useLocalStorage('GramSchmidt_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('GramSchmidt_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('GramSchmidt_showSteps', true);
  const [note, setNote] = useLocalStorage('GramSchmidt_note', undefined);

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
          value: putSpace(`Orthonormalize the given set of vectors`),
          type: 'equation',
        },
        {
          value: putSpace(
            `${vectors
              .map((itm) => printMatrix(itm.map((el) => [el])))
              .join(',')} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(`using the Gram-Schmidt process.`),
          type: 'equation',
        },
      ])
    );
  }, [vectors, numberOfVectors, sizeOfVectors]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: ` ${printMatrix(vectors)}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !numberOfVectors || !isMatValid(vectors);
    if (isInvalid) return;

    const tempFirst = vectors.map((itm) =>
      itm.map((el) => convertFromLatex(el))
    );
    const allVectors = vectors.map((itm) => new Vector(itm));
    if (!tempFirst || !allVectors.length) return;
    const answers = [allVectors[0]];
    const finals = [allVectors[0].unitVector()];
    const stepsAr = allVectors
      .map((itm, i) => {
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

          let [x1, y1, z1] = subtractionVector._components;
          answers.push(subtractionVector);
          finals.push(subtractionVector.unitVector());
          let [x2, y2, z2] = vectorA._components;
          return [
            {
              value: `<b>Step-${i + 1}</b>`,
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
            ...projArr
              .map((el, m) => [
                {
                  value: putSpace(
                    `proj_{\\overrightarrow{u_${m + 1}}}\\overrightarrow{v_{${
                      i + 1
                    }}}= ${vectorA.projection(answers[m]).display()}`
                  ),
                  type: 'equation',
                },
                {
                  value: `<a href = "/calculator/vector-projection-calculator/?x2=${answers[m]._components[0]}&y2=${answers[m]._components[1]}&z2=${answers[m]._components[2]}&x1=${x2}&y1=${y2}&z1=${z2}" target="_blank">to see the Steps to find projection vector , click here</a>`,
                  type: 'span',
                  className: 'text-decoration-underline',
                },
                'br',
              ])
              .flat(),
            {
              value: putSpace(
                `\\overrightarrow{u_{${i + 1}}} = \\overrightarrow{v_{${
                  i + 1
                }}} - ${projArr
                  .map(
                    (el, m) =>
                      `proj_{\\overrightarrow{u_${m + 1}}}\\overrightarrow{v_{${
                        i + 1
                      }}}`
                  )
                  .join(' - ')} =  ${vectorA.display()} - ${projArr
                  .map((_, m) => vectorA.projection(answers[m]).display())
                  .join(' - ')} =${subtractionVector.display()} `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\^{u_{${i + 1}}} = \\frac{\\overrightarrow{u_{${
                  i + 1
                }}}}{\\vert \\overrightarrow{u_{${
                  i + 1
                }}} \\vert} = ${subtractionVector.unitVector().display()}`
              ),
              type: 'equation',
            },
            {
              value: `<a href = "/calculator/unit-vector-calculator/?x1=${x1}&y1=${y1}&z1=${z1}" target="_blank">to see the Steps to find unit vector , click here</a>`,
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
          ];
        } else {
          let [x1, y1, z1] = vectorA._components;
          return [
            {
              value: '<b>Step-1</b>',
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
            {
              value: putSpace(
                `\\overrightarrow{u_1} = \\overrightarrow{v_1} =  ${vectorA.display()} `
              ),
              type: 'equation',
            },
            {
              value: putSpace(
                `\\^{u_1} = \\frac{\\overrightarrow{u_1}}{\\vert \\overrightarrow{u_1} \\vert} = ${vectorA
                  .unitVector()
                  .display()}`
              ),
              type: 'equation',
            },
            {
              value: `<a href = "/calculator/unit-vector-calculator/?x1=${x1}&y1=${y1}&z1=${z1}" target="_blank">to see the Steps to find unit vector , click here</a>`,
              type: 'span',
              className: 'text-decoration-underline',
            },
            'br',
          ];
        }
      })
      .flat();
    const filteredFinalAnswer = JSON.parse(JSON.stringify(finals)).filter(
      (itm) => !itm._components.every((el) => el == '0')
    );
    const finalAnswer = [
      {
        value: putSpace(
          `The set of orthonormal vectors is {${filteredFinalAnswer
            .map((itm) =>
              printCurlyMatrix(
                itm._components.map((el) => [
                  convertIntoLatex(el).replaceAll('\\cdot', ''),
                ])
              )
            )
            .join(',')}}`
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
        value: `The Gram-Schmidt process is a method for orthogonalizing a set of vectors<br>
        in an inner product space, such as a vector space with a dot product.<br>
        The process takes a set of linearly independent vectors and converts<br>
        them into a set of orthogonal vectors.Formula to find the set of<br>
         orthonormal vectors is`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\overrightarrow{u_k} = \\overrightarrow{v_k} - \\sum^{k-1}_{j=i} Proj_{\\overrightarrow{uj}} (\\overrightarrow{v_k}) where \\bold{proj_{\\overrightarrow{uj}}} (\\overrightarrow{V_k}) = {\\overrightarrow{u_j} . \\overrightarrow{v_k}\\above{1pt}{|\\overrightarrow{u_j}|}^2} \\overrightarrow{u_j} is a vector projection`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Solution involves a separate step for each vector.`),
        type: 'equation',
      },
      ...stepsAr,
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
            <div className="col-6 text-left">Number of Vectors:</div>
            <div className="col-6">
              <Input
                value={numberOfVectors}
                setVal={setNumberOfVectors}
                min={1}
                pattern={/^((\d)*)\d*$/}
                max={11}
                className="col-12"
              />
            </div>
            <div className="col-6 text-left mt-2">Size of Vectors:</div>
            <div className="col-6 mt-2">
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

export default GramSchmidt;
