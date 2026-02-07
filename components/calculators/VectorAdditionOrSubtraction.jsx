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
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { addSymbol } from '../../helpers/decimal';

const VectorAdditionOrSubtraction = () => {
  const [x1, setX1] = useState('2');
  const [y1, setY1] = useState('5');
  const [z1, setZ1] = useState('3');
  const [x2, setX2] = useState('2');
  const [y2, setY2] = useState('7');
  const [z2, setZ2] = useState('7');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState('Addition');
  const isAdd = order === 'Addition';
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
  }, []);

  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempZ1 = convertFromLatex(z1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);
  const tempZ2 = convertFromLatex(z2);

  const x1Value = evalExpression(tempX1);
  const y1Value = evalExpression(tempY1);
  const z1Value = evalExpression(tempZ1);
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
            `Find the \\bold{${
              isAdd ? `Addition` : 'Subtraction'
            }}  of the Vectors`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{\\overrightarrow{A}}(\\bold{{${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(
              z1 || '1'
            )}}}k ) \\& \\bold{\\overrightarrow{B}}( \\bold{{${
              x2 || '1'
            }}i ${addSymbol(evalInDecimals(tempY2))}  {${removeSymbol(
              y2 || '1'
            )}}j  ${addSymbol(evalInDecimals(tempZ2))} {${removeSymbol(
              z2 || '1'
            )}}}k)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2, isAdd]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `\\overrightarrow{A} : < \\bold{{${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1 || '1')}}}k >`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{B} : < \\bold{{${x2 || '1'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )}  {${removeSymbol(y2 || '1')}}j  ${addSymbol(
              evalInDecimals(tempZ2)
            )} {${removeSymbol(z2 || '1')}}}k >`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, y1, z1, x2, y2, z2].some((x) => !x);
    if (isInvalid.current) return;
    if (x1 == x2 && y1 == y2 && z1 == z2) setIsPointSame(true);
    else {
      setIsPointSame(false);
    }
    //Subtraction
    let sub1 = evalExpression(`(${x1Value}) - (${x2Value})`);
    let sub2 = evalExpression(`(${y1Value}) - (${y2Value})`);
    let sub3 = evalExpression(`(${z1Value}) - (${z2Value})`);

    //Addition
    let add1 = evalExpression(`(${x1Value}) + (${x2Value})`);
    let add2 = evalExpression(`(${y1Value}) + (${y2Value})`);
    let add3 = evalExpression(`(${z1Value}) + (${z2Value})`);

    let subSteps = [
      {
        value: putSpace(
          `(\\bold{{${x1 || '1'}}i ${addSymbol(
            evalInDecimals(y1)
          )} {${removeSymbol(y1)}}j ${addSymbol(
            evalInDecimals(z1)
          )} {${removeSymbol(z1)}}}k ) - ( \\bold{{${x2}}i ${addSymbol(
            evalInDecimals(y2)
          )}  {${removeSymbol(y2)}}j  ${addSymbol(
            evalInDecimals(z2)
          )} {${removeSymbol(z2)}}}k) = (\\bold{${evalInDecimals(
            sub1
          )}i ${addSymbol(evalInDecimals(sub2))} ${removeSymbol(
            evalInDecimals(sub2)
          )}j  ${addSymbol(evalInDecimals(sub3))} ${removeSymbol(
            evalInDecimals(sub3)
          )}}k)`
        ),
        type: 'equation',
      },
    ];

    let addSteps = [
      {
        value: putSpace(
          ` (\\bold{{${x1 || '1'}}i ${addSymbol(
            evalInDecimals(y1)
          )} {${removeSymbol(y1)}}j ${addSymbol(
            evalInDecimals(z1)
          )} {${removeSymbol(z1)}}}k ) + ( \\bold{{${x2}}i ${addSymbol(
            evalInDecimals(y2)
          )}  {${removeSymbol(y2)}}j  ${addSymbol(
            evalInDecimals(z2)
          )} {${removeSymbol(z2)}}}k) =  (\\bold{${evalInDecimals(
            add1
          )}i ${addSymbol(evalInDecimals(add2))} ${removeSymbol(
            evalInDecimals(add2)
          )}j  ${addSymbol(evalInDecimals(add3))} ${removeSymbol(
            evalInDecimals(add3)
          )}}k)`
        ),
        type: 'equation',
      },
    ];

    let stepsShow = isAdd ? addSteps : subSteps;

    let addfinalAnswer = [
      {
        value: putSpace(`The \\bold{Addition} of the Given Vectors`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{A}}(\\bold{{${valueToKatex(
            x1Value
          )}} ${addSymbol(evalInDecimals(y1Value))} {${removeSymbol(
            valueToKatex(y1Value)
          )}}j ${addSymbol(evalInDecimals(z1Value))} {${removeSymbol(
            valueToKatex(z1Value)
          )}}}k ) \\&  \\bold{\\overrightarrow{B}}( \\bold{{${valueToKatex(
            x2Value
          )}}i ${addSymbol(evalInDecimals(y2Value))}  {${removeSymbol(
            valueToKatex(y2Value)
          )}}j  ${addSymbol(evalInDecimals(z2Value))} {${removeSymbol(
            valueToKatex(z2Value)
          )}}}k) is (\\bold{${evalInDecimals(add1)}i ${addSymbol(
            evalInDecimals(add2)
          )} ${removeSymbol(evalInDecimals(add2))}j  ${addSymbol(
            evalInDecimals(add3)
          )} ${removeSymbol(evalInDecimals(add3))}}k)`
        ),
        type: 'equation',
      },
    ];

    let subfinalAnswer = [
      {
        value: putSpace(`The \\bold{Subtraction} of the Given Vectors`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{A}}(\\bold{{${valueToKatex(
            x1Value
          )}} ${addSymbol(evalInDecimals(y1Value))} {${removeSymbol(
            valueToKatex(y1Value)
          )}}j ${addSymbol(evalInDecimals(z1Value))} {${removeSymbol(
            valueToKatex(z1Value)
          )}}}k ) \\& \\bold{\\overrightarrow{B}}( \\bold{{${valueToKatex(
            x2Value
          )}}i ${addSymbol(evalInDecimals(y2Value))}  {${removeSymbol(
            valueToKatex(y2Value)
          )}}j  ${addSymbol(evalInDecimals(z2Value))} {${removeSymbol(
            valueToKatex(z2Value)
          )}}}k) is  (\\bold{${evalInDecimals(sub1)}i ${addSymbol(
            evalInDecimals(sub2)
          )} ${removeSymbol(evalInDecimals(sub2))}j  ${addSymbol(
            evalInDecimals(sub3)
          )} ${removeSymbol(evalInDecimals(sub3))}}k)`
        ),
        type: 'equation',
      },
    ];

    let stepsFinalAnswer = isAdd ? addfinalAnswer : subfinalAnswer;
    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',

      ...finalAnswer,
    ];

    const finalAnswer = [...stepsFinalAnswer];
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
        value: putSpace(`We know that \\bold{${
          isAdd ? `Addition` : 'Subtraction'
        } } of vectors is only valid if
        `),
        type: 'equation',
      },
      {
        value: putSpace(
          `both have same dimension means same number of elements. `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `We can \\bold{${
            isAdd ? `Add` : 'Subtract'
          } } two vectors by  \\bold{${isAdd ? `Additing` : 'Subtracting'} }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the corresponding elements of the given vectors.`),
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
        value: `Given input values are: -`,
        type: 'span',
      },
      {
        value: putSpace(
          ` x_1 = {${convertIntoLatex(x1Value)}}, y_1 = {${convertIntoLatex(
            y1Value
          )}}, z_1 = {${convertIntoLatex(z1Value)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_2 = {${convertIntoLatex(x2Value)}}, y_2 = {${convertIntoLatex(
            y2Value
          )}}, z_2 = {${convertIntoLatex(z2Value)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `then by adding the respective elements of the above given vectors`
        ),
        type: 'equation',
      },
      ...stepsShow,

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
  }, [x1, y1, z1, x2, y2, z2, isAdd, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');

    setX1('');
    setY1('');
    setZ1('');
    setX2('');
    setY2('');
    setZ2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, x2, y2, z2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, x2, y2, z2].every((v) => !!v || v == 0);
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
            Your input can be in the form of an Integer, Fraction or Real Number
          </div>

          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Operation</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Addition">Addition</option>
                <option value="Subtraction">Subtraction</option>
              </select>
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Vector A: </div>
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
                width: '27%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setY1}
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
              initialLatex={y1}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setZ1}
              initialLatex={z1}
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
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Vector B: </div>

            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
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
              setMathfieldRef={(ref) => (mf5.current = ref)}
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
              setMathfieldRef={(ref) => (mf6.current = ref)}
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

export default VectorAdditionOrSubtraction;
