'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  evalInDecimals,
  removeSymbol,
} from '../../helpers/matrixHelper';

const AngleBetweenTwoLines = () => {
  const [c1, setC1] = useState('4');
  const [m1, setM1] = useState('\\sqrt{3}');
  const [c2, setC2] = useState('5');
  const [m2, setM2] = useState('1');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setC1(vals.x1);
    if (vals.y1) setC2(vals.y1);
    if (vals.x2) setM1(vals.x2);
    if (vals.y2) setM2(vals.y2);
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
            `Find the \\bold{Angle (ɵ)} between the \\bold{two Lines.}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `y = \\bold{{${m1 || 'm'}}}x + {${c1 || '1'}} \\& y = {{${
              m2 || 'm'
            }}}x + {{${c2 || '1'}}}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [c1, m1, c2, m2]);

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
            `Line L_1: y = \\bold{{{${m1 || 'm'}}}x + {{${c1 || '1'}}}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Line L_2: y = \\bold{{${m2 || 'm'}}x + {${c2 || '1'}}}`
          ),
          type: 'equation',
        },
      ])
    );

    if (!showSteps) return;
    const tempM1 = katexSimplifiedValue(m1);
    const tempM2 = katexSimplifiedValue(m2);
    const m1Value = evalExpression(tempM1);
    const m2Value = evalExpression(tempM2);

    isInvalid.current = [c1, m1, c2, m2].some((x) => !x);
    if (isInvalid.current) return;
    setIsPointSame(
      valueToKatex(c1) === valueToKatex(m1) &&
        valueToKatex(c2) === valueToKatex(m2)
    );
    const DefaultSolution = () => {
      // variables
      const solveNumerator = evalExpression(`${m1Value} - (${m2Value})`);
      const solveDenominator = evalExpression(`1 + (${m1Value} )*(${m2Value})`);
      let calcAngle = evalExpression(
        `${solveNumerator} / (${solveDenominator})`
      );
      const answerRadian = `atan(${removeSymbol(calcAngle)})`;
      const answerDegree = evalExpression(`((${answerRadian}) 180 * 7) / 22 `);

      //Finsal Answer
      const finalAnswer = [
        {
          value: putSpace(`The \\bold{Angle (ɵ)} between \\bold{two Lines}`),
          type: 'equation',
        },

        {
          value: putSpace(`\\bold{y = 2x+5} \\& \\bold{y = -2x+7} is `),
          type: 'equation',
        },

        {
          value: `\\bold{ɵ = tan^{-1}\\bigg({{${valueToKatex(
            solveNumerator
          )}}\\above{1pt}{${valueToKatex(solveDenominator)}}}\\bigg) 
          = {${valueToKatex(evalInDecimals(answerRadian))}}^c = ${valueToKatex(
            evalInDecimals(answerDegree)
          )} \\space degree.}`,
          type: 'equation',
        },
      ];

      if (!showSteps) return finalAnswer;

      const steps = [
        {
          value: `<b>Step By Step Solution :-</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `We know that the \\bold{Angle (ɵ)} between \\bold{two Lines} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(`\\bold{y = m_1x+c_1 \\& y = m_2x+c_2}`),
          type: 'equation',
        },
        {
          value: putSpace(`is given by the formula below`),
          type: 'equation',
        },
        {
          value: `Angle (ɵ) = tan^{-1} \\lvert { m_1 - m_2 \\above{1pt} 1+m_1m_2} \\rvert`,
          type: 'equation',
        },
        {
          value: `Where ɵ is the acute angle between two Lines.`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`From the above input it is given that `),
          type: 'equation',
        },
        {
          value: putSpace(
            `m_1 = \\bold{{${showVal(m1, m1Value)}}}, m_2 = \\bold{{${showVal(
              m2,
              m2Value
            )}}}`
          ),
          type: 'equation',
        },
        {
          value: `Now putting these values in the above given`,
          type: 'span',
        },
        {
          value: putSpace(
            `formula ɵ = tan^{-1} \\lvert { {${m1}} - ({${m2}}) \\above{1pt} 1+({${m1}})({${m2}})} \\rvert`
          ),
          type: 'equation',
        },
        {
          value: `After Solving`,
          type: 'span',
        },
        {
          value: `ɵ = tan^{-1} \\lvert { {${valueToKatex(
            solveNumerator
          )}} \\above{1pt}{ ${valueToKatex(solveDenominator)}}} \\rvert`,
          type: 'equation',
        },
        {
          value: putSpace(
            `ɵ = tan^{-1} \\bigg({{${valueToKatex(
              removeSymbol(solveNumerator)
            )}} \\above{1pt} {{${valueToKatex(
              removeSymbol(solveDenominator)
            )}}}}\\bigg)`
          ),
          type: 'equation',
        },
        {
          value: `After Solving`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `ɵ = {{${valueToKatex(evalInDecimals(answerRadian))}}} Radian `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `= {{${valueToKatex(evalInDecimals(answerDegree))}}} Degree`
          ),
          type: 'equation',
        },
        'hr',
        {
          value: `Final Answer`,
          type: 'span',
        },
        'br',
        ...finalAnswer,
      ];

      return steps;
    };

    const Case1Solution = () => {
      return [
        {
          value: `since the slope of both the Lines is same it means both Lines are Parallel. 
          Hence angle (ɵ) between these Lines is Zero`,
          type: 'span',
        },
      ];
    };

    const Case2Solution = () => {
      return [
        {
          value: `since the product of the Slope of both the Lines is -1 it means both Lines are Perpendicular. 
          Hence angle (ɵ) between these Lines is 90 degrees`,
          type: 'span',
        },
      ];
    };

    const answerTag = {
      type: 'span',
      value: `<b>Answer</b>`,
    };

    let steps;
    const case1 = m1Value == m2Value;
    const case2 = evalExpression(m1Value * m2Value) == -1;

    if (case1) {
      steps = Case1Solution();
    } else if (case2) {
      steps = Case2Solution();
    } else {
      steps = DefaultSolution();
    }

    if (showSteps) {
      const solution = renderSteps([...steps]);

      setSolution(solution);
    } else {
      const eqRender = renderSteps([answerTag, ...steps]);
      setResult(eqRender);
    }
  }, [m1, m2, c1, c2, showSteps, setSolution]);

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
    setC1('');
    setM1('');
    setC2('');
    setM2('');
    setShowSteps(false);
    setShowResult(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [c1, m1, c2, m2].some((v) => !!v || v == 0);
  const hasAllValue = [c1, m1, c2, m2].every((v) => !!v || v == 0);
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
              setMathfieldRef={(ref) => (mf3.current = ref)}
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
              setMathfieldRef={(ref) => (mf4.current = ref)}
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
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
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
            />{' '}
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

export default AngleBetweenTwoLines;
