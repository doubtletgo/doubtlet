'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { FindTanData } from '../../utils/constants/Angle-table';
import { pluralise, putSpace } from '../../helpers/general';

const Tan = () => {
  const [a, setA] = useLocalStorage('Tan_a', '7');
  const [equation, setEquation] = useLocalStorage('Tan_equation', '');
  const [solution, setSolution] = useLocalStorage('Tan_solution', '');
  const [result, setResult] = useLocalStorage('Tan_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Tan_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('Tan_showSteps', true);
  const [note, setNote] = useLocalStorage('Tan_note', undefined);
  const [usePI, setUsePI] = useLocalStorage('Tan_usePI', false);
  const [order, setOrder] = useLocalStorage('Tan_order', 'Degree');

  let [p, q = 1] = a.split('/');

  const isDegree = order === 'Degree';
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Calculate \\space the \\space value \\space of \\space tan \\space ({${parseNumber(
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
          type: `span`,
        },
        'br',
        {
          value: putSpace(
            `Angle (θ): {${parseNumber(p || 'R')}${usePI ? '\\pi' : ''} ${
              q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
            }`
          ),
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
    const Tan = Math.tan((Math.PI * angle) / 180);
    const isNegative = Number(angle) < 0;
    const quadrant = isNegative ? 3 - (nDivide90 % 4) + 1 : (nDivide90 % 4) + 1;
    const isEven = nDivide90 % 2 == 0;
    const neg = [1, 3].includes(quadrant);

    const staticValues = FindTanData(angle);

    const finalAnswer = [
      {
        value: `The \\space value \\space of \\space tan ({${parseNumber(
          p || 'R'
        )}${usePI ? '\\pi' : ''} ${
          q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`
        }) \\space is = \\bold{${
          staticValues
            ? `${staticValues} ${
                (angle / 90) % 2 == 0 ? `\\space or \\space` : ``
              }  `
            : `${parseNumber(Tan, {}, 2)}`
        }} ${(angle / 90) % 2 == 0 ? `${parseNumber(Tan, {}, 2)}` : ` `}
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
        value: putSpace(
          `Now divide ${parseNumber(
            angle,
            {},
            4
          )} by 90 to reduce the angle to the lowest form `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `{ ${parseNumber(
            abs(angle),
            {},
            4
          )} \\above{1pt}90}=\\{{( 90*${parseNumber(nDivide90)})+${parseNumber(
            nDivide90Remainder,
            {},
            4
          )}}\\}=\\{{( 180*${parseNumber(nDivide90) / 2} )+${parseNumber(
            nDivide90Remainder,
            {},
            4
          )}}\\}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Since ${parseNumber(
          nDivide90
        )} multiple is an \\bold{${
          isEven ? 'Even' : 'Odd'
        }} number so \\bold{tan} will ${
          isEven ? 'remain \\bold{tan}' : 'become \\bold{cot}}'
        }.
      `),
        type: 'equation',
      },
      {
        value: putSpace(
          `Given angle lies in the ${pluralise(
            quadrant
          )} quadrant so the value of tan will be \\bold{${
            neg ? 'Positive' : 'Negative'
          }.}`
        ),
        type: 'equation',
      },
    ].flat();

    //Step To Radian
    const stepRadian = [
      {
        value: putSpace(
          `Given angle = {${
            denumerator == 1
              ? numerator
              : [`${numerator}${usePI ? `\\pi` : ``}`, denumerator].join(
                  '\\above{1pt}'
                )
          }} ${order}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `To convert the angle in radian to degrees we have to multiply the given angle by {180\\above{1pt}\\pi}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `After solving = {${
            denumerator == 1
              ? numerator
              : [`${numerator}${usePI ? `\\pi` : ``}`, denumerator].join(
                  '\\above{1pt}'
                )
          }}.{(180)\\above{1pt}\\pi} = ${parseNumber(
            radianValue,
            {},
            4
          )} \\degree`
        ),
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
        value: putSpace(
          `The Tangent of an angle is defined as the ratio of the length of the Perpendicular to the Base.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `The tan value will be \\bold{Positive} if it lies in the \\bold{1}^{st} or \\bold{3}^{rd} quadrant`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`tan ={Perpendicular \\above{1pt} Base}`),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...step1,
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        value: isNegative
          ? `Since tan is an <b> odd function</b> so “-” negative sign will  come out.`
          : '',
        type: 'span',
      },
      'br',
      {
        value: `tan(${parseNumber(angle, {}, 4)})=${
          isNegative ? '-' : ''
        } tan(${parseNumber(abs(angle), {}, 4)})  = ${
          isNegative ? '-' : ''
        } tan{(90 x ${parseNumber(nDivide90, {}, 4)} ) + ${parseNumber(
          nDivide90Remainder,
          {},
          4
        )})} = <b> ${isNegative || !neg ? '-' : ''}${
          isEven ? 'tan' : 'cot'
        }(${parseNumber(nDivide90Remainder, {}, 4)})</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Now \\space value \\space of \\space ${Tan < 0 ? '-' : ''}${
          isEven ? 'tan' : 'cot'
        }(${parseNumber(nDivide90Remainder, {}, 4)}) = \\bold{${
          staticValues
            ? `${staticValues} ${
                (angle / 90) % 2 == 0 ? `\\space or \\space` : ``
              }  `
            : `${parseNumber(Tan, {}, 2)}`
        }} ${(angle / 90) % 2 == 0 ? `${parseNumber(Tan, {}, 2)}` : ` `}`,
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
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default Tan;
