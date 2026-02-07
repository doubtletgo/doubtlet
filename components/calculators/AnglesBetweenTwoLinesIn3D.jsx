'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useRef, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import MathInput from 'react-math-keyboard';
import { minusSymbol, abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  removeSymbol,
  evalInDecimals,
} from '../../helpers/matrixHelper';

const numberWithAlternate = (num, alt) => {
  num = parseNumber(num);
  return num || (num === 0 ? num : alt);
};

const AnglesBetweenTwoLinesIn3D = () => {
  const [a, setA] = useState('4');
  const [b, setB] = useState('6');
  const [c, setC] = useState('5');
  const [d, setD] = useState('6');
  const [e, setE] = useState('2');
  const [f, setF] = useState('\\sqrt{144}');
  const [l, setL] = useState('2');
  const [m, setM] = useState('2');
  const [n, setN] = useState('3');
  const [p, setP] = useState('2');
  const [q, setQ] = useState('1');
  const [r, setR] = useState('5');
  const isInvalid = useRef();
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
  const mf11 = useRef();
  const mf12 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.a) setA(vals.a);
    if (vals.b) setB(vals.b);
    if (vals.c) setC(vals.c);
    if (vals.d) setD(vals.d);
    if (vals.e) setE(vals.e);
    if (vals.f) setF(vals.f);
    if (vals.l) setL(vals.l);
    if (vals.r) setE(vals.r);
    if (vals.m) setB(vals.m);
    if (vals.n) setA(vals.n);
    if (vals.p) setP(vals.p);
    if (vals.q) setQ(vals.q);
  }, []);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
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
          value: `We know that the Angle (ɵ) between
          `,
          type: `span`,
        },
        {
          value: ` Line\\space L_1:- \\ {x ${minusSymbol(
            l || 0
          )} ${numberWithAlternate(
            abs(l),
            'l'
          )} \\above{1pt} ${numberWithAlternate(a, 'a')}} = \\ {y ${minusSymbol(
            m || 0
          )} ${numberWithAlternate(
            abs(m),
            'm'
          )} \\above{1pt} ${numberWithAlternate(b, 'b')}}=
          \\ {z ${minusSymbol(n || 0)} ${numberWithAlternate(
            abs(n),
            'n'
          )} \\above{1pt} ${numberWithAlternate(c, 'c')}}`,
          type: `equation`,
        },
        {
          value: `\\&`,
          type: `equation`,
        },
        {
          value: `Line\\space L_2:- {x ${minusSymbol(
            p || 0
          )} ${numberWithAlternate(
            abs(p),
            'p'
          )} \\above{1pt} ${numberWithAlternate(d, 'd')}}  =
          {y ${minusSymbol(q || 0)} ${numberWithAlternate(
            abs(q),
            'q'
          )} \\above{1pt} ${numberWithAlternate(e, 'e')}}=
          {z ${minusSymbol(r || 0)} ${numberWithAlternate(
            abs(r),
            'r'
          )} \\above{1pt} ${numberWithAlternate(f, 'f')}}`,
          type: `equation`,
        },
      ])
    );
  }, [a, b, c, d, e, f, l, m, n, p, q, r]);

  useEffect(() => {
    isInvalid.current = [a, b, c].some((x) => !x);
    if (isInvalid.current) return;
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);
    const tempE = katexSimplifiedValue(e);
    const tempF = katexSimplifiedValue(f);
    const tempL = katexSimplifiedValue(l);
    const tempM = katexSimplifiedValue(m);
    const tempN = katexSimplifiedValue(n);
    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);
    //simple values
    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const eValue = evalExpression(tempE);
    const dValue = evalExpression(tempD);
    const fValue = evalExpression(tempF);
    const lValue = evalExpression(tempL);
    const mValue = evalExpression(tempM);
    const nValue = evalExpression(tempN);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Line \\space L_1:- \\ {x ${minusSymbol(
            evalInDecimals(lValue)
          )} ${valueToKatex(
            removeSymbol(lValue),
            'l'
          )} \\above{1pt} ${valueToKatex(aValue)}} = \\ {y ${minusSymbol(
            evalInDecimals(mValue)
          )} ${valueToKatex(
            removeSymbol(mValue),
            'm'
          )} \\above{1pt} ${valueToKatex(bValue)}}=\\ {z ${minusSymbol(
            evalInDecimals(nValue)
          )} ${valueToKatex(
            removeSymbol(nValue),
            'n'
          )} \\above{1pt} ${valueToKatex(cValue)}}`,
          type: `equation`,
          type: 'equation',
        },
        {
          value: `Line\\space L_2:- {x ${minusSymbol(
            evalInDecimals(pValue)
          )} ${valueToKatex(
            removeSymbol(pValue),
            'p'
          )} \\above{1pt} ${valueToKatex(dValue)}}  =
          {y ${minusSymbol(evalInDecimals(qValue))} ${valueToKatex(
            removeSymbol(qValue),
            'q'
          )} \\above{1pt} ${valueToKatex(eValue)}}=
          {z ${minusSymbol(r || 0)} ${valueToKatex(
            removeSymbol(r),
            'r'
          )} \\above{1pt} ${valueToKatex(f, 'f')}}`,
          type: 'equation',
        },
      ])
    );

    const aIntoD = evalExpression(`${aValue} * (${dValue})`);
    const bIntoE = evalExpression(`${bValue} * (${eValue})`);
    const cIntoF = evalExpression(`${cValue} * (${fValue})`);
    const squareA = evalExpression(`${aValue} ^ 2`);
    const squareB = evalExpression(`${bValue} ^ 2`);
    const squareC = evalExpression(`${cValue} ^ 2`);
    const squareD = evalExpression(`${dValue} ^ 2`);
    const squareE = evalExpression(`${eValue} ^ 2`);
    const squareF = evalExpression(`${fValue} ^ 2`);
    const valueTop = evalExpression(`(${aIntoD}) + (${bIntoE}) +( ${cIntoF})`);
    const valueBottomOne = evalExpression(
      `${squareA} + (${squareB}) + (${squareC})`
    );
    const valueBottomTwo = evalExpression(
      `${squareD} + (${squareE}) + (${squareF})`
    );
    const bottom = evalExpression(`${valueBottomOne} * (${valueBottomTwo})`);
    const final = evalExpression(`${valueTop} / sqrt(${bottom})`);
    const finalRadian = evalExpression(`acos(${removeSymbol(final)})`);
    const finalDegree = evalExpression(`${finalRadian} * 180*7 /22`);

    const finalAnswer = [
      {
        value: `Find the <b>Angle (ɵ)</b> between`,
        type: 'span',
      },
      {
        value: `Line\\space L_1:- \\ {x ${minusSymbol(
          evalInDecimals(lValue)
        )} ${(removeSymbol(valueToKatex(lValue)), 'l')} \\above{1pt} ${
          (aValue, 'a')
        }} = \\ {y ${minusSymbol(evalInDecimals(mValue))} ${
          (removeSymbol(valueToKatex(mValue)), 'm')
        } \\above{1pt} ${(bValue, 'b')}}=
        \\ {z ${minusSymbol(evalInDecimals(nValue))} ${
          (removeSymbol(nValue), 'n')
        } \\above{1pt} ${(cValue, 'c')}} \\enspace \\&`,
        type: 'equation',
      },
      {
        value: `Line\\space L_2:- {x ${minusSymbol(
          evalInDecimals(pValue) || 0
        )} ${(removeSymbol(pValue), 'p')} \\above{1pt} ${(d, 'd')}}  =
        {y ${minusSymbol(evalInDecimals(qValue) || 0)} ${removeSymbol(
          qValue
        )} \\above{1pt} ${(eValue, 'e')}}=
        {z ${minusSymbol(evalInDecimals(rValue) || 0)} ${removeSymbol(
          valueToKatex(rValue)
        )} \\above{1pt} ${fValue}}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\space ɵ = cos^{-1}\\lvert{${valueToKatex(
            valueTop
          )}\\above{1pt} \\sqrt{(${valueToKatex(bottom)})}}\\rvert \\space or`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{${valueToKatex(finalRadian)} or ${
            evalInDecimals(finalRadian) || finalRadian
          }}  Radian OR \\bold{${valueToKatex(finalDegree)} or ${
            evalInDecimals(finalDegree) || finalDegree
          }}  degrees`
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
        value: `We know that the Angle (ɵ) between  
        `,
        type: `span`,
      },

      {
        value: `Line\\space L_1  \\ {x-l \\above{1pt} a} ={x-m \\above{1pt} b}={x-n \\above{1pt} c}`,
        type: `equation`,
      },
      {
        value: `\\&`,
        type: `equation`,
      },
      {
        value: `Line\\space L_2  \\ {x-p \\above{1pt} d} ={x-q \\above{1pt} e}={x-r \\above{1pt} f}`,
        type: `equation`,
      },
      {
        value: `is the angle between direction ratio vector of both the lines L<sub>1</sub> & L<sub>2</sub> `,
        type: `span`,
      },
      'br',
      {
        value: `From the above given equations of the lines, `,
        type: `span`,
      },
      'br',
      {
        value: `we can easily determine their direction ratios`,
        type: `span`,
      },
      'br',
      {
        value: `A = < a, b, c > & B = < d, e, f >`,
        type: `span`,
      },
      'br',
      {
        value: `Now we have to use below formula to obtain the angle (ɵ) between them`,
        type: `span`,
      },
      'br',
      {
        value: `\\theta = cos^{-1}({A.B \\above{1pt}  
          \\lvert A \\rvert .\\lvert B \\rvert})`,
        type: `equation`,
      },
      {
        value: ` = cos^{-1} \\lvert {ad+be+cf \\above{1pt} \\sqrt{(a^2+b^2+c^2)}
       * \\sqrt{(d^2+e^2+f^2)} } \\rvert`,
        type: `equation`,
      },

      {
        value: `From the above input `,
        type: `span`,
      },
      'br',
      {
        value: putSpace(
          `a =\\bold{${showVal(a, aValue)}}, b =\\bold{${showVal(
            b,
            bValue
          )}}, c =\\bold{${showVal(c, cValue)}}, d =\\bold{${showVal(
            d,
            dValue
          )}}, e =\\bold{${showVal(e, eValue)}}, f =\\bold{${showVal(
            f,
            fValue
          )}}`
        ),
        type: `equation`,
      },
      'br',
      {
        value: putSpace(
          `l =\\bold{${showVal(l, lValue)}},m =\\bold{${showVal(
            m,
            mValue
          )}}, n =\\bold{${showVal(n, nValue)}} , p =\\bold{${showVal(
            p,
            pValue
          )}},q =\\bold{${showVal(q, qValue)}}, r =\\bold{${showVal(
            r,
            rValue
          )}} `
        ),
        type: 'equation',
      },
      'br',
      {
        value: `Putting these values in the above formula`,
        type: `span`,
      },
      'br',
      {
        value: `ɵ = cos^{-1} \\lvert {${a}*${d}+${b}*${e}+${c}*${f}
         \\above{1pt} \\sqrt{(${(a, 'a')}^2+${numberWithAlternate(
          b
        )}^2+${parseNumber(c)}^2)}
       * \\sqrt{(${parseNumber(d)}^2+${parseNumber(e)}^2+${parseNumber(
          f
        )}^2)}}\\rvert`,
        type: `equation`,
      },
      {
        value: `ɵ = cos^{-1}\\lvert {${valueToKatex(aIntoD)}+${valueToKatex(
          bIntoE
        )}+ ${valueToKatex(cIntoF)} \\above{1pt} \\sqrt{(${valueToKatex(
          squareA
        )}+${valueToKatex(squareB)}+${valueToKatex(
          squareC
        )})}* \\sqrt{(${valueToKatex(squareD)}+${
          valueToKatex(squareE) || '1'
        }+${valueToKatex(squareF)})}} \\rvert`,
        type: `equation`,
      },
      {
        value: putSpace(
          `ɵ = cos^{-1}\\lvert {${valueToKatex(
            valueTop
          )}\\above{1pt} \\sqrt{(${valueToKatex(
            valueBottomOne
          )})}*\\sqrt{( ${valueToKatex(valueBottomTwo)})} }\\rvert`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `ɵ = cos^{-1}\\lvert{${valueToKatex(
            valueTop
          )}\\above{1pt} \\sqrt{(${valueToKatex(bottom)})}}\\rvert`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `angle (ɵ) = cos^-1 (${valueToKatex(
            removeSymbol(final),
            {},
            5
          )}) = ${valueToKatex(finalRadian, {}, 5)} or ${
            evalInDecimals(finalRadian) || finalRadian
          }  Radian`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `or  ${valueToKatex(finalDegree, {}, 5)} or ${
            evalInDecimals(finalDegree) || finalDegree
          } degrees`
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
  }, [a, b, c, d, e, f, l, m, n, p, q, r, showSteps]);

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
    mf5?.current.latex('');
    mf6?.current.latex('');
    mf7?.current.latex('');
    mf8?.current.latex('');
    mf9?.current.latex('');
    mf10?.current.latex('');
    mf11?.current.latex('');
    mf12?.current.latex('');
    setA('');
    setB('');
    setC('');
    setD('');
    setE('');
    setF('');
    setL('');
    setM('');
    setN('');
    setP('');
    setQ('');
    setR('');
    setShowSteps(false);
    setShowResult(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, d, e, f, l, m, n, p, q, r].some(
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
            <div className="col-3 text-left">
              Line L<sub>1</sub> :-{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setL}
                allowAlphabeticKeyboard={false}
                initialLatex={l}
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
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setM}
                allowAlphabeticKeyboard={false}
                initialLatex={m}
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
                setValue={setN}
                allowAlphabeticKeyboard={false}
                initialLatex={n}
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf4.current = ref)}
                setValue={setA}
                allowAlphabeticKeyboard={false}
                initialLatex={a}
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
                setMathfieldRef={(ref) => (mf5.current = ref)}
                setValue={setB}
                allowAlphabeticKeyboard={false}
                initialLatex={b}
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
                setMathfieldRef={(ref) => (mf6.current = ref)}
                setValue={setC}
                allowAlphabetangles-between-two-lines-calculatoricKeyboard={
                  true
                }
                initialLatex={c}
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">
              Line L<sub>2</sub> :-
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf7.current = ref)}
                setValue={setP}
                allowAlphabeticKeyboard={false}
                initialLatex={p}
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
                setMathfieldRef={(ref) => (mf8.current = ref)}
                setValue={setQ}
                allowAlphabeticKeyboard={false}
                initialLatex={q}
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
                setMathfieldRef={(ref) => (mf9.current = ref)}
                setValue={setR}
                allowAlphabeticKeyboard={false}
                initialLatex={r}
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
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left"></div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf10.current = ref)}
                setValue={setD}
                allowAlphabeticKeyboard={false}
                initialLatex={d}
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
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf11.current = ref)}
                setValue={setE}
                allowAlphabeticKeyboard={false}
                initialLatex={e}
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
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf12.current = ref)}
                setValue={setF}
                allowAlphabeticKeyboard={false}
                initialLatex={f}
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
            </div>
          </div>

          <Equation equation={equation} className="border-primary mt-3" />
        </div>
      </div>
      <hr />
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
export default AnglesBetweenTwoLinesIn3D;
