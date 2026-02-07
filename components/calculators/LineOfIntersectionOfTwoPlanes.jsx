'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import {
  evalExpression,
  evalInDecimals,
  katexSimplifiedValue,
  showVal,
  valueToKatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import MathInput from 'react-math-keyboard';
import { putSpace } from '../../helpers/general';

const LineOfIntersectionOfTwoPlanes = () => {
  const [a, setA] = useState('\\sqrt{3}');
  const [b, setB] = useState('3');
  const [c, setC] = useState('5');
  const [d, setD] = useState('2');
  const [p, setP] = useState('\\sqrt{7}');
  const [q, setQ] = useState('\\sqrt{3}');
  const [r, setR] = useState('6');
  const [s, setS] = useState('4');
  const mf1 = useRef('');
  const mf2 = useRef('');
  const mf3 = useRef('');
  const mf4 = useRef('');
  const mf5 = useRef('');
  const mf6 = useRef('');
  const mf7 = useRef('');
  const mf8 = useRef('');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [isPointSame, setIsPointSame] = useState(false);
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Parametric equation of \\bold{Line of Intersection} of the`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Plane P_1 :- ( {${a || 'a'}}x ${addSymbol(b)} {${
              removeSymbol(b) || 'b'
            }}y ${addSymbol(c)}{${removeSymbol(c) || 'c'}}z ${addSymbol(c)} {${
              removeSymbol(d) || 'd'
            }} = 0)`
          ),
          type: 'equation',
        },
        {
          value: `&`,
          type: 'span',
        },
        {
          value: putSpace(
            `Plane P_2 :- ( {${p || 'p'}}x  ${addSymbol(q)} {${
              removeSymbol(q) || 'q'
            }}y  ${addSymbol(r)} {${removeSymbol(r) || 'r'}}z  ${addSymbol(
              s
            )} {${removeSymbol(s) || 's'}} = 0)`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, d, p, q, r, s]);

  useEffect(() => {
    if (!a || !b || !c || !d || !p || !q || !r || !s) return;
    setIsPointSame(a == b && c == d && p == q && q == r && r == s);
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Plane P_1 :- ( {\\bold{${a || 'a'}}}x  ${addSymbol(b)} {\\bold{${
              removeSymbol(b) || 'b'
            }}}y  ${addSymbol(c)} {\\bold{${
              removeSymbol(c) || 'c'
            }}}z  ${addSymbol(d)} {\\bold{${removeSymbol(d) || 'd'}}} = 0)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Plane P_2 :- ( {\\bold{${p || 'p'}}}x  ${addSymbol(q)} {\\bold{${
              removeSymbol(q) || 'q'
            }}}y  ${addSymbol(r)}{\\bold{${
              removeSymbol(r) || 'r'
            }}}z  ${addSymbol(s)} {\\bold{${removeSymbol(s) || 's'}}} = 0)`
          ),
          type: 'equation',
        },
      ])
    );

    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);
    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);
    const tempS = katexSimplifiedValue(s);
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);
    const sValue = evalExpression(tempS);

    if (
      !aValue ||
      !bValue ||
      !cValue ||
      !dValue ||
      !pValue ||
      !qValue ||
      !rValue ||
      !sValue
    )
      return;

    const getDefaultSolution = () => {
      const aDividedC = evalExpression(`(-${aValue}) / (${cValue})`);
      const bDividedC = evalExpression(`(-${bValue}) / (${cValue})`);
      const dDividedC = evalExpression(`(-${dValue}) / (${cValue})`);
      const pDividedr = evalExpression(`(-${pValue}) / (${rValue})`);
      const qDividedr = evalExpression(`(-${qValue}) / (${rValue})`);
      const sDividedr = evalExpression(`(-${sValue}) / (${rValue})`);

      const bDividedCSubQDividedR = evalExpression(
        `(${bDividedC}) - (${qDividedr})`
      );
      const aDividedCSubADividedC = evalExpression(
        `(${pDividedr}) - (${aDividedC})`
      );
      const dDividedCSubSdividedR = evalExpression(
        `(${dDividedC}) - (${sDividedr})`
      );
      const equationthreeValueOfX = evalExpression(
        `(${aDividedCSubADividedC}) / (${bDividedCSubQDividedR})`
      );
      const equationThreeContantValue = evalExpression(
        `(${dDividedCSubSdividedR}) / (${bDividedCSubQDividedR})`
      );
      const result1 = evalExpression(
        `(${equationthreeValueOfX}) * (${bDividedC})`
      );
      const result2 = evalExpression(
        `(${equationThreeContantValue}) * (${bDividedC})`
      );
      const finalResult1 = evalExpression(`(${result1}) + (${aDividedC})`);
      const finalResult2 = evalExpression(`(${result2}) - (${dDividedC})`);

      //calculate value of x
      const valueOfX = evalExpression(
        `(${dDividedCSubSdividedR}) / (${aDividedCSubADividedC})`
      );
      //value of z when y = 0 and we have value of x
      const answerWithX = evalExpression(
        `(${valueOfX}) * (${aDividedC}) + (${dDividedC})`
      );
      //conditions
      const yIsZero = bDividedCSubQDividedR === 0;

      const finalAnswer = [
        {
          value: `The parametric equation of Line of Intersection of the`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Find the Parametric equation of \\bold{Line of Intersection} of the`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `Plane P_1 :- ( {${a || 'a'}}x ${addSymbol(b)} {${
              removeSymbol(b) || 'b'
            }}y ${addSymbol(c)}{${removeSymbol(c) || 'c'}}z ${addSymbol(c)} {${
              removeSymbol(d) || 'd'
            }} = 0)`
          ),
          type: 'equation',
        },
        {
          value: `&`,
          type: 'span',
        },
        {
          value: putSpace(
            `Plane P_2 :- ( {${p || 'p'}}x  ${addSymbol(q)} {${
              removeSymbol(q) || 'q'
            }}y  ${addSymbol(r)} {${removeSymbol(r) || 'r'}}z  ${addSymbol(
              s
            )} {${removeSymbol(s) || 's'}} = 0)`
          ),
          type: 'equation',
        },
        {
          value: `${
            yIsZero ? `\\bold{x = ${valueToKatex(valueOfX)}}` : `\\bold{x = t}`
          }`,
          type: `equation`,
        },
        {
          value: `\\bold{y} =  ${
            yIsZero
              ? ` \\bold{(0)} =(${valueToKatex(answerWithX)})`
              : `(${valueToKatex(finalResult1)}t ${minusSymbol(
                  finalResult2
                )} ${valueToKatex(removeSymbol(finalResult2))} )`
          }   …… by equation (1)`,
          type: 'equation',
        },
        {
          value: `(${valueToKatex(
            removeSymbol(equationthreeValueOfX)
          )}t ${minusSymbol(equationThreeContantValue)} ${valueToKatex(
            removeSymbol(equationThreeContantValue)
          )})`,
          type: 'equation',
        },
        {
          value: ` = ${
            yIsZero
              ? `(${evalInDecimals(answerWithX)})`
              : `(${evalInDecimals(finalResult1)}t ${minusSymbol(
                  evalInDecimals(finalResult2)
                )} ${evalInDecimals(removeSymbol(finalResult2))} )`
          }   …… by\\space equation (1)`,
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
          value: putSpace(`We know that the Parametric equation of`),
          type: `equation`,
        },
        {
          value: putSpace(`\\bold{Line of Intersection of Planes} `),
          type: `equation`,
        },
        {
          value: putSpace(`\\bold{Plane P_1 :- (Ax + By + Cz + D = 0)}`),
          type: `equation`,
        },
        {
          value: `&`,
          type: `span`,
        },
        {
          value: putSpace(`\\bold{Plane P2 :- (Px + Qy + Rz + S = 0)}`),
          type: `equation`,
        },
        {
          value: putSpace(
            `can be calculated by using the method given below : -`
          ),
          type: `equation`,
        },
        {
          value: `<b>Step-1</b> `,
          type: `span`,
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(`From the above input it is given that `),
          type: `equation`,
        },
        {
          value: putSpace(
            `a= ${showVal(a, aValue)}, b=${showVal(b, bValue)}, c=${showVal(
              c,
              cValue
            )} , d=${showVal(d, dValue)}`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `p= ${showVal(p, pValue)}, q=${showVal(q, qValue)}, r=${showVal(
              r,
              rValue
            )}, s=${showVal(s, sValue)}`
          ),
          type: `equation`,
        },
        {
          value: putSpace(`We have to find the value of Z in terms of`),
          type: `equation`,
        },
        {
          value: putSpace(` x and y from the both equation of Planes.
        `),
          type: `equation`,
        },
        {
          value: putSpace(
            `Z = \\bigg({ -A \\above{1pt}C} \\bigg)x + \\bigg({ -B \\above{1pt}C}\\bigg)y + \\bigg({ -D \\above{1pt}C}\\bigg)`
          ),
          type: `equation`,
        },

        {
          value:
            putSpace(`Z = \\bigg( {-(${a}) \\above{1pt}  ${c}}\\bigg)x + \\bigg({-(${b})\\above{1pt}${c}}\\bigg)y + \\bigg( {-(${d}) \\above{1pt}${c}}\\bigg)      
      `),
          type: `equation`,
        },

        {
          value: putSpace(
            `= \\bold{(  ${valueToKatex(aDividedC)}x ${addSymbol(
              evalInDecimals(bDividedC)
            )} {${valueToKatex(removeSymbol(bDividedC))}}y ${addSymbol(
              evalInDecimals(dDividedC)
            )}  {${valueToKatex(
              removeSymbol(dDividedC)
            )}})} ……(1) from Equation of plane P_1`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `Z = \\bigg({ -P \\above{1pt}R} \\bigg)x +  \\bigg({ -Q \\above{1pt}R} \\bigg)y +  \\bigg({ -S \\above{1pt}R} \\bigg)`
          ),
          type: `equation`,
        },
        {
          value: `Z = \\bigg({ -(${p}) \\above{1pt}${r}}\\bigg)x + \\bigg({ -(${q}) \\above{1pt}${r}}\\bigg)y +\\bigg ({ - (${s}) \\above{1pt}${r}}\\bigg)`,
          type: `equation`,
        },
        {
          value: putSpace(
            `=\\bold{ ( {${valueToKatex(pDividedr)}}x ${addSymbol(
              evalInDecimals(qDividedr)
            )}  {${valueToKatex(removeSymbol(qDividedr))}}y ${addSymbol(
              evalInDecimals(sDividedr)
            )} {${valueToKatex(
              removeSymbol(sDividedr)
            )}}) }….(2) from Equation of plane P_2`
          ),
          type: `equation`,
        },
        {
          value: `<b>Step-2</b>`,
          type: `span`,
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(`Now, equating above both equations we can`),
          type: `equation`,
        },
        {
          value: putSpace(`find y in terms of x`),
          type: `equation`,
        },
        {
          value: `({${valueToKatex(aDividedC)}}x ${addSymbol(
            evalInDecimals(bDividedC)
          )} {${valueToKatex(removeSymbol(bDividedC))}}y ${addSymbol(
            dDividedC
          )}  {${valueToKatex(removeSymbol(dDividedC))}})=( {${valueToKatex(
            pDividedr
          )}}x ${addSymbol(evalInDecimals(qDividedr))}  {${valueToKatex(
            removeSymbol(qDividedr)
          )}}y ${addSymbol(evalInDecimals(sDividedr))} {${valueToKatex(
            removeSymbol(sDividedr)
          )}})`,
          type: `equation`,
        },
        {
          value: putSpace(
            `( {${valueToKatex(removeSymbol(bDividedC))}}y ${minusSymbol(
              evalInDecimals(qDividedr)
            )}{ ${valueToKatex(removeSymbol(qDividedr))}}y ) =({${valueToKatex(
              pDividedr
            )}}x  ${addSymbol(evalInDecimals(sDividedr))} {${valueToKatex(
              removeSymbol(sDividedr)
            )}} ${minusSymbol(evalInDecimals(aDividedC))} { ${valueToKatex(
              removeSymbol(aDividedC)
            )}}x  ${minusSymbol(evalInDecimals(dDividedC))} {${valueToKatex(
              removeSymbol(dDividedC)
            )}})`
          ),
          type: `equation`,
        },
        {
          value: `({${valueToKatex(
            bDividedCSubQDividedR
          )}}y)   =  ({${valueToKatex(aDividedCSubADividedC)}}x ${minusSymbol(
            evalInDecimals(dDividedCSubSdividedR)
          )} {${valueToKatex(removeSymbol(dDividedCSubSdividedR))}})`,
          type: `equation`,
        },
        {
          value: `y =\\bigg ({1\\above{1pt} {${valueToKatex(
            bDividedCSubQDividedR
          )}}}\\bigg ) ({${valueToKatex(
            aDividedCSubADividedC
          )}}x  ${minusSymbol(
            evalInDecimals(dDividedCSubSdividedR)
          )} { ${valueToKatex(removeSymbol(dDividedCSubSdividedR))}})`,
          type: `equation`,
        },
        {
          value: ` =${
            yIsZero
              ? '0'
              : putSpace(`\\bold{
  (${valueToKatex(removeSymbol(equationthreeValueOfX))}x ${minusSymbol(
                  evalInDecimals(equationThreeContantValue)
                )} ${valueToKatex(removeSymbol(equationThreeContantValue))})
}`)
          }\\space……(3)\\space from\\space Equations\\space (1 \\& 2) `,
          type: `equation`,
        },
        {
          value: `<b>Step-3</b>`,
          type: `span`,
          className: 'text-decoration-underline',
        },
        'br',
        {
          value: putSpace(`Now, to find the parametric equation of`),
          type: `equatiion`,
        },
        {
          value: putSpace(` line we have to assume`),
          type: `equatiion`,
        },
        {
          value: `${
            yIsZero ? `{x = ${valueToKatex(valueOfX)}}` : `\\bold{x = t}`
          }`,
          type: `equation`,
        },
        {
          value: `y = ${
            yIsZero ? (
              '0'
            ) : (
              <b>
                ( ${valueToKatex(removeSymbol(equationthreeValueOfX))}t $
                {minusSymbol(evalInDecimals(equationThreeContantValue))} $
                {valueToKatex(removeSymbol(equationThreeContantValue))})
              </b>
            )
          }    …… by equation (3) `,
          type: `span`,
        },
        'br',
        {
          value: `Then`,
          type: `span`,
        },
        {
          value: `z = \\bold{(  ${valueToKatex(aDividedC)}x ${
            yIsZero
              ? `+0y`
              : `${addSymbol(bDividedC)} ${valueToKatex(
                  removeSymbol(bDividedC)
                )}y`
          } ${addSymbol(dDividedC)}  ${valueToKatex(
            removeSymbol(dDividedC)
          )})}`,
          type: `equation`,
        },
        {
          value: `= ${
            yIsZero
              ? `(${valueToKatex(aDividedC)}*${valueToKatex(
                  valueOfX
                )} + 0 ${addSymbol(dDividedC)}  ${valueToKatex(
                  removeSymbol(dDividedC)
                )})`
              : `(${valueToKatex(aDividedC)}t ${addSymbol(
                  bDividedC
                )} ${valueToKatex(removeSymbol(bDividedC))}${
                  yIsZero
                    ? '(0)'
                    : `(${valueToKatex(
                        removeSymbol(equationthreeValueOfX)
                      )}t ${minusSymbol(
                        equationThreeContantValue
                      )} ${valueToKatex(
                        removeSymbol(equationThreeContantValue)
                      )})`
                } ${addSymbol(dDividedC)}  ${valueToKatex(
                  removeSymbol(dDividedC)
                )})`
          }`,
          type: `equation`,
        },
        {
          value: ` = ${
            yIsZero
              ? `(${evalInDecimals(answerWithX)})`
              : `(${evalInDecimals(finalResult1)}t ${minusSymbol(
                  evalInDecimals(finalResult2)
                )} ${evalInDecimals(removeSymbol(finalResult2))} )`
          }   …… by\\space equation (1)`,
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

    const getCase1Solution = () => {
      return [
        {
          value: `Since the directional ratios of the Normal vector the Planes are proportional then
          It means <b>Given Planes are Parallel</b> and hence <b>No any such Line of Intersection is possible.</b>`,
          type: 'span',
        },
      ];
    };

    let steps;

    const case1 = a / p == b / q && a / p == c / r;

    if (case1) {
      steps = getCase1Solution();
    } else {
      steps = getDefaultSolution();
    }
    if (steps) {
      const solution = renderSteps(steps);

      setSolution(solution);
    }
  }, [a, b, c, d, p, q, r, s, showSteps, isPointSame]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    mf1.current.latex('');
    mf2.current.latex('');
    mf3.current.latex('');
    mf4.current.latex('');
    mf5.current.latex('');
    mf6.current.latex('');
    mf7.current.latex('');
    mf8.current.latex('');
    setA('');
    setB('');
    setC('');
    setD('');
    setP('');
    setQ('');
    setR('');
    setS('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d, p, q, r, s].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, d, p, q, r, s].every((v) => !!v || v == 0);

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
            <div className="col-3 text-left">
              Plane P<sub>1</sub> :-{' '}
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-3">
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
                      // "infty",
                      // "theta",
                      'sin',
                      'cos',
                      'tan',
                    ]}
                    initialLatex={a}
                  />{' '}
                </div>
                <div className="col-3">
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
                      // "infty",
                      // "theta",
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
                      // "infty",
                      // "theta",
                      'sin',
                      'cos',
                      'tan',
                    ]}
                    initialLatex={c}
                  />{' '}
                </div>
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
                      // "infty",
                      // "theta",
                      'sin',
                      'cos',
                      'tan',
                    ]}
                    initialLatex={d}
                  />{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">
              {' '}
              Plane P<sub>2</sub> :-
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf5.current = ref)}
                    setValue={setP}
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
                    initialLatex={p}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf6.current = ref)}
                    setValue={setQ}
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
                    initialLatex={q}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf7.current = ref)}
                    setValue={setR}
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
                    initialLatex={r}
                  />{' '}
                </div>
                <div className="col-3">
                  <MathInput
                    setMathfieldRef={(ref) => (mf8.current = ref)}
                    setValue={setS}
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
                    initialLatex={s}
                  />{' '}
                </div>
              </div>
            </div>
          </div>

          <Equation equation={equation} className="border-primary mt-3" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 mt-2 btn-blue"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 mt-2 btn btn-danger"
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

export default LineOfIntersectionOfTwoPlanes;
