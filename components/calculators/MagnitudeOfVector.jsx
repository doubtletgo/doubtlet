'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import Input from '../common/input';
import { isMatValid } from '../../helpers/Validations';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import MatrixInput from '../MatrixInput';

const MagnitudeOfVector = () => {
  const [size, setSize] = useState('3');
  const [vectorMat, setVectorMat] = useState([['3', '4', '4']]);
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let arr = vals.a.split(',').map((i) => convertIntoLatex(i));
      setSize(arr.length);
      setVectorMat([arr]);
    }
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Magnitude of the \\overrightarrow{U} \\bold{ \\bigg<{${vectorMat
              .map((i) => i.map((l) => l).join(','))
              .join(',')}} \\bigg>}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [vectorMat]);

  useEffect(() => {
    isInvalid.current = !size || !isMatValid(vectorMat);
    const vectors = vectorMat?.[0];
    if (!vectors || vectors.length <= 0) return;
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `\\overrightarrow{U}:  \\bold{\\bigg<{${vectorMat
              .map((i) => i.map((l) => l).join(','))
              .join(',')}}\\bigg>}`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;
    const simplifiedVector = vectors.map((i) => convertFromLatex(i));
    const sqrMat = simplifiedVector.map((i) => evalExpression(`(${i})^2`));
    const sqrSum = sqrMat.reduce(
      (acc, curr) => evalExpression(`${acc}+${curr}`),
      0
    );
    const sqrSumDecimals = evalInDecimals(`${sqrSum}`);
    const magnitudeAns = evalExpression(`sqrt(${sqrSum})`);
    const ansInDecimal = evalInDecimals(magnitudeAns);
    const isSame = sqrSum == sqrSumDecimals;
    const finalAnswer = [
      {
        value: putSpace(``),
        type: 'equation',
      },
      {
        value: putSpace(
          `The Magnitude is \\bold{\\sqrt{${convertIntoLatex(
            sqrSumDecimals
          )}} or {${ansInDecimal}}}`
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
        value: putSpace(`We know that Magnitude of any`),
        type: 'equation',
      },
      {
        value: putSpace(`\\overrightarrow{U} is given by the formula below `),
        type: 'equation',
      },

      {
        value: putSpace(
          ` \\overrightarrow{|U|} =\\sqrt{\\sum^{n}_{i=1}\\mid{u_i^2}\\mid}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Given input values are ${vectors.join(',')}`),
        type: 'equation',
      },

      {
        value: putSpace(`then by putting these values `),
        type: 'equation',
      },
      {
        value: putSpace(`in the above formula
        `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{|U|} =  \\sqrt{${vectors
            .map((i) => `({${i}})^2`)
            .join(' + ')}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `=  \\sqrt{${sqrMat.map((i) => convertIntoLatex(i)).join(' + ')}} ${
            isSame ? '' : ` = \\sqrt{${convertIntoLatex(sqrSum)}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `= \\sqrt{${convertIntoLatex(sqrSumDecimals)}} = ${ansInDecimal}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/fraction-addition-substraction-calculator?l=${vectors.join(
          ','
        )}"
            target="_blank">to see steps for fraction addition, click here
            </a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: putSpace(
          `Magnitude of the above given vector is  \\sqrt{${convertIntoLatex(
            sqrSumDecimals
          )}} or {${ansInDecimal}}`
        ),
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
  }, [vectorMat, showSteps, size]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setVectorMat([['', '', '']]);
    setSize(3);
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = !!size && isMatValid(vectorMat);
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-3">
            Your input can be in form of Integer, FRACTION or Real Number
          </div>
          <div className="row mb-3 align-items-center">
            <div className="col-4 text-left">Size of Vector:</div>
            <div className="col-4">
              <Input
                value={size}
                setVal={setSize}
                min={1}
                max={11}
                className="col-12"
              />
            </div>
          </div>
          <div className="row mb-3 align-items-center">
            <div className={`col-2 text-left mb-4`}>Vector U:</div>
            <div className="col-10 d-flex align-items-center">
              {size > 0 && (
                <MatrixInput
                  rows={1}
                  columns={size}
                  className="mb-0"
                  onUpdate={setVectorMat}
                  value={vectorMat}
                />
              )}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
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

export default MagnitudeOfVector;
