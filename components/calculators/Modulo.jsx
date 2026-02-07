'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';

const AIsBPercentOfWhat = () => {
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
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
          value: `Calculate <b>${parseNumber(
            a || 'a'
          )} </b> modulo <b>${parseNumber(b || 'b')} </b>`,
          type: 'span',
        },
      ])
    );
  }, [a, b]);

  useEffect(() => {
    const isInvalid = [a, b].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `a : < <b>${parseNumber(a || 'a')} </b> >`,
          type: 'span',
        },
        'br',
        {
          value: `b : < <b>${parseNumber(b || 'b')}</b> >`,
          type: 'span',
        },
      ])
    );

    if (isInvalid) return;

    const quotient = Math.floor(a / b);
    const remainder = a % b;

    const finalAnswer = [
      {
        value: `The result of ${parseNumber(a)} modulo ${parseNumber(
          b
        )} is <b>${parseNumber(remainder)}</b>`,
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
        value: `Modulo is defined as the remainder obtained when a is divided by b.`,
        type: 'span',
      },
      'br',
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `a = <b>${parseNumber(a)}</b>`,
        type: 'span',
      },
      'br',
      {
        value: `b = <b>${parseNumber(b)}</b>`,
        type: 'span',
      },
      {
        value: `Now \\space divide \\space ${parseNumber(
          a
        )} \\space by \\space ${parseNumber(
          b
        )} \\space or \\space {${parseNumber(a)} \\above{1pt} ${parseNumber(
          b
        )}}`,
        type: 'equation',
      },
      {
        value: `<a href="/calculator/long-division-calculator-with-remainders/?p=${a}&q=${b}" target="_blank">to see Steps click here</a>`,
        type: `span`,
      },
      'br',
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Quotient = ${parseNumber(quotient)}`,
        type: 'span',
      },
      'br',
      {
        value: `Remainder = ${parseNumber(remainder)}`,
        type: 'span',
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
  }, [a, b, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    setB('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [a, b].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [a, b].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            Your input can be in form of only integers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">A :-</div>
            <div className="col-9">
              <Input
                placeholder="value of a"
                autoComplete="off"
                className="col-12"
                value={a}
                setVal={setA}
                min={0}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">B :-</div>
            <div className="col-9">
              <Input
                placeholder="value of b"
                autoComplete="off"
                className="col-12"
                value={b}
                setVal={setB}
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

export default AIsBPercentOfWhat;
