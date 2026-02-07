'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import { jStat } from 'jstat';
import {
  convertFromLatex,
  convertIntoLatex,
  evalExpression,
  evalToDecimals,
} from '../../helpers/matrixHelper';

const validateInput = (input) => {
  const validRegex =
    /^(-?\d+(\.\d+)?(\/-?\d+)?)(,\s*-?\d+(\.\d+)?(\/-?\d+)?)*$/;
  return validRegex.test(input);
};
const ZScore = () => {
  const [x1, setX1] = useState('2');
  const [xValues, setXValues] = useState('6,-2,10.5,7,0,5,9.1');
  const [pMean, setPMean] = useState('1.5');
  const [pStandardDeviation, setPStandardDeviation] = useState('0.4');
  const [sampleSize, setSampleSize] = useState('7');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [answer, setAnswer] = useState('');
  const [method, setMethod] = useState('Data Value');

  const mf1 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.x1) setX1(vals.x1);
  }, []);

  const xConverted = convertIntoLatex(convertFromLatex(x1));
  const pMeanConverted = convertIntoLatex(convertFromLatex(pMean));
  const pStandardDeviationConverted = convertIntoLatex(
    convertFromLatex(pStandardDeviation)
  );
  const xValuesConverted = convertIntoLatex(convertFromLatex(xValues));
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Calculate the Z-Score for ${
              method == 'Sample Mean'
                ? `\\bar{x}=${xConverted}, n=${sampleSize}`
                : method == 'Data Value'
                ? `x=${xConverted}`
                : `the given set of values x = ${xValuesConverted}`
            } with \\mu=${pMeanConverted} and \\sigma=${pStandardDeviationConverted}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [
    xConverted,
    method,
    pMeanConverted,
    sampleSize,
    pStandardDeviationConverted,
    xValuesConverted,
  ]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        {
          value: `x = ${method == 'Data Sample' ? xValues : x1}`,
          type: 'equation',
        },
        method == 'Data Value'
          ? {
              value: ``,
              type: 'span',
            }
          : {
              value: `n = ${sampleSize}`,
              type: 'equation',
            },
        {
          value: `\\mu = ${pMean}`,
          type: 'equation',
        },
        {
          value: `\\sigma = ${pStandardDeviation}`,
          type: 'equation',
        },
      ])
    );

    isInvalid.current = [x1].some((x) => !x);
    if (isInvalid.current) return;

    //final answer for data value z score
    const zScoreDataValue = evalExpression(
      `(${x1} - ${pMean}) / ${pStandardDeviation}`
    );

    //final answer for sample mean z score
    const zScoreSampleMean = evalExpression(
      `(${x1} - ${pMean}) / (${pStandardDeviation} / sqrt(${sampleSize}))`
    );

    //final answer for sample value z score
    //Mean calculation
    const vals = xValues.split(',');
    const sumOfValues = vals
      .map((val) => `(${val})`)
      .reduce((a, i) => evalExpression(`${a} + (${i})`), 0);

    const mean = evalExpression(`(${sumOfValues} / ${vals.length})`);

    const pMeanSubMean = evalExpression(`(${mean} - ${pMean})`);
    const pStandardDeviationDivideSampleSize = evalExpression(
      `(${pMeanSubMean}) / (${pStandardDeviation} )`
    );
    const zScoreDataSample = evalExpression(
      `(${pMeanSubMean}) / (${pStandardDeviation} / sqrt(${sampleSize}))`
    );

    //P calculation for various parameters
    const zScoreDataValueParsed = evalToDecimals(zScoreDataValue);
    const pLessThanZ = jStat.normal.cdf(zScoreDataValueParsed, 0, 1); //P(X < Z)
    const pGreaterThanZ = 1 - pLessThanZ; //P(X > Z)
    const pBetween0AndZ = pLessThanZ - jStat.normal.cdf(0, 0, 1); //P(0 < X < Z)
    const pAbsLessThanZ =
      jStat.normal.cdf(zScoreDataValueParsed, 0, 1) -
      jStat.normal.cdf(-zScoreDataValueParsed, 0, 1); //P(|X| < Z)
    const pAbsGreaterThanZ = 1 - pAbsLessThanZ; //P(|X| > Z)

    const meanCalculation =
      method == 'Data Sample'
        ? [
            {
              value: `Number of input values(n) = ${sampleSize}`,
              type: 'span',
            },
            {
              value: putSpace(
                `Mean (\\bar{X}) of the sample input = ${convertIntoLatex(
                  mean
                )} = ${evalToDecimals(mean)}`
              ),
              type: 'equation',
            },
            {
              value: `<a href="/calculator/arithmetic-mean-calculator/?a=${xValues}" target="_blank">to see Steps click here</a>`,
              type: `span`,
            },
            'br',
          ]
        : [];

    const pDataValue =
      method == 'Data Value'
        ? [
            {
              value: putSpace(
                `The Z-Score is = ${convertIntoLatex(
                  zScoreDataValue
                )} = ${evalToDecimals(zScoreDataValue)}`
              ),
              type: 'equation',
            },
            {
              value: `P(X < Z) \\approx ${pLessThanZ.toFixed(6)}`,
              type: 'equation',
            },
            {
              value: `P(X > Z) \\approx ${pGreaterThanZ.toFixed(6)}`,
              type: 'equation',
            },
            {
              value: `P(0 < X < Z) \\approx ${pBetween0AndZ.toFixed(6)}`,
              type: 'equation',
            },
            {
              value: `P(|X| < Z) \\approx ${pAbsLessThanZ.toFixed(6)}`,
              type: 'equation',
            },
            {
              value: `P(|X| > Z) \\approx ${pAbsGreaterThanZ.toFixed(6)}`,
              type: 'equation',
            },
          ]
        : [];

    const finalAnswer =
      method == 'Data Value'
        ? [...pDataValue]
        : [
            method == 'Sample Mean'
              ? {
                  value: putSpace(
                    `The Z-Score is = ${convertIntoLatex(
                      zScoreDataValue
                    )}\\sqrt{${sampleSize}} = ${evalToDecimals(
                      zScoreSampleMean
                    )}`
                  ),
                  type: 'equation',
                }
              : {
                  value: putSpace(
                    `The Z-Score is = ${convertIntoLatex(
                      pStandardDeviationDivideSampleSize
                    )}\\sqrt{${sampleSize}} = ${evalToDecimals(
                      zScoreDataSample
                    )}`
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
    setAnswer(eqRender);

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution:-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The <b>Z-score</b> is calculated using the formula:`,
        type: 'span',
      },
      method == 'Data Value'
        ? {
            value: `Z = \\frac{x-\\mu}{\\sigma}`,
            type: 'equation',
          }
        : {
            value: `Z = \\large{\\frac{\\bar{x}-\\mu}{(\\frac{\\sigma}{\\sqrt{n}})}}`,
            type: 'equation',
          },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...meanCalculation,
      {
        value: `After putting the given values in the formula`,
        type: 'span',
      },
      method == 'Data Value'
        ? {
            value: `Z = \\frac{x-\\mu}{\\sigma} = \\frac{${xConverted} - ${pMeanConverted}}{${pStandardDeviationConverted}} = ${convertIntoLatex(
              zScoreDataValue
            )} = ${evalToDecimals(zScoreDataValue)}`,
            type: 'equation',
          }
        : method == 'Sample Mean'
        ? {
            value: `Z = \\large{\\frac{\\bar{x}-\\mu}{(\\frac{\\sigma}{\\sqrt{n}})}} = \\large{\\frac{${xConverted} - ${pMeanConverted}}{\\frac{${pStandardDeviationConverted}}{\\sqrt${sampleSize}}}} = ${convertIntoLatex(
              zScoreDataValue
            )}\\sqrt{${sampleSize}} = ${evalToDecimals(zScoreSampleMean)}`,
            type: 'equation',
          }
        : {
            value: `Z = \\large{\\frac{\\bar{x}-\\mu}{(\\frac{\\sigma}{\\sqrt{n}})}} = \\large{\\frac{${convertIntoLatex(
              mean
            )} - ${pMeanConverted}}{\\frac{${pStandardDeviationConverted}}{\\sqrt${sampleSize}}}} = ${convertIntoLatex(
              pStandardDeviationDivideSampleSize
            )}\\sqrt{${sampleSize}} = ${evalToDecimals(zScoreDataSample)}`,
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
  }, [
    x1,
    showSteps,
    method,
    sampleSize,
    pMean,
    pStandardDeviation,
    pMeanConverted,
    pStandardDeviationConverted,
    xConverted,
    xValues,
  ]);
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeMethod = (event) => {
    setMethod(event.target.value);
  };

  const clear = useCallback(() => {
    if (mf1.current) mf1.current.latex('');

    setX1('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [x1].some((v) => !!v || v == 0);
  const hasAllValue = [x1].every((v) => !!v || v == 0);
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
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Select Method:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={method}
                onChange={onChangeMethod}
              >
                <option value="Data Value">Data Value</option>
                <option value="Sample Mean">Sample Mean {`&`} Size</option>
                <option value="Data Sample">A Data Sample</option>
              </select>
            </div>
          </div>

          {method == 'Data Sample' ? (
            <>
              <div className="col-12 text-left">Enter set of Values:-</div>
              <div className="col-12">
                <textarea
                  className="form-control border-primary col-4 min-height"
                  placeholder="Enter Comma Seperated Values"
                  value={xValues}
                  onBlur={(e) => {
                    if (!validateInput(e.target.value)) {
                      e.currentTarget.className =
                        'form-control border-danger col-4 min-height';
                      setShowSteps(false);
                      setShowResult(true);
                    } else {
                      e.currentTarget.className =
                        'form-control border-primary col-4 min-height';
                    }
                  }}
                  onChange={(e) => {
                    const input = e.target.value;

                    const validPartialInput =
                      /^(-?\d*(\.\d*)?(\/-?\d*)?)(,\s*-?\d*(\.\d*)?(\/-?\d*)?)*,?$/;

                    if (input === '' || validPartialInput.test(input)) {
                      setXValues(input);
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Data Value{`(x)`}:</div>
              <div className="col-8 text-left">
                <MathInput
                  setMathfieldRef={(ref) => (mf1.current = ref)}
                  setValue={setX1}
                  initialLatex={x1}
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
                />
              </div>
            </div>
          )}
          {method == 'Data Value' ? (
            ''
          ) : (
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Sample Size{`(n)`}:</div>
              <div className="col-8 text-left">
                <MathInput
                  setMathfieldRef={(ref) => (mf1.current = ref)}
                  setValue={setSampleSize}
                  initialLatex={sampleSize}
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
                />
              </div>
            </div>
          )}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Population Mean {`(μ)`}:</div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setPMean}
                initialLatex={pMean}
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
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Population Standard Deviation {`(σ)`}:{' '}
            </div>
            <div className="col-8 text-left">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setPStandardDeviation}
                initialLatex={pStandardDeviation}
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
              />
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
          <Equation className="mt-3" equation={answer} />
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

export default ZScore;
