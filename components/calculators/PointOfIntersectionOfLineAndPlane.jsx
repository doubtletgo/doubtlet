'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol, negative } from '../../helpers/decimal';
import MathInput from 'react-math-keyboard';
import {
  valueToKatex,
  katexSimplifiedValue,
  removeSymbol,
  evalInDecimals,
  evalExpression,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const PointOfIntersectionOfLineAndPlane = () => {
  const [a, setA] = useState('2');
  const [b, setB] = useState('5');
  const [c, setC] = useState('3');
  const [d, setD] = useState('5');
  const [e, setE] = useState('4');
  const [f, setF] = useState('7');
  const [p, setP] = useState('2');
  const [q, setQ] = useState('8');
  const [r, setR] = useState('7');
  const [s, setS] = useState('3');
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
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();
  const mf10 = useRef();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Point of Intersection} of the`),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Line} {x ${minusSymbol(a)} ${removeSymbol(
              a
            )}\\above{1pt} ${d}} = {y ${minusSymbol(b)} ${removeSymbol(
              b
            )}\\above{1pt} ${e}} ={z ${minusSymbol(c)} ${removeSymbol(
              c
            )}\\above{1pt} ${f}} `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `and \\bold{Plan} ${removeSymbol(p)}x ${addSymbol(
              q
            )} ${removeSymbol(q)}y ${addSymbol(r)} ${removeSymbol(
              r
            )}z ${addSymbol(r)} ${removeSymbol(s)} = 0`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d, e, f, p, q, r, s]);

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
            `\\bold{Line L:} {x ${minusSymbol(a)} ${removeSymbol(
              a
            )}\\above{1pt} ${d}} = {y ${minusSymbol(b)} ${removeSymbol(
              b
            )}\\above{1pt} ${e}} ={z ${minusSymbol(c)} ${removeSymbol(
              c
            )}\\above{1pt} ${f}}`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Plan P:} ${removeSymbol(p || 'A')}x ${addSymbol(
              q
            )} ${removeSymbol(q || 'B')}y ${addSymbol(r)} ${removeSymbol(
              r || 'C'
            )}z ${addSymbol(s)} ${removeSymbol(s || 'D')} = 0`
          ),
          type: 'equation',
        },
      ])
    );

    const isInvalid = [a, b, c, d, e, f, p, q, r, s].some((x) => !x && x != 0);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);
    const tempE = katexSimplifiedValue(e);
    const tempF = katexSimplifiedValue(f);
    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);
    const tempS = katexSimplifiedValue(s);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    const eValue = evalExpression(tempE);
    const fValue = evalExpression(tempF);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);
    const sValue = evalExpression(tempS);

    if (isInvalid) return;

    const pIntoA = evalExpression(`(${pValue}) * (${aValue})`);
    const qIntoB = evalExpression(`(${qValue}) * (${bValue})`);
    const rIntoC = evalExpression(`(${rValue}) * (${cValue})`);
    const addContantValues = evalExpression(
      `(${pIntoA}) + (${qIntoB}) + (${rIntoC}) + (${s})`
    );

    const pIntoD = evalExpression(`(${pValue}) * (${dValue})`);
    const qIntoE = evalExpression(`(${qValue}) * (${eValue})`);
    const rIntoF = evalExpression(`(${rValue}) * (${fValue})`);

    const addTValue = evalExpression(`(${pIntoD}) + (${qIntoE}) + (${rIntoF})`);

    //to check  t is positive or negative
    const t = addContantValues / addTValue < 0 ? 1 : -1;

    const aDivideAddTValue = evalExpression(`(${aValue}) * (${addTValue})`);
    const addADivideAddTValueAndAddConst = evalExpression(
      `(${aDivideAddTValue}) + (${dValue}) * (${t}) * (${addContantValues})`
    );

    const bDivideAddTValue = evalExpression(`${bValue} * ${addTValue}`);
    const addBDivideAddTValueAndAddConst = evalExpression(
      `(${bDivideAddTValue}) + (${eValue}) * (${t}) * (${addContantValues})`
    );

    const cDivideAddTValue = evalExpression(`${cValue} * (${addTValue})`);
    const addCDivideAddTValueAndAddConst = evalExpression(
      `(${cDivideAddTValue}) + (${f}) * (${t}) * (${addContantValues})`
    );

    //to check the value of t is integer or not
    const tDivide = addContantValues / negative(addTValue);

    //to calculate value of x
    const tDivideIntoD = evalExpression(`(${tDivide}) * (${dValue})`);
    const tDivideIntoDAnswer = evalExpression(
      `(${aValue}) + (${tDivideIntoD})`
    );

    //to calculate value of y
    const tDivideIntoE = evalExpression(`(${tDivide}) * (${eValue})`);
    const tDivideIntoEAnswer = evalExpression(
      `(${bValue}) + (${tDivideIntoE})`
    );

    //to calculate value of z
    const tDivideIntoF = evalExpression(`(${tDivide}) * (${fValue})`);
    const tDivideIntoFAnswer = evalExpression(
      `(${cValue}) + (${tDivideIntoF})`
    );

    //Step-3 solution
    let into1 = evalExpression(`${addContantValues} * ${d}`);
    let into2 = evalExpression(`${addContantValues} * ${eValue}`);
    let into3 = evalExpression(`${addContantValues} * ${fValue}`);

    const getDafaultSolution = () => {
      const finalAnswer = [
        {
          value: putSpace(
            `The Point of Intersection of the ${
              Number.isInteger(tDivide)
                ? `\\bold{\\bigg\\{ { \\large {${evalInDecimals(
                    tDivideIntoDAnswer
                  )}}, {${evalInDecimals(
                    tDivideIntoEAnswer
                  )}}, {${evalInDecimals(tDivideIntoFAnswer)}}}\\rbrace}`
                : `\\bold{ \\large = \\lbrace {{{${evalInDecimals(
                    addADivideAddTValueAndAddConst
                  )}} \\above{1pt} {{${evalInDecimals(
                    removeSymbol(addTValue)
                  )}}}}, {{${evalInDecimals(
                    addBDivideAddTValueAndAddConst
                  )}} \\above{1pt} {${evalInDecimals(
                    removeSymbol(addTValue)
                  )}}}, {{${evalInDecimals(
                    addCDivideAddTValueAndAddConst
                  )}} \\above{1pt} {${evalInDecimals(
                    removeSymbol(addTValue)
                  )}}}}\\rbrace }`
            }`
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
          value: `Step By Step Solution :-`,
          type: 'span',
        },
        {
          value: putSpace(`We know that the Point of Intersection of `),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\bold{Line {x ${minusSymbol(a)} ${removeSymbol(
              a
            )}\\above{1pt} ${d}} = {y ${minusSymbol(b)} ${removeSymbol(
              b
            )}\\above{1pt} ${e}} ={z ${minusSymbol(c)} ${removeSymbol(
              c
            )}\\above{1pt} ${f}}} \\&`
          ),
          type: 'equation',
        },
        {
          value: putSpace(` \\bold{Plane P: Ax + By + Cz + D = 0} `),
          type: 'equation',
        },
        {
          value: putSpace(`an be calculated by using the method`),
          type: 'equation',
        },
        {
          value: putSpace(`\\bold{given below: -}`),
          type: 'equation',
        },
        {
          value: putSpace(`First, we have to convert the Equation of Line `),
          type: 'equation',
        },
        {
          value: putSpace(`in parametric form which `),
          type: 'equation',
        },
        {
          value: putSpace(`X = (a + dt),`),
          type: 'equation',
        },

        {
          value: putSpace(`Y = (b + et),`),
          type: 'equation',
        },

        {
          value: putSpace(`Z = (c + ft)`),
          type: 'equation',
        },
        {
          value: `<b>Step 1 :-</b>`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        'br',

        {
          value: putSpace(`\\bold{Given :-}`),
          type: 'equation',
        },
        {
          value: putSpace(`From the above input it is given that`),
          type: 'equation',
        },
        {
          value: putSpace(
            `(a, b, c) = \\bigg(${valueToKatex(
              aValue
            )}, ${bValue}, ${valueToKatex(cValue)}\\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(d, e, f) =  \\bigg(${valueToKatex(dValue)}, ${valueToKatex(
              eValue
            )}, ${valueToKatex(fValue)}\\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `(A, B, C, D) =  \\bigg(${valueToKatex(pValue)}, ${valueToKatex(
              qValue
            )}, ${valueToKatex(rValue)}, ${valueToKatex(sValue)}\\bigg)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`by putting above values we can obtain`),
          type: 'equation',
        },
        {
          value: putSpace(`the Parametric form of general point on line`),
          type: 'equation',
        },
        {
          value: putSpace(`X = (${a} + ${d}t),`),
          type: 'equation',
        },

        {
          value: putSpace(`Y = (${b} + ${e}t),`),
          type: 'equation',
        },

        {
          value: putSpace(`Z = (${c} + ${f}t)`),
          type: 'equation',
        },

        {
          value: putSpace(`Now we know that if line and planes will intersect`),
          type: 'equation',
        },

        {
          value: putSpace(`then General point of line will also lie on `),
          type: 'equation',
        },

        {
          value: putSpace(
            `the plane \\& hence it will satisfy the equation of plane.`
          ),
          type: 'equation',
        },
        'br',
        {
          value: `<b>Step 2 :-</b>`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(`The equation of given Plane is`),
          type: 'equation',
        },

        {
          value: putSpace(
            ` ${removeSymbol(p)}x ${addSymbol(q)} ${removeSymbol(
              q
            )}y ${addSymbol(r)} ${removeSymbol(r)}z ${addSymbol(
              r
            )} ${removeSymbol(s)} = 0`
          ),
          type: 'equation',
        },

        {
          value: putSpace(
            `After putting the values of x, y, z in above equation`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` ${removeSymbol(p)}(${a} + ${d}t) ${addSymbol(q)} ${removeSymbol(
              q
            )}(${b} + ${e}t) ${addSymbol(r)} ${removeSymbol(
              r
            )}(${c} + ${f}t) ${addSymbol(r)} ${removeSymbol(s)} = 0`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`By solving the above equation for t`),
          type: 'equation',
        },
        {
          value: `${valueToKatex(pIntoA)} ${addSymbol(
            evalInDecimals(pIntoD)
          )} ${valueToKatex(removeSymbol(pIntoD))}t ${addSymbol(
            evalInDecimals(qIntoB)
          )} ${valueToKatex(removeSymbol(qIntoB))} ${addSymbol(
            evalInDecimals(qIntoE)
          )} ${valueToKatex(removeSymbol(qIntoE))}t ${addSymbol(
            evalInDecimals(rIntoC)
          )} ${valueToKatex(removeSymbol(rIntoC))} ${addSymbol(
            rIntoF
          )} ${valueToKatex(removeSymbol(rIntoF))}t ${addSymbol(
            evalInDecimals(sValue)
          )} ${removeSymbol(sValue)} = 0 `,
          type: 'equation',
        },
        {
          value: putSpace(
            `{${valueToKatex(addTValue)}}t ${addSymbol(
              evalInDecimals(addContantValues)
            )} {${valueToKatex(removeSymbol(addContantValues))}} = 0`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `then t = ${addSymbol(t)}{{${valueToKatex(
              removeSymbol(addContantValues)
            )}} \\above{1pt} {${valueToKatex(removeSymbol(addTValue))}}} ${
              Number.isInteger(tDivide) ? ` = {${valueToKatex(tDivide)}}` : ''
            }`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Since we found a single value of t from this process,`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `we know that the line should intersect the plane in`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`a single point.`),
          type: 'equation',
        },
        'br',
        {
          value: `<b>Step 3 :-</b>`,
          type: 'span',
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(`So, the point of intersection can be determined`),
          type: 'equation',
        },
        {
          value: putSpace(
            ` by plugging this value in for ‘t’ in the parametric`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`equations of the line.`),
          type: 'equation',
        },
        {
          value: `X = ${a} ${
            Number.isInteger(tDivide)
              ? `${addSymbol(evalInDecimals(tDivideIntoD))} ${valueToKatex(
                  removeSymbol(tDivideIntoD)
                )} ={${valueToKatex(tDivideIntoDAnswer)}}`
              : `{${addSymbol(d * t)}} {${valueToKatex(
                  removeSymbol(into1)
                )} \\above{1pt} ${valueToKatex(
                  removeSymbol(addTValue)
                )}} = {${valueToKatex(
                  addADivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(removeSymbol(addTValue))}}`
          } `,
          type: 'equation',
        },
        {
          value: `Y = ${b} ${
            Number.isInteger(tDivide)
              ? `${addSymbol(evalInDecimals(tDivideIntoE))} ${valueToKatex(
                  removeSymbol(tDivideIntoE)
                )} = ${valueToKatex(tDivideIntoEAnswer)}`
              : `${addSymbol(evalInDecimals(eValue * t))} {${valueToKatex(
                  removeSymbol(evalExpression(`${into2}`))
                )} \\above{1pt} ${valueToKatex(
                  removeSymbol(addTValue)
                )}} = {${valueToKatex(
                  addBDivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(removeSymbol(addTValue))}}`
          } `,
          type: 'equation',
        },
        {
          value: `Z = ${c} ${
            Number.isInteger(tDivide)
              ? `${addSymbol(evalInDecimals(tDivideIntoF))} ${valueToKatex(
                  removeSymbol(tDivideIntoF)
                )} = ${valueToKatex(tDivideIntoFAnswer)}`
              : `${addSymbol(evalInDecimals(fValue * t))} {${valueToKatex(
                  removeSymbol(into3)
                )} \\above{1pt} ${valueToKatex(
                  removeSymbol(addTValue)
                )}} = {${valueToKatex(
                  addCDivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(removeSymbol(addTValue))}}`
          } `,
          type: 'equation',
        },
        {
          value: `So, the point of intersection of this line with `,
          type: 'span',
        },
        'br',
        {
          value: `this plane is `,
          type: 'span',
        },
        {
          value: `Point \\space P \\space (x, \\space y, \\space z) ${
            Number.isInteger(tDivide)
              ? `\\bold{ { \\large ${valueToKatex(
                  tDivideIntoDAnswer
                )}, ${valueToKatex(tDivideIntoEAnswer)}, ${valueToKatex(
                  tDivideIntoFAnswer
                )}}}`
              : `\\bold{ \\large = {{${valueToKatex(
                  addADivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(
                  removeSymbol(addTValue)
                )}}, {${valueToKatex(
                  addBDivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(
                  removeSymbol(addTValue)
                )}}, {${valueToKatex(
                  addCDivideAddTValueAndAddConst
                )} \\above{1pt} ${valueToKatex(removeSymbol(addTValue))}}} }`
          }`,
          type: 'equation',
        },
        {
          value: putSpace(`We can verify our solution by putting`),
          type: 'equation',
        },
        {
          value: putSpace(`the coordinates of this point into the plane`),
          type: 'equation',
        },
        {
          value: putSpace(
            ` equation and checking to see that it is satisfied.`
          ),
          type: 'equation',
        },
        'hr',
        {
          value: `Final Answer`,
          type: 'span',
        },
        ...finalAnswer,
      ];

      return steps;
    };

    let steps;

    const case1 = p * d + q * e + r * f === 0;

    if (case1) {
      steps = getCase1Solution();
    } else {
      steps = getDafaultSolution();
    }

    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [a, b, c, d, e, f, p, q, r, s, showSteps]);

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
    if (mf10.current) mf10?.current.latex('');

    setA('');
    setB('');
    setC('');
    setD('');
    setE('');
    setF('');
    setP('');
    setQ('');
    setR('');
    setS('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d, e, p, q, r, s].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, d, e, , p, q, r, s].every((v) => !!v || v == 0);

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
            Your input can be in form of Integer,Fraction or any Real Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Line L:</div>
            <div className="col-3 ">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
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
                initialLatex={a}
              />{' '}
            </div>
            <div className="col-3 ">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setB}
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
                initialLatex={b}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setC}
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
                initialLatex={c}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setD}
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
                initialLatex={d}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setE}
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
                initialLatex={e}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setF}
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
                initialLatex={f}
              />{' '}
            </div>
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left ">Plane P:</div>
            <div className="col-9">
              <div className="row">
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf4.current = ref)}
                    setValue={setP}
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
                    initialLatex={p}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf5.current = ref)}
                    setValue={setQ}
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
                    initialLatex={q}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf6.current = ref)}
                    setValue={setR}
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
                    initialLatex={r}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf6.current = ref)}
                    setValue={setS}
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
                    initialLatex={s}
                  />{' '}
                </div>
              </div>
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

export default PointOfIntersectionOfLineAndPlane;
