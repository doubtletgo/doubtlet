'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  convertIntoLatex,
  evalToDecimals,
} from '../../helpers/matrixHelper';
import { convertFromLaTeX } from 'nerdamer-prime';
import { MathField } from '@/types/mathfield.types';
import { isInputInvalid } from '@/helpers/Validations';

const ConvertRadianToDegree = () => {
  const [a, setA] = useState('\\frac{4\\pi}{6}');

  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const mf1 = useRef<MathField>(null);

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams() as { x1: string };
    if (vals.x1) setA(vals.x1);
  }, []);
  const hasValue = !isInputInvalid(a);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Convert ${a || '1'} radian to degree.`),
          type: 'equation',
        },
      ])
    );
  }, [a]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Angle (θ): \\bold{${a || '1'}}`),
          type: 'equation',
        },
      ])
    );
    if (!hasValue) return;
    const parsedAngle = convertFromLaTeX(a);
    const aValue = evalExpression(parsedAngle.toString());
    const inDegrees = evalExpression(`(${aValue} * 180)/pi`);
    const inDecimals = evalToDecimals(inDegrees);
    const isSame = inDecimals == inDegrees;
    const finalAnswer = [
      {
        value: putSpace(
          `\\large{{${convertIntoLatex(aValue).replaceAll(
            '\\cdot',
            ''
          )}} radian is equal to \\bold{${convertIntoLatex(
            inDegrees
          )}} degrees} ${isSame ? '' : ` or \\bold{${inDecimals}} degrees`}`
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
      'br',
      {
        value: putSpace(`The angle between two lines is measured `),
        type: 'equation',
      },
      {
        value: putSpace(`either in degrees or radians.`),
        type: 'equation',
      },
      {
        value: putSpace(
          `To convert radians into degree, multiply the value by \\frac{180}{\\pi}`
        ),
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      {
        value: putSpace(`From the above input it is given that `),
        type: 'equation',
      },
      {
        value: putSpace(`Given angle = \\bold{${a}}`),
        type: 'equation',
      },
      {
        value: putSpace(
          `{${convertIntoLatex(aValue).replaceAll(
            '\\cdot',
            ''
          )}} radian = ({${convertIntoLatex(aValue).replaceAll(
            '\\cdot',
            ''
          )}})(\\frac{180}{\\pi}) degrees`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`= {${convertIntoLatex(inDegrees)}} degrees`),
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
    if (mf1.current) mf1.current?.latex('');

    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

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
            Your input can be in form of positive real numbers
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3 text-left">Angle (θ):</div>
            <div className="col-9">
              <MathInput
                setMathfieldRef={(ref) => (mf1.current = ref)}
                setValue={setA}
                allowAlphabeticKeyboard={false}
                initialLatex={a}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',
                  // "infty",
                  // "theta",
                  'sin',
                  'cos',
                  'tan',
                ]}
              />{' '}
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      {/* <hr /> */}
      <div className="mt-3 mb-1">
        <Equation equation={note} />{' '}
      </div>{' '}
      {hasValue && (
        <button
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-3"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-3"
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

export default ConvertRadianToDegree;
