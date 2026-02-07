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

const CentroidOfTriangle = () => {
  const [x1, setX1] = useState('e^2');
  const [x2, setX2] = useState('4');
  const [x3, setX3] = useState('7');
  const [y1, setY1] = useState('\\sqrt{5}');
  const [y2, setY2] = useState('\\sqrt{7}');
  const [y3, setY3] = useState('5');
  const [z1, setZ1] = useState('\\sqrt{5}');
  const [z2, setZ2] = useState('\\sqrt{7}');
  const [z3, setZ3] = useState('5');
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
    if (vals.x3) setX3(vals.x3);
    if (vals.y3) setY3(vals.y3);
    if (vals.z1) setZ1(vals.y2);
    if (vals.z2) setZ2(vals.z2);
    if (vals.z3) setZ3(vals.z3);
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
            `Find the \\bold{Centroid of the Triangle} joining the points`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `\\bold{A(${x1 || 'x_1'}, ${y1 || 'y_1'}, ${
              z1 || 'z_1'
            })}, \\bold{B (${x2 || 'x_2'}, ${y2 || 'y_2'} , ${
              z2 || 'z_2'
            })}\\& \\bold{C (${x3 || 'x_3'}, ${y3 || 'y_3'},  ${z3 || 'y_3'})}.`
          ),
          type: `equation`,
        },
      ])
    );
  }, [x1, x2, x3, y1, y2, y3, z1, z2, z3]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: putSpace(
            `\\bold{Point A :- (${x1 || '1'}, ${y1 || '1'}, ${z1 || '1'})}`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `\\bold{Point B :- (${x2 || '1'}, ${y2 || '1'}, ${z2 || '1'})}`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `\\bold{Point C :- (${x3 || '1'}, ${y3 || '1'}, ${z3 || '1'})}`
          ),
          type: `equation`,
        },
      ])
    );
    const isInvalid = [x1, x2, x3, y1, y2, y3, z1, z2, z3].some((x) => !x);
    if (isInvalid) return;
    setIsPointSame(x1 == x2 && y1 == y2 && z1 == z2);

    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempY3 = katexSimplifiedValue(y3);
    const tempZ1 = katexSimplifiedValue(z1);
    const tempZ2 = katexSimplifiedValue(z2);
    const tempZ3 = katexSimplifiedValue(z3);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const x3Value = evalExpression(tempX3);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const y3Value = evalExpression(tempY3);
    const z1Value = evalExpression(tempZ1);
    const z2Value = evalExpression(tempZ2);
    const z3Value = evalExpression(tempZ3);

    let xTotal = evalExpression(`(${x1Value}) + (${x2Value})+ (${x3Value})`);
    let yTotal = evalExpression(`(${y1Value}) + (${y2Value}) + (${y3Value}) `);
    let zTotal = evalExpression(`(${z1Value}) + (${z2Value}) + (${z3Value})`);
    let x = evalExpression(`(${xTotal})/3`);
    let y = evalExpression(`(${yTotal})/3`);
    let z = evalExpression(`(${zTotal})/3`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Centroid} of the Triangle joining the points `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{A(${x1 || 'x_1'}, ${y1 || 'y_1'}, ${
            z1 || 'z_1'
          })}, \\bold{B (${x2 || 'x_2'}, ${y2 || 'y_2'} , ${
            z2 || 'z_2'
          })}\\& \\bold{C (${x3 || 'x_3'}, ${y3 || 'y_3'},  ${z3 || 'y_3'})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `M(x,y,z)=\\bigg(${xTotal}, ${yTotal}, ${zTotal}\\bigg) or \\bigg(${evalInDecimals(
            x
          )}, ${evalInDecimals(y)}, ${evalInDecimals(z)}\\bigg)`
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'span',
        value: '<b>Answer</b>',
      },
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
        value: putSpace(
          `We know that the Centroid of the Triangle joining the`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`point A\\bold{A (x1, y1, z1), Point B (x2 , y2, z2)}`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{\\& Point C (x3, y3, z3)}`),
        type: 'equation',
      },
      {
        value: putSpace(` is given by the formula below `),
        type: `equation`,
      },
      {
        value: putSpace(
          `Let M (x, y, z) be the Centroid of the Triangle then,`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`can be obtained by using the below given formula`),
        type: 'equation',
      },
      {
        value: `x = {(x_1+x_2+x_3)\\above{1pt}3}`,
        type: 'equation',
      },
      {
        value: `y = {(y_1+y_2+y_3)\\above{1pt}3}`,
        type: 'equation',
      },
      {
        value: `z = {(z_1+z_2+z_3)\\above{1pt}3}`,
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
        value: `(x_1, y_1, z_1) = \\bold{({${showVal(x1, x1Value)}}, {${showVal(
          y1,
          y1Value
        )}}, {${showVal(z1, z1Value)}})}`,
        type: `equation`,
      },
      {
        value: `(x_2, y_2, z_2) = \\bold{({${showVal(x2, x2Value)}}, {${showVal(
          y2,
          y2Value
        )}}, {${showVal(z2, z2Value)}})}`,
        type: `equation`,
      },
      {
        value: `(x_3, y_3, z_3) = \\bold{({${showVal(x3, x3Value)}}, {${showVal(
          y3,
          y3Value
        )}}, {${showVal(z3, z3Value)}})}`,
        type: `equation`,
      },
      {
        value: `Now putting these values in the above formula`,
        type: `span`,
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `x = {(${x1}+${x2}+${x3})\\above{1pt}3}`,
        type: 'equation',
      },
      {
        value: `y = {(${y1}+${y2}+${y3})\\above{1pt}3}`,
        type: 'equation',
      },
      {
        value: `z = {(${z1}+${z2}+${z3})\\above{1pt}3}`,
        type: 'equation',
      },
      {
        value: `x = {(${valueToKatex(xTotal)})\\above{1pt}3}=${evalInDecimals(
          x
        )}`,
        type: 'equation',
      },
      {
        value: `y = {(${valueToKatex(yTotal)})\\above{1pt}3}=${evalInDecimals(
          y
        )}`,
        type: 'equation',
      },
      {
        value: `z = {(${valueToKatex(zTotal)})\\above{1pt}3}={${evalInDecimals(
          z
        )}}`,
        type: 'equation',
      },

      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);
    setSolution(solution);
  }, [x1, x2, x3, y1, y2, y3, z1, z2, z3, showSteps]);

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
    setX3('');
    setY1('');
    setY2('');
    setY3('');
    setZ1('');
    setZ2('');
    setZ3('');

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

  const hasValue = [x1, x2, x3, y1, y2, y3, z1, z2, z3].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [x1, x2, x3, y1, y2, y3, z1, z2, z3].every(
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
            <div className="col-3 text-left">Point A</div>
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={x1}
              />{' '}
            </div>
            <div className="col-3">
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={y1}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setZ1}
                allowAlphabeticKeyboard={false}
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
                initialLatex={z1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point B</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setX2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={x2}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setY2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={y2}
              />{' '}
            </div>

            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setZ2}
                allowAlphabeticKeyboard={false}
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
                initialLatex={z2}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point C</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf7.current = ref)}
                setValue={setX3}
                allowAlphabeticKeyboard={false}
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
                initialLatex={x3}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf8.current = ref)}
                setValue={setY3}
                allowAlphabeticKeyboard={false}
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
                initialLatex={y3}
              />{' '}
            </div>

            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf9.current = ref)}
                setValue={setZ3}
                allowAlphabeticKeyboard={false}
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
                initialLatex={z3}
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

export default CentroidOfTriangle;
