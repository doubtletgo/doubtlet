'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { getSearchParams, putSpace } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import { isInputInvalid } from '@/helpers/Validations';
import { convertFromLatex, convertIntoLatex } from '@/helpers/matrixHelper';
import Parser from '@/helpers/parser/parser';
import nerdamer from 'nerdamer-prime';
import { MdErrorOutline } from 'react-icons/md';
import { MathField } from '@/types/mathfield.types';

const generateTokens = (exp: string) => {
  const tokens = [];
  const length = exp.length;
  const expression = exp.replace(/\s+/g, '');
  let token = '';
  for (let i = 0; i < length; i++) {
    const char = expression[i];
    if (char == '+') {
      tokens.push(token);
      token = '';
    } else if (char == '-') {
      if (i == 0) {
        token += char;
        continue;
      }
      tokens.push(token);
      token = '-';
    } else {
      token += char;
    }
  }
  tokens.push(token);
  if (tokens.length == 1) {
    tokens.push('0');
  }
  return tokens;
};

const FoilMethod = () => {
  const [expression, setExpression] = useLocalStorage('FoilMethod_expression', '\\frac{2}{3}z^2-1');
  const [expressionTwo, setExpressionTwo] = useLocalStorage('FoilMethod_expressionTwo', '-5xy-\\frac{7}{4}');
  const [equation, setEquation] = useLocalStorage('FoilMethod_equation', '');
  const [solution, setSolution] = useLocalStorage('FoilMethod_solution', '');
  const [answer, setAnswer] = useLocalStorage('FoilMethod_answer', undefined);
  const [showResult, setShowResult] = useLocalStorage('FoilMethod_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('FoilMethod_showSteps', true);
  const [note, setNote] = useLocalStorage('FoilMethod_note', undefined);
  const [isAInvalid, setIsAInvalid] = useLocalStorage('FoilMethod_isAInvalid', false);
  const [isBInvalid, setIsBInvalid] = useLocalStorage('FoilMethod_isBInvalid', false);

  const inputRef1 = useRef<MathField>(null);
  const inputRef2 = useRef<MathField>(null);

  useEffect(() => {
    const vals: Record<string, string> = getSearchParams(false);
    if (vals.a) setExpression(vals.a);
  }, []);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(
            `Expand the product (${expression})(${expressionTwo}) using the FOIL Method.`
          ),
          type: 'equation',
        },
      ])
    );
  }, [expression, expressionTwo]);

  useEffect(() => {
    const isInvalid =
      isInputInvalid(expression) || isInputInvalid(expressionTwo);

    if (isInputInvalid(expression)) setIsAInvalid(true);
    if (isInputInvalid(expressionTwo)) setIsBInvalid(true);

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Given Equation : ${expression}`),
          type: 'equation',
        },
        {
          value: putSpace(`Given Equation 2 : ${expressionTwo}`),
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;
    setIsAInvalid(false);
    setIsBInvalid(false);

    const parsedExpression = convertFromLatex(expression);
    const allTokens1 = generateTokens(parsedExpression);

    const parsed2 = convertFromLatex(expressionTwo);

    const allTokens2 = generateTokens(parsed2);

    if (allTokens1.length !== 2) {
      setIsAInvalid(true);
    } else setIsAInvalid(false);

    if (allTokens2.length !== 2) {
      setIsBInvalid(true);
    } else setIsBInvalid(false);

    const vars = {
      var1: '',
      const1: '',
      var2: '',
      const2: '',
    };
    allTokens1.forEach((tkn) => {
      if (!/[a-zA-z]/.test(tkn)) {
        vars['var1'] = tkn;
      } else {
        vars['const1'] = tkn;
      }
    });

    allTokens2.forEach((tkn) => {
      if (!/[a-zA-z]/.test(tkn)) {
        vars['var2'] = tkn;
      } else {
        vars['const2'] = tkn;
      }
    });

    const multiplications = {
      first: nerdamer(vars.const1).multiply(vars.const2).toString(),
      outer: nerdamer(vars.const1).multiply(vars.var2).toString(),
      inner: nerdamer(vars.var1).multiply(vars.const2).toString(),
      last: nerdamer(vars.var1).multiply(vars.var2).toString(),
    };

    const final = new Parser(
      `(${expression}) *(${expressionTwo})`
    ).toSimplified();

    const finalAnswer = [
      {
        value: putSpace(`The roots of the equation are`),
        type: 'equation',
      },
      {
        value: putSpace(
          convertIntoLatex(final, false).replaceAll('\\cdot', '')
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
    setAnswer(eqRender);
    if (!showSteps) return;

    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      {
        value: `FOIL stand for: First Outer Inner Last`,
        type: 'span',
      },
      'br',
      {
        value: `First: Multiply the first terms of each binomial.`,
        type: 'span',
      },
      'br',
      {
        value: `Outer: Multiply the outer terms.`,
        type: 'span',
      },
      'br',
      {
        value: `Inner: Multiply the inner terms.`,
        type: 'span',
      },
      'br',
      {
        value: `Last: Multiply the last terms of each binomial.`,
        type: 'span',
      },
      'br',
      {
        value: 'Step-1',
        type: 'span',
        className: 'h6 text-decoration-underline text-black',
      },
      {
        value: putSpace(
          `Given Product: (\\textcolor{red}{(${convertIntoLatex(
            vars.const1,
            false
          )})} + \\textcolor{purple}{(${convertIntoLatex(
            vars.var1,
            false
          )})})(\\textcolor{green}{(${convertIntoLatex(
            vars.const2,
            false
          )})} + \\textcolor{blue}{(${convertIntoLatex(vars.var2, false)})})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `First : \\textcolor{red}{(${convertIntoLatex(
            vars.const1,
            false
          )})}\\textcolor{green}{(${convertIntoLatex(
            vars.const2,
            false
          )})} = ${convertIntoLatex(multiplications.first, false).replaceAll(
            '\\cdot',
            ''
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Outer : \\textcolor{red}{(${convertIntoLatex(
            vars.const1,
            false
          )})} \\textcolor{blue}{(${convertIntoLatex(
            vars.var2,
            false
          )})} = ${convertIntoLatex(multiplications.outer, false).replaceAll(
            '\\cdot',
            ''
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Inner : \\textcolor{purple}{(${convertIntoLatex(
            vars.var1,
            false
          )})} \\textcolor{green}{(${convertIntoLatex(
            vars.const2,
            false
          )})} = ${convertIntoLatex(multiplications.inner, false).replaceAll(
            '\\cdot',
            ''
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Last : \\textcolor{purple}{(${convertIntoLatex(
            vars.var1,
            false
          )})} \\textcolor{blue}{(${convertIntoLatex(
            vars.var2,
            false
          )})} = ${convertIntoLatex(multiplications.last, false).replaceAll(
            '\\cdot',
            ''
          )}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Now combining all terms`),
        type: 'equation',
      },
      {
        value: putSpace(
          `Product : ${convertIntoLatex(final, false).replaceAll('\\cdot', '')}`
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

    const solution = renderSteps(steps);

    setSolution(solution);
  }, [expression, showSteps, expressionTwo]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression(``);
    if (inputRef1) inputRef1.current.latex('');
    if (inputRef2) inputRef2.current.latex('');
    setExpressionTwo(``);
    setShowResult(false);
  }, [setShowResult]);

  const hasValue =
    !!expression &&
    !/^(.*[+\-*^])?$/.test(expression) &&
    !/^(.*[+\-*^])?$/.test(expressionTwo) &&
    !isAInvalid &&
    !isBInvalid;

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mt-23 ">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in the form of Integer,FRACTION or Real Number
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-3 text-left">Enter First Expression</div>
            <div className={`col-8 position-relative`}>
              <MathInput
                setValue={setExpression}
                numericToolbarKeys={[]}
                setMathfieldRef={(ref: MathField) => (inputRef1.current = ref)}
                allowAlphabeticKeyboard={false}
                initialLatex={expression}
                style={{
                  border: isAInvalid ? `2px solid #dc3545` : `0.5px solid blue`,
                  borderRadius: '6px',
                }}
              />
              {isAInvalid && (
                <div
                  style={{
                    position: 'absolute',
                    right: '5%',
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MdErrorOutline size={'1.5rem'} color="#dc3545" />
                </div>
              )}
            </div>
          </div>
          <div className="dropdown row mb-2 d-flex">
            <div className="col-3 text-left">Enter Second Expression</div>
            <div className={`col-8 position-relative`}>
              <MathInput
                setValue={setExpressionTwo}
                numericToolbarKeys={[]}
                setMathfieldRef={(ref: MathField) => (inputRef2.current = ref)}
                allowAlphabeticKeyboard={false}
                initialLatex={expressionTwo}
                style={{
                  border: isBInvalid ? `2px solid #dc3545` : `0.5px solid blue`,
                  borderRadius: '6px',
                }}
              />
              {isBInvalid && (
                <div
                  style={{
                    position: 'absolute',
                    right: '5%',
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MdErrorOutline size={'1.5rem'} color="#dc3545" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Equation equation={equation} className="border-primary" />
      <hr />{' '}
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
            <Equation equation={answer} className="mt-3" />
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

export default FoilMethod;
