'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import Input from '../common/input';

const NthRootFunction = () => {
  const [functionType, setFunctionType] = useState<'square' | 'cube' | 'n'>(
    'square'
  );
  const [number, setNumber] = useState('6');
  const [base, setBase] = useState('2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  const hasValue = [number].some((v) => (!!v && !isNaN(+v)) || v == '0');

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.x) setNumber(vals.x);
  }, []);

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
            `\\LARGE{Calculate the value of ${
              functionType == 'square'
                ? `\\sqrt{${number}}.`
                : functionType == 'cube'
                ? `cube root of ${number}.`
                : `${base}th root of ${number} .`
            }}`
          ),
          type: 'equation',
        },
      ])
    );
  }, [number, functionType, base]);

  useEffect(() => {
    setEquation(
      renderSteps(
        [
          {
            value: `<b>Formatted User Input Display</b>`,
            type: 'span',
          },
          'br',
          {
            value: `Root Type: ${functionType}`,
            type: 'span',
          },
          'br',
          {
            value: `Number = ${number}`,
            type: 'span',
          },
          'br',
          {
            value: `Base = ${base}`,
            type: 'span',
          },
        ],
        [number, base, functionType]
      )
    );

    if (!hasValue) return;

    const sqrtValue = Math.sqrt(+number);
    const cubeValue = Math.cbrt(+number);
    const nthValue = Math.pow(+number, 1 / +base);

    const finalAnswer = [
      {
        value: putSpace(
          `The value of ${
            functionType == 'square'
              ? `\\sqrt{${number}}`
              : functionType == 'cube'
              ? `cube root of ${number}`
              : `${base}th root of ${number}`
          } is = \\LARGE{\\bold{${
            functionType == 'square'
              ? `{${sqrtValue}}`
              : functionType == 'cube'
              ? `{${cubeValue}}`
              : `{${nthValue}}`
          }}}`
        ),
        type: 'equation',
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
          `${
            functionType == 'square'
              ? 'The square root of a number x is a value y such that y^2 = x'
              : functionType == 'cube'
              ? 'The cube root of a number x is a value y such that y^3 = x'
              : 'The nth root of a number x is a value y such that y^n = x, where n is a positive integer.'
          }`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `It is denoted by the symbol ${
            functionType == 'square'
              ? '√'
              : functionType == 'cube'
              ? '\\large{\\sqrt[3]{x}}'
              : '\\large{\\sqrt[n]{x}}'
          }  or by using the exponent of \\frac{1}{${
            functionType == 'square' ? '2' : functionType == 'cube' ? '3' : base
          }}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given, Number (x) = ${number}`,
        type: 'span',
      },
      'br',
      {
        value: putSpace(
          `Now, value of  \\large{${
            functionType == 'square'
              ? `\\sqrt{${number}}`
              : functionType == 'cube'
              ? `{${number}}^{\\frac{1}{3}}`
              : `{${number}}^{\\frac{1}{${base}}}`
          }} = ${
            functionType == 'square'
              ? `{${sqrtValue}}`
              : functionType == 'cube'
              ? `{${cubeValue}}`
              : `{${nthValue}}`
          }`
        ),
        type: 'equation',
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
  }, [number, base, showSteps, showResult, functionType]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onChangeFunctionType = (event) => {
    const value = event.target.value;
    setFunctionType(value);
    if (value == 'square') setBase('2');
    if (value == 'cube') setBase('3');
    if (value == 'n') setBase('4');
  };
  const clear = useCallback(() => {
    setShowResult(false);
    setNumber('');
    setBase('');
  }, [setShowResult]);

  return (
    <>
      <div className="row image-input-container">
        <div className="row image-input-container">
          <div className="col-sm-12 col-md-6 order-md-1 user-inputs offset-md-3">
            <div className="text-left mb-2">
              <strong>Your Input :-</strong>
            </div>
            <div className="text-left mb-2">
              Your input can be in form of any Real Number.
            </div>
            <div className="dropdown row mb-2 align-items-center">
              <div className="col-4 text-left">Select the Root Type:</div>
              <div className="col-8">
                <select
                  className="form-select border-primary"
                  aria-label="Default select example"
                  value={functionType}
                  onChange={onChangeFunctionType}
                >
                  <option value="square">√</option>
                  <option value="cube">Cube Root</option>
                  <option value="n">nth Root</option>
                </select>
              </div>
            </div>
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Enter Number:</div>
              <div className="col-8">
                <Input
                  type="number"
                  placeholder="number"
                  className="col-12"
                  value={number}
                  setVal={setNumber}
                  max={999999}
                />
              </div>
            </div>
            <div className="row mb-2 align-items-center">
              <div className="col-4 text-left">Enter Base:</div>
              <div className="col-8">
                <Input
                  type="number"
                  placeholder="base"
                  className="col-12"
                  value={base}
                  setVal={setBase}
                  max={999999}
                  disabled={functionType !== 'n'}
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

export default NthRootFunction;
