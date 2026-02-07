'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  evalInDecimals,
  removeSymbol,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import { addSymbol } from '../../helpers/decimal';

const AngleFormedByVectorWithCoordinateAxes = () => {
  const [x1, setX1] = useState('5');
  const [y1, setY1] = useState('\\sqrt{3}');
  const [z1, setZ1] = useState('4');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setZ1(vals.x1);
    if (vals.y1) setX1(vals.y1);
    if (vals.x2) setY1(vals.x2);
  }, []);

  const tempZ1 = convertFromLatex(z1);
  const tempY1 = convertFromLatex(y1);
  const tempX1 = convertFromLatex(x1);
  const x1Value = evalExpression(tempX1);
  const y1Value = evalExpression(tempY1);
  const z1Value = evalExpression(tempZ1);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the \\bold{Angle (\\alpha, \\beta, \\gamma)} formed by the given Vector`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `({${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(
              z1 || '1'
            )}}k) with the x, y, and z coordinate axes.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [z1, y1, x1]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          \\overrightarrow{A}: \\bigg<{${x1}}i  ${addSymbol(
            evalInDecimals(tempY1)
          )} {${removeSymbol(y1)}}j  ${addSymbol(
            evalInDecimals(tempZ1)
          )} {${removeSymbol(z1)}}k\\bigg>`,
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [z1, y1, x1].some((x) => !x);
    if (!showSteps) return;

    if (isInvalid.current) return;
    setIsPointSame(z1 == y1 && y1 == x1);
    const xSqr2 = evalExpression(`(${x1Value})^2`);
    const ySqr2 = evalExpression(`(${y1Value})^2`);
    const zSqr2 = evalExpression(`(${z1Value})^2`);
    const addOfSqr = evalExpression(` ${xSqr2}+(${ySqr2})+(${zSqr2})`);

    const x1DividedRootVal = evalInDecimals(
      evalExpression(`(${x1Value}) /  sqrt(${addOfSqr})`)
    );
    const y1DividedRootVal = evalInDecimals(
      evalExpression(`(${y1Value}) /  sqrt(${addOfSqr})`)
    );

    const z1DividedRootVal = evalInDecimals(
      evalExpression(`(${z1Value}) /  sqrt(${addOfSqr})`)
    );

    const alpha = evalExpression(`acos(${x1DividedRootVal}) * 57.2957795131`);
    const beta = evalExpression(`acos(${y1DividedRootVal}) * 57.2957795131`);
    const gamma = evalExpression(`acos(${z1DividedRootVal}) * 57.2957795131`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Angle (\\alpha, \\beta, \\gamma)} formed by the given Vector ({${convertIntoLatex(
            x1Value || '1'
          )}}i ${addSymbol(evalInDecimals(y1Value))} {${removeSymbol(
            convertIntoLatex(y1Value || '1')
          )}}j ${addSymbol(evalInDecimals(z1Value))} {${removeSymbol(
            convertIntoLatex(z1Value || '1')
          )}}k)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`with the x, y, and z coordinate axes `),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{${evalInDecimals(alpha)}}, {${evalInDecimals(
            beta
          )}}, {${evalInDecimals(gamma)}}} degrees respectively.`
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

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that the Angle (α, β, γ) formed by the given Vector`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} = ai+bj+ck is given by the formula below`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`l = cos(\\alpha) = {a \\above{1pt} \\lvert A \\rvert}, 
       m = cos(\\beta) = {b \\above{1pt} \\lvert A \\rvert}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `n = cos(\\gamma) = {c \\above{1pt} \\lvert A \\rvert}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where \\lvert A \\rvert is the magnitude of the given Vector.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now we can find the angles by taking the Cos inverse`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` of the direction cosines (l, m, n) of the given vector i.e.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\alpha = cos^{-1}(l), \\beta = cos^{-1}(m), \\gamma = cos^{-1}(n)}`
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
        value: `From the above input, it is given that`,
        type: 'span',
      },
      {
        value: putSpace(
          `a = \\bold{{${convertIntoLatex(
            x1Value
          )}}}, b = \\bold{{${convertIntoLatex(
            y1Value
          )}}} and c = \\bold{{${convertIntoLatex(z1Value)}}} `
        ),
        type: 'equation',
      },
      {
        value: `Now we have to find the magnitude of the given vector`,
        type: 'span',
      },
      {
        value: putSpace(
          `The Magnitude of \\overrightarrow{A} = \\sqrt{{${valueToKatex(
            addOfSqr
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/vector-magnitude-calculator/?a=${x1},${y1},${z1}" target="_blank">to see the magnitude of a vector, click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now putting the above-calculated value in`),
        type: 'equation',
      },
      {
        value: putSpace(`the above-given formula`),
        type: 'equation',
      },
      {
        value: `l = {{${valueToKatex(
          x1Value
        )}} \\above{1pt} {\\large{${valueToKatex(
          addOfSqr
        )}}}}, m = { {${valueToKatex(y1Value)}}\\above{1pt} {${valueToKatex(
          addOfSqr
        )}} }, n = { {${valueToKatex(z1Value)}}\\above{1pt} {${valueToKatex(
          addOfSqr
        )}} }`,
        type: 'equation',
      },

      {
        value: putSpace(`Then,`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\alpha = cos^{-1}({ ${x1}\\above{1pt} \\sqrt{{${valueToKatex(
            addOfSqr
          )}}} }) = cos^{-1}({${evalInDecimals(
            x1DividedRootVal
          )}}) = ${evalInDecimals(alpha)} Degree`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\beta =cos^{-1}({ ${y1}\\above{1pt} \\sqrt{{${valueToKatex(
            addOfSqr
          )}}} }) = cos^{-1}({${evalInDecimals(
            y1DividedRootVal
          )}}) =  ${evalInDecimals(beta)} Degree`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\gamma =cos^{-1}({ ${z1}\\above{1pt}\\sqrt{ {${valueToKatex(
            addOfSqr
          )}}} }) = cos^{-1}({${evalInDecimals(
            z1DividedRootVal
          )}}) =  ${evalInDecimals(gamma)} Degree`
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
  }, [z1, y1, x1, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setZ1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setY1('');
    setX1('');

    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [z1, y1, x1].some((v) => !!v || v == 0);
  const hasAllValue = [z1, y1, x1].every((v) => !!v || v == 0);
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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector A:</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setX1}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={x1}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setY1}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={y1}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setZ1}
                allowAlphabeticKeyboard={false}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z1}
              />{' '}
            </div>
          </div>

          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue &&
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
          className="default-btn rounded-pill mt-2 px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
        <>
          <Equation className="mt-3" equation={result} />
          {
            <button
              className="default-btn mt-3 rounded-pill px-5 btn-blue"
              onClick={toggleSteps}
            >
              Show Steps
            </button>
          }
        </>
      )}
      {hasAllValue && !isPointSame && showSteps && (
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

export default AngleFormedByVectorWithCoordinateAxes;
