'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import Input from '../common/input';
import { Equation } from '../Equation';
import { abs, parseNumber } from '../../helpers/decimal';
import { getSearchParams } from '../../helpers/general';

const FractionReduction = () => {
  const [l, setL] = useState('2/4');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();

  let [p, q] = l.split('/');
  useEffect(() => {
    const vals = getSearchParams(false);
    if (vals.a) setL(vals.a);
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
          value: `Reduce \\space the \\space fractional \\space number \\space {${parseNumber(
            p || 'p'
          )} \\above{1pt} ${parseNumber(
            q || 'q'
          )}} \\space to \\space its \\space lowest \\space form.`,
          type: 'equation',
        },
      ])
    );
  }, [l, p, q]);

  useEffect(() => {
    const isInvalid = [p, q].some((x) => isNaN(x));

    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: `span`,
        },
        'br',
        {
          value: `Fraction : {${parseNumber(
            p || 'p'
          )} \\above{1pt} ${parseNumber(q || 'q')}}`,
          type: 'equation',
        },
      ])
    );

    if (isInvalid) return;

    //calculation for prime factorisation
    const arr = l.split('/');
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

    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const answer = arr.reduce(gcd);

    //prime factors of p
    const factorOfP = factor(p);

    //prime factors of q
    const factorOfQ = factor(q);

    //final result
    function fraction(numR, denumR) {
      let max = abs(numR) > abs(denumR) ? numR : denumR;
      for (let i = abs(max); i >= 2; i--) {
        if (numR % i == 0 && denumR % i == 0) {
          numR = numR / i;
          denumR = denumR / i;

          return { numR, denumR };
        }
      }
      return { numR, denumR };
    }
    let Result;
    if (p === q) {
      Result = { numR: 1, denumR: 1 };
    } else {
      Result = fraction(p, q);
    }

    const { numR, denumR } = Result;

    //condition to put the minus sign
    const numRIntoDenumR = numR * denumR > 0;
    //condition to check  the denominator is 1
    const DenominatorOne = denumR === '1';

    const finalAnswer = [
      {
        value: `The \\space lowest \\space form \\space of \\space the \\space fractional \\space number \\space 
        {${parseNumber(p)} \\above{1pt} ${parseNumber(q)}}\\space is \\space ${
          DenominatorOne
            ? `\\bold{${numR}}`
            : `${
                p === q
                  ? `\\bold{${numR}}`
                  : `${
                      numRIntoDenumR
                        ? `\\bold{{${abs(numR)} \\above{1pt} ${abs(denumR)}}}`
                        : `\\bold{{${numR} \\above{1pt} ${denumR}}}`
                    }`
              }`
        }`,
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
        value: `A \\space fraction \\space is \\space always \\space represented \\space in \\space the \\space 
        form \\space of \\space {p \\above{1pt} q} \\space where \\space p \\space and \\space q`,
        type: 'equation',
      },
      {
        value: `are \\space integers \\space and \\space q \\not = 0`,
        type: 'equation',
      },
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: `Given \\space fraction = {${parseNumber(
          p
        )} \\above{1pt} ${parseNumber(q)}}`,
        type: 'equation',
      },
      {
        value: `Now we have to find the Highest common factor of the numerator & denominator.`,
        type: 'span',
      },
      'br',
      {
        value: `HCF of (${parseNumber(p)}, ${parseNumber(q)}) = ${answer}`,
        type: 'span',
      },
      {
        value: `<a href="/calculator/hcf-calculator/?a=${l
          .split('/')
          .join(',')}" target="_blank">to see Steps click here</a>`,
        type: 'h6',
      },
      {
        value: `Now we have to cancel out Highest common factor i.e., ${answer}`,
        type: 'span',
      },
      'br',
      {
        value: `from the factors of numerator and denominator.`,
        type: 'span',
      },
      'br',
      {
        value: `${parseNumber(p)} = ${factorOfP}`,
        type: 'span',
      },
      'br',
      {
        value: `${parseNumber(q)} = ${factorOfQ}`,
        type: 'span',
      },
      'br',
      {
        value: `Then,`,
        type: 'span',
      },
      {
        value: `{${parseNumber(p)} \\above{1pt} ${parseNumber(
          q
        )}} = {${factorOfP} \\above{1pt} ${factorOfQ}} = ${
          DenominatorOne
            ? `${numR}`
            : `${
                p === q
                  ? `\\bold{${numR}}`
                  : `${
                      numRIntoDenumR
                        ? `\\bold{{${abs(numR)} \\above{1pt} ${abs(denumR)}}}`
                        : `\\bold{{${numR} \\above{1pt} ${denumR}}}`
                    }`
              }`
        }`,
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
  }, [l, p, q, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setL('');
    setShowResult(false);
  }, [setShowResult]);

  const hasValue = [p, q].some((v) => (!!v && !isNaN(v)) || v === 0);
  const hasAllValue = [p, q].every((v) => (!!v && !isNaN(v)) || v === 0);

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
            <div className="col-3 text-left">Fraction:-</div>
            <div className="col-9">
              <Input
                placeholder="Input values as p/q"
                autoComplete="off"
                className="col-12"
                value={l}
                setVal={setL}
                pattern={/^(-?(\d)*)(\/-?(\d)*)?$/}
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
          <Link href="/contact">
            <button className="btn default-btn px-5 mt-2 rounded-pill btn-blue">
              Suggestion
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default FractionReduction;
