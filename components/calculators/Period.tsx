'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';

import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";

// Utility to check leap year
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Get today's date
const today = new Date();
const defaultMonth = today.getMonth() + 1;
const defaultDate = today.getDate();
const defaultYear = today.getFullYear();

const PeriodDateCalculator = () => {
  // --------------------------
  // STATE HOOKS
  // --------------------------
  const [month, setMonth] = useLocalStorage('Period_month', defaultMonth);
  const [date, setDate] = useLocalStorage('Period_date', defaultDate);
  const [year, setYear] = useLocalStorage('Period_year', defaultYear);
  const [periodDuration, setPeriodDuration] = useLocalStorage('Period_periodDuration', '5');
  const [cycleLength, setCycleLength] = useLocalStorage('Period_cycleLength', '28');
  const [result, setResult] = useLocalStorage('Period_result', []);
  const [showResult, setShowResult] = useLocalStorage('Period_showResult', true);

  // ---------------------------------------------------
  // GENERATE DATE OPTIONS
  // ---------------------------------------------------
  const getDateOptions = (month, year) => {
    const daysInMonth = [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return Array.from({ length: daysInMonth[month - 1] }, (_, i) => i + 1);
  };

  const dateOptions = getDateOptions(month, year);

  // If current date is out-of-range after changing month/year, adjust it
  useEffect(() => {
    if (!dateOptions.includes(date)) {
      setDate(dateOptions[dateOptions.length - 1]);
    }
  }, [month, year]);

  // ---------------------------------------------------
  // CALCULATE PERIOD & OVULATION INTERVALS
  // ---------------------------------------------------
  useEffect(() => {
    const lastPeriodDate = new Date(year, month - 1, date);
    const cycle = parseInt(cycleLength, 10);
    const duration = parseInt(periodDuration, 10);

    const periods = [];
    for (let i = 0; i < 12; i++) {
      // Start day of the period
      const periodStart = new Date(lastPeriodDate);
      periodStart.setDate(periodStart.getDate() + i * cycle);

      // End day of the period
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + duration - 1);

      // Ovulation window
      const ovulationStart = new Date(periodStart);
      ovulationStart.setDate(periodStart.getDate() + Math.floor(cycle - 14));
      const ovulationEnd = new Date(ovulationStart);
      ovulationEnd.setDate(ovulationStart.getDate() + 3);

      periods.push({
        month: periodStart.toLocaleString('default', { month: 'long' }),

        // Period Interval
        periodStartDay: periodStart.toLocaleDateString('en-US', {
          weekday: 'long',
        }),
        periodStartDate: `${periodStart.getDate()} ${periodStart.toLocaleString(
          'default',
          { month: 'short' }
        )}`,
        periodEndDate: `${periodEnd.getDate()} ${periodEnd.toLocaleString(
          'default',
          { month: 'short' }
        )}`,

        // Ovulation Interval
        ovulationStartDay: ovulationStart.toLocaleDateString('en-US', {
          weekday: 'long',
        }),
        ovulationStartDate: `${ovulationStart.getDate()} ${ovulationStart.toLocaleString(
          'default',
          { month: 'short' }
        )}`,
        ovulationEndDate: `${ovulationEnd.getDate()} ${ovulationEnd.toLocaleString(
          'default',
          { month: 'short' }
        )}`,
      });
    }

    setResult(periods);
  }, [month, date, year, periodDuration, cycleLength]);

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------
  const clear = useCallback(() => {
    // Restore defaults
    setMonth(defaultMonth);
    setDate(defaultDate);
    setYear(defaultYear);
    setPeriodDuration('5');
    setCycleLength('28');
    setResult([]);
    setShowResult(false);
  }, []);

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
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

          {/* Row for Month, Date, Year Labels */}
          <div className="row mb-2 align-items-center text-center">
            <div className="col-4"></div>
            <div className="col-8 row">
              <span className="col-4">
                <strong>Month ⬇</strong>
              </span>
              <span className="col-4">
                <strong>Date ⬇</strong>
              </span>
              <span className="col-4">
                <strong>Year ⬇</strong>
              </span>
            </div>
          </div>

          {/* Last Period Date Dropdowns */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              <strong>First day</strong> of your Last Period Date:
            </div>
            <div className="col-8 d-flex gap-1">
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}{' '}
                    ({i + 1})
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={date}
                onChange={(e) => setDate(Number(e.target.value))}
              >
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {Array.from({ length: 7 }, (_, i) => (
                  <option key={2024 + i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Period Duration */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Period Duration:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(e.target.value)}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cycle Length */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Average Period Cycle Length:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
              >
                {[...Array(36).keys()].map((i) => (
                  <option key={i + 15} value={i + 15}>
                    {i + 15} days
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <button
        className="btn default-btn px-5 rounded-pill mr-3 mt-2 btn-blue"
        onClick={() => setShowResult(true)}
      >
        Calculate
      </button>

      <button
        className="default-btn rounded-pill px-5 mt-2 btn btn-danger"
        onClick={clear}
      >
        Clear
      </button>

      {/* OUTPUT */}
      {showResult && (
        <>
          <hr />
          {/* Container with thin black border (no fill color) */}
          <div
            style={{
              border: '1px solid black',
              borderRadius: '10px',
              margin: '20px auto',
              padding: '20px',
              maxWidth: '1000px',
            }}
          >
            <h2 className="text-center">
              Your Next 12 Period & Ovulation Cycles
            </h2>
            <br />
            <h3 className="text-center text-primary">
              Selected Year: <strong>{year}</strong>
            </h3>
            <div className="table-responsive d-flex justify-content-center">
              <table
                className="table table-bordered text-center hoverable-table"
                style={{ width: '60%' }}
              >
                <thead className="table-primary">
                  <tr>
                    <th>Expected Period Month</th>
                    <th>Expected Period Interval</th>
                    <th>Expected Ovulation Interval</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, index) => (
                    <tr
                      key={index}
                      className="hover-row"
                      style={{
                        borderBottom: '1px solid #ccc', // line separation
                      }}
                    >
                      <td>{row.month}</td>
                      <td>
                        <strong>{row.periodStartDay}</strong>
                        <br />
                        {row.periodStartDate} - {row.periodEndDate}
                      </td>
                      <td>
                        <strong>{row.ovulationStartDay}</strong>
                        <br />
                        {row.ovulationStartDate} - {row.ovulationEndDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

export default PeriodDateCalculator;
