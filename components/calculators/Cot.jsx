'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { FindCotData } from '../../utils/constants/Angle-table';
import { putSpace } from '../../helpers/general';

const Cot = () => {
  const [a, setA] = useState('54');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [usePI, setUsePI] = useState(false);
  const [order, setOrder] = useState('Degree');

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
          value: putSpace(
            `Calculate the value of Cot ({${parseNumber(p || 'R')}${
              usePI ? '\\pi' : ''
            } ${q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`})`
          ),
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
    const Cot = 1 / Tan;
    const quadrant = (nDivide90 % 4) + 1;
    const isNegative = Number(angle) < 0;
    const isEven = nDivide90 % 2 == 0;
    const neg = [1, 3].includes(quadrant);
    const staticValues = FindCotData(angle);

    const finalAnswer = [
      {
        value: putSpace(`The value of Cos ({${parseNumber(p || 'R')}${
          usePI ? '\\pi' : ''
        } ${q != 1 ? `\\above{1pt} ${parseNumber(q)}}` : `}`}) is = \\bold{${
          staticValues ? `${staticValues} or ` : ''
        }} \\bold{${parseNumber(Cot, {}, 2)}}
        `),
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
        value: putSpace(`Given angle = ${parseNumber(angle, {}, 4)}\\degree `),
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
          )}}\\}=\\{{( 180*${parseNumber(nDivide90) / 2})+${parseNumber(
            nDivide90Remainder,
            {},
            4
          )}}\\}`
        ),
        type: 'equation',
      },
      {
        value: `Since ${parseNumber(nDivide90)} multiple is an <b>${
          isEven ? 'Even' : 'Odd'
        }</b> number so <b>Cot</b> will ${
          isEven ? 'remain <b>Cot</b>' : 'become <b>Tan</b>'
        }.
      `,
        type: 'span',
      },
      'br',
      {
        value: `Given angle lies in the ${quadrant}<sup>th</sup> quadrant so the value of Cot will be <b>${
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
        value: putSpace(
          `To convert the angle in radian to degrees we have to multiply the given angle by {180\\above{1pt}\\pi} `
        ),
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
        value: `The Cotangent of an angle is defined as the ratio of the length of the Base to the Perpendicular.`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `The Cot value will be \\bold{positive} if it lies in the \\bold{1^{st}} or \\bold{3^{rd}} quadrant`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Cot ={Base \\above{1pt} Perpendicular}`),
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
          ? `Since ${isEven ? 'Cot' : 'Tan'} is an <b>${
              isEven ? 'odd' : 'even'
            } function</b> so “-” negative sign will ${
              isEven ? '' : 'not'
            } come out.`
          : '',
        type: 'span',
      },
      'br',
      {
        value: `Cot(${parseNumber(angle, {}, 4)})=${
          isNegative ? '-' : ''
        } Cot(${parseNumber(abs(angle), {}, 4)})  = ${
          isNegative ? '-' : ''
        } Cot{(90 x ${parseNumber(nDivide90, {}, 4)} ) + ${parseNumber(
          nDivide90Remainder,
          {},
          4
        )})} = <b> ${isNegative || !neg ? '-' : ''}${
          isEven ? 'Cot' : 'Tan'
        }(${parseNumber(nDivide90Remainder, {}, 4)})</b>`,
        type: 'span',
      },
      'br',
      {
        value: `Now \\space value \\space of \\space ${Cot < 0 ? '-' : ''}${
          isEven ? 'Cot' : 'Tan'
        }(${parseNumber(nDivide90Remainder, {}, 4)}) = ${
          staticValues ? `${staticValues}` : `${parseNumber(Cot, {}, 2)}`
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

export default Cot;
