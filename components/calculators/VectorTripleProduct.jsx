'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  removeSymbol,
  evalInDecimals,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';

const VectorTripleProduct = () => {
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('2');
  const [z1, setZ1] = useState('3');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('5');
  const [z2, setZ2] = useState('6');
  const [x3, setX3] = useState('7');
  const [y3, setY3] = useState('8');
  const [z3, setZ3] = useState('9');
  const [result, setResult] = useState();
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
    if (vals.x3) setX3(vals.x3);
    if (vals.y3) setY3(vals.y3);
    if (vals.z3) setZ3(vals.z3);
  }, []);
  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempZ1 = convertFromLatex(z1);
  const tempX2 = convertFromLatex(x2);
  const tempY2 = convertFromLatex(y2);
  const tempZ2 = convertFromLatex(z2);
  const tempX3 = convertFromLatex(x3);
  const tempY3 = convertFromLatex(y3);
  const tempZ3 = convertFromLatex(z3);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Vector Triple Product} of the `),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{A}(\\bold{{${x1 || 'a'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )}  {${removeSymbol(y1 || 'b')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1 || 'c')}}}k), \\overrightarrow{B}(\\bold{{${
              x2 || 'a'
            }}i${addSymbol(evalInDecimals(tempY2))} {${removeSymbol(
              y2 || 'b'
            )}}k${addSymbol(evalInDecimals(tempZ2))}{${removeSymbol(
              z2 || 'c'
            )}}}k) \\& \\overrightarrow{C}(\\bold{{${x3 || 'a'}}i${addSymbol(
              evalInDecimals(tempY3)
            )} {${removeSymbol(y3 || 'b')}}j${addSymbol(
              evalInDecimals(tempZ3)
            )} {${removeSymbol(z3 || 'c')}}}k)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1, x2, y2, z2, x3, y3, z3]);

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
            `Vector \\overrightarrow{A}: ({${x1 || '1'}}i ${addSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1 || '1')}}k)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Vector \\overrightarrow{B}: ({${x2 || '1'}}i ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ2)
            )} {${removeSymbol(z2 || '1')}}k)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Vector \\overrightarrow{C}: ({${x3 || '1'}}i ${addSymbol(
              evalInDecimals(tempY3)
            )} {${removeSymbol(y3 || '1')}}j ${addSymbol(
              evalInDecimals(tempZ3)
            )} {${removeSymbol(z3 || '1')}}k)`
          ),
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1, y1, z1, x2, y2, z2, x3, y3, z3].some((x) => !x);

    if (isInvalid.current) return;
    if (x1 == x2 && y1 == y2 && z1 == z2) setIsPointSame(true);
    else {
      setIsPointSame(false);
    }
    const x1Value = evalExpression(tempX1);
    const y1Value = evalExpression(tempY1);
    const z1Value = evalExpression(tempZ1);
    const x2Value = evalExpression(tempX2);
    const y2Value = evalExpression(tempY2);
    const z2Value = evalExpression(tempZ2);
    const x3Value = evalExpression(tempX3);
    const y3Value = evalExpression(tempY3);
    const z3Value = evalExpression(tempZ3);

    //variables

    //  A x B = D
    let y1IntoZ2 = evalExpression(`${y1Value} * (${z2Value})`);
    let y2IntoZ1 = evalExpression(`${y2Value} * (${z1Value})`);
    let x1IntoZ2 = evalExpression(`${x1Value} * (${z2Value})`);
    let x2IntoZ1 = evalExpression(`${x2Value} * (${z1Value})`);
    let x1IntoY2 = evalExpression(`${x1Value} * (${y2Value})`);
    let x2IntoY1 = evalExpression(`${x2Value} * (${y1Value})`);
    let i = evalExpression(`${y1IntoZ2} - (${y2IntoZ1})`);
    let j = evalExpression(`${x1IntoZ2} - (${x2IntoZ1})`);
    let k = evalExpression(`${x1IntoY2} - (${x2IntoY1})`);

    //  D x C
    // x1 = i,   y1=j,  z1 =k,  x2 =x3,  y2=y3, z2= z3
    const vlaueY1IntoZ2 = evalExpression(`-1 *(${j}) * (${z3Value})`);
    const valueY2IntoZ1 = evalExpression(`${y3Value} * (${k})`);
    const vlaueX1IntoZ2 = evalExpression(`(${i}) * (${z3Value})`);
    const vlaueX2IntoZ1 = evalExpression(`${x3Value} * (${k})`);
    const vlaueX1IntoY2 = evalExpression(`(${i}) * (${y3Value})`);
    const vlaueX2IntoY1 = evalExpression(`-1 *(${x3Value}) * (${j})`);
    let iTow = evalExpression(`(${vlaueY1IntoZ2}) - (${valueY2IntoZ1})`);
    let jTow = evalExpression(`(${vlaueX1IntoZ2}) - (${vlaueX2IntoZ1})`);
    let kTow = evalExpression(`(${vlaueX1IntoY2}) - (${vlaueX2IntoY1})`);
    //  -------------------End Variables-------------############------------------//

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Vector Triple Product} is (\\bold{{${evalInDecimals(
            iTow
          )}}i ${minusSymbol(evalInDecimals(jTow))} {${removeSymbol(
            evalInDecimals(jTow)
          )}}j ${addSymbol(evalInDecimals(kTow))} {${removeSymbol(
            evalInDecimals(kTow)
          )}}k})`
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
          ` We know that the \\bold{Vector Triple Product} of the given Vectors`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{A} (x_1, y_1, z_1), \\overrightarrow{B} (x_2, y_2, z_2) \\& \\overrightarrow{C} (x_3, y_3, z_3)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Vector Triple Product = \\bold{(\\overrightarrow{A} x \\overrightarrow{B}) x \\overrightarrow{C}}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(`Now, Given values are`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_1, y_1, z_1) = ({${convertIntoLatex(
            x1Value
          )}}, {${convertIntoLatex(y1Value)}}, {${convertIntoLatex(z1Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2, z_2) = ({${convertIntoLatex(
            x2Value
          )}}, {${convertIntoLatex(y2Value)}}, {${convertIntoLatex(z2Value)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_3, y_3, z_3) = ({${convertIntoLatex(
            x3Value
          )}}, {${convertIntoLatex(y3Value)}}, {${convertIntoLatex(z3Value)}})`
        ),
        type: 'equation',
      },
      {
        value:
          putSpace(`First, we have to find the cross-product of  \\overrightarrow{A} \\&   \\overrightarrow{B}
        `),
        type: 'equation',
      },

      {
        value: putSpace(
          `(\\overrightarrow{A} x \\overrightarrow{B}) = {${evalInDecimals(
            i
          )}}i ${minusSymbol(evalInDecimals(j))} {${removeSymbol(
            evalInDecimals(j)
          )}}j ${addSymbol(k)} {${removeSymbol(convertIntoLatex(k))}}k`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cross-product-of-two-vectors-calculator/?x1=${x1}&y1=${y1}
        &z1=${z1}&x2=${x2}&y2=${y2}&z2=${z2}" 
        target="_blank">to see the steps to find the cross product, click here</a>`,
        type: `span`,
      },
      {
        value: `Step-2`,
        type: 'span',
      },
      {
        value: putSpace(
          `Now, we have to assume the vector obtained from \\overrightarrow{A} x \\overrightarrow{B} as \\overrightarrow{D}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now, we have to again find the cross−product of \\overrightarrow{D} \\& \\overrightarrow{C}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(\\overrightarrow{D} x \\overrightarrow{C}) = \\bold{{${evalInDecimals(
            iTow
          )}}i ${minusSymbol(evalInDecimals(jTow))} {${removeSymbol(
            evalInDecimals(jTow)
          )}}j ${addSymbol(evalInDecimals(kTow))} {${removeSymbol(
            evalInDecimals(kTow)
          )}}k}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cross-product-of-two-vectors-calculator/?x1=${i}&y1=${
          j * -1
        }
        &z1=${k}&x2=${x3}&y2=${y3}&z2=${z3}" 
        target="_blank">to see the steps to find the cross product, click here</a>`,
        type: `span`,
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
  }, [x1, y1, z1, x2, y2, z2, x3, y3, z3, showSteps]);
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
    if (mf5.current) mf5.current.latex('');
    if (mf3.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    if (mf9.current) mf9.current.latex('');

    setX1('');
    setY1('');
    setZ1('');
    setX2('');
    setY2('');
    setZ2('');
    setX3('');
    setY3('');
    setZ3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1, x2, y2, z2, x3, y3, z3].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, y1, z1, x2, y2, z2, x3, y3, z3].every(
    (v) => !!v || v == 0
  );
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
            Your input can be in the form of Integer, Fraction or any Real
            Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Vector A:</div>
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
            <div className="col-2 text-left d-flex">Vector B:</div>

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
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Vector C:</div>

            <MathInput
              setMathfieldRef={(ref) => (mf7.current = ref)}
              setValue={setX3}
              initialLatex={x3}
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
              setMathfieldRef={(ref) => (mf8.current = ref)}
              setValue={setY3}
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
              initialLatex={y3}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf9.current = ref)}
              setValue={setZ3}
              initialLatex={z3}
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

export default VectorTripleProduct;
