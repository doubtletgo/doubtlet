'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import {
  getSearchParams,
  putSpace,
  simplifyKatex,
} from '../../helpers/general';
import {
  evalExpression,
  katexSimplifiedValue,
  evalInDecimals,
  valueToKatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';

import { convertToKatex } from '../../helpers/SolveRoot';
import { parseNumber } from '../../helpers/decimal';

const Slopeofline = () => {
  const [x1, setx1] = useState('3');
  const [x2, setx2] = useState('4');
  const [y1, sety1] = useState('5');
  const [y2, sety2] = useState('1');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [result, setResult] = useState('');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setx1(vals.x1);
    if (vals.y1) sety1(vals.y1);
    if (vals.x2) setx2(vals.x2);
    if (vals.y2) sety2(vals.y2);
  }, []);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          (x_1, y_1) = \\bold{(${x1 || '0'}, ${y1 || '0'})}
        `),
          type: 'equation',
        },
        {
          value: putSpace(`
          (x_2, y_2) = \\bold{(${x2 || '0'}, ${y2 || '0'})}
        `),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [x1, x2, y1, y2].some((x) => !x);
    setIsPointSame(x1 == x2 && y1 == y2);

    const tempX1 = katexSimplifiedValue(x1);
    const tempX2 = katexSimplifiedValue(x2);
    const tempY1 = katexSimplifiedValue(y1);
    const tempY2 = katexSimplifiedValue(y2);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);
    if (isInvalid) return;
    const y2MinusY1 = evalExpression(`${y2Value} - (${y1Value})`);
    const x2MinusX1 = evalExpression(`${x2Value} - (${x1Value})`);
    const yByX = convertToKatex(
      valueToKatex(y2MinusY1),
      valueToKatex(x2MinusX1),
      true
    );
    const M = simplifyKatex(yByX);
    const m = parseNumber(evalInDecimals(M), {}, 3);

    const finalAnswer = [
      {
        type: 'equation',
        value: putSpace(
          `The slope(m) of the line joining the points \\space P_1\\bold{(${x1},${y1})} and P_2\\bold{(${x2}, ${y2})} \\space`
        ),
      },
      {
        value: putSpace(`is : \\bold{{${yByX}} or ${parseNumber(m)}}`),
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
          `The slope(m) of the line joining the points P_1 \\bold{(x_1, y_1)} and P_2 \\bold{(x_2, y_2)} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is  given by the formula given below m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Given the values  of the variables :`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 =\\bold{${convertIntoLatex(
            x1Value
          )}} , y_1 =\\bold{${convertIntoLatex(
            y1Value
          )}},  x_2 = \\bold{${convertIntoLatex(
            x2Value
          )}}, y_2 = \\bold{${convertIntoLatex(y2Value)}}`
        ),
        type: 'equation',
      },
      {
        value: 'After putting the values in the formula',
        type: 'span',
      },
      {
        value: `m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`,
        type: 'equation',
      },
      {
        type: 'equation',
        value: `m = {(${valueToKatex(
          y2Value
        )} - {{0}})\\above{1pt}(${valueToKatex(x2Value)} - {{1}})}`,
        args: [valueToKatex(y1Value), valueToKatex(x1Value)],
      },
      {
        type: 'equation',
        value: `m = {{{0}}\\above{1pt}{{1}}} = {${yByX}} \\implies m = {${yByX}}`,
        args: [valueToKatex(y2MinusY1), valueToKatex(x2MinusX1)],
      },
      ,
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
  }, [x1, x2, y1, y2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setx1('');
    setx2('');
    sety1('');
    sety2('');
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = [x1, x2, y1, y2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2].every((v) => !!v || v == 0);
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
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P_1:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setx1}
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
              setValue={sety1}
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
            <div className="col-4 text-left">Point P_2:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setx2}
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
              setValue={sety2}
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
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />

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

export default Slopeofline;
