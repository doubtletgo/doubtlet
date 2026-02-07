'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import {
  addSymbol,
  minusSymbol,
  negative,
  parseNumber,
} from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
  removeSymbol,
  evalInDecimals,
  withSign,
} from '../../helpers/matrixHelper';

const QuadraticEquation = () => {
  const [a, setA] = useState('1');
  const [b, setB] = useState('9');
  const [c, setE3] = useState('20');
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
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.y1) setE3(vals.y1);
    if (vals.x2) setB(vals.x2);
  }, []);
  isInvalid.current = [a, b, c].some((x) => !x);
  const tempA = katexSimplifiedValue(a);
  const tempB = katexSimplifiedValue(b);
  const tempC = katexSimplifiedValue(c);
  const aValue = evalExpression(tempA);
  const bValue = evalExpression(tempB);
  const cValue = evalExpression(tempC);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find the \\bold{Sum, Difference, Product,}`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Nature of roots \\& the Value of the Roots of the quadratic`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` equation \\bold{ {${withSign(a, '{x^2}')}} ${addSymbol(
              evalInDecimals(tempB)
            )} {${withSign(removeSymbol(b), '{x}')}}${addSymbol(
              evalInDecimals(tempC)
            )}{${removeSymbol(c) || '0'}}  = 0}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c]);

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
            ` \\bold{ {${withSign(a, '{x^2}')}} ${addSymbol(
              evalInDecimals(tempB)
            )} {${withSign(removeSymbol(b), '{x}')}}${addSymbol(
              evalInDecimals(tempC)
            )}{${removeSymbol(c) || '0'}}  = 0}`
          ),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let bSqr = evalExpression(`${bValue} * ${bValue}`);
    let fourAC = evalExpression(`4 * (${aValue}) * (${cValue})`);
    let bMinusFourAC = evalExpression(`${bSqr}-${fourAC}`);
    let D = removeSymbol(evalExpression(`${bSqr} -(${fourAC})`));
    let towA = evalExpression(` 2 *( ${aValue})`);
    let res = evalExpression(`(-(${bValue}) + sqrt(${D}))/ ${towA}`);
    let res2 = evalExpression(`(-(${bValue}) - sqrt(${D}))/ ${towA}`);
    let bByTwoA = evalExpression(`-(${bValue})/(${towA})`);
    const sum = evalExpression(`${res} + ${res2}`);
    const difference = evalExpression(`${D} / (${aValue})`);
    const product = evalExpression(`${cValue} / (${aValue})`);
    const bValKatex = `${minusSymbol(evalInDecimals(bValue))}${removeSymbol(
      valueToKatex(bValue)
    )}`;
    let x = `d_1 = \\ {${bValKatex} + \\iota
    \\sqrt{${D}}\\above{1pt}${valueToKatex(
      towA
    )}} \\implies d_1 = ${valueToKatex(bByTwoA)}+{${valueToKatex(
      evalExpression(`${D} / (2 * ${aValue})`)
    )}}\\iota`;

    let x1 = `d_2 = \\ {${bValKatex} - \\iota
    \\sqrt{${D}}\\above{1pt}${valueToKatex(
      towA
    )}} \\implies d_2 = ${valueToKatex(bByTwoA)}- {${valueToKatex(
      evalExpression(`${D} / 2 * ${aValue}`)
    )}}\\iota`;

    let y = `d_1 = \\ {${bValKatex} +
    \\sqrt{${valueToKatex(D)}}\\above{1pt}${valueToKatex(
      towA
    )}} \\implies d_1 = ${parseNumber(res)}`;

    let y1 = `d_2 = \\ {${bValKatex} -
    \\sqrt{${valueToKatex(D)}}\\above{1pt}${valueToKatex(
      towA
    )}} \\implies d_2 = ${parseNumber(res2)}`;
    setResult(res);

    const finalAnswer = [
      {
        value: putSpace(
          `For  the  above  given  Quadratic  equation :\\bold{{ ${withSign(
            a,
            '{x^2}'
          )}} ${addSymbol(b)} {${withSign(removeSymbol(b), '{x}')}} ${addSymbol(
            c
          )} {${c || '0'}}  = 0}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Nature}  of  the  Roots  is  ${
            bSqr - fourAC > 0
              ? `\\bold{Real  and  Distinct}`
              : bSqr - fourAC < 0
              ? `\\bold{Imaginary  and  Complex  Conjugate  numbers}`
              : `\\bold{Real  and  Equal}`
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Sum}  of  the  Roots = \\bold{${valueToKatex(sum)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Difference}  of  the  Roots = \\bold{${parseNumber(
            valueToKatex(difference)
          )}}{${bSqr < fourAC ? `\\iota` : ''}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Product}  of  the  Roots = \\bold{${parseNumber(
            valueToKatex(product)
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Value}  of  the  Roots  is \\enspace x = \\bold{${parseNumber(
            res
          )}} \\enspace and \\enspace x = \\bold{${parseNumber(res2)}}`
        ),
        type: 'equation',
      },
      {
        value: `\\bold {${bSqr < fourAC ? x : y}}`,
        type: 'equation',
      },
      {
        value: `\\bold {${bSqr < fourAC ? x1 : y1}}`,
        type: 'equation',
      },
    ];
    setResult(res);
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
          `We  know  that  Roots  of  a  Quadratic  equation  (ax^2+bx+c = 0)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `are  obtained  by  Discriminant  method.  Where  first  we  have`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`to  find  out  the  value  of  D = (b^2 -4ac).`),
        type: 'equation',
      },
      {
        value: putSpace(
          `If  value  of  \\bold{D > 0}  then  Roots  are  \\bold{Real  and  Distinct.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `If  value  of  \\bold{D = 0}  then  Roots  are  \\bold{Real  and  Equal.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `If  value  of  \\bold{D < 0}  then  Roots  are  \\bold{Imaginary  and  Complex  Conjugate  numbers.}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `To  find  the  \\bold{Exact  value}  of  the  \\bold{Roots}  we  have  to  use  the  formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `given  by  \\bold{Sridhar  Acharya}  Ji  (A  Great  Indian  Mathematician)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Let  \\bold{d_1  and  d_2}  be  the  \\bold{Roots}  of  the  \\bold{Quadratic  Equation}`
        ),
        type: 'equation',
      },
      {
        value: `then`,
        type: 'equation',
      },
      {
        value: putSpace(`d = \\ {-b \\pm \\sqrt{(b^2-4ac)}\\above{1pt}2a}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Sum}   of the \\bold{Roots} = {-b\\above{1pt}a} `
        ),
        type: 'equation',
      },
      {
        value: `\\bold{Difference} of the \\bold{Roots} = {\\sqrt{d}\\above{1pt}a}`,
        type: 'equation',
      },
      {
        value: putSpace(
          `\\bold{Product} of the \\bold{Roots} = {c\\above{1pt}a} `
        ),
        type: 'equation',
      },
      {
        value: `From  the  above input it is given that:`,
        type: 'span',
      },
      {
        value: putSpace(
          `a =\\space ${showVal(a, aValue)}, \\space b =\\space${showVal(
            b,
            bValue
          )}, \\space c =\\space${showVal(c, cValue)}`
        ),
        type: 'equation',
      },

      {
        value: 'After putting the values in the Sridharacharya formula',
        type: 'span',
      },
      {
        value: putSpace(
          `d = \\ {${bValKatex} \\pm \\sqrt{(${valueToKatex(
            bValue
          )})^2-4*${valueToKatex(aValue)}*${valueToKatex(
            cValue
          )}}\\above{1pt}2*${valueToKatex(aValue)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `d = \\ {${bValKatex} \\pm \\sqrt{(${valueToKatex(bSqr)}${minusSymbol(
            evalInDecimals(fourAC)
          )}${removeSymbol(valueToKatex(fourAC))})}\\above{1pt}${valueToKatex(
            towA
          )}}`
        ),
        type: 'equation',
      },
      {
        value: 'After solving',
        type: 'span',
      },
      {
        value: putSpace(
          `d = \\ {${bValKatex} \\pm \\sqrt{${valueToKatex(
            bMinusFourAC
          )}}\\above{1pt}${valueToKatex(towA)}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          bSqr - fourAC < 0
            ? `d = \\ {${negative(parseNumber(bValue))} \\pm ${
                bSqr < fourAC ? '\\iota' : ''
              }\\sqrt{${D}}\\above{1pt}${2 * aValue}}`
            : ''
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
  }, [a, b, c, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setB('');
    setE3('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c].some((v) => !!v || v == 0);

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

          <div className="row mb-3 align-items-center">
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
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
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
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
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setE3}
                allowAlphabeticKeyboard={false}
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
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
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

export default QuadraticEquation;
