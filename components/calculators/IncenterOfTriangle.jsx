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
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  valueToKatex,
} from '../../helpers/matrixHelper';
import {} from '../../helpers/decimal';

const IncenterOfTriangle = () => {
  const [x1, setX1] = useState('e^2');
  const [x2, setX2] = useState('4');
  const [x3, setX3] = useState('\\sqrt{5}');
  const [y1, setY1] = useState('\\sqrt{5}');
  const [y2, setY2] = useState('\\sqrt{7}');
  const [y3, setY3] = useState('\\sqrt{7}');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [result, setResult] = useState('');
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
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z1) setX3(vals.z1);
    if (vals.z2) setY3(vals.z2);
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
            `Find the \\bold{Incentre} of the triangle joining the vertices `
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `A (\\bold{{${x1 || 'x1'}}}, \\bold{{${y1 || 'y1'}}}), B (\\bold{{${
              x2 || 'x2'
            }}}, \\bold{{${y2 || 'y2'}}}) \\& C (\\bold{{${
              x3 || 'x3'
            }}}, \\bold{{${y3 || 'y3'}}}) .`
          ),
          type: `equation`,
        },
      ])
    );
  }, [x1, x2, y1, y2, x3, y3]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: putSpace(`Point \\bold{ A :- (${x1 || '1'}, ${y1 || '1'})}`),
          type: `equation`,
        },
        {
          value: putSpace(`Point \\bold{ B :- ( ${x2 || '1'}, ${y2 || '1'})}`),
          type: `equation`,
        },
        {
          value: putSpace(`Point \\bold{ C :- (${x3 || '1'}, ${y3 || '1'})}`),
          type: `equation`,
        },
      ])
    );
    const isInvalid = [x1, x2, y1, y2, x3, y3].some((x) => !x);
    setIsPointSame(x1 == x2 && y1 == y2 && x3 == y3);

    if (isInvalid) return;

    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY3 = katexSimplifiedValue(y3);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const x3Value = evalExpression(tempX3);
    const y3Value = evalExpression(tempY3);

    // vlaue A

    let aSqrt = evalExpression(
      `(${x2Value} -${x3Value})^2 + (${y2Value} -${y3Value})^2`
    );
    let a = `sqrt(${aSqrt})`;
    console.log('????????????', aSqrt);
    // vlaue B
    let bSqrt = evalExpression(
      `(${x1Value} -${x3Value})^2 + (${y1Value} -${y3Value})^2`
    );
    let b = `sqrt(${bSqrt})`;
    // vlaue B
    let cSqrt = evalExpression(
      `(${x1Value} -${x2Value})^2 + (${y1Value} -${y2Value})^2`
    );
    let c = `sqrt(${cSqrt})`;
    console.log('????????????', aSqrt);
    // vlaue B

    //formula  solving for x
    // numerator
    let aItnoX1 = evalExpression(`(${a})*(${x1Value})`);
    let bItnoX2 = evalExpression(`(${b})*(${x2Value})`);
    let cItnoX3 = evalExpression(`(${c})*(${x3Value})`);
    let numerator = evalExpression(`${aItnoX1}+ (${bItnoX2})+(${cItnoX3})`);
    //  denominator x
    let denominator = evalExpression(`(${a}) + (${b})+ (${c})`);
    let x = evalInDecimals(`(${numerator})/(${denominator})`);

    //formula  solving for y
    // numerator
    let aItnoY1 = evalExpression(`(${a})*(${y1Value})`);
    let bItnoY2 = evalExpression(`(${b})*(${y2Value})`);
    let cItnoY3 = evalExpression(`(${c})*(${y3Value})`);
    let numeratorY = evalExpression(`${aItnoY1}+ (${bItnoY2})+(${cItnoY3})`);
    //  denominator x
    let denominatorY = evalExpression(`(${a}) + (${b})+ (${c})`);
    let y = evalInDecimals(`(${numeratorY})/(${denominatorY})`);

    const finalAnswer = [
      {
        value: putSpace(`The Incentre of the triangle joining the vertices  `),
        type: 'equation',
      },

      {
        value: putSpace(
          `A (\\bold{{${x1 || 'x1'}}}, \\bold{{${y1 || 'y1'}}}), B (\\bold{{${
            x2 || 'x2'
          }}}, \\bold{{${y2 || 'y2'}}}) \\& C (\\bold{{${
            x3 || 'x3'
          }}}, \\bold{{${y3 || 'y3'}}}) is  `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `l(x, y) =  \\bigg(\\bold{{{${evalInDecimals(
            numerator
          )}})\\above{1pt}{${evalInDecimals(denominator)}}}, {{${evalInDecimals(
            numeratorY
          )}}\\above{1pt}{${evalInDecimals(
            denominatorY
          )}}}}\\bigg) or (\\bold{${evalInDecimals(x)}, ${evalInDecimals(y)}}) `
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'span',
        value: '<b>Answer</b>',
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
        value: putSpace(`We know that the Incentre of the Triangle joining `),
        type: 'equation',
      },
      {
        value: putSpace(
          ` Point A (x_1, y_1), Point B (x_2, y_2) \\& Point C (x_3, y_3)`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`
        is given by the formula below`),
        type: 'equation',
      },

      {
        value: putSpace(
          `Let I (x, y, z) be the Centroid of the Triangle then,`
        ),
        type: 'equation',
      },

      {
        value: putSpace(`Coordinates of the Point M (x, y) can be obtained `),
        type: 'equation',
      },
      {
        value: putSpace(`by using the below-given formula `),
        type: 'equation',
      },
      {
        value: `x = {(ax_1 + bx_2 + cx_3)\\above{1pt}(a+b+c)}`,
        type: 'equation',
      },
      {
        value: `y = {(ay_1 + by_2 + cy_3)\\above{1pt}(a+b+c)}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `where a, b, and c are the length of the sides of the triangle`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`opposite to the vertices A, B, and C respectively`),
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
        value: `From the above input it is given that`,
        type: `span`,
      },
      {
        value: putSpace(
          `(x_1, y_1) = \\bold{({${showVal(x1, x1Value)}}, {${showVal(
            y1,
            y1Value
          )}})}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `(x_2, y_2) = \\bold{({${showVal(x2, x2Value)}}, {${showVal(
            y2,
            y2Value
          )}}})`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `(x_2, y_2) = \\bold{( {${showVal(x3, x3Value)}} ,{${showVal(
            y3,
            y3Value
          )}})}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`Now putting these values in the above formula`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `The length of the sides of the triangle can be obtained`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`by using the \\bold{distance formula in 2D}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `a = \\sqrt{{${valueToKatex(aSqrt)}}} = {${evalInDecimals(a)}}  `
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/distance-between-two-points/?x1=${x2}&y1=${y2}&x2=${x3}&y2=${y3}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: putSpace(
          `b = \\sqrt{{${valueToKatex(bSqrt)}}} = {${evalInDecimals(b)}}  `
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/distance-between-two-points/?x1=${x1}&y1=${y1}&x2=${x3}&y2=${y3}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',

      {
        value: putSpace(
          `c = \\sqrt{{${valueToKatex(cSqrt)}}} = {${evalInDecimals(c)}}  `
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/distance-between-two-points/?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `<b>Step-3</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now by using the above-calculated values and the given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x = {({${evalInDecimals(a)}})({${valueToKatex(
            x1Value
          )}}) + ({${evalInDecimals(b)}})({${valueToKatex(
            x2Value
          )}}) + ({${evalInDecimals(c)}})({${valueToKatex(
            x3Value
          )}})\\above{1pt}({${evalInDecimals(a)}}+{${evalInDecimals(
            b
          )}}+{${evalInDecimals(c)}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `y = {({${evalInDecimals(a)}})({${valueToKatex(
            y1Value
          )}}) + ({${evalInDecimals(b)}})({${valueToKatex(
            y2Value
          )}}) + ({${evalInDecimals(c)}})({${valueToKatex(
            y3Value
          )}})\\above{1pt}({${evalInDecimals(a)}}+{${evalInDecimals(
            b
          )}}+{${evalInDecimals(c)}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x = {({${evalInDecimals(aItnoX1)}}) + ({${evalInDecimals(
            bItnoX2
          )}}) + ({${evalInDecimals(cItnoX3)}})\\above{1pt}({${evalInDecimals(
            denominator
          )}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `y = {({${evalInDecimals(aItnoY1)}}) + ({${evalInDecimals(
            bItnoY2
          )}}) + ({${evalInDecimals(cItnoY3)}})\\above{1pt}({${evalInDecimals(
            denominatorY
          )}})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x = {({${evalInDecimals(numerator)}})\\above{1pt}({${evalInDecimals(
            denominator
          )}})} = \\bold{${evalInDecimals(x)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `y = {({${evalInDecimals(numeratorY)}})\\above{1pt}({${evalInDecimals(
            denominatorY
          )}})} = \\bold{${evalInDecimals(y)}}`
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
  }, [x1, x2, y1, y2, x3, y3, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setX3('');
    setY3('');

    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    if (mf7.current) mf7?.current.latex('');
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, x2, x3, y1, y2, y3, x3, y3].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, x3, y1, y2, y3, x3, y3].every(
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
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point A:</div>
            <div className="col-4">
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
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point B:</div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setX2}
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
                initialLatex={x2}
              />{' '}
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setY2}
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
                initialLatex={y2}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point C :</div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setX3}
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
                initialLatex={x3}
              />{' '}
            </div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setY3}
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
                initialLatex={y3}
              />{' '}
            </div>
          </div>

          <Equation equation={equation} className="border-primary mt-3" />
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

export default IncenterOfTriangle;
