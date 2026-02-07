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
import { solveWithLeastRoots } from '../../helpers/SolveRoot';
import { addSymbol } from '../../helpers/decimal';

const UnitVector = () => {
  const [x1, setX1] = useState('4');
  const [y1, setY1] = useState('5');
  const [z1, setZ1] = useState('2');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
    if (vals.y1) setY1(vals.y1);
    if (vals.z1) setZ1(vals.z1);
  }, []);

  isInvalid.current = [x1, y1, z1].some((x) => !x);
  const tempX1 = convertFromLatex(x1);
  const tempY1 = convertFromLatex(y1);
  const tempZ1 = convertFromLatex(z1);
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
            `Find the \\bold{Unit Vector} of the Vector \\bold{\\overrightarrow{U} ({${x1}}i ${addSymbol(
              tempY1
            )} {${removeSymbol(y1)}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1)}}k)}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [x1, y1, z1]);

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
            `Vector \\overrightarrow{U} : \\bigg<\\bold{{${x1}}i ${addSymbol(
              evalInDecimals(evalInDecimals(tempY1))
            )} {${removeSymbol(y1)}}j ${addSymbol(
              evalInDecimals(tempZ1)
            )} {${removeSymbol(z1)}}k } \\bigg>`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;
    const xSquare = evalExpression(`(${x1Value})^2`);
    const ySquare = evalExpression(`(${y1Value})^2`);
    const zSquare = evalExpression(`(${z1Value})^2`);
    const denominatorAdd = evalExpression(
      `(${xSquare}) + (${ySquare}) + (${zSquare})`
    );
    const denomFinal = solveWithLeastRoots(denominatorAdd);
    const isSame = denomFinal == denominatorAdd;
    const squareRoot = evalInDecimals(
      evalExpression(`sqrt(${denominatorAdd})`)
    );
    const x1DivideRoot = evalExpression(`(${x1Value}) / (${squareRoot})`);
    const y1DivideRoot = evalExpression(`(${y1Value}) / (${squareRoot})`);
    const z1DivideRoot = evalExpression(`(${z1Value}) / (${squareRoot})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Unit Vector} is \\bigg({${x1}\\above{1pt} {${denomFinal}}}i ${addSymbol(
            y1
          )} {{${removeSymbol(
            y1
          )}}\\above{1pt}{{${denomFinal}}}} j  ${addSymbol(
            z1
          )} {{${removeSymbol(
            z1
          )}}\\above{1pt} {${denomFinal}}}k\\bigg) or \\bold{({${evalInDecimals(
            x1DivideRoot
          )}}i ${addSymbol(removeSymbol(y1DivideRoot))} {${removeSymbol(
            evalInDecimals(y1DivideRoot)
          )}}j ${addSymbol(evalInDecimals(z1DivideRoot))} {${removeSymbol(
            evalInDecimals(z1DivideRoot)
          )}}k)}`
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
        value: putSpace(
          `We know that Unit Vector of any vector \\bold{\\overrightarrow{U} (x_1, y_1, z_1)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },

      {
        value: putSpace(
          `\\overrightarrow{U} = {( x_1, y_1, z_1)\\above{1pt} \\sqrt{{x_1}^2+ {y_1}^2 + {z_1}^2}}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Given Vector : -</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `x_1 = \\bold{{${convertIntoLatex(
            x1Value
          )}}}, y_1 = \\bold{{${convertIntoLatex(
            y1Value
          )}}}, z_1 = \\bold{{${convertIntoLatex(z1Value)}}} `
        ),
        type: 'equation',
      },

      {
        value: putSpace(`then by putting these values in the above formula`),
        type: 'equation',
      },
      {
        value:
          putSpace(`\\overrightarrow{U}  = {<({${x1}}), ({${y1}}), ({${z1}})>\\above{1pt} 
        \\sqrt{({${x1}})^2+ ({${y1}})^2 + ({${z1}})^2} }`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U}  = {({${x1}}, {${y1}}, {${z1}}) \\above{1pt} \\sqrt{{${valueToKatex(
            xSquare
          )}} +{${valueToKatex(ySquare)}} + {${valueToKatex(zSquare)}}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U}  = {({${x1}}, {${y1}}, {${z1}}) \\above{1pt} (\\sqrt{${valueToKatex(
            denominatorAdd
          )}}})  ${
            isSame
              ? ''
              : ` = {({${x1}}, {${y1}}, {${z1}}) \\above{1pt} {${denomFinal}}}`
          }`
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          ` ${
            isSame
              ? ''
              : ` = {({${x1}}, {${y1}}, {${z1}}) \\above{1pt} {${denomFinal}}}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` =\\bigg({${x1}\\above{1pt} {${denomFinal}}}i ${addSymbol(
            y1
          )} {{${removeSymbol(
            y1
          )}}\\above{1pt}{{${denomFinal}}}} j  ${addSymbol(
            z1
          )} {{${removeSymbol(
            z1
          )}}\\above{1pt} {${denomFinal}}}k\\bigg) or \\bold{({${evalInDecimals(
            x1DivideRoot
          )}}i ${addSymbol(removeSymbol(y1DivideRoot))} {${removeSymbol(
            evalInDecimals(y1DivideRoot)
          )}}j ${addSymbol(evalInDecimals(z1DivideRoot))} {${removeSymbol(
            evalInDecimals(z1DivideRoot)
          )}}k)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/vector-magnitude-calculator/?a=${x1},${y1},${z1}" 
        target="_blank">to see the magnitude of a vector, click here</a>`,
        type: 'span',
      },
      'br',
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
  }, [x1, y1, z1, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setX1('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setY1('');
    setZ1('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1, y1, z1].some((v) => !!v || v == 0);
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
            Your input can be in form of Integer, FRACTION or any Real Number
          </div>
          <div className="row mb-3 align-items-center">
            <div className={`col-2 text-left`}>Vector U:</div>
            <div className="col-4">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setX1}
                allowAlphabeticKeyboard={false}
                initialLatex={x1}
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
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setY1}
                allowAlphabeticKeyboard={false}
                initialLatex={y1}
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
              />
              {''}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setZ1}
                allowAlphabeticKeyboard={false}
                initialLatex={z1}
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
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
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

export default UnitVector;
