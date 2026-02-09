'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  showVal,
  katexSimplifiedValue,
  evalInDecimals,
  valueToKatex,
  removeSymbol,
} from '../../helpers/matrixHelper';
import { minusSymbol } from '../../helpers/decimal';
import {} from '../../helpers/decimal';

const DistanceBetweenPointAndLineIn3D = () => {
  const [p, setP] = useLocalStorage('DistanceBetweenPointAndLineIn3D_p', 'e^2');
  const [q, setQ] = useLocalStorage('DistanceBetweenPointAndLineIn3D_q', '4');
  const [r, setR] = useLocalStorage('DistanceBetweenPointAndLineIn3D_r', '7');
  const [d, setD] = useLocalStorage('DistanceBetweenPointAndLineIn3D_d', '\\sqrt{5}');
  const [e, setE] = useLocalStorage('DistanceBetweenPointAndLineIn3D_e', '\\sqrt{7}');
  const [f, setF] = useLocalStorage('DistanceBetweenPointAndLineIn3D_f', '5');
  const [x, setX] = useLocalStorage('DistanceBetweenPointAndLineIn3D_x', '\\sqrt{5}');
  const [y, setY] = useLocalStorage('DistanceBetweenPointAndLineIn3D_y', '\\sqrt{7}');
  const [z, setZ] = useLocalStorage('DistanceBetweenPointAndLineIn3D_z', '5');
  const [equation, setEquation] = useLocalStorage('DistanceBetweenPointAndLineIn3D_equation', '');
  const [solution, setSolution] = useLocalStorage('DistanceBetweenPointAndLineIn3D_solution', '');
  const [showResult, setShowResult] = useLocalStorage('DistanceBetweenPointAndLineIn3D_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('DistanceBetweenPointAndLineIn3D_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('DistanceBetweenPointAndLineIn3D_isPointSame', false);
  const [result, setResult] = useLocalStorage('DistanceBetweenPointAndLineIn3D_result', '');
  const [note, setNote] = useLocalStorage('DistanceBetweenPointAndLineIn3D_note', undefined);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setP(vals.x1);
    if (vals.y1) setD(vals.y1);
    if (vals.x2) setQ(vals.x2);
    if (vals.y2) setE(vals.y2);
    if (vals.x3) setR(vals.x3);
    if (vals.y3) setF(vals.y3);
    if (vals.z1) setX(vals.y2);
    if (vals.z2) setY(vals.z2);
    if (vals.z3) setZ(vals.z3);
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
            `Find the \\bold{Perpendicular distance (d)} between point P (\\bold{${
              x || '1'
            }, ${y || '1'}, ${z || '1'}})`
          ),
          type: `equation`,
        },
        {
          value: putSpace(
            `Line L:  \\bold{x ${minusSymbol(
              evalInDecimals(p)
            )} {${removeSymbol(p || '1')}}\\above{1pt}{${
              d || '1'
            }}} = \\bold{y ${minusSymbol(evalInDecimals(q))} {${removeSymbol(
              q || '1'
            )}}\\above{1pt} {${e || '1'}}} = \\bold{z ${minusSymbol(
              evalInDecimals(r)
            )} {${removeSymbol(r || '1')}}\\above{1pt} {${f || '1'}}} `
          ),
          type: `equation`,
        },

        {
          value: `Point P: \\bigg<\\bold{${x || '1'}, ${y || '1'}, ${
            z || '1'
          }}\\bigg>`,
          type: 'equation',
        },
      ])
    );
  }, [p, q, r, d, e, f, x, y, z]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: '<b>Formatted User Input Display</b>',
          type: 'span',
        },
        {
          value: putSpace(
            `Line L:  \\bold{x ${minusSymbol(
              evalInDecimals(p)
            )} {${removeSymbol(p || '1')}}\\above{1pt}{${
              d || '1'
            }}} = \\bold{y ${minusSymbol(evalInDecimals(q))} {${removeSymbol(
              q || '1'
            )}}\\above{1pt} {${e || '1'}}} = \\bold{z ${minusSymbol(
              evalInDecimals(r)
            )} {${removeSymbol(r || '1')}}\\above{1pt} {${f || '1'}}} `
          ),
          type: `equation`,
        },
      ])
    );
    const isInvalid = [p, q, r, d, e, f, x, y, z].some((x) => !x);
    if (isInvalid) return;
    setIsPointSame(p == q && d == e && x == y);

    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);
    const tempD = katexSimplifiedValue(d);
    const tempE = katexSimplifiedValue(e);
    const tempF = katexSimplifiedValue(f);
    const tempX = katexSimplifiedValue(x);
    const tempY = katexSimplifiedValue(y);
    const tempZ = katexSimplifiedValue(z);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);
    const dValue = evalExpression(tempD);
    const eValue = evalExpression(tempE);
    const fValue = evalExpression(tempF);
    const xValue = evalExpression(tempX);
    const yValue = evalExpression(tempY);
    const zValue = evalExpression(tempZ);

    // vriables
    let xSubP = evalExpression(`(${xValue}) - (${pValue})`);
    let ySubQ = evalExpression(`(${yValue}) - (${qValue})`);
    let zSubR = evalExpression(`(${zValue}) - (${rValue})`);
    // v
    const magnitudeV = evalExpression(
      `((${dValue})^2)+((${eValue})^2)+((${fValue})^2)`
    );
    // Cross Vectors AP x V
    let y1IntoZ2 = evalExpression(`${ySubQ} * (${fValue})`);
    let y2IntoZ1 = evalExpression(`${eValue} * (${zSubR})`);
    let x1IntoZ2 = evalExpression(` ${xSubP} * (${fValue})`);
    let x2IntoZ1 = evalExpression(`${dValue} * ( ${zSubR})`);
    let x1IntoY2 = evalExpression(` ${xSubP} * (${eValue})`);
    let x2IntoY1 = evalExpression(`${dValue} * ( ${ySubQ})`);
    let i = evalExpression(`${y1IntoZ2} - (${y2IntoZ1})`);
    let j = evalExpression(`${x1IntoZ2} - (${x2IntoZ1})`);
    let k = evalExpression(`${x1IntoY2} - (${x2IntoY1})`);

    //  Magnitude of AP x V
    const magnitudeAPxV = evalExpression(`((${i})^2)+((${j})^2)+((${k})^2)`);
    // res
    const res = evalExpression(`sqrt(${magnitudeAPxV})/sqrt(${magnitudeV})`);

    const finalAnswer = [
      {
        value: putSpace(
          `The Perpendicular distance (d) between Point P (\\bold{${
            x || '1'
          }, ${y || '1'}, ${z || '1'}}) \\&`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Line L:  \\bold{x ${minusSymbol(evalInDecimals(p))} {${removeSymbol(
            p || '1'
          )}}\\above{1pt}{${d || '1'}}} = \\bold{y ${minusSymbol(
            evalInDecimals(q)
          )} {${removeSymbol(q || '1')}}\\above{1pt} {${
            e || '1'
          }}} = \\bold{z ${minusSymbol(evalInDecimals(r))} {${removeSymbol(
            r || '1'
          )}}\\above{1pt} {${f || '1'}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is \\bold{\\sqrt{{{${evalInDecimals(
            magnitudeAPxV
          )}} \\above{1pt} ${evalInDecimals(magnitudeV)}}} = ${evalInDecimals(
            res
          )}}`
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
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `We know that the \\bold{Perpendicular distance (d)} between  Point P (x, y, z)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\&`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Line L {x-p \\above{1pt} d} = {y-q \\above{1pt} e} = {z-r \\above{1pt} f}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`can be calculated by using the formula below `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Above given line passes through point \\bold{A = (p, q, r)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Above given line having direction ratios \\bold{V = (d, e, f)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Then, \\bold{Perpendicular distance (d)} = \\bold{{\\lVert \\overrightarrow{AP}x \\overrightarrow{V} \\rVert \\above{1pt} \\lVert \\overrightarrow{V} \\rVert}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{Given}`),
        type: 'equation',
      },
      {
        value: `(p, q, r) = \\bold{({${showVal(p, pValue)}}, {${showVal(
          q,
          qValue
        )}}, {${showVal(r, rValue)}})}`,
        type: `equation`,
      },
      {
        value: `(d, e, f) = \\bold{({${showVal(d, dValue)}}, {${showVal(
          e,
          eValue
        )}}, {${showVal(f, fValue)}})}`,
        type: `equation`,
      },
      {
        value: `(x, y, z) = \\bold{({${showVal(x, xValue)}}, {${showVal(
          y,
          yValue
        )}}, {${showVal(z, zValue)}})}`,
        type: `equation`,
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `\\overrightarrow{AP} = (x, y, z) - (p, q, r) = ({${valueToKatex(
            xValue
          )}}, {${valueToKatex(yValue)}}, {${valueToKatex(
            zValue
          )}}) - ({${valueToKatex(pValue)}}, {${valueToKatex(
            qValue
          )}}, {${valueToKatex(rValue)}}) =({${valueToKatex(
            xSubP
          )}}, {${valueToKatex(ySubQ)}}, {${valueToKatex(zSubR)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{V} = ({${showVal(d, dValue)}}, {${showVal(
            e,
            eValue
          )}}, {${showVal(f, fValue)}})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{V} = \\sqrt{${evalInDecimals(magnitudeV)}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/vector-magnitude-calculator/?a=${d},${e},${f}" target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `\\overrightarrow{AP} x \\overrightarrow{V} = ({${valueToKatex(
            xSubP
          )}}, {${valueToKatex(ySubQ)}}, {${valueToKatex(
            zSubR
          )}}) x  ({${showVal(d, dValue)}}, {${showVal(e, eValue)}}, {${showVal(
            f,
            fValue
          )}})  `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `\\overrightarrow{AP} x \\overrightarrow{V} = ({${valueToKatex(
            i
          )}}, {${valueToKatex(j)}}, {${valueToKatex(k)}})`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/cross-product-of-two-vectors-calculator/?x1=${xSubP}&y1=${ySubQ}&z1=${zSubR}&x2=${d}&y2=${e}&z2=${f}" 
        target="_blank">to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `\\lVert AP x  V \\rVert =  \\sqrt{{${evalInDecimals(
            magnitudeAPxV
          )}}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/vector-magnitude-calculator/?a=${i},${j},${k}" target="_blank">
        to see Steps click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `(d) = \\bold{{\\lVert \\overrightarrow{AP} x \\overrightarrow{V} \\rVert \\above{1pt} \\lVert \\overrightarrow{V} \\rVert}} `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(d) = {\\lVert \\sqrt{{${evalInDecimals(
            magnitudeAPxV
          )}}} \\rVert \\above{1pt} \\lVert \\sqrt{${evalInDecimals(
            magnitudeV
          )}} \\rVert}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`(d) = ${evalInDecimals(res)}`),
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
  }, [p, q, r, d, e, f, x, y, z, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const clear = useCallback(() => {
    setP('');
    setQ('');
    setR('');
    setD('');
    setE('');
    setF('');
    setX('');
    setY('');
    setZ('');

    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    if (mf3.current) mf3?.current.latex('');
    if (mf4.current) mf4?.current.latex('');
    if (mf5.current) mf5?.current.latex('');
    if (mf6.current) mf6?.current.latex('');
    if (mf7.current) mf7?.current.latex('');
    if (mf8.current) mf8?.current.latex('');
    if (mf9.current) mf9?.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [p, q, r, d, e, f, x, y, z].some((v) => !!v || v == 0);
  const hasAllValue = [p, q, r, d, e, f, x, y, z].every((v) => !!v || v == 0);
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
                setMathfieldRef={(ref) => (mf2.current = ref)}
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
                setMathfieldRef={(ref) => (mf3.current = ref)}
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
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point B</div>
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
                  // "infty",
                  // "theta",
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
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
                initialLatex={f}
              />{' '}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Point C</div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf7.current = ref)}
                setValue={setX}
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
                initialLatex={x}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf8.current = ref)}
                setValue={setY}
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
                initialLatex={y}
              />{' '}
            </div>

            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf9.current = ref)}
                setValue={setZ}
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
                initialLatex={z}
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

export default DistanceBetweenPointAndLineIn3D;
