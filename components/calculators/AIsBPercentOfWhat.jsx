'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';

const AIsBPercentOfWhat = () => {
  const [a, setA] = useState('3');
  const [b, setB] = useState('7');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  let [p, q] = a.split('/');
  let [r, s] = b.split('/');

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Calculate\\space the\\space \\bold{Number} \\space whose \\space  \\bold{{${parseNumber(
            r || '1'
          )} ${
            s ? `\\above{1pt}${parseNumber(s)}}` : '}'
          }} \\% \\space is \\space  \\bold{{${parseNumber(p || '1')} ${
            q ? `\\above{1pt}${parseNumber(q || '1')}}` : '}'
          }} ?`,
          type: 'equation',
        },
      ])
    );
  }, [p, q, r, s]);

  useEffect(() => {
    const isInvalid = [p, r].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `A : <{${parseNumber(p || '1')}${
            q ? `\\above{1pt}${parseNumber(q)}}` : '}'
          }> `,
          type: 'equation',
        },
        {
          value: `B :<{${parseNumber(r || '1')} ${
            s ? `\\above{1pt}${parseNumber(s)}}` : ' }'
          }>`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    //calculation
    //decimal to fraction calculations
    function checkDecimal(n) {
      var isDecimal = n - Math.floor(n) !== 0;
      return isDecimal;
    }
    function decimalToFraction(val) {
      if (!val) return;
      if (checkDecimal(val)) {
        return val.replace('.', '') + '/' + 10 ** val.split('.')[1].length;
      }
      return val + '/' + 1;
    }
    //Convert To Fraction
    let decimalP = decimalToFraction(p);
    let decimalQ = decimalToFraction(q) || '1/1';
    let decimalR = decimalToFraction(r);
    let decimalS = decimalToFraction(s) || '1/1';
    //Reduce to minimal
    let numberP = fraction(decimalP?.split('/')[0], decimalP?.split('/')[1]);
    let numberQ = fraction(decimalQ?.split('/')[0], decimalQ?.split('/')[1]);
    let numberR = fraction(decimalR?.split('/')[0], decimalR?.split('/')[1]);
    let numberS = fraction(decimalS?.split('/')[0], decimalS?.split('/')[1]);
    //Multiply
    let pByQ = fraction(numberP[0] * numberQ[1], numberP[1] * numberQ[0]);
    let rByS = fraction(numberR[0] * numberS[1], numberR[1] * numberS[0]);
    let aIntoB = [pByQ[0] * rByS[1] * 100, pByQ[1] * rByS[0]];
    let aIntoBReduction = fraction(aIntoB[0], aIntoB[1]);

    //fraction reduction
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return [numR, denumR];
        }
      }
      return [numR, denumR];
    }

    const finalResult = aIntoBReduction[0] / aIntoBReduction[1];

    //Conditions to render steps
    var showPStep =
      (!checkDecimal(p) && (!q || pByQ[1] == 1 || !checkDecimal(q))) ||
      (!checkDecimal(p) && !checkDecimal(q));
    var showRStep =
      (!checkDecimal(r) && (!s || rByS[1] == 1 || checkDecimal(s))) ||
      (!checkDecimal(r) && !checkDecimal(s));
    var isPSingle =
      (!checkDecimal(p) && (!q || pByQ[1] == 1)) ||
      (!checkDecimal(p) && !checkDecimal(q));
    var isRSingle =
      (!checkDecimal(r) && (!r || rByS[1] == 1)) ||
      (!checkDecimal(r) && !checkDecimal(s));

    const finalAnswer = [
      {
        value: `The\\space value\\space whose \\space  {${parseNumber(r)}${
          q ? `\\above{1pt}${parseNumber(s)}}` : '}'
        } \\%\\space is\\space {${parseNumber(p)} ${
          s ? `\\above{1pt}${parseNumber(q)}}` : '}'
        }\\space is\\space \\bold {{${parseNumber(
          aIntoBReduction[0]
        )}\\above{1pt}${parseNumber(aIntoBReduction[1])}}}\\space or \\space
       \\bold  {${parseNumber(finalResult, {}, 4)}} `,
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
        value: `Let the number be P, then the value of P can be obtained <br>
        by using the formula`,
        type: 'span',
      },
      {
        value: `P = {100 \\above{1pt} B} * A`,
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
        value: `A={${parseNumber(p)} ${
          q ? `\\above{1pt}${parseNumber(q)}}` : '}'
        }`,
        type: 'equation',
      },
      {
        value: showPStep
          ? ''
          : `A={${checkDecimal(p) ? numberP.join('/') : p} ${
              q
                ? `\\above{1pt}${checkDecimal(q) ? numberQ.join('/') : q}}`
                : '}'
            }`,
        type: showPStep ? 'span' : 'equation',
      },
      {
        value: isPSingle
          ? ''
          : `A={${pByQ[0]} ${pByQ[1] == 1 ? '' : `\\above{1pt}{${pByQ[1]}}`} }`,
        type: isPSingle ? '' : 'equation',
      },
      {
        value: `B={${parseNumber(r)} ${
          s ? `\\above{1pt}${parseNumber(s)}}` : '}'
        }`,
        type: 'equation',
      },
      {
        value: showRStep
          ? ''
          : `B={${checkDecimal(r) ? numberR.join('/') : r} ${
              s
                ? `\\above{1pt}${checkDecimal(s) ? numberS.join('/') : s}}`
                : '}'
            }`,
        type: showRStep ? 'span' : 'equation',
      },
      {
        value: isRSingle
          ? ''
          : `B={${rByS[0]}${rByS[1] == 1 ? '' : ` \\above{1pt}{${rByS[1]}}`}} `,
        type: isRSingle ? '' : 'equation',
      },
      {
        value: `Now we have to put the above-given values in the formula.`,
        type: 'span',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `P = {100 \\above{1pt} {${rByS[1] == 1 ? '' : `\\Large`} ${
          rByS[0]
        }${rByS[1] == 1 ? '' : `\\above{1pt} ${rByS[1]}`}}} * {${
          pByQ[0]
        }\\above{1pt}${pByQ[1]}}`,
        type: 'equation',
      },
      {
        value: ` ={${rByS[1] * 100}\\above{1pt}${rByS[0]}}*{${
          pByQ[0]
        }\\above{1pt}${pByQ[1]}}`,
        type: 'equation',
      },
      {
        value: `P = {${aIntoB[0]}\\above{1pt} ${aIntoB[1]}}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-multiplication-calculator/?a= ${
          rByS[1] * 100
        }/${rByS[0]},${pByQ[0]}/${
          pByQ[1]
        }" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `Now reducing the fraction to its lowest form`,
        type: 'span',
      },
      {
        value: `P = {${aIntoBReduction[0]}\\above{1pt} ${aIntoBReduction[1]}}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/fraction-reduction-calculator/?a= ${aIntoB[0]}/${aIntoB[1]} " target="_blank">to see Steps click here</a>`,
        type: `span`,
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
  }, [p, q, r, s, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setB('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p, r].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p, r].every((v) => (!!v && !isNaN(v)) || v === 0);

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
          <div className="text-left mb-2">
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">A :-</div>
            <div className="col-9">
              <Input
                placeholder="Input values as p/q"
                autoComplete="off"
                className="col-12"
                value={a}
                setVal={setA}
                pattern={
                  /^(-?((\d*)|\.|(\d*\.\d*)))(\/-?((\d*)|\.|(\d*\.\d*)|(\d*\.)))?$/
                }
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">B :-</div>
            <div className="col-9">
              <Input
                placeholder="Input values as r/s"
                autoComplete="off"
                className="col-12"
                value={b}
                setVal={setB}
                pattern={
                  /^(-?((\d*)|\.|(\d*\.\d*)))(\/-?((\d*)|\.|(\d*\.\d*)|(\d*\.)))?$/
                }
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

export default AIsBPercentOfWhat;
