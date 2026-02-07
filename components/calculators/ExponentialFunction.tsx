'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  convertFromLatex,
  convertIntoLatex,
  evalInDecimals,
  evalToDecimals,
} from '@/helpers/matrixHelper';
import ExpressionInput from '../expression-input';
import { isInputInvalid } from '@/helpers/Validations';
import { MathField } from '@/types/mathfield.types';

const ExponentialFunction = () => {
  const [value, setValue] = useState('e');
  const [exponent, setExponent] = useState('\\sqrt{2}');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const valueRef = useRef<MathField>(null);
  const baseRef = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setValue(vals.a);
  }, []);

  const parsedValue = convertFromLatex(value);
  const parsedExponent = convertFromLatex(exponent);
  const exponentLatex = `{(${convertIntoLatex(
    convertFromLatex(value),
    value != '\\pi'
  )})}^{${convertIntoLatex(convertFromLatex(exponent), exponent != '\\pi')}}`;

  const valueInDecimals = evalInDecimals(parsedValue);
  const exponentInDecimals = evalInDecimals(parsedExponent);
  const valueExists =
    !isInputInvalid(value) && valueInDecimals !== '' && !isNaN(valueInDecimals);
  const exponentExists =
    !isInputInvalid(exponent) &&
    exponentInDecimals !== '' &&
    !isNaN(exponentInDecimals);
  const hasValue = valueExists && exponentExists;

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`\\LARGE{Evaluate:  ${exponentLatex}}`),
          type: 'equation',
        },
      ])
    );
  }, [exponentLatex, exponent]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Value \\space = \\space ${exponentLatex}`,
          type: 'equation',
        },
      ])
    );

    if (!hasValue) return;

    const isInDeterminant = valueInDecimals == 0 && exponentInDecimals == 0;
    const finalValue = isInDeterminant
      ? 'It’s an indeterminant form'
      : evalToDecimals(`(${parsedValue})^(${parsedExponent})`, 15);

    const finalAnswer = [
      {
        value: putSpace(` \\LARGE{${exponentLatex}  = \\bold{${finalValue}}}`),
        type: 'equation',
      },
    ];
    const equations = [
      {
        type: 'span',
        value: `<b>Final Answer:</b>`,
      },
      'br',
      ...finalAnswer,
    ];

    const eqRender = renderSteps(equations);
    setResult(eqRender);

    if (!showSteps) return;
    const solution = renderSteps(equations);

    setSolution(solution);
  }, [exponentLatex, valueInDecimals, showSteps, exponent]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setValue('');
    setExponent('');
    if (valueRef.current) valueRef.current.latex('');
    if (baseRef.current) baseRef.current.latex('');
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
            Your input can be in the form of any Real Number
          </div>
          <ExpressionInput
            label={'Base Value:'}
            value={value}
            setValue={setValue}
            setMathfieldRef={(ref) => (valueRef.current = ref)}
            validate={() => valueExists}
            numericToolbarKeys={['pi', 'e']}
            labelCol="col-3"
            inputCol="col-9"
          />
          <ExpressionInput
            label={'Exponent Value:'}
            value={exponent}
            setValue={setExponent}
            setMathfieldRef={(ref) => (baseRef.current = ref)}
            validate={() => exponentExists}
            numericToolbarKeys={['pi', 'e']}
            labelCol="col-3"
            inputCol="col-9"
          />
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

export default ExponentialFunction;
