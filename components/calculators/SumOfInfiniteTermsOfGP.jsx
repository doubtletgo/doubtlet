'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import Input from '../common/input';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
} from '../../helpers/matrixHelper';

const SumOfInfinteTermsOfGP = () => {
  const [a, setA] = useState('1');
  const [r, setR] = useState('\\sqrt{9}');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const mf1 = useRef();
  const mf2 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.y1) setN(vals.y1);
    if (vals.x2) setR(vals.x2);
  }, []);

  useEffect(() => {
    setIsPointSame(a == r && r == a);
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    isInvalid.current = [a, r].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempR = katexSimplifiedValue(r);
    const aValue = evalExpression(tempA);
    const rValue = evalExpression(tempR);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`First Term a = \\bold{${parseNumber(a) || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(
            `Common Ratio r = \\bold{${
              parseNumber(r) || '0'
            }} (should be from -1 to 1)`
          ),
          type: 'equation',
        },
        {
          value: putSpace(`Number Of Terms n = \\bold{∞}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let res = evalExpression(` ${aValue} / (1 - ${rValue})`);
    let denominator = evalExpression(`1 - ${rValue}`);

    const finalAnswer = [
      {
        value: putSpace(
          `The \\bold{Sum} of \\bold{infinite Terms S_{∞}} of above given \\bold{Geometric sequence}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is   \\bold{${
            Number.isInteger(res)
              ? res
              : `{{${a}}\\above{1pt}{${valueToKatex(
                  denominator
                )}}}  or  ${evalInDecimals(denominator)}`
          }.}`
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
        value: putSpace(
          `We know that \\bold{Sum of Infinite terms} (S_∞) of the \\bold{Geometric}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{sequence} is represented by`),
        type: 'equation',
      },
      {
        value: putSpace(
          `the following formula \\bold {S_∞ = {a\\above{1pt}{(r-1)} }}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where \\bold{a} is the \\bold{First Term} and  r is the \\bold{Common Ratio}.`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input it is is given that`),
        type: 'equation',
      },
      {
        value: putSpace(`a = \\bold{${showVal(a, aValue)}}`),
        type: 'equation',
      },

      {
        value: putSpace(`r = \\bold{${showVal(r, rValue)}}`),
        type: 'equation',
      },
      {
        value: putSpace(`n = Infinite(\\bold{∞})`),
        type: 'equation',
      },
      {
        value: putSpace(`After putting the values in the formula`),
        type: 'equation',
      },
      {
        value: putSpace(`S_∞ = {{${a}}\\above{1pt}1-{${r}}}`),
        type: 'equation',
      },
      {
        value: `After Solving`,
        type: 'span',
      },
      {
        value: putSpace(
          `S_∞ = {{${a}}\\above{1pt}{${valueToKatex(denominator)}}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`S_∞ = \\bold{{${valueToKatex(res)}}}`),
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
  }, [a, r, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    if (mf1.current) mf1?.current.latex('');
    if (mf2.current) mf2?.current.latex('');
    setR('');
    setA('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, r].some((v) => !!v || v == 0);
  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of FRACTION, Real Number or any Variable
          </div>

          <div className="row mb-3 align-items-center">
            <div className="col-3">
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

                  'sin',
                  'cos',
                  'tan',
                ]}
              />{' '}
            </div>
            <div className="col-3">
              <MathInput
                setMathfieldRef={(ref) => (mf2.current = ref)}
                setValue={setR}
                allowAlphabeticKeyboard={false}
                initialLatex={r}
                numericToolbarKeys={[
                  'epower',
                  'pi',
                  'ln',
                  'log',
                  'dot',

                  'sin',
                  'cos',
                  'tan',
                ]}
              />
              {''}
            </div>
            <div className="col-3">
              <Input
                placeholder="Infinite(∞)"
                autoComplete="off"
                disabled={true}
                className="col-12"
              />
            </div>
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <div className="mt-3 mb-1"></div>{' '}
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

export default SumOfInfinteTermsOfGP;
