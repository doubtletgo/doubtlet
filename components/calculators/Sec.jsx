'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { FindSecData } from '../../utils/constants/Angle-table';

const Sec = () => {
  const [a, setA] = useLocalStorage('Sec_a', '3');
  const [equation, setEquation] = useLocalStorage('Sec_equation', '');
  const [solution, setSolution] = useLocalStorage('Sec_solution', '');
  const [result, setResult] = useLocalStorage('Sec_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Sec_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('Sec_showSteps', true);
  const [note, setNote] = useLocalStorage('Sec_note', undefined);
  const [usePI, setUsePI] = useLocalStorage('Sec_usePI', false);
  const [order, setOrder] = useLocalStorage('Sec_order', 'Degree');

  let [p, q = 1] = a.split('/');

  const isDegree = order === 'Degree';

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Calculate \\space the \\space value \\space of \\space Sec \\space ({${parseNumber(
            p || 'R'
          )}${usePI ? '\\pi' : ''} ${
            q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
          })`,
          type: 'equation',
        },
      ])
    );
  }, [a, usePI]);
  useEffect(() => {
    const isInvalid = [p].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Angle \\space (θ): {${parseNumber(p || 'R')}${
            usePI ? '\\pi' : ''
          } ${q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`}`,
          type: 'equation',
        },
      ])
    );
    if (!a) return;
    if (isInvalid) return;

    //perimeter calculation
    function checkDecimal(n) {
      var isDecimal = n - Math.floor(n) !== 0;

      return isDecimal;
    }
    function decimalToFraction(val) {
      val = val?.toString();
      if (!val) return;
      if (checkDecimal(val)) {
        return (
          val.replace('.', '') +
          `\\above{1pt}` +
          10 ** val.split('.')[1]?.length
        );
      }
      return val + `\\above{1pt}` + 1;
    }

    let numerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[0] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[1] || 1);
    let denumerator =
      decimalToFraction(p)?.split(`\\above{1pt}`)[1] *
      (decimalToFraction(q)?.split(`\\above{1pt}`)[0] || 1);

    const radianValue = usePI
      ? (numerator * 180) / denumerator
      : (numerator / denumerator) * (180 / Math.PI);
    const angle = isDegree ? numerator / denumerator : radianValue;
    const nDivide90 = abs(Math.trunc(angle / 90));
    const nDivide90Remainder = abs(angle % 90);
    const Sec = 1 / Math.cos((Math.PI * angle) / 180);
    const quadrant = (nDivide90 % 4) + 1;
    const isNegative = Number(angle) < 0;
    const isEven = nDivide90 % 2 == 0;
    const neg = [1, 4].includes(quadrant);

    const staticValues = FindSecData(angle);

    const finalAnswer = [
      {
        value: `The \\space value \\space of \\space Sec ({${parseNumber(
          p || 'R'
        )}${usePI ? '\\pi' : ''} ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }) \\space is = \\bold{${staticValues}} \\space or \\space \\bold{${parseNumber(
          Sec,
          {},
          2
        )}}
        `,
        type: `equation`,
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

    const stepOfDegree = [
      {
        value: `Given\\space angle =\\space  ${parseNumber(
          angle,
          {},
          4
        )}\\degree `,
        type: 'equation',
      },
      {
        value: `Now divide ${parseNumber(
          angle,
          {},
          4
        )} by 90 to reduce the angle to the lowest form `,
        type: 'span',
      },
      'br',
      {
        value: `{ ${parseNumber(abs(angle), {}, 4)} \\above{1pt}90}=
        \\{{( 90*${parseNumber(nDivide90)})+${parseNumber(
          nDivide90Remainder,
          {},
          4
        )}}\\}=\\{{( 180*
          
           ${parseNumber(nDivide90) / 2} 
          
            )+
            
            ${parseNumber(nDivide90Remainder, {}, 4)}}\\}`,
        type: 'equation',
      },
      {
        value: `Since ${parseNumber(nDivide90)} multiple is an <b>${
          isEven ? 'Even' : 'Odd'
        }</b> number so <b>Sec</b> will ${
          isEven ? 'remain <b>Sec</b>' : 'become <b>Cosec</b>'
        }.
      `,
        type: 'span',
      },
      'br',
      {
        value: `Given angle lies in the ${quadrant}<sup>th</sup> quadrant so the value of Sec will be <b>${
          neg ? 'Positive' : 'Negative'
        }.</b>`,
        type: 'span',
      },
    ].flat();

    //Step To Radian
    const stepRadian = [
      {
        value: `Given \\space angle \\space = \\space {${
          denumerator == 1
            ? numerator
            : [`${numerator}${usePI ? `\\pi` : ``}`, denumerator].join(
                '\\above{1pt}'
              )
        }} \\space   ${order} `,
        type: 'equation',
      },
      {
        value: `To  \\space convert \\space the \\space angle \\space in \\space radian \\space to \\space degrees \\space we \\space have \\space to \\space multiply \\space the \\space given \\space angle \\space by \\space {180\\above{1pt}\\pi} `,
        type: 'equation',
      },
      {
        value: `After \\space solving \\space = {${
          denumerator == 1
            ? numerator
            : [`${numerator}${usePI ? `\\pi` : ``}`, denumerator].join(
                '\\above{1pt}'
              )
        }}.{(180)\\above{1pt}\\pi} = ${parseNumber(
          radianValue,
          {},
          4
        )} \\degree`,
        type: 'equation',
      },
    ];

    if (!showSteps) return;
    const step1 = !isDegree
      ? [...stepRadian, ...stepOfDegree]
      : [...stepOfDegree];

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `The Sec of an angle is defined as the ratio of the length of the Hypotenuse to the Base.
        `,
        type: 'span',
      },
      'br',
      {
        value: `The sec value will be <b>positive</b> if it lies in the <b>1<sup>st</sup></b> or <b>4<sup>th</sup></b> quadrant.`,
        type: 'span',
      },
      {
        value: `Sec ={Hypotenuse\\above{1pt}Base}`,
        type: 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...step1,
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: isNegative
          ? `Since Sec is an <b> even function</b> so “-” negative sign will not come out.`
          : '',
        type: 'span',
      },
      'br',
      {
        value: `Sec(${parseNumber(angle, {}, 4)})=${
          isNegative ? '-' : ''
        } Sec(${parseNumber(abs(angle), {}, 4)})  = ${
          isNegative ? '-' : ''
        } Sec{(90 x ${parseNumber(nDivide90, {}, 4)} ) + ${parseNumber(
          nDivide90Remainder,
          {},
          4
        )})} = <b> ${Sec < 0 ? '-' : ''}${
          isEven ? 'Sec' : 'Cosec'
        }(${parseNumber(nDivide90Remainder, {}, 4)})</b>`,
        type: 'span',
      },
      {
        value: `Now \\space value \\space of \\space ${Sec < 0 ? '-' : ''}${
          isEven ? 'Sec' : 'Cosec'
        }(${parseNumber(nDivide90Remainder, {}, 4)}) = ${
          staticValues ? `${staticValues}` : `${parseNumber(Sec, {}, 2)}`
        }`,
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
  }, [a, showSteps, setSolution, usePI, isDegree]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
    setUsePI(false);
  };

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of positive real numbers
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Deg./Rad.</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Degree">Degree</option>
                <option value="Radian">Radian</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Angle (θ):</div>
            <div className={isDegree ? 'col-8' : 'col-5'}>
              <Input
                placeholder="Angle"
                className="col-12"
                value={a}
                setVal={setA}
                pattern={
                  /^(-?((\d*)|\.|(\d*\.\d*)))(\/-?((\d*)|\.|(\d*\.\d*)|(\d*\.)))?$/
                }
              />
            </div>
            {!isDegree ? (
              <div className="col-3 d-flex">
                <label htmlFor="check" className=" form-label mx-2 px-2">
                  Include PI
                </label>
                <input
                  className="form-check"
                  type="checkbox"
                  id="check"
                  checked={usePI}
                  onChange={(e) => setUsePI(e.target.checked)}
                />
              </div>
            ) : (
              ''
            )}
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

export default Sec;
