'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { addSymbol, parseNumber } from '../../helpers/decimal';
import MathInput from 'react-math-keyboard';
import {
  evalInDecimals,
  removeSymbol,
  evalExpression,
  convertFromLatex,
  convertIntoLatex,
} from '../../helpers/matrixHelper';
import { putSpace } from '../../helpers/general';

const AngleBetweenTwoVectors = () => {
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [c, setC] = useState('4');
  const [p, setP] = useState('8');
  const [q, setQ] = useState('2.4');
  const [r, setR] = useState('7');
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

  const isInvalid = [a, b, c, p, q, r].some((x) => !x && x != 0);
  const tempA = convertFromLatex(a);
  const tempP = convertFromLatex(p);
  const tempB = convertFromLatex(b);
  const tempQ = convertFromLatex(q);
  const tempC = convertFromLatex(c);
  const tempR = convertFromLatex(r);
  const aValue = evalExpression(tempA);
  const pValue = evalExpression(tempP);
  const bValue = evalExpression(tempB);
  const qValue = evalExpression(tempQ);
  const cValue = evalExpression(tempC);
  const rValue = evalExpression(tempR);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Find the Acute Angle θ between the two given Vectors`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            `\\overrightarrow{U}({${a}}i ${addSymbol(
              evalInDecimals(tempB)
            )} {${removeSymbol(b)}}j ${addSymbol(
              evalInDecimals(tempC)
            )} {${removeSymbol(
              c
            )}}k) \\&  \\overrightarrow{V}({${p}}i ${addSymbol(
              evalInDecimals(tempQ)
            )} {${removeSymbol(q)}}j ${addSymbol(
              evalInDecimals(tempR)
            )} {${removeSymbol(r)}}k) `
          ),
          type: 'equation',
        },
      ])
    );
  }, [a, b, c, p, q, r]);

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
            `\\overrightarrow{U}({${a}}i ${addSymbol(
              evalInDecimals(tempB)
            )} {${removeSymbol(b)}}j ${addSymbol(
              evalInDecimals(tempC)
            )} {${removeSymbol(c)}}k)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(
            ` \\overrightarrow{V}({${p}}i ${addSymbol(
              evalInDecimals(tempQ)
            )} {${removeSymbol(q)}}j ${addSymbol(
              evalInDecimals(tempR)
            )} {${removeSymbol(r)}}k) `
          ),
          type: 'equation',
        },
      ])
    );

    //Dot product

    if (isInvalid) return;
    const aIntoP = evalExpression(`${aValue} * (${pValue})`);
    const bIntoQ = evalExpression(`${bValue} * (${qValue})`);
    const cIntoR = evalExpression(`${cValue} * (${rValue})`);
    const Prodect = evalInDecimals(
      evalExpression(`(${aIntoP})+(${bIntoQ})+(${cIntoR})`)
    );

    //Magnitude of vectors U
    const aSqr2 = evalExpression(`(${aValue})^2`);
    const bSqr2 = evalExpression(`(${bValue})^2`);
    const cSqr2 = evalExpression(`(${cValue})^2`);
    const uMagnitude = evalInDecimals(
      evalExpression(` ${aSqr2}+(${bSqr2})+(${cSqr2})`)
    );
    //Magnitude of vectors V
    const pSqr2 = evalExpression(`(${pValue})^2`);
    const qSqr2 = evalExpression(`(${qValue})^2`);
    const rSqr2 = evalExpression(`(${rValue})^2`);
    const vMagnitude = evalInDecimals(
      evalExpression(` ${pSqr2}+(${qSqr2})+(${rSqr2})`)
    );
    //Res
    let res = Prodect / (Math.sqrt(uMagnitude) * Math.sqrt(vMagnitude));
    let cosInverse = Math.acos(res);
    const cosInverseDegree = (cosInverse * 180) / 3.14;

    const finalAnswer = [
      {
        value: putSpace(`The Acute Angle θ between the two given Vectors `),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U}: ({${a}}i ${addSymbol(b)} {${removeSymbol(
            b
          )}}j ${addSymbol(c)} {${removeSymbol(
            c
          )}}k) \\&  \\overrightarrow{V}: ({${p}}i ${addSymbol(
            q
          )} {${removeSymbol(q)}}j ${addSymbol(r)} {${removeSymbol(
            r
          )}}k) is \\bold{${parseNumber(cosInverseDegree, {}, 2)}} degree `
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
        value: putSpace(`We know that the Acute Angle θ between two Vectors`),
        type: 'equation',
      },
      {
        value: putSpace(`U = ai+bj+ck \\& V = pi+qj+rk`),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula below`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Angle (\\theta)  Cos^{-1}\\bigg({\\overrightarrow{U}.\\overrightarrow{V}\\above{1pt}|\\overrightarrow{U}| |\\overrightarrow{V}|} \\bigg)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Where ɵ is the acute angle between two given Vectors.`
        ),
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`From final result the above input, it is given that`),
        type: 'equation',
      },
      {
        value: putSpace(
          `(a, b, c) = (\\bold{{${convertIntoLatex(
            aValue
          )}}}, \\bold{{${convertIntoLatex(
            bValue
          )}}}, \\bold{{${convertIntoLatex(cValue)}}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(p, q, r) = (\\bold{{${convertIntoLatex(
            pValue
          )}}}, \\bold{{${convertIntoLatex(
            qValue
          )}}}, \\bold{{${convertIntoLatex(rValue)}}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now we have to find the dot product \\& magnitude of`),
        type: 'equation',
      },
      {
        value: putSpace(`the given vectors`),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{U}.\\overrightarrow{V} = ({${a}}i ${addSymbol(
            b
          )} {${removeSymbol(b)}}j ${addSymbol(c)} {${removeSymbol(
            c
          )}}k).({${p}}i ${addSymbol(q)} {${removeSymbol(q)}}j ${addSymbol(
            r
          )} {${removeSymbol(r)}}k) = ${evalInDecimals(Prodect)}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/dot-product-calculator/?a=${a},${b},${c}&b=${p},${q},${r}"  target="_blank">to see the steps to find the dot product, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The magnitude of |\\overrightarrow{U}| = \\sqrt{${evalInDecimals(
            uMagnitude
          )}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/vector-magnitude-calculator/?a=${a},${b},${c}"  target="_blank">to see the steps to find the magnitude, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The magnitude of |\\overrightarrow{V}| = \\sqrt{${evalInDecimals(
            vMagnitude
          )}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/vector-magnitude-calculator/?a=${p},${q},${r}"  target="_blank">to see the steps to find the magnitude, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Now putting the above calculated values in`),
        type: 'equation',
      },
      {
        value: putSpace(
          `the above given formula θ=  Cos^{-1}\\bigg({${Prodect} \\above{1pt} \\sqrt{${uMagnitude}}. \\sqrt{${vMagnitude}}} \\bigg) = Cos^{-1}(${parseNumber(
            res,
            {},
            2
          )}) `
        ),
        type: 'equation',
      },
      {
        value: `<a href="/calculator/cosecant-inverse-calculator/?x1=${Prodect}"  target="_blank">to see the steps to find the cose Inverse, click here</a>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Cos^{-1}(${parseNumber(res, {}, 2)}) = ${parseNumber(
            cosInverseDegree,
            {},
            2
          )}^{\\large{°}}`
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
  }, [a, b, c, p, q, r, showSteps]);

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
    setA('');
    setP('');
    setB('');
    setQ('');
    setC('');
    setR('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, b, c, p, q, r].some((v) => !!v || v == 0);
  const hasAllValue = [a, b, c, p, q, r].every((v) => !!v || v == 0);

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
            Your input can be in the form of Integer, Fraction or any Real
            Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector U:</div>
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

                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={c}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Vector V :</div>
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

export default AngleBetweenTwoVectors;
