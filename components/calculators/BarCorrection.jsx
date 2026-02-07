'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import {
  abs,
  addSymbol,
  minusSymbol,
  parseNumber,
} from '../../helpers/decimal';
import getTemperatureOnBarCorrectionSubtractedKelvin from '../../utils/conversion/bar-correction-subtracted-kelvin';
import getTemperatureOnBarCorrectionSubtractedDabok from '../../utils/conversion/bar-correction-subtracted-dabok';
import getTemperatureOnBarCorrectionAddedKelvin from '../../utils/conversion/bar-correction-added-kelvin';
import getTemperatureOnBarCorrectionAddedDabok from '../../utils/conversion/bar-correction-added-dabok';
import getTemperatureOnBarCorrectionAdded from '../../utils/conversion/bar-correction-added';
import getTemperatureOnBarCorrectionSubtracted from '../../utils/conversion/bar-correction-subtracted';

import Jaipur from '../../utils/conversion/Jaipur';
import Jaisalmer from '../../utils/conversion/Jaisalmer';
import Jodhpur from '../../utils/conversion/Jodhpur';
import Kota from '../../utils/conversion/Kota';
import Nagpur from '../../utils/conversion/Nagpur';
import Ramagundam from '../../utils/conversion/Ramagundam';
import Sriganganagar from '../../utils/conversion/Sriganganagar';
import Ajmer from '../../utils/conversion/Ajmer';
import Barmer from '../../utils/conversion/Barmer';
import Bikaner from '../../utils/conversion/Bikaner';
import Churu from '../../utils/conversion/churu';

const parseWithDecimals = (num, digits = 1) =>
  parseFloat(parseNumber(num, {}, digits)).toFixed(digits);

const stations = {
  Dabok: null,
  Ajmer,
  Barmer,
  Bikaner,
  Churu,
  Jaipur,
  Jaisalmer,
  Jodhpur,
  Kota,
  Nagpur,
  Ramagundam,
  Sriganganagar,
};

const getClosestValue = (map, key) => {
  const keys = Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b);
  const closestKey = keys.reduce((prev, curr) =>
    Math.abs(curr - key) < Math.abs(prev - key) ? curr : prev
  );
  return map[closestKey];
};

const getRTC = (data, temperature, pressure) => {
  if (!data || !data.RTC) return 0;

  const tempKeys = Object.keys(data.RTC).map(k => parseFloat(k)).sort((a, b) => a - b);
  if (tempKeys.length === 0) return 0;

  const closestTemp = tempKeys.reduce((prev, curr) =>
    Math.abs(curr - temperature) < Math.abs(prev - temperature) ? curr : prev
  );

  // Try directly accessing the key as it might be a string in JSON
  // If not found, try formatting it to string, or just use the number if keys are numbers?
  // JSON keys are always strings.
  let pressures = data.RTC[closestTemp];
  if (!pressures) pressures = data.RTC[closestTemp.toString()];

  if (!pressures) return 0;

  return getClosestValue(pressures, pressure);
};

const getDBC = (data, temperature, pressure) => {
  if (!data || !data.DBC) return 0;

  let foundKey = null;
  // Try to find the range
  for (const key of Object.keys(data.DBC)) {
    // Handle split by 'to' or '-' if inconsistent, but Jaipur.ts uses 'to'
    const separator = key.includes('to') ? 'to' : '-';
    const parts = key.split(separator).map(s => parseFloat(s.trim()));
    if (parts.length === 2 && temperature >= parts[0] && temperature <= parts[1]) {
      foundKey = key;
      break;
    }
  }

  // Fallback: if not in exact range, maybe find closest range midpoint? 
  // For now, if not found, return 0 or maybe try to find closest boundary.
  // Given the data is continuous, it should be found unless out of bounds.
  if (!foundKey) return 0;

  const pressures = data.DBC[foundKey];
  return getClosestValue(pressures, pressure);
};


const BarCorrection = () => {
  const [bt, setBt] = useState(299.4);
  const [dbt, setDbt] = useState(27);
  const [br, setBr] = useState(956.5);
  const [indexError, setIndexError] = useState('-0.2');
  const [previousSlp, setPreviousSlp] = useState(952.1);
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [note, setNote] = useState();
  const [temperature, setTemperature] = useState('Dabok');

  const isDabok = temperature === 'Dabok';

  // Legacy flags for hardcoded options if they still existed, 
  // but we are replacing Kelvin/Celcius with actual stations.
  // We'll keep logic for Dabok separate as it uses imported functions.

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Find the <b>SLP, MSLP</b> when the Bar Temp. is <b>${parseWithDecimals(
            bt || '1'
          )}</b>, Barometer Reading is <b>${parseWithDecimals(
            br || '1'
          )}</b> & Index error is <b>${parseWithDecimals(
            indexError || '1'
          )}</b>`,
          type: 'span',
        },
      ])
    );
  }, [bt, dbt, br, indexError]);

  useEffect(() => {
    const isInvalid = [bt, dbt, br, indexError].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Bar Temperature <b>(BT)</b> = <b>${parseWithDecimals(
            bt || '1'
          )}</b><br>
          Barometer Reading <b>(BR)</b> = <b>${parseWithDecimals(
            br || '1'
          )}</b><br>
          Index Error of Instrument = <b>${parseWithDecimals(
            indexError || '1'
          )}</b><br>
          Dry Bulb Temperature <b>(DBT)</b> = <b>${parseWithDecimals(
            dbt || '1'
          )}</b><br>
          Previous Day <b>SLP</b> = <b>${parseWithDecimals(previousSlp)} </b>`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    const correctedBaroMeterReading = Number(br) + Number(indexError);

    let correctionSubtracted;
    let correctionAdded;
    const stationData = stations[temperature];

    if (stationData) {
      // New Logic for added stations
      correctionSubtracted = getRTC(stationData, Number(bt), correctedBaroMeterReading);
    } else if (isDabok) {
      correctionSubtracted = getTemperatureOnBarCorrectionSubtractedDabok(
        bt,
        correctedBaroMeterReading
      );
    } else {
      // Fallback or default
      // If someone somehow selects something else or code changes, default to Dabok or generic
      correctionSubtracted = getTemperatureOnBarCorrectionSubtracted(bt, correctedBaroMeterReading);
    }

    const stationLevelPressure =
      correctedBaroMeterReading - correctionSubtracted;

    if (stationData) {
      correctionAdded = getDBC(stationData, Number(dbt), stationLevelPressure);
    } else if (isDabok) {
      correctionAdded = getTemperatureOnBarCorrectionAddedDabok(dbt, '952.1');
    } else {
      // Fallback
      correctionAdded = getTemperatureOnBarCorrectionAdded(dbt, stationLevelPressure);
    }

    const meanSeaLevelPressure = stationLevelPressure + correctionAdded;
    let changeInSLP = stationLevelPressure - previousSlp;

    const answerSteps = [
      'table',
      'tbody',
      'tr',
      {
        type: 'td',
        value: `Corrected Barometer Reading:`,
      },
      {
        type: 'td',
        value: `<b>${parseWithDecimals(correctedBaroMeterReading)}</b> hpa`,
      },
      '/tr',
      'tr',
      {
        type: 'td',
        value: `Station Level Pressure (SLP):`,
      },
      {
        type: 'td',
        value: `<b>${parseWithDecimals(stationLevelPressure)}</b> hpa`,
      },
      '/tr',
      'tr',
      {
        type: 'td',
        value: `Mean Sea Level Pressure (MSLP):`,
      },
      {
        type: 'td',
        value: `<b>${parseWithDecimals(meanSeaLevelPressure)}</b> hpa`,
      },
      '/tr',
      '/tbody',
      '/table',
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

    const previousSlpSteps = previousSlp
      ? [
        {
          value: `<b>Change in Station Level Pressure</b>`,
          type: 'span',
        },
        'br',
        'tbody',
        'table',
        'tr',
        {
          value: `Today's <b>SLP</b>: `,
          type: 'td',
        },
        {
          value: `<b>${parseWithDecimals(stationLevelPressure)}</b> hpa`,
          type: 'td',
          className: 'text-right',
        },
        '/tr',
        'tr',
        {
          value: `Previous Day <b>SLP</b>:`,
          type: 'td',
        },
        {
          value: `${addSymbol(abs.previousSlp)}<b>${parseWithDecimals(
            previousSlp
          )}</b> hpa`,
          type: 'td',
          className: 'pb-1 border-b-1-d text-right',
        },
        '/tr',
        'tr',
        {
          value: `Change in <b>SLP</b>:`,
          type: 'td',
        },
        {
          value: `<b>${parseWithDecimals(changeInSLP)}</b> hpa`,
          type: 'td',
          className: 'text-right',
        },
        '/tr',
        'tbody',
        '/table',
        'hr',
      ]
      : [];

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      'table',
      'tbody',
      'tr',
      {
        value: `Barometer Reading:`,
        type: 'td',
      },
      {
        value: `<b>${parseWithDecimals(br)}</b>`,
        className: 'text-right',
        type: 'td',
      },
      '/tr',
      'tr',
      {
        value: `Index error: `,
        type: 'td',
      },
      {
        value: `<b>${addSymbol(indexError)} ${parseWithDecimals(
          abs(indexError)
        )}</b>`,
        className: 'pb-1 border-b-1-d text-right',
        type: 'td',
      },
      '/tr',
      'tr',
      {
        value: `Corrected Barometer Reading: `,
        type: 'td',
      },
      {
        value: `<b>${parseWithDecimals(correctedBaroMeterReading)}</b>`,
        className: 'text-right',
        type: 'td',
      },
      '/tr',
      'tr',
      {
        value: `Temperature Correction: `,
        type: 'td',
      },
      {
        value: `${minusSymbol(correctionSubtracted)}<b>${parseWithDecimals(
          correctionSubtracted
        )}</b>`,
        className: 'pb-1 border-b-1-d text-right',
        type: 'td',
      },
      '/tr',
      'tr',
      {
        value: `Station Level Pressure(<b>SLP</b>): `,
        type: 'td',
      },
      {
        value: `<b>${parseWithDecimals(stationLevelPressure)}</b>`,
        type: 'td',
        className: 'text-right',
      },
      '/tr',
      'tr',
      {
        value: `Bar Correction to Be Added: `,
        type: 'td',
      },
      {
        value: `${addSymbol(correctionAdded)}<b>${parseWithDecimals(
          correctionAdded
        )}</b>`,
        className: 'pb-1 border-b-1-d text-right',
        type: 'td',
      },
      '/tr',
      'tr',
      {
        value: `Mean Sea Level Pressure (<b>MSLP</b>): `,
        type: 'td',
      },
      {
        value: `<b>${parseWithDecimals(meanSeaLevelPressure)}</b>`,
        className: 'pb-1 border-b-1-d',
        type: 'td',
      },
      '/tr',
      '/tbody',
      '/table',
      'hr',

      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...answerSteps,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [bt, dbt, br, indexError, showSteps, previousSlp, temperature]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const onChangeTemperature = (event) => {
    setTemperature(event.target.value);
  };

  const clear = useCallback(() => {
    setBt('');
    setBr('');
    setDbt('');
    setIndexError('');
    setShowResult(false);
  }, [setShowResult]);


  const hasValue = [bt, dbt, br, indexError].some(
    (v) => (!!v && !isNaN(v)) || v === 0
  );
  const hasAllValue = [bt, dbt, br, indexError].every(
    (v) => (!!v && !isNaN(v)) || v === 0
  );

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 offset-md-3 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Temperature</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={temperature}
                onChange={onChangeTemperature}
              >
                {Object.keys(stations).map((stationName) => (
                  <option key={stationName} value={stationName}>
                    {stationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Bar Temperature :</div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="BT"
                autoComplete="off"
                className="col-12"
                value={bt}
                setVal={setBt}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Barometer Reading:</div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="BR"
                autoComplete="off"
                className="col-12"
                value={br}
                setVal={setBr}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Index Error of Instrument:</div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="Index Error"
                autoComplete="off"
                className="col-12"
                value={indexError}
                min={-10}
                setVal={setIndexError}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Dry Bulb Temperature:</div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="DBT"
                autoComplete="off"
                className="col-12"
                value={dbt}
                setVal={setDbt}
                min={-35}
                max={55}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Previous Day SLP:</div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="Previous Day SLP"
                autoComplete="off"
                className="col-12"
                value={previousSlp}
                setVal={setPreviousSlp}
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

        </>
      )}
    </>
  );
};

export default BarCorrection;
