'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol, withSymbol } from '../../helpers/decimal';
import MathInput from 'react-math-keyboard';
import {
  showVal,
  removeSymbol,
  evalInDecimals,
  evalExpression,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

import Vector from '@/helpers/Vectors';

const withX = (val) => (val ? `${val}x` : val);
const withY = (val) => (val ? `${val}y` : val);
const withZ = (val) => (val ? `${val}z` : val);

const EquationOfLineJoiningTwoPointsIn3D = () => {
  const [x1, setX1] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_x1', '5');
  const [y1, setY1] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_y1', '-1');
  const [z1, setZ1] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_z1', '7');
  const [x2, setX2] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_x2', '-2');
  const [y2, setY2] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_y2', '0');
  const [z2, setZ2] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_z2', '6');
  const [x3, setX3] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_x3', '2');
  const [y3, setY3] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_y3', '4');
  const [z3, setZ3] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_z3', '8');
  const [equation, setEquation] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_equation', '');
  const [solution, setSolution] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_solution', '');
  const [result, setResult] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_showSteps', true);
  const [note, setNote] = useLocalStorage('EquationOfPlanePassingThroughThreePoint_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `fkFind the \\bold{Equation} of the \\bold{Plane} passing`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `through three points \\bold{P_1(${x1 || '1'}, ${y1 || '1'}, ${
              z1 || '1'
            })}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{P_2 (${x2 || '1'}, ${y2 || '1'}, ${
              z2 || '1'
            })} \\& \\bold{P_3 (${x3 || '1'}, ${y3 || '1'}, ${z3 || '1'})}`
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
          value: `Point P_1 :- (x_1, y_1, z_1) = (${x1 || '1'}, ${y1 || '1'}, ${
            z1 || '1'
          })`,
          type: 'equation',
        },
        {
          value: `Point P_2 :- (x_2, y_2, z_2) = (${x2 || '1'}, ${y2 || '1'}, ${
            z2 || '1'
          })`,
          type: 'equation',
        },
        {
          value: `Point P_3 :- (x_3, y_3, z_3) = (${x3 || '1'}, ${y3 || '1'}, ${
            z3 || '1'
          })`,
          type: 'equation',
        },
      ])
    );

    const isInvalid = [x1, y1, z1, x2, y2, z2, x3, y3, z3].some(
      (x) => !x && x != 0
    );
    const tempX1 = convertFromLatex(x1);
    const tempY1 = convertFromLatex(y1);
    const tempZ1 = convertFromLatex(z1);
    const tempX2 = convertFromLatex(x2);
    const tempY2 = convertFromLatex(y2);
    const tempZ2 = convertFromLatex(z2);
    const tempX3 = convertFromLatex(x3);
    const tempY3 = convertFromLatex(y3);
    const tempZ3 = convertFromLatex(z3);

    const x1Value = evalExpression(tempX1);
    const y1Value = evalExpression(tempY1);
    const z1Value = evalExpression(tempZ1);
    const x2Value = evalExpression(tempX2);
    const y2Value = evalExpression(tempY2);
    const z2Value = evalExpression(tempZ2);
    const x3Value = evalExpression(tempX3);
    const y3Value = evalExpression(tempY3);
    const z3Value = evalExpression(tempZ3);
    if (isInvalid) return;

    const a1 = evalExpression(`${x2Value} - (${x1Value})`);
    const b1 = evalExpression(`${y2Value} - (${y1Value})`);
    const c1 = evalExpression(`${z2Value} - (${z1Value})`);
    const a2 = evalExpression(`${x3Value} - (${x1Value})`);
    const b2 = evalExpression(`${y3Value} - (${y1Value})`);
    const c2 = evalExpression(`${z3Value} - (${z1Value})`);

    const b1IntoC2 = evalExpression(`${b1} * (${c2})`);
    const b2IntoC1 = evalExpression(`${b2} * (${c1})`);
    const a1IntoC2 = evalExpression(`${a1} * (${c2})`);
    const a2IntoC1 = evalExpression(`${a2} * (${c1})`);
    const a1IntoB2 = evalExpression(`${a1} * (${b2})`);
    const a2IntoB1 = evalExpression(`${a2} * (${b1})`);

    const b1c2MinusB2c1 = evalExpression(`${b1IntoC2} - (${b2IntoC1})`);
    const a1c2MinusA2c1 = evalExpression(`${a1IntoC2} - (${a2IntoC1})`);
    const a1b2MinusA2b1 = evalExpression(`${a1IntoB2} - (${a2IntoB1})`);

    const b1c2MinusB2c1IntoA1 = evalExpression(
      `-1*(${b1c2MinusB2c1}) * (${x1Value})`
    );
    const a1c2MinusA2c1Intob1 = evalExpression(
      `(${a1c2MinusA2c1}) * (${y1Value})`
    );

    const a1b2MinusA2b1Intoc1 = evalExpression(
      `-1*(${a1b2MinusA2b1}) * (${z1Value})`
    );
    const total = evalExpression(
      `(${b1c2MinusB2c1IntoA1}) + (${a1c2MinusA2c1Intob1}) + (${a1b2MinusA2b1Intoc1})`
    );

    const a = new Vector([x1, y1, z1]);
    const b = new Vector([x2, y2, z2]);
    const c = new Vector([x3, y3, z3]);
    const ab = b.subtract(a);
    const ac = c.subtract(a);

    const cross = ab.crossProduct(ac);
    console.log(cross, ab, ac, '??????????????');
    const finalAnswer = [
      {
        value: putSpace(`The Cartesian Equation of the Plane passing through`),
        type: 'equation',
      },
      {
        value: putSpace(
          `three points A (${x1}, ${y1}, ${z1}), B (${x2}, ${y2}, ${z2}) \\& C (${x3}, ${y3}, ${z3})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{{${withX(convertIntoLatex(b1c2MinusB2c1))}} {${minusSymbol(
            evalInDecimals(a1c2MinusA2c1)
          )}} {${withY(
            removeSymbol(convertIntoLatex(a1c2MinusA2c1))
          )}} {${addSymbol(evalInDecimals(a1b2MinusA2b1))}} {${withZ(
            removeSymbol(convertIntoLatex(a1b2MinusA2b1))
          )}} {${addSymbol(evalInDecimals(total))} }{${removeSymbol(
            convertIntoLatex(total)
          )}} = 0 }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `or \\bold{{${withX(evalInDecimals(b1c2MinusB2c1))}} {${minusSymbol(
            evalInDecimals(a1c2MinusA2c1)
          )}} {${withY(
            removeSymbol(evalInDecimals(a1c2MinusA2c1))
          )}} {${addSymbol(evalInDecimals(a1b2MinusA2b1))}} {${withZ(
            removeSymbol(evalInDecimals(a1b2MinusA2b1))
          )}} {${addSymbol(evalInDecimals(total))} }{${removeSymbol(
            evalInDecimals(total)
          )}} = 0 }`
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
        value: putSpace(`We know that the Cartesian`),
        type: 'equation',
      },
      {
        value: putSpace(`Equation of Plane passing `),
        type: 'equation',
      },
      {
        value: putSpace(`through three points `),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{ P_1 (x_1, y_1, z_1)} \\&`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{P_2 (x_2, y_2, z_2)} \\&`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{P_3 (x_3, y_3, z_3) }`),
        type: 'equation',
      },

      {
        value: putSpace(`can be calculated by the`),
        type: 'equation',
      },
      {
        value: putSpace(`formula given below.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `{\\large(\\overrightarrow{r} – \\overrightarrow{a}).\\overrightarrow{n} = 0} Where,`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` \\bold{\\overrightarrow{r}} vector is the Position vector`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`of any Point on the plane,`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{a}} vector is the Position vector`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`of any Point lying in the Plane`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{n}} is the normal vector to the plane.`
        ),
        type: 'equation',
      },
      {
        value: `<b>Given :-</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `(x_1, y_1, z_1) = \\bigg(\\bold{{${showVal(
          x1,
          x1Value
        )}}}, \\bold{{${showVal(y1, y1Value)}}}, \\bold{{${showVal(
          z1,
          z1Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(x_2, y_2, z_2) = \\bigg(\\bold{{${showVal(
          x2,
          x2Value
        )}}}, \\bold{{${showVal(y2, y2Value)}}}, \\bold{{${showVal(
          z2,
          z2Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `(x_3, y_3, z_3) = \\bigg(\\bold{{${showVal(
          x3,
          x3Value
        )}}}, \\bold{{${showVal(y3, y3Value)}}}, \\bold{{${showVal(
          z3,
          z3Value
        )}}}\\bigg)`,
        type: 'equation',
      },
      {
        value: `<b>Step 1 :-</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now, \\bold{\\overrightarrow{a}} can be obtained from any of`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`the three given Points on the plane.`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{\\overrightarrow{a}} = (${x1}, ${y1}, ${z1})`),
        type: 'equation',
      },
      {
        value: `<b>Step 2 :-</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now to find the normal vector to`),
        type: 'equation',
      },
      {
        value: putSpace(`the Plane, first we have to find`),
        type: 'equation',
      },
      {
        value: putSpace(`\\overrightarrow{AB} \\& \\overrightarrow{AC}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{AB} = ({${x2}}, {${y2}}, {${z2}}) - ({${x1}}, {${y1}}, {${z1}}) = ({${convertIntoLatex(
            a1
          )}}, {${convertIntoLatex(b1)}}, {${convertIntoLatex(c1)}})`
        ),
        type: 'equation',
      },
      {
        value: `\\overrightarrow{AC} = ({${x3}}, {${y3}}, {${z3}}) - ({${x1}}, {${y1}}, {${z1}}) = ({${convertIntoLatex(
          a2
        )}}, {${convertIntoLatex(b2)}}, {${convertIntoLatex(c2)}})`,
        type: 'equation',
      },
      {
        value: `<b>Step 3 :-</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now \\bold{\\overrightarrow{n}} can be obtained by`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Cross Product} of the two-Line`),
        type: 'equation',
      },
      {
        value: putSpace(`Vectors joining AB \\& AC.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{\\overrightarrow{n} = \\overrightarrow{AB} x \\overrightarrow{AC}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/Cross-Product-Of-Two-Vectors?x1=${a1}&x2=${a2}&y1=${b1}&y2=${b2}&z1=${c1}&z2=${c2}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `\\bold{\\overrightarrow{n} = \\overrightarrow{AB} x \\overrightarrow{AC}} = `
        ),
        type: 'equation',
      },
      {
        value: `\\bold{{${withSymbol(
          convertIntoLatex(b1c2MinusB2c1),
          'i'
        )}} {${addSymbol(evalInDecimals(a1c2MinusA2c1))}} {${withSymbol(
          removeSymbol(convertIntoLatex(a1c2MinusA2c1)),
          'j'
        )}} {${addSymbol(evalInDecimals(a1b2MinusA2b1))}} {${withSymbol(
          removeSymbol(convertIntoLatex(a1b2MinusA2b1)),
          'k'
        )}}} = {(${convertIntoLatex(b1c2MinusB2c1)}), ({${convertIntoLatex(
          a1c2MinusA2c1
        )}}), ({${convertIntoLatex(a1b2MinusA2b1)}})}`,
        type: 'equation',
      },
      {
        value: `<b>Step 4 :-</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now by putting the values of \\bold{\\overrightarrow{a}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`and \\bold{\\overrightarrow{n}} in above formula`),
        type: 'equation',
      },
      {
        value: `{(x, y, z) - ({${x1}}, {${y1}}, {${z1}})}.({${convertIntoLatex(
          b1c2MinusB2c1
        )}}, {${convertIntoLatex(a1c2MinusA2c1)}},{${convertIntoLatex(
          a1b2MinusA2b1
        )}}) = 0`,
        type: 'equation',
      },
      'br',
      {
        value: `{(x {${minusSymbol(evalInDecimals(x1Value))}}{ ${removeSymbol(
          x1
        )}}), (y {${minusSymbol(evalInDecimals(y1Value))}}{ ${removeSymbol(
          y1
        )}}), (z {${minusSymbol(evalInDecimals(z1Value))}} {${removeSymbol(
          z1
        )}})}.({${convertIntoLatex(b1c2MinusB2c1)}}, {${convertIntoLatex(
          a1c2MinusA2c1
        )}}, {${convertIntoLatex(a1b2MinusA2b1)}})  = 0`,
        type: 'equation',
      },
      'br',
      {
        value: `({${convertIntoLatex(b1c2MinusB2c1)}})(x {${minusSymbol(
          evalInDecimals(x1Value)
        )}} {${removeSymbol(x1)}}) + ({${convertIntoLatex(
          a1c2MinusA2c1
        )}})(y {${minusSymbol(evalInDecimals(y1Value))}} {${removeSymbol(
          y1
        )}}) + ({{${convertIntoLatex(a1b2MinusA2b1)}}})(z {${minusSymbol(
          evalInDecimals(z1Value)
        )}} {${removeSymbol(z1)}}) = 0`,
        type: 'equation',
      },
      'br',
      {
        value: `{${withX(convertIntoLatex(b1c2MinusB2c1))}} {${addSymbol(
          evalInDecimals(b1c2MinusB2c1IntoA1)
        )}} {${removeSymbol(
          convertIntoLatex(b1c2MinusB2c1IntoA1)
        )}} {${minusSymbol(evalInDecimals(a1c2MinusA2c1))}} {${withY(
          removeSymbol(convertIntoLatex(a1c2MinusA2c1))
        )}} {${addSymbol(evalInDecimals(a1c2MinusA2c1Intob1))}} {${removeSymbol(
          convertIntoLatex(a1c2MinusA2c1Intob1)
        )}} {${addSymbol(evalInDecimals(a1b2MinusA2b1))}}{ ${withZ(
          removeSymbol(convertIntoLatex(a1b2MinusA2b1))
        )} }{${addSymbol(evalInDecimals(a1b2MinusA2b1Intoc1))}} {${removeSymbol(
          convertIntoLatex(a1b2MinusA2b1Intoc1)
        )}} = 0`,
        type: 'equation',
      },
      'br',
      {
        value: `\\bold{{${withX(
          convertIntoLatex(b1c2MinusB2c1)
        )}} {${minusSymbol(evalInDecimals(a1c2MinusA2c1))}} {${withY(
          removeSymbol(convertIntoLatex(a1c2MinusA2c1))
        )}} {${addSymbol(evalInDecimals(a1b2MinusA2b1))}} {${withZ(
          removeSymbol(convertIntoLatex(a1b2MinusA2b1))
        )}} {${addSymbol(evalInDecimals(total))}} {${removeSymbol(
          convertIntoLatex(total)
        )}} = 0 } `,
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
  }, [x1, y1, z1, x2, y2, z2, , x3, y3, z3, showSteps]);

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
    if (mf7.current) mf7?.current.latex('');
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
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
  }, [setShowResult]);

  const hasValue = [x1, y1, z1, x2, y2, x3, y3, z3].some((v) => !!v || v == 0);
  const hasAllValue = [x1, y1, z1, x2, y2, , x3, y3, z3].every(
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
            <div className="col-3 text-left">Vector A</div>
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
            <div className="col-3 text-left">Vector B</div>
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
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector C</div>
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={z3}
              />{' '}
            </div>
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

export default EquationOfLineJoiningTwoPointsIn3D;
