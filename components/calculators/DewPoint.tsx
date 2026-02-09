'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { pressureLevels } from '../../utils/constants/index';
import styles from './DewPoint.module.css';
import AdComponent from '../AdSense';

// Import JSON data for different pressure levels
import dp1000 from '../../utils/constants/dp1000.json';
import dp900 from '../../utils/constants/dp900.json';
import dp800 from '../../utils/constants/dp800.json';
import dp700 from '../../utils/constants/dp700.json';
import rh1000 from '../../utils/constants/rh1000.json';
import rh900 from '../../utils/constants/rh900.json';
import rh800 from '../../utils/constants/rh800.json';
import rh700 from '../../utils/constants/rh700.json';
import vapourPressureData from '../../utils/constants/vapourpressure.json';

const dpData: Record<number, any> = {
  1000: dp1000,
  900: dp900,
  800: dp800,
  700: dp700,
};

const rhData: Record<number, any> = {
  1000: rh1000,
  900: rh900,
  800: rh800,
  700: rh700,
};

const DewPoint = () => {
  const [dB, setDB] = useLocalStorage('DewPoint_dB', '26');
  const [wB, setWB] = useLocalStorage('DewPoint_wB', '25');
  const [pressure, setPressure] = useLocalStorage('DewPoint_pressure', 1000);
  const [result, setResult] = useLocalStorage<any>('DewPoint_result', null);
  const [showResult, setShowResult] = useLocalStorage('DewPoint_showResult', true);
  const [note, setNote] = useLocalStorage<any>('DewPoint_note', undefined);
  const [calculatedValues, setCalculatedValues] = useLocalStorage<any>('DewPoint_calculatedValues', {});

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Find the <b>DP, VP, RH</b> when the Dry Bulb Temp. is <b>${parseNumber(dB) || '1'
            }</b> and Wet Bulb Temp. is <b>${parseNumber(wB) || '1'}</b>`,
          type: 'span',
        },
      ])
    );
  }, [dB, wB]);

  useEffect(() => {
    const isInvalid = [dB, wB].some((x) => isNaN(+x));

    let dp: number | null = null;
    let rh: number | null = null;
    let vpInHpa: string | number = 'N/A';

    if (!isInvalid) {
      const dpTable = (dpData as any)[pressure];
      const rhTable = (rhData as any)[pressure];

      if (dpTable && rhTable) {
        const dbNum = parseFloat(dB);
        const wbNum = parseFloat(wB);

        const findClosestKey = (obj: any, target: number) => {
          if (!obj) return null;
          const keys = Object.keys(obj).map(Number);
          if (keys.length === 0) return null;
          return keys.reduce((prev, curr) =>
            Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
          ).toString();
        };

        const dbKey = findClosestKey(dpTable, dbNum);
        if (dbKey) {
          const dpWbData = dpTable[dbKey];
          const dpWbKey = findClosestKey(dpWbData, wbNum);

          if (dpWbKey) {
            dp = dpWbData[dpWbKey] ?? null;

            if (dp !== null) {
              // Fetch RH
              const rhDbKey = findClosestKey(rhTable, dbNum);
              if (rhDbKey) {
                const rhWbData = rhTable[rhDbKey];
                const rhWbKey = findClosestKey(rhWbData, wbNum);
                if (rhWbKey) {
                  rh = rhWbData[rhWbKey] ?? null;
                }
              }

              // Calculate VP
              const getVaporPressure = (dewPoint: number) => {
                const isNeg = dewPoint < 0;
                const intPart = Math.abs(Math.trunc(dewPoint));
                const decPart = Math.abs(dewPoint % 1).toFixed(1); // "0.5"

                // Construct key, handling negative zero if necessary. 
                // Math.trunc(-0.5) is -0. toString() is "0". 
                // If we need "-0", we must handle it.
                // Based on file inspection, "-0" key is missing, so we might fallback or use strict logic.
                // Current file analysis showed gap between -1 and 0.
                // We will try signed key.
                let key = (dewPoint < 0 && dewPoint > -1) ? "-0" : (dewPoint < 0 ? `-${intPart}` : `${intPart}`);

                // If "-0" missing but 0 exists, user might just expect 0? Unlikely.
                // We try to find the entry.
                const entry = (vapourPressureData as any)[key] || (vapourPressureData as any)[isNeg ? `-${intPart}` : `${intPart}`];

                if (!entry) return null;

                // entry is { "0": ..., "0.1": ... }
                // keys in entry are strictly "0", "0.1", ...
                // Ensure decPart matches format "0.X" or "0"
                let exactDec = decPart === "0.0" ? "0" : decPart;
                if (decPart.startsWith("0") && decPart.length > 1 && !decPart.includes(".")) {
                  // Should actally be "0.X"
                }

                // The table keys are "0", "0.1", "0.2"...
                // decPart from toFixed(1) is "0.5". from "0.0" is "0.0".
                // Table has "0", "0.1". So "0.0" needs to map to "0".
                if (exactDec === "0.0") exactDec = "0";

                return entry[exactDec] ?? null;
              };

              const vpVal = getVaporPressure(dp);
              if (vpVal !== null) {
                vpInHpa = vpVal;
              }

              // Update calculated values for other calculators
              setCalculatedValues({
                result: 'success',
                dryBulb: dB, // Dry bulb input
                dewPoint: dp.toFixed(1),
                relativeHumidity: rh ? Math.round(rh).toString() : '',
                vapourPressure: typeof vpInHpa === 'number' ? vpInHpa.toFixed(1) : vpInHpa
              });
            }
          }
        }
      }
    }

    if (isInvalid || dp === null) {
      if (!isInvalid && showResult) {
        setResult(
          <div className={styles.resultContainer}>
            <div className="text-danger font-weight-bold">Data not available for the selected input.</div>
          </div>
        );
      } else {
        setResult(null);
      }
      return;
    }

    setResult(
      <div className={styles.resultContainer}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Dew Point (DP)</span>
          <span className={styles.resultValue}>
            {dp !== null ? dp.toFixed(1) : ''} <span style={{ color: 'black' }}>°C</span>
          </span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Relative Humidity (RH)</span>
          <span className={styles.resultValue}>
            {rh !== null ? Math.round(rh).toString().padStart(2, '0') : ''} <span style={{ color: 'black' }}>%</span>
          </span>
        </div>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Vapour Pressure (VP)</span>
          <span className={styles.resultValue}>{typeof vpInHpa === 'number' ? vpInHpa.toFixed(1) : vpInHpa} <span style={{ color: 'black' }}>hPa</span></span>
        </div>
      </div>
    );
  }, [dB, wB, pressure, showResult]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const clear = () => {
    setDB('');
    setWB('');
    setPressure(1000);
    setShowResult(false);
  };

  const hasValue = [dB, wB].some((v) => (!!v && !isNaN(+v)) || v == '0');
  const hasAllValue = [dB, wB].every((v) => (!!v && !isNaN(+v)) || v == '0');

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-8 user-inputs text-center">
          <div className={styles.inputWrapper}>
            <div className="row mt-3 mb-3 align-items-center">
              <div className="col-4 text-right">
                <span className={styles.pressureLabel}>Pressure Level :-</span>
              </div>
              <div className="col-8">
                <div className={styles.pressureContainer}>
                  {pressureLevels.map((level) => (
                    <button
                      key={level.value}
                      className={`${styles.pressureButton} ${pressure === level.value ? styles.activePressure : ''
                        }`}
                      onClick={() => setPressure(level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <div className="col-4 text-right">Dry Bulb (DB):</div>
              <div className="col-6">
                <Input
                  type="number"
                  placeholder="Dry Bulb Temp (°C)"
                  className="w-100"
                  inputClass={styles.inputField}
                  value={dB}
                  setVal={setDB}
                  min={-35}
                  max={55}
                />
              </div>
            </div>
            <div className="row mb-4 align-items-center">
              <div className="col-4 text-right">Wet Bulb (WB):</div>
              <div className="col-6">
                <Input
                  type="number"
                  placeholder="Wet Bulb Temp (°C)"
                  className="w-100"
                  inputClass={styles.inputField}
                  value={wB}
                  setVal={setWB}
                  min={-35}
                  max={55}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-3 mb-1">
        <Equation equation={note} />
      </div>

      <div className="text-center">
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
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {hasAllValue && showResult && result}
        </div>
      </div>

      <div className="row justify-content-center mt-2">
        <div className="col-md-8 text-center">
          <AdComponent />
          <div className="mt-2">
            <strong>Note :-</strong> If you find any computational or Logical
            error in this calculator, then you can write your suggestion by
            clicking the below button or in the comment box.
          </div>
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DewPoint;
