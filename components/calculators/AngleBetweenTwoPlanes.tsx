'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  showVal,
  removeSymbol,
  evalInDecimals,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { solveWithLeastRoots } from '../../helpers/SolveRoot';

import { MathField } from '@/types/mathfield.types';

const DistanceBetweenTwoParallelPlanes = () => {
  const [a1, setA1] = useState('1');
  const [b1, setB1] = useState('2');
  const [c1, setC1] = useState('\\sqrt{1}');
  const [d1, setD1] = useState('1');
  const [a2, setA2] = useState('e^5');
  const [b2, setB2] = useState('4');
  const [c2, setC2] = useState('2');
  const [d2, setD2] = useState('\\sqrt{1}');

  const [result, setResult] = useState();
  const isInvalid = useRef<boolean>(true);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef<MathField | null>(null);
  const mf2 = useRef<MathField | null>(null);
  const mf3 = useRef<MathField | null>(null);
  const mf4 = useRef<MathField | null>(null);
  const mf5 = useRef<MathField | null>(null);
  const mf6 = useRef<MathField | null>(null);
  const mf7 = useRef<MathField | null>(null);
  const mf8 = useRef<MathField | null>(null);

  //to get values from other calculator
  useEffect(() => {
    const vals: Record<string, string> = getSearchParams();
    if (vals.a1) setA1(vals.a1);
    if (vals.b1) setB1(vals.b1);
    if (vals.c1) setC1(vals.c1);
    if (vals.d1) setA2(vals.d1);
    if (vals.a2) setA2(vals.a2);
    if (vals.b2) setB2(vals.b2);
    if (vals.c2) setC2(vals.c2);
    if (vals.d2) setA2(vals.d2);
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
            `Find the \\bold{Acute Angle (ɵ)} between the two Planes`
          ),
          type: 'equation',
        },
        {
          value: `P_1 : 
          \\bold{{${parseNumber(a1 || 'a')}}}x + \\bold{{${parseNumber(
            b1 || 'b'
          )}}}y + \\bold{{${parseNumber(c1 || 'c')}}}z + \\bold{{${parseNumber(
            d1 || 'd'
          )}}} = 0`,
          type: 'equation',
        },
        {
          value: `&`,
          type: 'span',
        },
        {
          value: `P_2 : \\bold{{${parseNumber(
            a2 || 'a'
          )}}}x + \\bold{{${parseNumber(b2 || 'b')}}}y + \\bold{{${parseNumber(
            c2 || 'c'
          )}}}z + \\bold{{${parseNumber(d2 || 'd')}}} = 0`,
          type: 'equation',
        },
      ])
    );
  }, [a1, b1, c1, a2, b2, c2, d1, d2]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Plane 1 : 
          \\bold{{${parseNumber(a1 || 'a')}}}x + \\bold{{${parseNumber(
            b1 || 'b'
          )}}}y + \\bold{{${parseNumber(c1 || 'c')}}}z + \\bold{{${parseNumber(
            d1 || 'd'
          )}}} = 0`,
          type: 'equation',
        },
        {
          value: `Plane 2 : 
          \\bold{{${parseNumber(a2 || 'a')}}}x + \\bold{{${parseNumber(
            b2 || 'b'
          )}}}y + \\bold{{${parseNumber(c2 || 'c')}}}z + \\bold{{${parseNumber(
            d2 || 'd'
          )}}} = 0`,
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [a1, b1, c1, a2, b2, c2, d1, d2].some((x) => !x);
    if (isInvalid.current) return;
    const tempA1 = convertFromLatex(a1);
    const tempB1 = convertFromLatex(b1);
    const tempC1 = convertFromLatex(c1);
    const tempD1 = convertFromLatex(d1);
    const tempA2 = convertFromLatex(a2);
    const tempB2 = convertFromLatex(b2);
    const tempC2 = convertFromLatex(c2);
    const tempD2 = convertFromLatex(d2);
    const a1Value = evalExpression(tempA1);
    const b1Value = evalExpression(tempB1);
    const c1Value = evalExpression(tempC1);
    const d1Value = evalExpression(tempD1);
    const a2Value = evalExpression(tempA2);
    const b2Value = evalExpression(tempB2);
    const c2Value = evalExpression(tempC2);
    const d2Value = evalExpression(tempD2);
    const a1A2 = evalExpression(`${a1Value}* (${a2Value})`);
    const b1B2 = evalExpression(`${b1Value}* (${b2Value})`);
    const c1C2 = evalExpression(`${c1Value}* (${c2Value})`);
    const getDafaultSolution = () => {
      const denominatorAddFirst = evalExpression(
        `(${a1Value})^2 + (${b1Value})^2 + (${c1Value})^2`
      );
      const denominatorAddSecond = evalExpression(
        `(${a2Value})^2 + (${b2Value})^2 + (${c2Value})^2`
      );
      const denomAddSqr = solveWithLeastRoots(denominatorAddFirst);
      const denomAddSqrScnd = solveWithLeastRoots(denominatorAddSecond);
      const bothSame =
        denomAddSqr == denominatorAddFirst &&
        denomAddSqrScnd == denominatorAddSecond;
      const NumberatorAdd = evalExpression(`(${a1A2}) + (${b1B2}) + (${c1C2})`);
      const denominatorRootMultiply = evalExpression(
        `(${denominatorAddFirst}) * (${denominatorAddSecond})`
      );
      const denominatorRootMultiplySolution = evalExpression(
        `sqrt(${denominatorRootMultiply})`
      );
      const divide = evalExpression(
        `(${NumberatorAdd}) / (${denominatorRootMultiplySolution})`
      );
      const angleRadian = evalExpression(`cos(${evalInDecimals(divide)})`);
      const angleDegree = evalExpression(`(${angleRadian}*7*180) / 22 `);

      const equations = [
        {
          type: 'span',
          value: `<b>Answer</b>`,
        },
        'br',
        {
          value: `The Angle (ɵ) between two Planes <b>P1: ${a1 || ''}x+${
            b1 || '0'
          }y+${c1 || ''}z+${d1 || '1'} = 0 & P2 : ${a2 || ''}x+${b2 || ''}y+${
            c2 || ''
          }z+${d2 || '1'} = 0</b> is`,
          type: 'span',
        },
        'br',
        {
          value: `ɵ = cos^{-1}(${divide}) = ${convertIntoLatex(
            angleRadian
          )}\\space Radian \\implies ${convertIntoLatex(
            angleDegree
          )}\\space degree`,
          type: 'equation',
        },
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
          value: `We know that the <b>Acute Angle (ɵ)</b> between two <b>Planes</b>`,
          type: 'span',
        },
        'br',
        {
          value: `<b>P<sub>1</sub>: A<sub>1</sub>x + B<sub>1</sub>y + C<sub>1</sub>z + D<sub>1</sub> = 0  <br>
     & P<sub>2</sub>: A<sub>2</sub>x + B<sub>2</sub>y + C<sub>2</sub>z + D<sub>2</sub> = 0 </b> <br>
        is given by the formula below`,
          type: 'span',
        },
        {
          value: `Angle (ɵ) =Cos^{-1} \\lvert{A_1A_2 + B_1B_2 + C_1C_2 \\above{1pt}\\bigg(\\sqrt{{A_1}^2+{B_1}^2+
        {C_1}^2 }\\bigg)\\bigg(\\sqrt{{A_2}^2+{B_2}^2+
          {C_2}^2 }\\bigg)}\\rvert`,
          type: 'equation',
        },
        {
          value: `Where ɵ is the acute angle between two Planes.`,
          type: 'span',
        },
        'br',
        {
          value: `From the above input it is given that `,
          type: 'span',
        },
        'br',
        {
          value: `a_1= ${showVal(a1, a1Value)}, b_1 = ${showVal(
            b1,
            b1Value
          )},c_1 = ${showVal(c1, c1Value)}, d_1=${showVal(d1, d1Value)}`,
          type: 'equation',
        },
        {
          value: `a_2= ${showVal(a2, a2Value)}, b_2 = ${showVal(
            b2,
            b2Value
          )}, c_2 = ${showVal(c2, c2Value)}, d_2=${showVal(d2, d2Value)}`,
          type: 'equation',
        },
        {
          value: `Now putting these values in the above given formula`,
          type: 'span',
        },
        {
          value: putSpace(
            `ɵ =Cos^{-1} \\lvert{({${convertIntoLatex(
              a1Value
            )}})({${convertIntoLatex(a2Value)}})+({${convertIntoLatex(
              b1Value
            )}})({${convertIntoLatex(b2Value)}})+{(${convertIntoLatex(
              c1Value
            )})}{(${convertIntoLatex(
              c2Value
            )})} \\above{1pt}\\bigg(\\sqrt{{(${convertIntoLatex(
              a1Value
            )})}^2+{(${convertIntoLatex(b1Value)})}^2+{(${convertIntoLatex(
              c1Value
            )})}^2 }\\bigg)\\bigg(\\sqrt{{(${convertIntoLatex(
              a2Value
            )})}^2+{(${convertIntoLatex(b2Value)})}^2+{(${convertIntoLatex(
              c2Value
            )})}^2 }\\bigg)}\\rvert`
          ),
          type: 'equation',
        },
        {
          value: `After solving`,
          type: 'span',
        },
        {
          value: putSpace(
            `ɵ =Cos^{-1} \\lvert{{${convertIntoLatex(
              a1A2
            )}}+{${convertIntoLatex(b1B2)}}+{${removeSymbol(
              convertIntoLatex(c1C2)
            )}} \\above{1pt}\\sqrt{{${convertIntoLatex(
              denominatorAddFirst
            )}}}*\\sqrt{{${convertIntoLatex(denominatorAddSecond)}}}}\\rvert ${
              bothSame
                ? ''
                : `= Cos^{-1} \\lvert{{${convertIntoLatex(
                    a1A2
                  )}}+{${convertIntoLatex(b1B2)}}+{${removeSymbol(
                    convertIntoLatex(c1C2)
                  )}} \\above{1pt}{{${denomAddSqr}}}*{{${denomAddSqrScnd}}}}\\rvert`
            }`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `ɵ =Cos^{-1} \\lvert{${convertIntoLatex(
              NumberatorAdd
            )} \\above{1pt}\\sqrt{${convertIntoLatex(
              denominatorRootMultiply
            )}}}\\rvert`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `ɵ = cos^{-1}(${convertIntoLatex(divide)}) = ${convertIntoLatex(
              angleRadian
            )}\\space Radian \\implies ${convertIntoLatex(
              angleDegree
            )} or ${evalInDecimals(angleDegree)} degree`
          ),
          type: 'equation',
        },
        'hr',
        {
          value: `<b>Final Answer</b>`,
          type: 'span',
        },
        {
          value: putSpace(`The Angle (ɵ) between two Planes `),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{P1: ${parseNumber(a1 || '')}x+${parseNumber(
              b1 || ''
            )}y+${parseNumber(c1 || '')}z+${parseNumber(d1 || '1')} = 0} `
          ),
          type: 'equation',
        },
        {
          value: `\\&`,
          type: 'euqation',
        },
        {
          value: putSpace(
            `\\bold{P2 : ${parseNumber(a2 || '')}x+${parseNumber(
              b2 || ''
            )}y+${parseNumber(c2 || '')}z+${parseNumber(d2 || '1')} = 0}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `is ɵ = cos^{-1}(${convertIntoLatex(divide)}) = ${parseNumber(
              convertIntoLatex(angleRadian)
            )}\\space Radian \\implies ${parseNumber(
              convertIntoLatex(angleDegree)
            )} or ${parseNumber(evalInDecimals(angleDegree))} degree`
          ),
          type: 'equation',
        },
      ];

      return steps;
    };
    const getCase1Solution = () => {
      return [
        {
          value: `Since the ratio of Normal vectors of both the Planes is same it means both Planes are Parallel.
          Hence angle (ɵ) between these Planes is Zero`,
          type: 'span',
        },
      ];
    };

    const getCase2Solution = () => {
      return [
        {
          value: `since the dot product of the Normal vectors of both the Planes is 0 it means both Planes are 
          Perpendicular. Hence angle (ɵ) between these Planes is 90 degrees`,
          type: 'span',
        },
      ];
    };

    let steps;

    const case1 =
      a1Value / a2Value == b1Value / b2Value &&
      a1Value / a2Value == c1Value / c2Value;
    const case2 = a1A2 + b1B2 + c1C2 === 0;

    if (case1) {
      steps = getCase1Solution();
    } else if (case2) {
      steps = getCase2Solution();
    } else {
      steps = getDafaultSolution();
    }

    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [a1, b1, c1, a2, b2, c2, d1, d2, showSteps]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA1('');
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2.current.latex('');
    if (mf3.current) mf3.current.latex('');
    if (mf4.current) mf4.current.latex('');
    if (mf5.current) mf5.current.latex('');
    if (mf6.current) mf6.current.latex('');
    if (mf7.current) mf7.current.latex('');
    if (mf8.current) mf8.current.latex('');
    setB1('');
    setC1('');
    setD1('');
    setA2('');
    setB2('');
    setC2('');
    setD2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a1, b1, c1, a2, b2, c2, d1, d2].some(
    (v) => !!v || v == '0'
  );
  const hasAllValue = [a1, b1, c1, a2, b2, c2, d1, d2].every(
    (v) => !!v || v == '0'
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
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Plane 1:</div>
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf1.current = ref)}
              setValue={setA1}
              initialLatex={a1}
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
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf2.current = ref)}
              setValue={setB1}
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
              style={{
                width: '20%',
              }}
              initialLatex={b1}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf3.current = ref)}
              setValue={setC1}
              initialLatex={c1}
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
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf4.current = ref)}
              setValue={setD1}
              initialLatex={d1}
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
              style={{
                width: '20%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left d-flex">Plane 2:</div>

            <MathInput
              setMathfieldRef={(ref: MathField) => (mf5.current = ref)}
              setValue={setA2}
              initialLatex={a2}
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
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf6.current = ref)}
              setValue={setB2}
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
              style={{
                width: '20%',
              }}
              initialLatex={b2}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf7.current = ref)}
              setValue={setC2}
              initialLatex={c2}
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
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref: MathField) => (mf8.current = ref)}
              setValue={setD2}
              initialLatex={d2}
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
              style={{
                width: '20%',
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
      {hasAllValue && (
        <button
          className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
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

export default DistanceBetweenTwoParallelPlanes;
