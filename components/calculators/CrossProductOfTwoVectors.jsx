'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  evalInDecimals,
  evalExpression,
  removeSymbol,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import { putSpace, getSearchParams } from '../../helpers/general';
import { addSymbol, minusSymbol } from '../../helpers/decimal';

const CrossProductOfTwoVectors = () => {
  const [x1, setX1] = useState('2');
  const [y1, setY1] = useState('5');
  const [z1, setZ1] = useState('2');
  const [x2, setX2] = useState('5');
  const [y2, setY2] = useState('2');
  const [z2, setZ2] = useState('7');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
    if (vals.x2) setX2(vals.x2);
    if (vals.y2) setY2(vals.y2);
    if (vals.z2) setZ2(vals.z2);
  }, []);

  const isInvalid = [x1, y1, z1, x2, y2, z2].some((x) => !x && x != 0);
  const tempX1 = convertFromLatex(x1);
  const tempX2 = convertFromLatex(x2);
  const tempY1 = convertFromLatex(y1);
  const tempY2 = convertFromLatex(y2);
  const tempZ1 = convertFromLatex(z1);
  const tempZ2 = convertFromLatex(z2);
  const x1Value = evalExpression(tempX1);
  const x2Value = evalExpression(tempX2);
  const y1Value = evalExpression(tempY1);
  const y2Value = evalExpression(tempY2);
  const z1Value = evalExpression(tempZ1);
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
            `Find the Cross Product of the \\bold{\\overrightarrow{U}}(\\bold{{${
              x1 || '1'
            }}i ${addSymbol(evalInDecimals(tempY1))} {${removeSymbol(
              y1 || '1'
            )}}j ${addSymbol(evalInDecimals(tempZ1))} {${removeSymbol(
              z1 || '1'
            )}}}k ) \\& \\bold{\\overrightarrow{V}}( \\bold{{${
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
  }, [x1, y1, z1, x2, y2, z2]);

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
            `\\bold{\\overrightarrow{U}}:\\bigg< \\bold{{${
              x1 || '1'
            }}i {${addSymbol(evalInDecimals(tempY1))}} {${removeSymbol(
              y1 || '1'
            )}}j {${addSymbol(evalInDecimals(tempZ1))}}}k \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{\\overrightarrow{V}}:\\bigg<\\bold{{${
              x2 || '1'
            }}i {${addSymbol(evalInDecimals(tempY2))}}  {${removeSymbol(
              y2 || '1'
            )}}j  {${addSymbol(evalInDecimals(tempZ2))}} {${removeSymbol(
              z2
            )}}}k \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    let y1IntoZ2 = evalExpression(`${y1Value} * (${z2Value})`);
    let y2IntoZ1 = evalExpression(`${y2Value} * (${z1Value})`);
    let x1IntoZ2 = evalExpression(`${x1Value} * (${z2Value})`);
    let x2IntoZ1 = evalExpression(`${x2Value} * (${z1Value})`);
    let x1IntoY2 = evalExpression(`${x1Value} * (${y2Value})`);
    let x2IntoY1 = evalExpression(`${x2Value} * (${y1Value})`);
    let i = evalExpression(`${y1IntoZ2} - (${y2IntoZ1})`);
    let j = evalExpression(`${x1IntoZ2} - (${x2IntoZ1})`);
    let k = evalExpression(`${x1IntoY2} - (${x2IntoY1})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The Cross Product of Vectors is \\bigg(\\bold{{${valueToKatex(
            i
          )}}i ${minusSymbol(evalInDecimals(j))} {${removeSymbol(
            valueToKatex(j)
          )}}j ${addSymbol(evalInDecimals(k))} {${removeSymbol(
            valueToKatex(k)
          )}}k}\\bigg) or (\\bold{{${evalInDecimals(i)}}i ${minusSymbol(
            evalInDecimals(j)
          )} {${removeSymbol(evalInDecimals(j))}}j ${addSymbol(
            evalInDecimals(k)
          )} {${removeSymbol(evalInDecimals(k))}}k})  `
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
        value: `We know that Cross product of two given vectors with `,
        type: 'span',
      },
      {
        value: `\\bold{\\overrightarrow{U} \\space (x_1, y_1, z_1)} \\space \\& \\space 
        \\bold{\\overrightarrow{V} \\space (x_2, y_2, z_2)} \\space is \\space given \\space by \\space the \\space formula \\space below`,
        type: 'equation',
      },
      {
        value: `\\bold{\\overrightarrow{U}} \\space x \\space \\bold{\\overrightarrow{V}} = {\\large \\begin{vmatrix}
        \\hat{i} & \\hat{j} & \\hat{k} \\\\
        x_1 & y_1 & z_1 \\\\
        x_2 & y_2 & z_2 
     \\end{vmatrix}}`,
        type: 'equation',
      },
      {
        value: `\\bold{\\overrightarrow{U}} \\space x \\space \\bold{\\overrightarrow{V}} = {\\large \\begin{vmatrix}
        y_1 & z_1 \\\\
        y_2 & z_2 \\\\
        \\end{vmatrix}}\\space \\hat{i} - {\\large \\begin{vmatrix}
        x_1 & z_1 \\\\
        x_2 & z_2 \\\\
        \\end{vmatrix}} \\space \\hat{j} + {\\large \\begin{vmatrix}
        x_1 & y_1 \\\\
        x_2 & y_2 \\\\
        \\end{vmatrix}} \\space \\hat{k}`,
        type: 'equation',
      },
      {
        value: `\\overrightarrow{U} \\space x \\space \\overrightarrow{V} = (y_1.z_2 - y_2.z_1)i - 
        (x_1.z_2 - x_2.z_1)j + (x_1.y_2 - x_2.y_1)k`,
        type: 'equation',
      },
      {
        value: `<b>Input</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `(x_1, y_1, z_1) = \\bigg({${convertIntoLatex(
            x1Value
          )}}, {${convertIntoLatex(y1Value)}}, {${convertIntoLatex(
            z1Value
          )}} \\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(x_2, y_2, z_2) = \\bigg({${convertIntoLatex(
            x2Value
          )}}, {${convertIntoLatex(y2Value)}}, {${convertIntoLatex(
            z2Value
          )}} \\bigg)`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step 1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Now, by putting these values in the above formula`,
        type: 'span',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{U}}  x \\bold{\\overrightarrow{V}} = {\\large \\begin{vmatrix}\\hat{i} & \\hat{j} & \\hat{k}\\\\{${x1}} & {${y1}} & {${z1}}\\\\{${x2}} & {${y2}} & {${z2}}\\end{vmatrix}}`
        ),
        type: 'equation',
      },
      {
        value: `\\bold{\\overrightarrow{U}} \\space x \\space \\bold{\\overrightarrow{V}} = \\hat{i} {\\large \\begin{vmatrix}
        {${y1}} & {${z1}} \\\\
        {${y2}} & {${z2}} \\\\
        \\end{vmatrix}}\\space  - \\hat{j}  {\\large \\begin{vmatrix}
        {${x1}} & {${z1}} \\\\
        {${x2}} & {${z2}} \\\\
        \\end{vmatrix}} \\space + \\hat{k} {\\large \\begin{vmatrix}
        {${x1}} & {${y1}} \\\\
        {${x2}} & {${y2}} \\\\
        \\end{vmatrix}} \\space `,
        type: 'equation',
      },
      {
        value: `<b>Step 2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `\\overrightarrow{U} \\space x \\space \\overrightarrow{V} = \\{({${y1}}).({${z2}}) - ({${y2}}).({${z1}})\\}i - 
        \\{({${x1}}).({${z2}}) - ({${x2}}).({${z1}})\\}j + \\{({${x1}}).({${y2}}) - ({${x2}}).({${y1}})\\}k`,
        type: 'equation',
      },
      {
        value: putSpace(`After Solving`),
        type: 'equation',
      },
      {
        value: `\\overrightarrow{U} \\space x \\space \\overrightarrow{V} = \\{(
          {${valueToKatex(y1Value)}}).({${valueToKatex(
          z2Value
        )}}) - ({${valueToKatex(y2Value)}}).({${valueToKatex(z1Value)}})\\}i - 
        \\{({${valueToKatex(x1Value)}}).({${valueToKatex(
          z2Value
        )}}) - ({${valueToKatex(x2Value)}}).({${valueToKatex(
          z1Value
        )}})\\}j + \\{({${valueToKatex(x1Value)}}).({${valueToKatex(
          y2Value
        )}}) - ({${valueToKatex(x2Value)}}).({${valueToKatex(y1Value)}})\\}k`,
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U} \\space x \\space \\overrightarrow{V} = \\{({${valueToKatex(
            y1IntoZ2
          )}})-({${valueToKatex(y2IntoZ1)}})\\}i - \\{({${valueToKatex(
            x1IntoZ2
          )}})-({${valueToKatex(x2IntoZ1)}})\\}j + \\{({${valueToKatex(
            x1IntoY2
          )}})-({${valueToKatex(x2IntoY1)}})\\}k`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`After Solving Further`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U} \\space x \\space \\overrightarrow{V} =\\bigg(\\bold{{${valueToKatex(
            i
          )}}i ${minusSymbol(evalInDecimals(j))} {${removeSymbol(
            valueToKatex(j)
          )}}j ${addSymbol(evalInDecimals(k))} {${removeSymbol(
            valueToKatex(k)
          )}}k}\\bigg) or (\\bold{{${evalInDecimals(i)}}i ${minusSymbol(
            evalInDecimals(j)
          )} {${removeSymbol(evalInDecimals(j))}}j ${addSymbol(
            evalInDecimals(k)
          )} {${removeSymbol(evalInDecimals(k))}}k})`
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
  }, [x1, y1, z1, x2, y2, z2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    setX1('');
    setX2('');
    setY1('');
    setY2('');
    setZ1('');
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
            Your input can be in the form of Integer, Fraction or any Real
            Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector U:</div>
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z1}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector V :</div>
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z2}
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />s
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-2"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
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
      {hasAllValue && showSteps && (
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

export default CrossProductOfTwoVectors;
