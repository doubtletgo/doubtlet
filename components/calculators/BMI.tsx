'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import Input from '../common/input';
import BMIMeter from '../graph/bmi-meter';

const BMI = () => {
  const [unit, setUnit] = useState<'Metric' | 'US'>('Metric');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState('25');
  const [inches, setInches] = useState('30');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('78');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [ans, setAns] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const hasValue =
    age && height && weight && +age > 0 && +height > 0 && +weight > 0;

  const getHeight = () => {
    return unit == 'US'
      ? `${height} feet ${inches || 0} inches`
      : `${height} cm`;
  };

  const getWeight = () => {
    return unit == 'US' ? `${weight} lbs` : `${weight} kg`;
  };

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setHeight(vals.x);
  }, []);

  useEffect(() => {
    if (unit == 'Metric') {
      setWeight('78');
      setHeight('178');
    } else {
      setWeight('160');
      setHeight('5');
      setInches('11');
    }
  }, [unit]);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Evaluate BMI when Height = <b>${getHeight()}</b> and Weight = <b>${getWeight()}</b>`,
          type: 'span',
        },
      ])
    );
  }, [height, weight, inches, unit, gender]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Age = ${age}, Height = ${getHeight()} , Weight = ${getWeight()}`
          ),
          type: 'equation',
        },
      ])
    );

    if (!hasValue) return;

    const totalHeight = unit == 'US' ? +height * 12 + +inches : +height / 100;
    const heightSqr = Math.pow(totalHeight, 2);
    const unitWeight = +weight * (unit == 'US' ? 703 : 1);
    const bmi = unitWeight / heightSqr;
    const bmiAnswer = bmi.toFixed(2);
    setAns(bmiAnswer);
    const isUnderWeight = bmi < 18.5;

    const isNormalWeight = !isUnderWeight && bmi < 24.9999;
    const isOverWeight = !isNormalWeight && bmi < 29.9999;

    const coloredText =
      'You are \\textcolor' +
      (isUnderWeight
        ? `{blue}{Under Weight}`
        : isNormalWeight
        ? `{green}{Normal Weight}`
        : isOverWeight
        ? `{red}{Over Weight}`
        : `{darkred}{Obese}`);

    const finalAnswer = [
      {
        value: `BMI = ${bmiAnswer}`,
        type: 'span',
        className: 'h2',
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

    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      {
        value: putSpace(
          `BMI is calculated using the formula  = \\bold{${
            unit == 'Metric'
              ? '\\frac{Weight(Kg)}{(Height(m))^2}'
              : '\\frac{Weight(lbs) x 703}{(Height(in))^2}'
          }}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Given Height = ${getHeight()} = ${totalHeight} ${
            unit == 'US' ? 'inches' : 'cm'
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Given Weight = ${getWeight()}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `BMI = \\frac{${weight} ${
            unit == 'US' ? ` x 703` : ''
          }}{(${totalHeight})^2} = \\frac{${unitWeight}}{${heightSqr}} = ${bmiAnswer}`
        ),
        type: 'equation',
      },
      {
        type: 'equation',
        value: putSpace(`\\Large{${coloredText}}`),
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
  }, [weight, showSteps, age, height, unit, inches]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setHeight('');
    setWeight('');
    setAge('');
    setInches('');
    setUnit('Metric');
    setAns(null);
    setShowResult(false);
  }, [setShowResult]);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 d-flex align-items-center justify-content-center">
          {ans && <BMIMeter bmi={+ans} />}
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Positive Real Number
          </div>

          <div className="dropdown row align-items-center p-0">
            <div className="col-4 text-left">Select Unit Type:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'US' | 'Metric')}
              >
                <option value="Metric">Metric</option>
                <option value="US">Us</option>
              </select>
            </div>
          </div>
          <div className="dropdown row align-items-center">
            <div className="col-4 text-left">Gender:</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Age:</div>
            <div className="col-8">
              <Input
                type="text"
                placeholder="age"
                className="col-12"
                value={age}
                setVal={setAge}
                min={0}
                max={151}
                disabled={false}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Height ({unit == 'Metric' && 'Cm'}):
            </div>
            <div className="col-8 d-flex justify-content-between gap-1">
              <Input
                type="text"
                placeholder={unit == 'Metric' ? 'height' : 'Feet'}
                className={unit == 'US' ? 'col-6' : 'col-12'}
                value={height}
                setVal={setHeight}
                min={0}
                max={unit == 'Metric' ? 900 : 9}
                disabled={false}
              />
              {unit == 'US' && (
                <Input
                  type="text"
                  placeholder="inches"
                  className={unit == 'US' ? 'col-6' : 'col-12'}
                  value={inches}
                  setVal={setInches}
                  min={-0.00001}
                  max={12.0000001}
                  disabled={false}
                />
              )}
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">
              Weight ({unit == 'Metric' ? 'Kg' : 'lbs'}):
            </div>
            <div className="col-8">
              <Input
                type="number"
                placeholder="p"
                className="col-12"
                value={weight}
                setVal={setWeight}
                min={0}
                max={100000}
                disabled={false}
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

export default BMI;
