'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';

const PrimeFactorisation = () => {
  const [a, setA] = useState('40');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [arr, setArr] = useState([]);
  const [divisonArr, setDivisonArr] = useState([]);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.a) setA(vals.a);
  }, []);

  useEffect(() => {
    if (arr.length > 0) setArr([]);
    if (divisonArr.length > 0) setDivisonArr([]);
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`
          Find the \\bold{Prime factorisation} of the number  \\bold{${parseNumber(
            a || '1'
          )}}`),
          type: 'equation',
        },
      ])
    );
  }, [a]);
  useEffect(() => {
    if (arr.length > 0) setArr([]);
    const isInvalid = isNaN(a);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        'br',
        {
          value: putSpace(`Number: - <  \\bold{${parseNumber(a || 'a')}} >`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    let divisionArr = [];
    let arrTemp = arr || [];
    function factor(a) {
      if (isNaN(a) || !isFinite(a) || a % 1 != 0 || a == 0) return '' + a;
      if (a < 0) return '-' + factor(-a);
      var minFactor = leastFactor(a);
      let val = { minFactor, a };
      divisionArr = [...divisionArr, val];
      if (a == minFactor) return '' + a;

      return minFactor + '*' + factor(a / minFactor);
    }
    function leastFactor(a) {
      arrTemp = [...arrTemp, a];
      if (isNaN(a) || !isFinite(a)) return a;
      if (a == 0) {
        return 0;
      }
      if (a % 1 || a * a < 2) {
        return 1;
      }
      if (a % 2 == 0) {
        return 2;
      }
      if (a % 3 == 0) {
        return 3;
      }
      if (a % 5 == 0) {
        return 5;
      }
      var m = Math.sqrt(a);
      for (var i = 7; i <= m; i += 30) {
        if (a % i == 0) return i;
        if (a % (i + 4) == 0) return i + 4;
        if (a % (i + 6) == 0) return i + 6;
        if (a % (i + 10) == 0) return i + 10;
        if (a % (i + 12) == 0) return i + 12;
        if (a % (i + 16) == 0) return i + 16;
        if (a % (i + 22) == 0) return i + 22;
        if (a % (i + 24) == 0) return i + 24;
      }

      return a;
    }

    const result = factor(a);
    setDivisonArr(divisionArr);
    setArr(arrTemp);

    const finalAnswer = [
      {
        value: `The <b>Prime factorisation</b> of the number ${parseNumber(
          a
        )} is <b>${result}</b>`,
        type: 'span',
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
      'br',
      {
        value: `Given number =${parseNumber(a)}`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      ...divisionArr.map((item) => {
        return {
          value: `${item.a} divides by  ${item.minFactor}= (${item.a} ÷ ${
            item.minFactor
          }) = ${item.a / item.minFactor} <br>`,
          type: 'span',
        };
      }),
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Hence number ${parseNumber(
          a
        )} can be written as   ${parseNumber(a)} = ${result}`,
        type: 'span',
      },
      {
        value: `<hr />`,
      },
      {
        value: `<b>Final Answer</b>`,
        type: 'span',
      },
      'br',
      ...finalAnswer,
    ];

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [a, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a].some((v) => !!v && v != '0');

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
            Your input can be in form of only Natural numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Number:- </div>
            <div className="col-9">
              <Input
                placeholder="a"
                autoComplete="off"
                className="col-12"
                value={a}
                setVal={setA}
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

export default PrimeFactorisation;
