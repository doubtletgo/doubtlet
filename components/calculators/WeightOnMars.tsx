'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import Input from '../common/input';

// Type definitions for the weight unit
type WeightUnit = 'Kg' | 'Pounds' | 'Grams';

const WeightOnMarsCalculator = () => {
  // --------------------------
  // STATE HOOKS
  // --------------------------
  const [weight, setWeight] = useState('70'); // weight on Earth (in selected unit)
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('Kg'); // Unit of input weight
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [note, setNote] = useState();

  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  // ---------------------------------------------------
  // INPUT VALIDATION
  // ---------------------------------------------------
  const hasValue = weight && +weight > 0;

  // ---------------------------------------------------
  // SIDE EFFECT: NOTE / QUESTION DISPLAY
  // ---------------------------------------------------
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Calculate your Weight on Mars if your weight on Earth is \\bold{${Number(
              weight
            ).toLocaleString('en-IN')}} ${weightUnit}.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [weight, weightUnit]);

  // ---------------------------------------------------
  // SIDE EFFECT: MAIN CALCULATION
  // ---------------------------------------------------
  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Weight on Earth = ${Number(weight).toLocaleString(
            'en-IN'
          )} ${weightUnit}`,
          type: 'span',
        },
      ])
    );

    // Exit if inputs are not valid
    if (!hasValue) return;

    // Weight Conversion Formula:
    // Weight on Mars = (Weight on Earth / g) * g_Mars, where:
    // g = Gravity on Earth = 9.81 m/s²
    // g_Mars = Gravity on Mars = 3.711 m/s²

    const g = 9.81; // gravity on Earth (m/s²)
    const g_Mars = 3.711; // gravity on Mars (m/s²)

    let weightOnEarthInKg = Number(weight);

    // Converting weight to Kg if it's in Pounds or Grams
    if (weightUnit === 'Pounds') {
      weightOnEarthInKg = weightOnEarthInKg * 0.453592; // convert lbs to Kg
    } else if (weightUnit === 'Grams') {
      weightOnEarthInKg = weightOnEarthInKg / 1000; // convert gm to Kg
    }

    // Formula to calculate weight on Mars
    const weightOnMarsInKg = (weightOnEarthInKg / g) * g_Mars;
    const weightOnMars = weightOnMarsInKg;

    // Convert the final result into the correct unit
    let finalResult;
    if (weightUnit === 'Kg') {
      finalResult = weightOnMars; // in Kg
    } else if (weightUnit === 'Pounds') {
      finalResult = weightOnMars * 2.20462; // converting back to Pounds
    } else if (weightUnit === 'Grams') {
      finalResult = weightOnMars * 1000; // converting back to Grams
    }

    // Showing the result in appropriate units
    const finalAnswer = [
      {
        value: putSpace(
          `Your Weight on Mars = \\bold{\\textcolor{green}{${finalResult.toLocaleString(
            'en-IN'
          )}}} ${weightUnit}`
        ),
        type: 'equation',
      },
    ];

    const answer = [
      {
        type: 'span',
        value: `<b>Answer</b>`,
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(answer);
    setResult(eqRender);

    // If showSteps is false, we skip showing step-by-step
    if (!showSteps) return;

    // Step-by-step explanation
    const steps = [
      {
        value: `<b>Step By Step Solution :</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `We use the formula to calculate your weight on Mars as: `
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Weight on Mars = (\\frac{Weight on Earth}{g_{Earth}}) *(g_{Mars})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Weight on Mars = (\\frac{${weightOnEarthInKg.toLocaleString(
            'en-IN'
          )}}{9.81}) *(3.711)`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Weight on Mars = \\bold{${weightOnMarsInKg.toLocaleString(
            'en-IN'
          )}} Kg`
        ),
        type: 'equation',
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solutionInLatex = renderSteps(steps);
    setSolution(solutionInLatex);
  }, [hasValue, weight, weightUnit, showSteps]);

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------
  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(() => {
    setShowSteps((prev) => !prev);
  }, [setShowSteps]);

  const clear = useCallback(() => {
    setWeight('');
    setWeightUnit('Kg');
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
          <div className="text-left mb-2">
            Your input should be a positive real number.
          </div>

          {/* Weight on Earth */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Weight on Earth:</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Enter Weight on Earth"
                className="col-12"
                value={weight}
                setVal={setWeight}
                min={0}
                max={1000} // max possible weight for most people on Earth
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>
          </div>

          {/* Weight Unit Selector */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Select Unit:</div>
            <div className="col-8">
              <select
                onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                value={weightUnit}
                className="form-select border-primary"
              >
                <option value="Kg">Kilograms (Kg)</option>
                <option value="Pounds">Pounds (lbs)</option>
                <option value="Grams">Grams (gm)</option>
              </select>
            </div>
          </div>

          {/* Displaying equation of user inputs */}
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>

      <hr />

      {/* Problem Statement / Note */}
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>

      {/* Buttons to Calculate or Clear */}
      {hasValue && (
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
          Clear
        </button>
      )}

      {/* Quick Result (No Steps) */}
      {hasValue && showResult && !showSteps && (
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

      {/* Detailed Steps */}
      {hasValue && showSteps && (
        <>
          <Equation
            className="mt-4 mb-5 solution-container"
            print
            equation={solution}
          />
          <div className="bottom-note">
            <strong>Note :-</strong> If you find any computational or logical
            errors in this calculator, kindly share your suggestions below.
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

export default WeightOnMarsCalculator;
