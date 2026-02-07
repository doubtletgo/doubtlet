'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import {
  evalExpression,
  evalInDecimals,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { getSearchParams, putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MatrixInput from '../MatrixInput';
import Input from '../common/input';
import { isMatValid } from '../../helpers/Validations';

const DotProductOfTwoVectors = () => {
  const [size, setSize] = useState('3');
  const [vectorOne, setVectorOne] = useState([['2', '2', '7']]);
  const [vectorTwo, setVectorTwo] = useState([['5', '7', '3']]);
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let v1 = vals.a.split(',');
      let v2 = vals.b.split(',');
      setSize(v1.length);
      setVectorOne([v1]);
      setVectorTwo([v2]);
    }
  }, []);

  useEffect(() => {
    const vector1 = vectorOne?.[0];
    const vector2 = vectorTwo?.[0];
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Dot Product} of the Vectors\\bold{ \\overrightarrow{U} (${vector1.join(
              ','
            )})} \\& \\bold{\\overrightarrow{V} (${vector2.join(',')})}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [vectorOne, vectorTwo]);

  useEffect(() => {
    isInvalid.current =
      !size || !isMatValid(vectorOne) || !isMatValid(vectorTwo);
    const vector1 = vectorOne?.[0];
    const vector2 = vectorTwo?.[0];
    let sameCoordinates = vector1.every((l, i) => l == vector2[i]);
    setIsPointSame(sameCoordinates);
    if (sameCoordinates) {
      setShowResult(false);
      setShowSteps(false);
    }
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Vector \\overrightarrow{U} : \\bold{\\bigg< {${vector1.join(
              ','
            )}} \\bigg>}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Vector \\overrightarrow{V} : \\bold{\\bigg< {${vector2.join(
              ','
            )}} \\bigg> }`
          ),
          type: 'equation',
        },
      ])
    );
    const parsedV1 = vector1.map(convertFromLatex);
    const parsedV2 = vector2.map(convertFromLatex);
    const mulitplication = parsedV1.map(
      (el, i) => `(${evalExpression(`(${el})*(${parsedV2[i]})`)})`
    );
    const sum = mulitplication.reduce(
      (acc, curr) => evalExpression(`(${acc})+(${curr})`),
      0
    );
    const ansInDecimals = evalInDecimals(sum);
    const isSame = sum == ansInDecimals;

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Dot Product \\overrightarrow{U} . \\overrightarrow{V}}  is \\bold{{${convertIntoLatex(
            sum
          )}}}${isSame ? '' : `or \\bold{${ansInDecimals}}`}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(``),
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

    const steps = [
      {
        value: putSpace(`We know that Dot product of two given vectors with `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{U}} \\& \\bold{\\overrightarrow{V}} is given by the formula below`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{U} . \\overrightarrow{V}= <x_1, y_1,z_1 ,...> . <x_2, y_2 ,z_2, ...>}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{=(x_1 . x_2) + (y_1 . y_2)+ (z_1 . z_2) + ....}`
        ),
        type: 'equation',
      },

      {
        value: `Given input values are`,
        type: 'span',
      },
      {
        value: putSpace(`\\overrightarrow{U} = ${vector1.join(',')}`),
        type: 'equation',
      },
      {
        value: putSpace(`\\overrightarrow{V} = ${vector2.join(',')}`),
        type: 'equation',
      },
      {
        value: `then by putting these values in the above formula`,
        type: 'span',
      },
      {
        value: `\\overrightarrow{U} . \\overrightarrow{V} = ${vector1
          .map((el, i) => `(${el})(${vector2[i]})`)
          .join(' + ')} 
        = {${mulitplication.map((l) => convertIntoLatex(l)).join(' + ')}}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `Dot product of above given vectors is = {${convertIntoLatex(sum)}} ${
            isSame ? '' : ` or ${ansInDecimals}`
          }`
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
  }, [vectorOne, vectorTwo, size, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setSize('2');
    setVectorOne([['', '']]);
    setVectorTwo([['', '']]);
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);
  const hasValue = !!size && isMatValid(vectorOne) && isMatValid(vectorTwo);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-3">
            Your input can be in form of Integer, Fraction or any Real Number
          </div>
          <div className="row mb-2 align-items-center">
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
          <div className="row  align-items-center">
            <div className={`col-2 text-left mb-4`}>
              V<sub>1</sub>:
            </div>
            <div className="col-10 d-flex align-items-center">
              {size > 0 && (
                <MatrixInput
                  rows={1}
                  columns={size}
                  className="mb-0"
                  onUpdate={setVectorOne}
                  value={vectorOne}
                />
              )}
            </div>
          </div>
          <div className="row mb-3 align-items-center">
            <div className={`col-2 text-left mb-4`}>
              V<sub>2</sub>:
            </div>
            <div className="col-10 d-flex align-items-center">
              {size > 0 && (
                <MatrixInput
                  rows={1}
                  columns={size}
                  className="mb-0"
                  onUpdate={setVectorTwo}
                  value={vectorTwo}
                />
              )}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasValue &&
        (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        ) : (
          <div>
            <strong>Note :-</strong> Since initial & final points are the same
            hence points are <strong>Coincident</strong> and distance between
            two coincident points is always <strong>ZERO</strong>.
          </div>
        ))}
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

export default DotProductOfTwoVectors;
