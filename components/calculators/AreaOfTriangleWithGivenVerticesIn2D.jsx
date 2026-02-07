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
  removeSymbol,
} from '../../helpers/matrixHelper';
import { minusSymbol, addSymbol } from '../../helpers/decimal';
import {} from '../../helpers/decimal';

const AreaOfTriangleWithGivenVerticesIn2D = () => {
  const [x1, setX1] = useState('e^2');
  const [x2, setX2] = useState('4');
  const [x3, setX3] = useState('5');
  const [y1, setY1] = useState('\\sqrt{5}');
  const [y2, setY2] = useState('\\sqrt{7}');
  const [y3, setY3] = useState('5');
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

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.x3) setX3(vals.x3);
    if (vals.y3) setY3(vals.y3);
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
            `Find the \\bold{Area of triangle} formed the Vertices`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `\\bold{A(${x1 || 'x_1'}, ${y1 || 'y_1'})}, \\bold{B (${
              x2 || 'x_3'
            }, ${y2 || 'y_2'})}\\& \\bold{C (${x3 || 'x_3'}, ${y3 || 'y_3'})}.`
          ),
          type: `equation`,
        },
      ])
    );
  }, [x1, y1, x2, y2, x3, y3]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: putSpace(`\\bold{A :- (${x1 || '1'}, ${y1 || '1'})}`),
          type: `equation`,
        },
        {
          value: putSpace(`\\bold{B :- (${x2 || '1'}, ${y2 || '1'})}`),
          type: `equation`,
        },
        {
          value: putSpace(`\\bold{C :- (${x3 || '1'}, ${y3 || '1'})}`),
          type: `equation`,
        },
      ])
    );
    const isInvalid = [x1, x2, y1, y2].some((x) => !x);
    if (isInvalid) return;
    setIsPointSame(x1 == x2 && y1 == y2);

    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempX3 = katexSimplifiedValue(x3);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const tempY3 = katexSimplifiedValue(y3);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const x3Value = evalExpression(tempX3);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    const y3Value = evalExpression(tempY3);

    //variables
    let x2IntoY3 = evalExpression(`(${x2Value}) * (${y3Value})`);
    let x3Intoy2 = evalExpression(`(${x3Value}) * (${y2Value})`);
    let y2SUbY3 = evalExpression(`(${y2Value}) - (${y3Value})`);
    let x2SubX3 = evalExpression(`(${x2Value}) - (${x3Value})`);
    let x2IntoY3Subx3Intoy2 = evalExpression(`(${x2IntoY3}) -(${x3Intoy2})`);
    let x1IntoY2SUbY3 = evalExpression(`(${x1Value}) * (${y2SUbY3})`);
    let y1IntoX2SubX3 = evalExpression(`(${y1Value}) * (${x2SubX3})`);
    let total = evalExpression(
      `(${x1IntoY2SUbY3}) - (${y1IntoX2SubX3}) + (${x2IntoY3Subx3Intoy2})`
    );
    let res = evalInDecimals(evalExpression(`1/2 *(${total})`));

    const finalAnswer = [
      {
        value: putSpace(`The \\bold{Area of triangle} formed the Vertices`),
        type: `equation`,
      },
      {
        value: putSpace(
          `\\bold{A(${x1}, ${y1})}, \\bold{B (${x2}, ${y2})}\\& \\bold{C (${x3}, ${y3})} is `
        ),
        type: `equation`,
      },
      {
        value: `= {1\\above{1pt}2} (${evalInDecimals(total)}) = ${removeSymbol(
          res
        )}`,
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: '<b>span</b>',
        value: 'Answer',
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
          `We know that \\bold{Area of triangle} formed the Vertices`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{A (x1, y1), B (x2 , y2) \\& C (x3, y3)}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Area of the triangle = {1 \\above{1pt}2} \\lVert AB X AC \\rVert or `
        ),
        type: `equation`,
      },
      {
        value: `{1\\above{1pt}2} \\space \\bigg \\lvert \\begin{array}{cc} X1 & Y1 & 1 \\\\ X2 & Y2 & 1 \\\\ X3 & Y3 & 1 \\end{array} \\bigg \\rvert `,
        type: `equation`,
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given that`,
        type: `span`,
      },
      {
        value: `(x_1, y_1) = \\bold{({${showVal(x1, x1Value)}}, {${showVal(
          y1,
          y1Value
        )}})}`,
        type: `equation`,
      },
      {
        value: `(x_2, y_2) = \\bold{({${showVal(x2, x2Value)}}, {${showVal(
          y2,
          y2Value
        )}})}`,
        type: `equation`,
      },
      {
        value: `(x_3, y_3) = \\bold{({${showVal(x3, x3Value)}}, {${showVal(
          y3,
          y3Value
        )}})}`,
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
        value: `{1\\above{1pt}2} \\space \\bigg \\lvert \\begin{array}{cc} ${x1} & ${y1} & 1 \\\\ ${x2} & ${y2} & 1 \\\\ ${x3} & ${y3} & 1 \\end{array} \\bigg \\rvert `,
        type: `equation`,
      },
      ,
      {
        value: ` = {1\\above{1pt}2} \\space[(${x1}) \\lbrace (${y2})(1)-(${y3})(1) \\rbrace -(${y1})\\lbrace (${x2})(1)-(${x3})(1)\\rbrace+(1)\\lbrace (${x2})(${y3}) -(${x3})(${y2})\\rbrace ]`,
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2} \\space[\\{(${x1})(${y2}-${y3}) -(${y1})(${x2}-${x3}) + (1) (${x2IntoY3} -${x3Intoy2})\\}]`,
        type: `equation`,
      },

      {
        value: ` = {1\\above{1pt}2} \\space[\\{(${x1})({${valueToKatex(
          y2SUbY3
        )}}) - (${y1})({${valueToKatex(x2SubX3)}}) +  (${valueToKatex(
          x2IntoY3Subx3Intoy2
        )})\\}]`,
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2} (${valueToKatex(
          x1IntoY2SUbY3
        )} ${minusSymbol(evalInDecimals(y1IntoX2SubX3))} ${valueToKatex(
          removeSymbol(y1IntoX2SubX3)
        )} ${addSymbol(evalInDecimals(x2IntoY3Subx3Intoy2))} ${valueToKatex(
          removeSymbol(x2IntoY3Subx3Intoy2)
        )})`,
        type: `equation`,
      },
      {
        value: ` = {1\\above{1pt}2} (${valueToKatex(total)})`,
        type: `equation`,
      },
      {
        value: ` =(${removeSymbol(res)})`,
        type: `equation`,
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
    setX3('');

    setY1('');
    setY2('');
    setY3('');
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = [x1, x2, y1, y2, x3, y3].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2, x3, y3].every((v) => !!v || v == 0);
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
            <div className="col-4 text-left">Point A:-</div>
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
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setY1}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y1}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point B:-</div>
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setX2}
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
              allowAlphabeticKeyboard={false}
              initialLatex={x2}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setY2}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y2}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point C:-</div>
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setX3}
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
              allowAlphabeticKeyboard={false}
              initialLatex={x3}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setY3}
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
              allowAlphabeticKeyboard={false}
              initialLatex={y3}
              style={{
                width: '33.33%',
              }}
            />
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

export default AreaOfTriangleWithGivenVerticesIn2D;
