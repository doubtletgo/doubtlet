'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertFromLatex,
  convertIntoLatex,
  evalInDecimals,
} from '@/helpers/matrixHelper';
import ExpressionInput from '../expression-input';
import Input from '../common/input';
import { isInputInvalid } from '@/helpers/Validations';
import { MathField } from '@/types/mathfield.types';

const Logarithm = () => {
  const [value, setValue] = useLocalStorage('Logarithm_value', '10');
  const [base, setBase] = useLocalStorage('Logarithm_base', 'e');
  const [equation, setEquation] = useLocalStorage('Logarithm_equation', '');
  const [solution, setSolution] = useLocalStorage('Logarithm_solution', '');
  const [result, setResult] = useLocalStorage('Logarithm_result', undefined);
  const [showResult, setShowResult] = useLocalStorage('Logarithm_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('Logarithm_showSteps', true);
  const [note, setNote] = useLocalStorage('Logarithm_note', undefined);
  const inputRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setValue(vals.a);
  }, []);

  const parsed = convertFromLatex(value);
  const logLatex = `\\log_{${convertIntoLatex(base)}}(${convertIntoLatex(
    parsed
  )})`;
  const valueInDecimals = evalInDecimals(parsed);
  const hasValue =
    !isInputInvalid(base) &&
    !isInputInvalid(value) &&
    valueInDecimals > 0 &&
    (base == 'e' || (evalInDecimals(base) > 0 && evalInDecimals(base) != 1));

  const Base = base == 'e' ? Math.E : evalInDecimals(base);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`\\LARGE{Evaluate ${logLatex}}`),
          type: 'equation',
        },
      ])
    );
  }, [value, base]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Value \\space = \\space ${logLatex}`,
          type: 'equation',
        },
      ])
    );

    if (!hasValue) return;

    const logValue = Math.log(valueInDecimals);
    const baseValue = Math.log(Base);
    const finalValue = logValue / baseValue;

    const finalAnswer = [
      {
        value: putSpace(
          `\\LARGE{The Value of ${logLatex} is = \\bold{${finalValue}}}`
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
        value: `${logLatex} = \\frac{\\ln{(${convertIntoLatex(
          parsed
        )})}}{\\ln{(${base})}} = ${finalValue}`,
        type: 'equation',
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
  }, [value, showSteps, base]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setValue('');
    setBase('');
    if (inputRef.current) inputRef.current.latex('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult]);

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
            Your input can be in the form of Positive Real Number
          </div>
          <ExpressionInput
            label={'Enter log Value:'}
            value={value}
            setValue={setValue}
            setMathfieldRef={(ref) => (inputRef.current = ref)}
            validate={(exp) => {
              return (
                !isInputInvalid(exp) &&
                evalInDecimals(convertFromLatex(exp)) > 0
              );
            }}
            labelCol="col-3"
            inputCol="col-9"
          />
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Enter Base value:</div>
            <div className="col-9">
              <Input
                placeholder="Enter a number"
                className="col-12"
                value={base}
                setVal={setBase}
                pattern={
                  /^(e|(-?\d*(\.\d*)?(\/-?\d*)?)(,\s*-?\d*(\.\d*)?(\/-?\d*)?)*)?$/
                }
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

export default Logarithm;
