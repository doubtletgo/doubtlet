'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import awsKmphData from '../../utils/constants/awskmph.json';
import awsKnotsData from '../../utils/constants/awsknotsph.json';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, minusSymbol, parseNumber } from '../../helpers/decimal';

const parseWithDecimals = (num, digits = 1) =>
  parseFloat(parseNumber(num, {}, digits)).toFixed(digits);

const AverageWindSpeed = () => {
  const [duration, setDuration] = useLocalStorage('AverageWindSpeed_duration', '');
  const [current, setCurrent] = useLocalStorage('AverageWindSpeed_current', '');
  const [previous, setPrevious] = useLocalStorage('AverageWindSpeed_previous', '');
  const [equation, setEquation] = useLocalStorage('AverageWindSpeed_equation', '');
  const [solution, setSolution] = useLocalStorage('AverageWindSpeed_solution', '');
  const [result, setResult] = useLocalStorage('AverageWindSpeed_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('AverageWindSpeed_showResult', false);
  const [showSteps, setShowSteps] = useLocalStorage('AverageWindSpeed_showSteps', false);
  const [note, setNote] = useLocalStorage('AverageWindSpeed_note', undefined);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Find the <b>Average Wind Speed</b> given that Anemometer Current reading is <b>${parseNumber(current) || 'N/A'
            }</b> and Anemometer Previous reading is <b>${parseNumber(previous) || 'N/A'
            }</b>.`,
          type: 'span',
        },
      ])
    );
  }, [current, previous]);

  useEffect(() => {
    const isInvalid = [current, previous].some((x) => isNaN(x)) || !duration;

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Anemometer Current Reading :- <b>${parseNumber(current) || 'N/A'
            }</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Anemometer Previous Reading :- <b>${parseNumber(previous) || 'N/A'
            }</b>`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    let diff = current - previous;
    if (diff < 0) {
      diff += 1000000;
    }
    const difference = parseFloat(diff.toFixed(1));

    // Prepare keys for lookup
    // Remove (P) for both
    const baseDuration = duration.replace(/\(P\)/g, '').trim();
    // JSON keys format: 
    // kmph: "0830 to 1730" (lowercase to)
    // knots: "0830 TO 1730" (uppercase TO)
    const keyKmph = baseDuration;
    const keyKnots = baseDuration.replace(' to ', ' TO ');

    const findClosest = (table, target) => {
      if (!table) return null;
      const keys = Object.keys(table).map(Number);
      if (keys.length === 0) return null;
      const closest = keys.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
      );
      return table[closest.toString()];
    };

    const kmphTable = awsKmphData[keyKmph];
    const knotsTable = awsKnotsData[keyKnots];

    const kmphValue = findClosest(kmphTable, difference);
    const knotsValue = findClosest(knotsTable, difference);

    const answer = {
      kmph: kmphValue !== null ? kmphValue : 'N/A',
      knots: knotsValue !== null ? knotsValue : 'N/A'
    };

    const answerSteps = [
      {
        value: `The <b>Average Wind Speed</b> for the above given Inputs is <b>${JSON.stringify(
          answer.kmph,
          null,
          4
        )}</b> Km/Hr and <b>${JSON.stringify(answer.knots, null, 4)}</b> Knots`,
        type: 'span',
      },
    ];

    const equations = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      ...answerSteps,
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
        value: `We can calculate the Anemometer Run as given below`,
        type: 'span',
      },
      'br',
      {
        value: `The difference of the Anemometer Reading =`,
        type: 'td',
      },
      'br',
      'table',
      'tbody',
      'tr',
      {
        value: `Current Reading`,
        type: 'td',
      },
      {
        value: `${parseNumber(current)}`,
        type: 'td',
        className: 'text-right',
      },
      '/tr',
      'tr',
      {
        value: `Previous Reading`,
        type: 'td',
      },
      {
        value: `${minusSymbol(previous)} ${parseNumber(abs(previous))}`,
        type: 'td',
        className: 'pb-1 border-b-1-d text-right',
      },
      '/tr',
      'tr',
      {
        value: `Difference`,
        type: 'td',
      },
      {
        value: `${parseWithDecimals(difference)}`,
        type: 'td',
        className: 'text-right',
      },
      '/tr',
      '/tbody',
      '/table',
      {
        value: `<hr />`,
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...answerSteps,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [duration, current, previous, showSteps]);

  const changeDuration = (event) => {
    setDuration(event.target.value);
  };

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setCurrent('');
    setPrevious('');
    setShowResult(false);
  }, [setShowResult]);

  const onChangeCurrent = useCallback(
    (val) => {
      if (!val) return setCurrent(val);
      let valNum = Number(val.replace('.', ''));

      if (Math.abs(valNum - current) >= 1) {
        valNum /= 10;
        valNum = valNum.toFixed(1);
      }

      setCurrent(valNum);
    },
    [setCurrent, current]
  );

  const onChangePrevious = useCallback(
    (val) => {
      if (!val) return setPrevious(val);
      let valNum = Number(val.replace('.', ''));

      if (Math.abs(valNum - previous) >= 1) {
        valNum /= 10;
        valNum = valNum.toFixed(1);
      }

      setPrevious(valNum);
    },
    [setPrevious, previous]
  );

  const hasValue = [current, previous].some(
    (v) => (!!v && !isNaN(v)) || v === 0
  );
  const hasAllValue = [current, previous].every(
    (v) => (!!v && !isNaN(v)) || v === 0
  );

  return (
    <>
      <div className="row image-input-container">
        <div className="row image-input-container">
          <div className="col-sm-12 col-md-6 order-md-1 user-inputs offset-md-3">
            <div className="text-left mb-2">
              <strong>Your Input :-</strong>
            </div>
            <div className="text-left mb-2">
              Your input can be in form of only 6-digit Integer
            </div>
            <div className="dropdown row mb-2 align-items-center">
              <div className="col-4 text-left">Select the Duration</div>
              <div className="col-8">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={duration}
                  onChange={changeDuration}
                >
                  <option value="">Select the Duration</option>
                  <option value="1730(P) to 0830">1730(P) to 0830</option>
                  <option value="0830(P) to 0830">0830(P) to 0830</option>
                  <option value="0830 to 1730">0830 to 1730</option>
                </select>
              </div>
            </div>
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Current Reading</div>
              <div className="col-8">
                <Input
                  type="number"
                  placeholder="CR"
                  autoComplete="off"
                  className="col-12"
                  value={current}
                  setVal={onChangeCurrent}
                  max={999999}
                />
              </div>
            </div>
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Previous Reading</div>
              <div className="col-8">
                <Input
                  type="number"
                  placeholder="PR"
                  autoComplete="off"
                  className="col-12"
                  value={previous}
                  setVal={onChangePrevious}
                  max={999999}
                />
              </div>
            </div>
            <Equation equation={equation} className="border-primary" />
          </div>
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
          <Equation className="mt-4 mb-5" print equation={solution} />
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

export default AverageWindSpeed;
