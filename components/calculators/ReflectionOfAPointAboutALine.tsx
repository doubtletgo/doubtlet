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
  evalInDecimals,
  removeSymbol,
  convertFromLatex,
  convertIntoLatex,
  evalToDecimals,
} from '../../helpers/matrixHelper';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { MathField } from '@/types/mathfield.types';

const ReflectionOfAPointAboutALine = () => {
  const [a, setA] = useState('-5');
  const [b, setB] = useState('-7');
  const [p, setP] = useState('2');
  const [c, setC] = useState('9');
  const [q, setQ] = useState('2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [result, setResult] = useState('');
  const [note, setNote] = useState();
  const mf1 = useRef<MathField>(null);
  const mf2 = useRef<MathField>(null);
  const mf3 = useRef<MathField>(null);
  const mf4 = useRef<MathField>(null);
  const mf5 = useRef<MathField>(null);
  const mf6 = useRef<MathField>(null);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams() as {
      x1: string;
      y1: string;
      z1: string;
      y3: string;
      z3: string;
    };
    if (vals.x1) setA(vals.x1);
    if (vals.y1) setB(vals.y1);
    if (vals.z1) setC(vals.z1);
    if (vals.y3) setP(vals.y3);
    if (vals.z3) setQ(vals.z3);
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
            `Find the Image Q (h, k) of Point P (\\bold{${p || 'p'},  ${
              q || 'q'
            }}) `
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `about the Line L: (${a || 'a'}x ${addSymbol(
              b || 'b'
            )} ${removeSymbol(b || 'b')}y ${addSymbol(c)} ${removeSymbol(
              c || 'c'
            )} =0) `
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, p, q]);
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
            `Line L: (${a || 'a'}x ${addSymbol(b)} ${
              removeSymbol(b) || 'b'
            }y ${addSymbol(c)} ${removeSymbol(c) || 'c'} =0)`
          ),
          type: `equation`,
        },

        {
          value: putSpace(`Point P: (${p || 'p'}, ${q || 'q'})`),
          type: `equation`,
        },
      ])
    );

    const isInvalid = [a, b, c, p, q].some((x) => !x);
    setIsPointSame(a == b && b == c && p == q && q == p);

    const parsedA = convertFromLatex(a);
    const parsedB = convertFromLatex(b);
    const parsedC = convertFromLatex(c);
    const parsedP = convertFromLatex(p);
    const parsedQ = convertFromLatex(q);
    const bValue = evalToDecimals(parsedB);
    const pValue = evalToDecimals(parsedP);
    const cValue = evalToDecimals(parsedC);
    const qValue = evalToDecimals(parsedQ);
    const pWithSymbol = `${minusSymbol(pValue)} {${removeSymbol(p)}}`;
    const qWithSymbol = `${minusSymbol(qValue)} {${removeSymbol(q)}}`;

    // variables
    const aIntoP = evalExpression(`(${parsedA}) * (${parsedP})`);
    const bIntoQ = evalExpression(`(${parsedB}) * (${parsedQ})`);
    const sumOfApBqC = evalExpression(`${aIntoP}+(${bIntoQ}) +(${cValue})`);
    const sumIntoMinusTwo = evalExpression(`(${sumOfApBqC}) *(-2)`);
    const aSqr = evalExpression(`(${parsedA})^2`);
    const bSqr = evalExpression(`(${parsedB})^2`);
    const aSqrPlusBSqr = evalExpression(`(${aSqr})+(${bSqr})`);
    const numeratorIntoA = evalExpression(
      `(${sumIntoMinusTwo}) * (${parsedA})`
    );
    const numeratorIntoB = evalExpression(`(${sumIntoMinusTwo})*(${parsedB})`);
    const h = evalExpression(
      `((${sumIntoMinusTwo}) * (${parsedA}) /  (${aSqrPlusBSqr})) + (${parsedP}) `
    );
    const k = evalExpression(
      `((${sumIntoMinusTwo}) * (${parsedB}) /(${aSqrPlusBSqr})) + (${qValue})  `
    );
    const hInDecimals = evalInDecimals(`${h}`);

    const kInDecimals = evalInDecimals(`${k}`);
    const finalAnswer = [
      {
        value: putSpace(
          `The Reflection or Image of Point P (\\bold{${p},  ${q}}) about the Line L: (${
            a || 'a'
          }x ${minusSymbol(bValue)} ${removeSymbol(b) || 'b'}y ${minusSymbol(
            cValue
          )} ${removeSymbol(c) || 'c'} =0)  is`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\large{Q(h,k)= \\bold{\\bigg({${convertIntoLatex(
            h
          )}}, {${convertIntoLatex(
            k
          )}}}} \\bigg) OR  \\large{\\bold{(${hInDecimals}, ${kInDecimals})}} `
        ),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'h6',
        value: 'Answer',
      },
      ...finalAnswer,
    ];
    const eqRender = renderSteps(equations);
    setResult(eqRender);

    if (isInvalid) return;
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that the \\bold{Image Q (h, k)} of the Point \\bold{P (p, q)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `the \\bold{Line (ax + by + c = 0)} is given by the formula below`
        ),
        type: 'equation',
      },
      {
        value: `\\frac{h-p}{a}=\\frac{k-q}{b}=\\frac{-2(ap+bq+c)}{(a^2+b^2)}`,
        type: 'equation',
      },
      {
        value: `Step-1`,
        className: 'text-decoration-underline',
        type: `h6`,
      },
      {
        value: `From the above input it is given that `,
        type: 'span',
      },
      {
        value: putSpace(
          `(a, b, c)=({${convertIntoLatex(parsedA)}}, {${convertIntoLatex(
            parsedB
          )}}, {${convertIntoLatex(parsedC)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(p, q)=({${convertIntoLatex(parsedP)},${convertIntoLatex(parsedQ)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now putting these values in the above-given formula`),
        type: 'equation',
      },
      {
        value: `Step-2`,
        className: 'text-decoration-underline',
        type: `h6`,
      },
      {
        value: `\\frac{h${pWithSymbol}}{${a}}=\\frac{k${qWithSymbol}}{${b}}=\\frac{-2\\{(${a})(${p})+(${b})(${q})+(${c})\\}}{(${a})^2+(${b})^2}`,
        type: 'equation',
      },
      {
        value: `\\frac{h${pWithSymbol}}{${a}}=\\frac{k${qWithSymbol}}{${b}}={-2\\{({${convertIntoLatex(
          aIntoP
        )}})+({${convertIntoLatex(
          bIntoQ
        )}})+(${c})\\}\\above{1pt} {${convertIntoLatex(
          aSqr
        )}} + {${convertIntoLatex(bSqr)}}}`,
        type: 'equation',
      },
      {
        value: `\\frac{h${pWithSymbol}}{${a}}=\\frac{k${qWithSymbol}}{${b}}=\\frac{-2({${convertIntoLatex(
          sumOfApBqC
        )}})}{${convertIntoLatex(aSqrPlusBSqr)}}`,
        type: 'equation',
      },
      {
        value: `\\frac{h${pWithSymbol}}{${a}}=\\frac{k${qWithSymbol}}{${b}}={{${convertIntoLatex(
          sumIntoMinusTwo
        )}}\\above{1pt} (${convertIntoLatex(aSqrPlusBSqr)})}`,
        type: 'equation',
      },
      {
        value: `h=\\bigg({{${convertIntoLatex(
          numeratorIntoA
        )}} \\above{1pt} {${convertIntoLatex(aSqrPlusBSqr)}} }${addSymbol(
          parsedP
        )}${removeSymbol(p)}\\bigg)={${convertIntoLatex(h)}}`,
        type: 'equation',
      },
      {
        value: `k=\\bigg({{${convertIntoLatex(
          numeratorIntoB
        )}} \\above{1pt} {${convertIntoLatex(aSqrPlusBSqr)}} }${addSymbol(
          parsedQ
        )}${removeSymbol(q)}\\bigg)= ${convertIntoLatex(k)}`,
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
  }, [a, b, c, p, q, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    setA('');
    setB('');
    setC('');
    setP('');
    setQ('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, p, q].some((v) => !!v || +v == 0);
  const hasAllValue = [a, b, c, p, q].every((v) => !!v || +v == 0);
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
            <div className="col-3 text-left">Point A</div>
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
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point C</div>
            <div className="col-4-5">
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={p}
              />{' '}
            </div>
            <div className="col-4-5">
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
          </div>

          <Equation equation={equation} className="border-primary mt-3" />
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

export default ReflectionOfAPointAboutALine;
