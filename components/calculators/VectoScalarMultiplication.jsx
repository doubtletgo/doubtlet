'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  removeSymbol,
  evalInDecimals,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';

const VectorScalarMultiplication = () => {
  const [x1, setX1] = useState('3');
  const [x2, setX2] = useState('2');
  const [y2, setY2] = useState('7');
  const [z2, setZ2] = useState('2');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const [answer, setAnswer] = useState('');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.z2) setZ2(vals.z2);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
  }, []);

  const tempX1 = convertFromLatex(x1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);
  const tempZ2 = convertFromLatex(z2);

  const x1Value = evalExpression(tempX1);
  const x2Value = evalExpression(tempX2);
  const y2Value = evalExpression(tempY2);
  const z2Value = evalExpression(tempZ2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Multiply the scalar \\bold{{${x1}}} with the given Vector`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(\\bold{{${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ2)
            )} {${removeSymbol(z2 || '1')}}}k)
            `
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y2, z2, x2, y2, z2]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Scalar(k): \\bigg<\\bold{{${x1 || '1'}}} \\bigg>`),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{A} : \\bigg<\\bold{{${x2 || '1'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )}  {${removeSymbol(y2 || '1')}}j  ${addSymbol(
              evalInDecimals(tempZ2)
            )} {${removeSymbol(z2 || '1')}}}k
 \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    isInvalid.current = [x1, y2, z2, x2, y2, z2].some((x) => !x);

    if (isInvalid.current) return;
    if (x1 == x2 && y1 == y2 && z1 == z2) setIsPointSame(true);
    else setIsPointSame(false);
    // Multiplying
    let x = evalExpression(`(${x1Value}) * (${x2Value})`);
    let y = evalExpression(`(${x1Value}) * (${y2Value})`);
    let z = evalExpression(`(${x1Value}) * (${z2Value})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The result of Multiplication of scalar {${valueToKatex(
            x1Value
          )}} with `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the given Vector \\bold{\\overrightarrow{A}} \\bigg(\\bold{{${valueToKatex(
            x2Value
          )}}i ${addSymbol(evalInDecimals(y2Value))}  {${removeSymbol(
            valueToKatex(y2Value)
          )}}j  ${addSymbol(evalInDecimals(z2Value))} {${removeSymbol(
            valueToKatex(z2Value)
          )}}}k\\bigg)is `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bigg({${valueToKatex(x)}}i ${addSymbol(
            evalInDecimals(y)
          )} {${removeSymbol(valueToKatex(y))}}j ${addSymbol(
            evalInDecimals(z)
          )} {${removeSymbol(
            valueToKatex(z)
          )}}k\\bigg) or \\bold{({${evalInDecimals(x)}}i  ${addSymbol(
            evalInDecimals(y)
          )} {${removeSymbol(evalInDecimals(y))}}j  ${addSymbol(
            evalInDecimals(z)
          )} {${removeSymbol(evalInDecimals(z))}}k)} `
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
    setAnswer(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`We can multiply any scalar quantity with `),
        type: 'equation',
      },
      {
        value: putSpace(`the given vector by directly multiplying it`),
        type: 'equation',
      },

      {
        value: putSpace(`with the each of x, y, and z components of `),
        type: 'equation',
      },
      {
        value: putSpace(`the given vector.`),
        type: 'equation',
      },

      {
        value: putSpace(`Given Input is `),
        type: 'equation',
      },
      {
        value: putSpace(`k = ({${convertIntoLatex(x1Value)}})`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x, y, z) = \\bigg({${convertIntoLatex(
            x2Value
          )}}, {${convertIntoLatex(y2Value)}}, {${convertIntoLatex(
            z2Value
          )}}\\bigg)`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`Multiplying the scalar value with the x component`),
        type: 'equation',
      },
      {
        value: putSpace(
          `k.x = {${valueToKatex(x1Value)}} * {${valueToKatex(
            x2Value
          )}} = {${valueToKatex(x)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Multiplying the scalar value with the y component`),
        type: 'equation',
      },
      {
        value: putSpace(
          `k.y = {${valueToKatex(x1Value)}} * {${valueToKatex(
            y2Value
          )}} = {${valueToKatex(y)}} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(`Multiplying the scalar value with the z component`),
        type: 'equation',
      },
      {
        value: putSpace(
          ` k.z = {${valueToKatex(x1Value)}} * {${valueToKatex(
            x2Value
          )}} = {${valueToKatex(z)}} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `so, the result of k.\\overrightarrow{A}  = \\bigg({${valueToKatex(
            x
          )}}i ${addSymbol(evalInDecimals(y))} {${removeSymbol(
            valueToKatex(y)
          )}}j ${addSymbol(evalInDecimals(z))} {${removeSymbol(
            valueToKatex(z)
          )}}k\\bigg)`
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
  }, [x1, y2, z2, x2, y2, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    setX1('');
    setZ2('');
    setX2('');
    setY2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y2, z2, x2, y2, z2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y2, z2, x2, y2, z2].every((v) => !!v || v == 0);
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
            Your input can be in the form of an Integer,Fraction or Real Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Scalar value:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setX1}
              initialLatex={x1}
              numericToolbarKeys={[
                'epower',
                'pi',
                'ln',
                'log',
                'dot',
                // "infty",
                // "theta",
                'sin',
                'cos',
                'tan',
              ]}
              allowAlphabeticKeyboard={false}
              style={{
                width: '75%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Vector A: </div>

            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setX2}
              initialLatex={x2}
              numericToolbarKeys={[
                'epower',
                'pi',
                'ln',
                'log',
                'dot',
                // "infty",
                // "theta",
                'sin',
                'cos',
                'tan',
              ]}
              allowAlphabeticKeyboard={false}
              style={{
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setY2}
              numericToolbarKeys={[
                'epower',
                'pi',
                'ln',
                'log',
                'dot',
                // "infty",
                // "theta",
                'sin',
                'cos',
                'tan',
              ]}
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
              initialLatex={y2}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setZ2}
              initialLatex={z2}
              numericToolbarKeys={[
                'epower',
                'pi',
                'ln',
                'log',
                'dot',
                // "infty",
                // "theta",
                'sin',
                'cos',
                'tan',
              ]}
              allowAlphabeticKeyboard={false}
              style={{
                width: '28%',
              }}
            />
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
          <Equation className="mt-3" equation={answer} />
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

export default VectorScalarMultiplication;
