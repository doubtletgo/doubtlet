'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol, parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  convertIntoLatex,
  showVal,
  evalInDecimals,
  convertFromLatex,
  evalToDecimals,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { MathField } from '@/types/mathfield.types';
import { isInputInvalid } from '@/helpers/Validations';

const PointOfIntersectionOfTwoLinesIn2D = () => {
  const [m1, setM1] = useState('12');
  const [m2, setM2] = useState('6');
  const [c1, setC1] = useState('-5');
  const [c2, setC2] = useState('4');

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const [result, setResult] = useState('');
  const mf1 = useRef<MathField>(null);
  const mf2 = useRef<MathField>(null);
  const mf3 = useRef<MathField>(null);
  const mf4 = useRef<MathField>(null);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams() as {
      x1: string;
      y1: string;
      x2: string;
      y2: string;
    };
    if (vals.x1) setM1(vals.x1);
    if (vals.y1) setC1(vals.y1);
    if (vals.x2) setM2(vals.x2);
    if (vals.y2) setC2(vals.y2);
  }, []);
  const hasValue = [m1, m2, c1, c2].every((e) => !isInputInvalid(e));
  const parsedM1 = convertFromLatex(m1);
  const parsedM2 = convertFromLatex(m2);
  const parsedC1 = convertFromLatex(c1);
  const parsedC2 = convertFromLatex(c2);

  const m2InDecimal = evalToDecimals(parsedM2);
  const c1InDecimal = evalToDecimals(parsedC1);
  const c2InDecimal = evalToDecimals(parsedC2);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Intersection Point of the Lines y = \\bold{{${
              m1 || '0'
            }}}x ${addSymbol(c1InDecimal)}\\bold{{${
              removeSymbol(c1) || '1'
            }}} \\& y = \\bold{{${m2 || '0'}}}x ${addSymbol(
              c2InDecimal
            )}\\bold{{${removeSymbol(c2) || '0'}}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [m1, m2, c1, c2]);

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
            `Line L_1: \\bold{ y = ${m1 || ''}x ${addSymbol(c1InDecimal)} ${
              removeSymbol(c1) || '1'
            }}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L_2: \\bold{y = ${m2 || ''}x ${addSymbol(c2InDecimal)} ${
              removeSymbol(c2) || '1'
            }}`
          ),
          type: 'equation',
        },
      ])
    );
    if (!hasValue) return;
    setIsPointSame(m1 == m2 && c1 == c2);

    const m1Value = evalExpression(parsedM1);
    const m2Value = evalExpression(parsedM2);
    const c1Value = evalExpression(parsedC1);
    const c2Value = evalExpression(parsedC2);
    const numberatorMinus = evalExpression(` (${c2Value}) - (${c1Value})`);
    const denominatorMinus = evalExpression(`(${m1Value}) - (${m2Value})`);
    const valueX = evalExpression(
      `(${numberatorMinus}) / (${denominatorMinus})`
    );
    const valueY = evalExpression(`(${m1Value})* (${valueX}) + (${c1Value})`);
    const finalAnswer = [
      {
        value: putSpace(
          `The intersection points of \\bold{y = ${convertIntoLatex(
            m1Value
          )}x ${addSymbol(c1)} ${removeSymbol(
            c1
          )}} \\&  \\bold{y = ${convertIntoLatex(m2Value)}x ${addSymbol(
            c2
          )} ${removeSymbol(
            c2
          )}} is \\bold{M(x, y)} = \\bold{(${convertIntoLatex(
            valueX
          )}, ${convertIntoLatex(valueY)})}`
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
        value: `We know that the <b>Intersection-Point</b> of the two Lines `,
        type: 'span',
      },
      'br',
      {
        value: `<b>y = m<sub>1</sub>x + c<sub>1</sub></b> & <b>y = m<sub>2</sub>x + c<sub>2</sub></b> can `,
        type: 'span',
      },
      'br',
      {
        value: `be calculated by Eliminating the one variable from 1st line and <br>putting it in the other.`,
        type: 'span',
      },
      'br',
      {
        value: `m<sub>1</sub>x+c<sub>1</sub> = m<sub>2</sub>x+c<sub>2</sub>`,
        type: 'span',
      },
      'br',
      {
        value: `Then x(m<sub>1</sub>-m<sub>2</sub>) = c<sub>2</sub>-c<sub>1</sub>`,
        type: 'span',
      },
      'br',
      {
        value: `x = {(c_2-c_1)\\above{1pt}(m_1-m_2)}`,
        type: 'equation',
      },
      {
        value: `From the above input it is given that`,
        type: 'span',
      },
      {
        value: `c_1 = \\space \\bold{${showVal(
          c1,
          c1Value
        )}}, \\space m_1 = \\space \\bold{${showVal(
          c1,
          c1Value
        )}}, \\space c_2 = \\space \\bold{ ${showVal(
          m2,
          m2Value
        )}}, \\space c_2 = \\space \\bold{${showVal(c2, c2Value)}}`,
        type: 'equation',
      },

      {
        value: `Now putting these values in the above given formula`,
        type: 'span',
      },

      {
        value: `x = {(${c2}${addSymbol(c1InDecimal)}${removeSymbol(
          c1
        )})\\above{1pt}((${m1})${addSymbol(m2InDecimal)}(${removeSymbol(
          m2
        )}))}`,
        type: 'equation',
      },
      {
        value: `After solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `X = {{${convertIntoLatex(
            numberatorMinus
          )}} \\above{1pt} {${convertIntoLatex(
            denominatorMinus
          )}}} \\implies {${convertIntoLatex(valueX)}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Now put the value of x = ${convertIntoLatex(
            valueX
          )} in Line L_1 equation`
        ),
        type: 'equation',
      },
      {
        value: `Y = {${convertIntoLatex(m1Value)}}({${convertIntoLatex(
          valueX
        )}}) ${addSymbol(c1InDecimal)}{ ${removeSymbol(
          c1
        )}} \\implies {${convertIntoLatex(valueY)}}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `P(x, y) = ({${convertIntoLatex(valueX)}}, {${convertIntoLatex(
            valueY
          )}})  or  \\bold{(${parseNumber(
            evalInDecimals(valueX)
          )}, ${parseNumber(evalInDecimals(valueY))})}`
        ),
        type: 'equation',
      },
      'hr',
      {
        value: '<b>Final Answer</b>',
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);
    setSolution(solution);
  }, [m1, m2, c1, c2, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    setM1('');
    setM2('');
    setC1('');
    setC2('');
    setShowResult(false);
  }, [setShowResult]);

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
            <div className="col-4 text-left">
              Line L<sub>1</sub>:
            </div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setM1}
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
              initialLatex={m1}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setC1}
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
              initialLatex={c1}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Line L<sub>2</sub>:
            </div>
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setM2}
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
              initialLatex={m2}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setC2}
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
              initialLatex={c2}
              style={{
                width: '33.33%',
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
      {hasValue &&
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
      {hasValue && showResult && !showSteps && (
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
      {hasValue && !isPointSame && showSteps && (
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

export default PointOfIntersectionOfTwoLinesIn2D;
