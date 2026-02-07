'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import Input from '../common/input';
import { addSpace, putSpace } from '../../helpers/general';
import { getSearchParams } from '../../helpers/general';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import MathInput from 'react-math-keyboard';
import { valueToKatex } from '../../helpers/matrixHelper';
import { create, all } from 'mathjs';

import algebrite from 'algebrite';

const config = {};
const math = create(all, config);
const fact = (val) => {
  if (val <= 1) return 1;
  return val * fact(val - 1);
};
const nCr = (n, r) => {
  return fact(n) / (fact(r) * fact(n - r));
};
function seperateWithSpace(expression) {
  if (!expression) return;

  let result = expression.replaceAll(/([^\*])-/g, '$1 -');
  result = result.replace(/([^\*+])\+/g, '$1 +');

  return result;
}

const solveExp = (exp) => {
  try {
    return math.simplify(`${exp}`).toString();
  } catch {
    return '';
  }
};
const solveWithAlgbrite = (temp) => {
  try {
    return algebrite.simplify(`(${temp.replaceAll('*', ')*(')})`).toString();
  } catch {
    return '';
  }
};

const BinomialExpansion = () => {
  const [power, setPower] = useState('3');
  const [expression, setExpression] = useState('0.5x -2y^2');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [notValid, setNotValid] = useState(false);

  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) {
      let b = vals.b;
      setPower(b);
      setExpression(temp);
    }
  }, []);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: `Expand \\space  (${expression})^{${power}}`,
          type: 'equation',
        },
      ])
    );
  }, [expression, power]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Expand \\space  (${expression})^{${power}}`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !power || !expression;
    if (isInvalid) return;
    const moreThanTwo = addSpace(expression).split(' ');

    if (moreThanTwo.length > 2) setNotValid(true);
    else setNotValid(false);
    if (notValid) {
      return;
    }
    const [aValue, bValue] = addSpace(expression).split(' ');
    const kSteps = [];
    const allTerms = [];
    for (let k = 0; k <= power; k++) {
      let factorial = nCr(power, k);
      let term = solveWithAlgbrite(
        solveExp(
          `${factorial}*((${aValue})^(${power - k}))*((${bValue})^(${k}))`
        )
      );
      allTerms.push(term);
      term =
        '(' +
        term
          .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`)
          .replace(/\*/g, ')*(') +
        ')';
      let eachStep = {
        value: putSpace(
          `\\bold{K= ${k}}: \\binom{${power}}{${k}}{(${aValue})}^{(${power}-${k})}{(${bValue})}^{${k}} = \\frac{(${power})!}{(${power}-${k})!(${k})!}{(${aValue})}^{(${power}-${k})}{(${bValue})}^{${k}}= ${valueToKatex(
            term
          )}`
        ),
        type: 'equation',
      };
      kSteps.push(eachStep);
    }
    if (!allTerms.length) {
      return;
    }
    const tempAns = solveExp(allTerms.join('+')).replace(/\s+/g, '');
    const finalExpression = seperateWithSpace(tempAns)
      ?.split(' ')
      ?.map((itm, i) => {
        itm = itm.endsWith('*') ? itm.slice(0, itm.length - 1) : itm;
        let val = solveWithAlgbrite(
          itm.replace(/(\*)(-\w+\/\w+)\s+([+-])/g, '$1($2)$3')
        );
        let isMinus = false;
        if (val.indexOf('-') > -1) {
          val = val.replace('-', '');
          isMinus = true;
        }
        return (
          '{' +
          (isMinus ? '-' : i > 0 ? '+' : '') +
          val
            .replace(/\*/g, '')
            .replaceAll(/(\^)\(?(\d*\/?\.?\d*)\)?/gi, `$1{$2}`)
            .replaceAll(/(\d*)\/(\d*)/gi, `{$1\\above{1pt}$2}`) +
          '}'
        );
      })
      .join(' ');
    const finalAnswer = [
      {
        value: putSpace(
          `The expansion of (${expression})^{${power}} is ${finalExpression}`
        ),
        type: 'equation',
      },
    ];

    const equations = [
      {
        type: 'span',
        value: `<b>Answer : </b>`,
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
        value: `The expansion of a binomial term is given by the formula as`,
        type: 'span',
      },
      {
        value:
          putSpace(`({a+b})^{n} = \\sum_{k=0}^{n} \\binom{n}{k}(a)^{(n-k)}(b)^{k} where \\binom{n}{k} = \\frac{(n)!}{(n-k)!(k)!} and n! = 1.2.3....n
        `),
        type: 'equation',
      },
      {
        value: '<b>Step-1</b>',
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `On comparing we get value of a = ${aValue},b=${bValue} ,n =${power}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `Therefore (${expression})^{${power}} = \\sum_{(k = 0)}^{${power}} \\binom{${power}}{k}{(${aValue})}^{(${power}-k)}{(${bValue})}^{k}`
        ),
        type: 'equation',
      },
      { value: 'Step-2', type: 'span', className: 'text-decoration-underline' },
      'br',
      {
        value: `Now,we need to calculate the above result for every value of k from 0 to ${power}`,
        type: 'span',
      },
      ...kSteps,
      ,
      ,
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
  }, [expression, power, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setExpression('');
    setPower('2');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = !!power && !!expression && !notValid;

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
            Your input can be in the form of an Integer, FRACTION or Real Number
          </div>
          <div>
            <div className="d-flex">
              <div className="col-3 text-left d-flex">Expression: -</div>
              <div className={`col-7 ${notValid ? 'invalid' : ''}`}>
                <MathInput
                  tabShouldSkipKeys
                  allowAlphabeticKeyboard={false}
                  setValue={setExpression}
                  numericToolbarKeys={['e', 'log', 'ln']}
                  initialLatex={expression}
                />
              </div>
            </div>
            <div className="dropdown power mb-2 align-items-center d-flex">
              <div className="col-3 text-left">Power:</div>
              <div className="col-7">
                <Input
                  value={power}
                  setVal={setPower}
                  min={1}
                  max={21}
                  className="col-12"
                />
              </div>
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

export default BinomialExpansion;
