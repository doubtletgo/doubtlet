'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import Input from '../common/input';

// Defines the types of travel class (similar structure to your compounding type)
type SpaceTravelClass = 'Economy' | 'Business' | 'First Class';

const SpaceTravelCalculator = () => {
  // --------------------------
  // STATE HOOKS
  // --------------------------
  const [distance, setDistance] = useLocalStorage('SpaceTravelCost_distance', '500000'); // distance in miles
  const [passengers, setPassengers] = useLocalStorage('SpaceTravelCost_passengers', '4'); // number of passengers
  const [daysInSpace, setDaysInSpace] = useLocalStorage('SpaceTravelCost_daysInSpace', '10'); // days aboard spacecraft
  const [travelClass, setTravelClass] = useLocalStorage<SpaceTravelClass>('SpaceTravelCost_travelClass', 'Economy');

  const [equation, setEquation] = useLocalStorage('SpaceTravelCost_equation', '');
  const [solution, setSolution] = useLocalStorage('SpaceTravelCost_solution', '');
  const [result, setResult] = useLocalStorage('SpaceTravelCost_result', undefined);
  const [note, setNote] = useLocalStorage('SpaceTravelCost_note', undefined);

  const [showResult, setShowResult] = useLocalStorage('SpaceTravelCost_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('SpaceTravelCost_showSteps', true);

  // ---------------------------------------------------
  // INPUT VALIDATION
  // ---------------------------------------------------
  // Checking if user has given valid input
  const hasValue =
    distance &&
    +distance > 0 &&
    passengers &&
    +passengers > 0 &&
    daysInSpace &&
    +daysInSpace >= 0;

  // ---------------------------------------------------
  // SIDE EFFECT: NOTE / QUESTION DISPLAY
  // ---------------------------------------------------
  useEffect(() => {
    /*
      Example Note: Summarizes the question for the user.
      We use 'renderSteps' and 'putSpace' similarly to your Compound Interest snippet.
    */
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Calculate the total cost of a space voyage covering \\bold{${Number(
              distance
            ).toLocaleString(
              'en-IN'
            )}} miles for \\bold{${passengers}} passengers, traveling for \\bold{${daysInSpace}} days in \\bold{${travelClass}} class.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [distance, passengers, daysInSpace, travelClass]);

  // ---------------------------------------------------
  // SIDE EFFECT: MAIN CALCULATION
  // ---------------------------------------------------
  useEffect(() => {
    /*
      This side effect updates the 'equation' block showing user inputs
      and then calculates the cost if valid inputs are present.
    */

    // First, show the user inputs in a styled manner
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Distance (in miles) = ${Number(distance).toLocaleString(
            'en-IN'
          )}`,
          type: 'span',
        },
        'br',
        {
          value: `No. of Passengers = ${passengers}`,
          type: 'span',
        },
        'br',
        {
          value: `Travel Class = ${travelClass}`,
          type: 'span',
        },
        'br',
        {
          value: `Days in Space = ${daysInSpace}`,
          type: 'span',
        },
      ])
    );

    // Exit if inputs are not valid
    if (!hasValue) return;

    /* 
      SIMPLE COST FORMULA (illustrative):
      Base cost depends on class:
        Economy      -> $0.50 per mile
        Business     -> $0.75 per mile
        First Class  -> $1.00 per mile

      Additional daily cost (for life support, lodging, etc.):
        $2000 per day for each passenger

      Final cost = (distanceCost + dailyCost) * passengers
    */

    let costPerMile = 0.5;
    if (travelClass === 'Business') costPerMile = 0.75;
    if (travelClass === 'First Class') costPerMile = 1.0;

    const distanceCost = Number(distance) * costPerMile;
    const dailyCost = 2000 * Number(daysInSpace);

    // total cost for all passengers
    const totalCost = distanceCost + dailyCost;
    const overallCost = totalCost * Number(passengers);

    // This block uses 'renderSteps' to display final results in Equation component
    const finalAnswer = [
      {
        value: putSpace(
          `Total Space Travel Cost = \\bold{\\textcolor{green}{\\$ ${overallCost.toLocaleString(
            'en-IN'
          )}}}`
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

    // The step-by-step explanation
    const steps = [
      {
        value: `<b>Step By Step Solution :</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `Let the Cost per Mile (CPM) be based on chosen travel class.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Let Daily Cost (DC) = 2000 dollars per day per passenger.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `distance \\space Cost = distance × CPM = ${Number(
            distance
          ).toLocaleString(
            'en-IN'
          )} × ${costPerMile} = ${distanceCost.toLocaleString('en-IN')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `daily \\space Cost = DC × days In Space = 2000 × ${daysInSpace} = ${dailyCost.toLocaleString(
            'en-IN'
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Total cost (per passenger) = distance Cost + daily Cost = ${(
            distanceCost + dailyCost
          ).toLocaleString('en-IN')}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Overall Cost = (distance Cost + daily Cost) × passengers`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Overall Cost = ${(distanceCost + dailyCost).toLocaleString(
            'en-IN'
          )} × ${passengers} = \\bold{\\ ${overallCost.toLocaleString(
            'en-IN'
          )}}`
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
  }, [hasValue, distance, passengers, daysInSpace, travelClass, showSteps]);

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
    setDistance('');
    setPassengers('');
    setDaysInSpace('');
    setShowResult(false);
  }, []);

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <>
      {/* Container for Inputs and AdComponent */}
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>

        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of positive real numbers.
          </div>

          {/* Distance (miles) */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Distance (miles):</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Enter Distance in Miles"
                className="col-12"
                value={distance}
                setVal={setDistance}
                min={1}
                max={1000000000} // 1 billion miles max
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">No. of Passengers:</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="Enter Number of Passengers"
                className="col-12"
                value={passengers}
                setVal={setPassengers}
                min={1}
                max={10000}
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>
          </div>

          {/* Days in Space + Travel Class */}
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Days in Space:</div>
            <div className="col-3">
              <Input
                type="text"
                placeholder="Enter Days"
                className="col-12"
                value={daysInSpace}
                setVal={setDaysInSpace}
                min={0}
                max={10000}
                pattern={/^(\d)*(\.\d*)?$/}
                disabled={false}
              />
            </div>

            <div className="col-4">
              <select
                onChange={(e) =>
                  setTravelClass(e.target.value as SpaceTravelClass)
                }
                value={travelClass}
                className="form-select border-primary"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
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
          clear
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
            <strong>Note :-</strong> If you spot any computational or logical
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

export default SpaceTravelCalculator;
