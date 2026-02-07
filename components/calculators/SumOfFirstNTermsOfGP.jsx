'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  valueToKatex,
  katexSimplifiedValue,
  showVal,
} from '../../helpers/matrixHelper';

const SumOfFirstNTermsOfGP = () => {
  const [a, setA] = useState('1');
  const [r, setR] = useState('2');
  const [n, setN] = useState('18');
  const isInvalid = useRef();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.x1) setA(vals.x1);
    if (vals.y1) setN(vals.y1);
    if (vals.x2) setR(vals.x2);
  }, []);

  useEffect(() => {
    setIsPointSame(a == r && ((a == n) == r) == a);
    if (isPointSame) {
      setShowResult(false);
      setShowSteps(false);
    }
    isInvalid.current = [a, r, n].some((x) => !x);
    const tempA = katexSimplifiedValue(a);
    const tempR = katexSimplifiedValue(r);
    const tempN = katexSimplifiedValue(n);
    const aValue = evalExpression(tempA);
    const rValue = evalExpression(tempR);
    const nValue = evalExpression(tempN);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          First Term a = \\bold{${a || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Common Ratio r = \\bold{${r || '0'}}`),
          type: 'equation',
        },
        {
          value: putSpace(`
          Number Of Terms n = \\bold{${n || '0'}}`),
          type: 'equation',
        },
      ])
    );
    if (isInvalid.current) return;

    let power = evalExpression(`${rValue}^${nValue}`);
    let subtractDino = evalExpression(`${rValue} - 1`);
    let subtractNum = evalExpression(`${power} - 1`);
    let divide = evalExpression(`${subtractNum} / ${subtractDino}`);
    let multiple = evalExpression(`${aValue} * ${divide}`);
    const res = evalExpression(
      `(${aValue} * (${rValue}^${nValue} - 1)) / (${rValue} - 1)`
    );

    const finalAnswer = [
      {
        type: 'equation',
        value: putSpace(
          `The \\bold {Sum} of first \\bold{${n}  Terms (S_{${n}}}) of above given \\bold{Geometric sequence}`
        ),
      },
      {
        value: putSpace(
          `is  \\bold{{${valueToKatex(res)}}  or  ${evalInDecimals(res)} .}`
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
          'We know that \\bold {Sum of first n terms (S_n)} in \\bold{Geometric sequence}'
        ),
        type: 'equation',
      },
      {
        value: putSpace('is represented'),
        type: 'equation',
      },
      {
        value: putSpace(
          `by the following formula  \\bold{S_n = \\bigg\\lbrace a{(r^n-1)\\above{1pt} (r-1)}\\bigg\\rbrace}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `where \\bold a is the \\bold{First term} and \\bold{r} is the \\bold{Common Ratio}. `
        ),
        type: 'equation',
      },
      {
        value: putSpace(`From the above input is given that`),
        type: 'equation',
      },
      {
        value: ` a = \\bold{${showVal(a, aValue)}}`,
        type: 'equation',
      },
      {
        value: `r = \\bold{${showVal(r, rValue)}}`,
        type: 'equation',
      },
      {
        value: `n = \\bold{${showVal(n, nValue)}}`,
        type: 'equation',
      },
      {
        value: putSpace(`After putting the values in the formula`),
        type: 'equation',
      },
      {
        value: putSpace(
          `S_{{${n}}} = {${a}}{({${r}}^{{${n}}}-1)\\above{1pt} ({${r}}-1)}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`After Solving`),
        type: `equation`,
      },
      {
        value: putSpace(
          `S_{{${n}}} = {${a}}{({${valueToKatex(
            power
          )}}-1)\\above{1pt}({${r}}-1)}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          `S_{{${n}}} = {${a}}{{${valueToKatex(
            subtractNum
          )}}\\above{1pt}{${valueToKatex(subtractDino)}}}`
        ),
        type: `equation`,
      },
      {
        value: putSpace(`S_{{${n}}} = {${a}}*{${valueToKatex(divide)}}`),
        type: `equation`,
      },
      {
        value: putSpace(`S_{{${n}}} = \\bold{{${valueToKatex(multiple)}}}`),
        type: `equation`,
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
  }, [a, r, n, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setA('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    setR('');
    setN('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [a, r, n].some((v) => !!v || v == 0);
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
              <MathInput
                setMathfieldRef={(ref) => (mf3.current = ref)}
                setValue={setN}
                allowAlphabeticKeyboard={false}
                initialLatex={n}
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

export default SumOfFirstNTermsOfGP;
