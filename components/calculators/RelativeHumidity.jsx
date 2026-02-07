'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';

const RelativeHumidity = () => {
  const [dB, setDB] = useState('3');
  const [wB, setWB] = useState('45');
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
          value: `Find the <b>Relative Humidity</b> when the Dry Bulb Temp. is <b>${
            parseNumber(dB) || '1'
          }</b> & Wet Bulb Temp. is <b>${parseNumber(wB) || '1'}</b>`,
          type: 'span',
        },
      ])
    );
  }, [dB, wB]);

  useEffect(() => {
    const isInvalid = [dB, wB].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `
          Dry \\space Bulb \\space Temp.(DB) = \\bold{${
            parseNumber(dB) || '1'
          }}`,
          type: 'equation',
        },
        {
          value: `
          Wet \\space Bulb \\space Temp.(WB) = \\bold{${
            parseNumber(wB) || '1'
          }}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    //For eD calculation
    let valueIntoDB = 17.502 * dB;
    let valuePlusDB = 240.097 + Number(dB);
    let divideDb = valueIntoDB / valuePlusDB;
    let eIntoDivideDb = 2.718 ** divideDb;
    let eD = 6.112 * eIntoDivideDb;

    //For eW calculation
    let valueIntoWB = 17.502 * wB;
    let valuePlusWB = 240.097 + Number(wB);
    let divideWb = valueIntoWB / valuePlusWB;
    let eIntoDivideWb = 2.718 ** divideWb;
    let eW = 6.112 * eIntoDivideWb;

    //For R.H calculation
    let wBIntoConstValue = 1 + 0.00115 * wB;
    let dBMinuswB = dB - wB;
    let multiply = 0.6687451584 * wBIntoConstValue * dBMinuswB;
    let eWMinusMultiply = eW - multiply;
    let divide = eWMinusMultiply / eD;
    let rH = divide * 100;
    let roundValue = Math.round(rH);

    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      {
        type: 'span',
        value: `The <b>Relative Humidity (RH)</b> for the given values of 
        Dry Bulb = <b>${parseNumber(dB)}</b> & Wet Bulb = <b>${parseNumber(
          wB
        )}</b> 
        is <b>${parseNumber(roundValue)}%</b>`,
      },
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
        value: `We know that <b>Relative Humidity</b> from the <b>Dry Bulb</b> & <b>Wet Bulb</b> Temperature is given by 
        the formula below`,
        type: 'span',
      },
      {
        value: `E_d = \\bigg\\lbrace{6.112*e^{\\large17.502*DB\\above{1pt}240.97+DB}}\\bigg\\rbrace \\space \\& \\space 
        `,
        type: 'equation',
      },
      {
        value: `E_w = \\bigg\\lbrace{6.112*e^{\\large17.502*WB\\above{1pt}240.97+WB}}\\bigg\\rbrace`,
        type: 'equation',
      },
      {
        value: 'Now',
        type: 'span',
      },
      {
        value: `R.H = {E_w-N*(1+0.00115*WB)(DB-WB)\\above{1pt}E_d}*100`,
        type: 'equation',
      },
      {
        value: 'Where,',
        type: 'span',
      },
      {
        type: 'br',
      },
      {
        value: 'e = 2.71828182845904',
        type: 'span',
      },
      {
        type: 'br',
      },
      {
        value: `DB = Dry Bulb Temperature (In Degree Celsius)<br>WB = Wet Bulb Temperature (In Degree Celsius)<br>
        N = 0.6687451584`,
        type: 'span',
      },
      {
        type: 'br',
      },
      {
        value: `Given input values are DB = <b>${parseNumber(
          dB
        )}</b> & WB = <b>${parseNumber(wB)}</b>`,
        type: 'span',
      },
      {
        type: 'br',
      },
      {
        value: `Then, by putting these values in the above formula`,
        type: 'span',
      },
      {
        type: 'br',
      },
      {
        value: `First solving for E<sub>d</sub>`,
        type: 'span',
      },
      {
        value: `E_d = 6.112 * e^{\\large(17.502*${parseNumber(
          dB
        )})\\above{1pt}(240.097 + ${parseNumber(dB)})}`,
        type: 'equation',
      },
      {
        value: `E_d = 6.112 * e^{\\large(${parseNumber(
          valueIntoDB
        )})\\above{1pt}(${parseNumber(valuePlusDB)})}`,
        type: 'equation',
      },
      {
        value: `E_d = 6.112*e^{\\normalsize(${parseNumber(divideDb)})}`,
        type: 'equation',
      },
      {
        value: `E_d = 6.112*${parseNumber(eIntoDivideDb)}`,
        type: 'equation',
      },
      {
        value: `E_d = ${parseNumber(eD)}`,
        type: 'equation',
      },
      {
        value: `Now, solving for E<sub>w</sub>`,
        type: 'span',
      },
      {
        value: `E_w = 6.112 * e^{\\large(17.502*${parseNumber(
          wB
        )})\\above{1pt}(240.097 + ${parseNumber(wB)})}`,
        type: 'equation',
      },
      {
        value: `E_w = 6.112 * e^{\\large(${parseNumber(
          valueIntoWB
        )})\\above{1pt}(${parseNumber(valuePlusWB)})}`,
        type: 'equation',
      },
      {
        value: `E_w = 6.112*e^{\\normalsize(${parseNumber(divideWb)})}`,
        type: 'equation',
      },
      {
        value: `E_w = 6.112*${parseNumber(eIntoDivideWb)}`,
        type: 'equation',
      },
      {
        value: `E_w = ${parseNumber(eW)}`,
        type: 'equation',
      },
      {
        value: `Now, Solving for Relative Humidity`,
        type: 'span',
      },
      {
        value: `R.H = {(E_w-0.6687451584) *(1+0.00115*${parseNumber(
          wB
        )})*(${parseNumber(dB)}-${parseNumber(wB)})\\above{1pt}E_d}*100`,
        type: 'equation',
      },
      {
        value: `R.H = {(${parseNumber(
          eW
        )}-0.6687451584 *(1+0.00115*${parseNumber(wB)})*(${parseNumber(
          dB
        )}-${parseNumber(wB)}))\\above{1pt}${parseNumber(eD)}}*100`,
        type: 'equation',
      },
      {
        value: `R.H = ${parseNumber(rH)} \\implies ${parseNumber(roundValue)}`,
        type: 'equation',
      },
      {
        value: `<hr />`,
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      {
        type: 'span',
        value: `The <b>Relative Humidity (RH)</b> for the given values of 
        Dry Bulb = <b>${parseNumber(dB)}</b> & Wet Bulb = <b>${parseNumber(
          wB
        )}</b> 
        is <b>${parseNumber(roundValue)}%</b>`,
      },
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [dB, wB, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setDB('');
    setWB('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [dB, wB].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [dB, wB].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of Real Number
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Unit:(Celcius/Fahrenheit)</div>
            <div className="col-4">
              <Input
                placeholder="DB"
                autoComplete="off"
                className="col-12"
                value={dB}
                setVal={setDB}
                min={0}
              />
            </div>
            <div className="col-4">
              <Input
                placeholder="WB"
                autoComplete="off"
                className="col-12"
                value={wB}
                setVal={setWB}
                min={0}
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

export default RelativeHumidity;
