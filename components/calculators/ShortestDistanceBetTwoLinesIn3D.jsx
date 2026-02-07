'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import {
  addSymbol,
  minusSymbol,
  numberWithAlternate,
} from '../../helpers/decimal';
import { getSearchParams, putSpace } from '../../helpers/general';
import {
  evalExpression,
  evalInDecimals,
  removeSymbol,
  valueToKatex,
  showVal,
  katexSimplifiedValue,
} from '../../helpers/matrixHelper';
import { solveWithLeastRoots } from '../../helpers/SolveRoot';

const ShortestDistanceBetTwoLinesIn3D = () => {
  const [l, setL] = useState('\\sqrt{3}');
  const [m, setM] = useState('2');
  const [n, setN] = useState('4');
  const [a, setA] = useState('1');
  const [b, setB] = useState('\\pi');
  const [c, setC] = useState('7');
  const [p, setP] = useState('\\sqrt{8}');
  const [q, setQ] = useState('12');
  const [r, setR] = useState('9');
  const [d, setD] = useState('2');
  const [e, setE] = useState('1');
  const [f, setF] = useState('8');
  const [result, setResult] = useState();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPointSame, setIsPointSame] = useState(false);
  const [note, setNote] = useState();
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();
  const mf5 = useRef();
  const mf6 = useRef();
  const mf7 = useRef();
  const mf8 = useRef();
  const mf9 = useRef();
  const mf10 = useRef();
  const mf11 = useRef();
  const mf12 = useRef();
  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();

    if (vals.a) setA(vals.a);
    if (vals.b) setB(vals.b);
    if (vals.c) setC(vals.c);
    if (vals.d) setD(vals.d);
    if (vals.e) setE(vals.e);
    if (vals.f) setF(vals.f);
    if (vals.l) setL(vals.l);
    if (vals.m) setM(vals.m);
    if (vals.n) setN(vals.n);
    if (vals.p) setP(vals.p);
    if (vals.q) setQ(vals.q);
    if (vals.r) setR(vals.r);
    if (vals.s) setS(vals.s);
  }, []);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },

        {
          value: `Find the Shortest Distance between`,
          type: 'span',
        },
        {
          value: `Line \\space L_1: {x ${minusSymbol(
            l || 0
          )} ${numberWithAlternate(
            removeSymbol(l),
            'l'
          )} \\above{1pt} ${numberWithAlternate(a, 'a')}} = \\ {y ${minusSymbol(
            m || 0
          )} ${numberWithAlternate(
            removeSymbol(m),
            'm'
          )} \\above{1pt} ${numberWithAlternate(b, 'b')}}=\\ {z ${minusSymbol(
            n || 0
          )} ${numberWithAlternate(
            removeSymbol(n),
            'n'
          )} \\above{1pt} ${numberWithAlternate(c, 'c')}}`,
          type: `equation`,
          type: 'equation',
        },
        {
          value: `\\&`,
          type: `equation`,
        },
        {
          value: `Line\\space L_2: {x ${minusSymbol(
            p || 0
          )} ${numberWithAlternate(
            removeSymbol(p),
            'p'
          )} \\above{1pt} ${numberWithAlternate(d, 'd')}}  =
          {y ${minusSymbol(q || 0)} ${numberWithAlternate(
            removeSymbol(q),
            'q'
          )} \\above{1pt} ${numberWithAlternate(e, 'e')}}=
          {z ${minusSymbol(r || 0)} ${numberWithAlternate(
            removeSymbol(r),
            'r'
          )} \\above{1pt} ${numberWithAlternate(f, 'f')}}`,
          type: 'equation',
        },
      ])
    );
  }, [l, m, n, , p, q, r, a, b, c, d, e, f]);

  useEffect(() => {
    const isInvalid = [l, m, n, , p, q, r, a, b, c, d, e, f].some((x) => !x);
    setIsPointSame(l == p && m == q && n == r);
    const tempA = katexSimplifiedValue(a);
    const tempB = katexSimplifiedValue(b);
    const tempC = katexSimplifiedValue(c);
    const tempD = katexSimplifiedValue(d);
    const tempE = katexSimplifiedValue(e);
    const tempF = katexSimplifiedValue(f);

    const tempL = katexSimplifiedValue(l);
    const tempM = katexSimplifiedValue(m);
    const tempN = katexSimplifiedValue(n);
    const tempP = katexSimplifiedValue(p);
    const tempQ = katexSimplifiedValue(q);
    const tempR = katexSimplifiedValue(r);

    const aValue = evalExpression(tempA);
    const bValue = evalExpression(tempB);
    const cValue = evalExpression(tempC);
    const dValue = evalExpression(tempD);
    const eValue = evalExpression(tempE);
    const fValue = evalExpression(tempF);

    const lValue = evalExpression(tempL);
    const mValue = evalExpression(tempM);
    const nValue = evalExpression(tempN);
    const pValue = evalExpression(tempP);
    const qValue = evalExpression(tempQ);
    const rValue = evalExpression(tempR);

    if (isInvalid) {
      setShowSteps(false);
      setShowResult(false);
    }
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: `Line \\space L_1: \\ {x ${minusSymbol(
            evalInDecimals(lValue || 0)
          )} ${numberWithAlternate(
            removeSymbol(l),
            'l'
          )} \\above{1pt} ${numberWithAlternate(a, 'a')}} = \\ {y ${minusSymbol(
            evalInDecimals(mValue || 0)
          )} ${numberWithAlternate(
            removeSymbol(m),
            'm'
          )} \\above{1pt} ${numberWithAlternate(b, 'b')}}=\\ {z ${minusSymbol(
            evalInDecimals(nValue || 0)
          )} ${numberWithAlternate(
            removeSymbol(n),
            'n'
          )} \\above{1pt} ${numberWithAlternate(c, 'c')}}`,
          type: `equation`,
        },
        {
          value: `Line\\space L_2: {x ${minusSymbol(
            evalInDecimals(pValue || 0)
          )} ${numberWithAlternate(
            removeSymbol(p),
            'p'
          )} \\above{1pt} ${numberWithAlternate(d, 'd')}}  =
          {y ${minusSymbol(evalInDecimals(qValue || 0))} ${numberWithAlternate(
            removeSymbol(q),
            'q'
          )} \\above{1pt} ${numberWithAlternate(e, 'e')}} =
          {z ${minusSymbol(evalInDecimals(rValue || 0))} ${numberWithAlternate(
            removeSymbol(r),
            'r'
          )} \\above{1pt} ${numberWithAlternate(f, 'f')}}`,
          type: 'equation',
        },
      ])
    );
    //numerator solutions
    const pSubL = evalExpression(`${pValue} - (${lValue})`);
    const qSubM = evalExpression(`${qValue} - (${mValue})`);
    const rSubN = evalExpression(`${rValue} - (${nValue})`);
    //denominator solutions
    const aIntoE = evalExpression(`${aValue} * ${eValue}`);
    const bIntoD = evalExpression(`${bValue} * ${dValue}`);
    const bIntoF = evalExpression(`${bValue} *${fValue}`);
    const cIntoE = evalExpression(`${cValue} *${eValue}`);
    const aIntoF = evalExpression(`${aValue} *${fValue}`);
    const cIntoD = evalExpression(`${cValue} * ${dValue}`);
    const aIntoESubBIntoD = evalExpression(`${aIntoE} - ${bIntoD}`);
    const bIntofSubCIntoE = evalExpression(`${bIntoF} - ${cIntoE}`);
    const aIntofSubCIntoD = evalExpression(`${aIntoF} -${cIntoD}`);
    const aIntoESubBIntoDsqrt = evalExpression(
      `${aIntoESubBIntoD} * ${aIntoESubBIntoD}`
    );
    const bIntofSubCIntoEsqrt = evalExpression(
      `${bIntofSubCIntoE} * ${bIntofSubCIntoE}`
    );
    const aIntofSubCIntoDsqrt = evalExpression(
      `${aIntofSubCIntoD} * ${aIntofSubCIntoD}`
    );
    const addDenominator = evalExpression(
      `${aIntoESubBIntoDsqrt} +${bIntofSubCIntoEsqrt}+ ${aIntofSubCIntoDsqrt}`
    );
    const addDenomFinal = solveWithLeastRoots(addDenominator);
    const bothSame = addDenomFinal == addDenominator;
    const squareRootOfAddDenominator = ` sqrt(${addDenominator})`;

    const pSubLIntoBIntofSubCIntoE = evalExpression(
      `${pSubL} * (${bIntofSubCIntoE})`
    );
    const qSubMIntoAIntofSubCIntoD = evalExpression(
      `${qSubM}* (${aIntofSubCIntoD})`
    );
    const rSubNIntoAIntoESubBIntoD = evalExpression(
      `${rSubN} *(${aIntoESubBIntoD})`
    );
    const addNumerator = evalExpression(
      `(${pSubLIntoBIntofSubCIntoE})-(${qSubMIntoAIntofSubCIntoD})+(${rSubNIntoAIntoESubBIntoD})`
    );

    const result = evalExpression(
      `${addNumerator} /(${squareRootOfAddDenominator})`
    );
    const finalAnswer = [
      {
        value: `Find the Shortest Distance between`,
        type: 'span',
      },
      {
        value: `Line \\space L_1: \\ {x ${minusSymbol(
          l || 0
        )} ${numberWithAlternate(
          removeSymbol(l),
          'l'
        )} \\above{1pt} ${numberWithAlternate(a, 'a')}} = \\ {y ${minusSymbol(
          m || 0
        )} ${numberWithAlternate(
          removeSymbol(m),
          'm'
        )} \\above{1pt} ${numberWithAlternate(b, 'b')}} = \\ {z ${minusSymbol(
          n || 0
        )} ${numberWithAlternate(
          removeSymbol(n),
          'n'
        )} \\above{1pt} ${numberWithAlternate(c, 'c')}}`,
        type: `equation`,
      },
      {
        value: `\\&`,
        type: `equation`,
      },
      {
        value: `Line\\space L_2: {x ${minusSymbol(
          p || 0
        )} ${numberWithAlternate(
          removeSymbol(p),
          'p'
        )} \\above{1pt} ${numberWithAlternate(d, 'd')}}  =
        {y ${minusSymbol(q || 0)} ${numberWithAlternate(
          removeSymbol(q),
          'q'
        )} \\above{1pt} ${numberWithAlternate(e, 'e')}}=
        {z ${minusSymbol(r || 0)} ${numberWithAlternate(
          removeSymbol(r),
          'r'
        )} \\above{1pt} ${numberWithAlternate(f, 'f')}}`,
        type: 'equation',
      },
      {
        value: `is \\space {${valueToKatex(
          removeSymbol(addNumerator)
        )} \\above{1pt} \\sqrt{${valueToKatex(
          removeSymbol(addDenominator)
        )}} } ${
          bothSame
            ? ''
            : `=  {${valueToKatex(
                removeSymbol(addNumerator)
              )} \\above{1pt} {${removeSymbol(addDenomFinal)}} }`
        } \\space or \\space ${valueToKatex(removeSymbol(result))}`,
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
        value: `We know that the<b> Shortest Distance d</b> between `,
        type: `span`,
      },
      {
        value: `Line \\space L_1:- \\ {x - l \\above{1pt} a} = \\ {y - m \\above{1pt} b}=\\ {z - n \\above{1pt} c}`,
        type: `equation`,
        type: 'equation',
      },
      {
        value: `\\&`,
        type: `equation`,
      },
      {
        value: `Line\\space L_2:- {x - p \\above{1pt} d}  =
        {y - q \\above{1pt} e} =
        {z - r \\above{1pt} f}`,
        type: 'equation',
      },

      {
        value: ` is given by the formula given below`,
        type: `span`,
      },
      {
        value: `b =
        \\begin{vmatrix}
        {
        \\begin{vmatrix}
           p-l & q-m & r-n \\\\
           a & b & c \\\\
        d&e&f
        \\end{vmatrix}
         \\above{1pt} \\sqrt{\\large(ae-bd)^2+(bf-ce)^2+(af-cd)^2} 
        }
        
        \\end{vmatrix} `,
        type: `equation`,
      },
      {
        value: `From the above Input we know that`,
        type: `span`,
      },
      'br',
      {
        value: putSpace(
          `(l, m, n) = (\\bold{${showVal(l, lValue)}, ${showVal(
            m,
            mValue
          )}, ${showVal(n, nValue)}})`
        ),
        type: `equation`,
      },
      {
        value: putSpace(
          putSpace(
            `(a, b, c) =(\\bold{${showVal(a, aValue)},${showVal(
              b,
              bValue
            )},${showVal(c, cValue)}})`
          )
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `(p, q, r)= \\bold{(${showVal(p, pValue)}, ${showVal(
            q,
            qValue
          )}, ${showVal(r, rValue)})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          ` (d, e, f) = \\bold{(${showVal(d, dValue)}, ${showVal(
            e,
            eValue
          )}, ${showVal(f, fValue)})}`
        ),
        type: 'equation',
      },
      'br',
      {
        value: `Now by putting these value in above ginen formulae `,
        type: `span`,
      },
      {
        value: `b =
        \\begin{vmatrix}
        {
        \\begin{vmatrix}
           ${p} ${minusSymbol(evalInDecimals(lValue))} ${removeSymbol(
          l
        )} & ${q} ${minusSymbol(m)}  ${valueToKatex(
          evalInDecimals(mValue)
        )} & ${r} ${minusSymbol(n)} ${valueToKatex(evalInDecimals(nValue))} \\\\
           ${a} & ${b} & ${c} \\\\
        ${d} & ${e} & ${f}
        \\end{vmatrix}
         \\above{1pt} \\bold{\\sqrt{\\lbrace(${valueToKatex(a)})(${valueToKatex(
          e
        )})-(${valueToKatex(b)})(${valueToKatex(
          d
        )})\\rbrace^2 + \\lbrace  (${valueToKatex(b)})(${valueToKatex(
          f
        )}) -(${valueToKatex(c)})(${valueToKatex(
          e
        )})\\rbrace^2 + \\lbrace(${valueToKatex(a)})(${valueToKatex(
          f
        )})-(${valueToKatex(c)})(${valueToKatex(d)})\\rbrace^2}} 
        }
        
        \\end{vmatrix} `,
        type: `equation`,
      },
      {
        value: `b =
        \\begin{vmatrix}
        {
        \\begin{vmatrix}
           ${valueToKatex(pSubL)} & ${valueToKatex(qSubM)} & ${valueToKatex(
          rSubN
        )} \\\\
           ${valueToKatex(a)} & ${valueToKatex(b)} & ${valueToKatex(c)} \\\\
        ${valueToKatex(d)} & ${valueToKatex(e)} & ${valueToKatex(f)}
        \\end{vmatrix}
         \\above{1pt} \\bold{\\sqrt{ \\lbrace (${valueToKatex(
           aIntoE
         )})-(${valueToKatex(bIntoD)})\\rbrace^2 + \\lbrace(${valueToKatex(
          bIntoF
        )}) - (${valueToKatex(cIntoE)}) \\rbrace^2 + \\lbrace(${valueToKatex(
          aIntoF
        )}) - (${valueToKatex(cIntoD)})\\rbrace^2}} 
        }
        
        \\end{vmatrix} `,
        type: `equation`,
      },
      {
        value: `b =
        \\begin{vmatrix}
        {
        \\begin{vmatrix}
           ${valueToKatex(pSubL)} & ${valueToKatex(qSubM)} & ${valueToKatex(
          rSubN
        )} \\\\
           ${valueToKatex(a)} & ${valueToKatex(b)} & ${valueToKatex(c)} \\\\
        ${valueToKatex(d)} & ${valueToKatex(e)} & ${valueToKatex(f)}
        \\end{vmatrix}
         \\above{1pt} \\bold{\\sqrt{ 
         (${valueToKatex(aIntoESubBIntoD)})^2 + (${valueToKatex(
          bIntofSubCIntoE
        )})^2 + (${valueToKatex(aIntofSubCIntoD)})^2}} 
        }
        
        \\end{vmatrix} `,
        type: `equation`,
      },
      {
        value: `b =
        \\begin{vmatrix}
        {
        \\begin{vmatrix}
           ${valueToKatex(pSubL)} & ${valueToKatex(qSubM)} & ${valueToKatex(
          rSubN
        )} \\\\
           ${valueToKatex(a)} & ${valueToKatex(b)} & ${valueToKatex(c)} \\\\
        ${valueToKatex(d)} & ${valueToKatex(e)} & ${valueToKatex(f)}
        \\end{vmatrix}
         \\above{1pt} \\bold{\\sqrt{ 
         { ${valueToKatex(addDenominator)}}}} 
        }
        \\end{vmatrix} `,
        type: `equation`,
      },
      {
        value: `Now, by solving the Determinant in the numerator and Under Root</br> in the denominator we will get the shortest distance
        `,
        type: `span`,
      },
      'br',
      {
        value: `d=\\lvert {1 \\above{1pt} \\sqrt{ ${valueToKatex(
          addDenominator
        )}}} * \\lbrace(${valueToKatex(pSubL)}) (${valueToKatex(
          bIntoF
        )} ${minusSymbol(evalInDecimals(cIntoE))} ${valueToKatex(
          removeSymbol(cIntoE)
        )}) - (${valueToKatex(qSubM)}) (${valueToKatex(aIntoF)} ${minusSymbol(
          evalInDecimals(cIntoD)
        )} ${valueToKatex(removeSymbol(cIntoD))}) + (${valueToKatex(rSubN)}) 
         (${valueToKatex(aIntoE)} ${minusSymbol(
          evalInDecimals(bIntoD)
        )} ${valueToKatex(removeSymbol(bIntoD))})\\rbrace \\rvert `,
        type: `equation`,
      },
      'br',
      {
        value: `d=\\lvert { 1 \\above{1pt}  \\sqrt{ ${valueToKatex(
          addDenominator
        )}}} * \\lbrace(${valueToKatex(pSubL)}) (${valueToKatex(
          bIntofSubCIntoE
        )}) - (${valueToKatex(qSubM)}) (${valueToKatex(
          aIntofSubCIntoD
        )}) + (${valueToKatex(rSubN)})
        (${valueToKatex(aIntoESubBIntoD)}) \\rbrace\\rvert `,
        type: `equation`,
      },
      {
        value: `d=\\lvert { 1 \\above{1pt} \\sqrt{ {${valueToKatex(
          addDenominator
        )}}}} * \\lbrace {${valueToKatex(
          pSubLIntoBIntofSubCIntoE
        )}} ${minusSymbol(
          evalInDecimals(qSubMIntoAIntofSubCIntoD)
        )}{ ${valueToKatex(removeSymbol(qSubMIntoAIntofSubCIntoD))}} 
        ${addSymbol(evalInDecimals(rSubNIntoAIntoESubBIntoD))} {${valueToKatex(
          removeSymbol(rSubNIntoAIntoESubBIntoD)
        )}} \\rbrace\\rvert  = {{${valueToKatex(
          removeSymbol(addNumerator)
        )}} \\above{1pt} \\sqrt{{${valueToKatex(
          removeSymbol(addDenominator)
        )}}}} ${
          bothSame
            ? ''
            : `=  {${valueToKatex(
                removeSymbol(addNumerator)
              )} \\above{1pt} {${removeSymbol(addDenomFinal)}} }`
        }`,
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
  }, [l, m, n, , p, q, r, a, b, c, d, e, f, showSteps]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setL('');
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    mf5?.current.latex('');
    mf6?.current.latex('');
    mf7?.current.latex('');
    mf8?.current.latex('');
    mf9?.current.latex('');
    mf10?.current.latex('');
    mf11?.current.latex('');
    mf12?.current.latex('');
    setA(() => '');
    setB(() => '');
    setC(() => '');
    setD(() => '');
    setE(() => '');
    setP(() => '');
    setQ(() => '');
    setR(() => '');
    setL(() => '');
    setM(() => '');
    setN(() => '');
    setShowSteps(() => false);
    setShowResult(() => false);
  }, []);

  const hasValue = [l, m, n, , p, q, r, a, b, c, d, e, f].some(
    (v) => !!v || v == 0
  );
  const hasAllValue = [l, m, n, , p, q, r, a, b, c, d, e, f].every(
    (v) => !!v || v == 0
  );
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
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">Line L 1 :-</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setL}
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
              allowAlphabeticKeyboard={false}
              initialLatex={l}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setM}
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
              allowAlphabeticKeyboard={false}
              initialLatex={m}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={setN}
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
              allowAlphabeticKeyboard={false}
              initialLatex={n}
              style={{
                width: '20%',
              }}
            />
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left"></div>
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={setA}
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
              allowAlphabeticKeyboard={false}
              initialLatex={a}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf5.current = ref)}
              setValue={setB}
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
              allowAlphabeticKeyboard={false}
              initialLatex={b}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf6.current = ref)}
              setValue={setC}
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
              allowAlphabeticKeyboard={false}
              initialLatex={c}
              style={{
                width: '20%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left">
              Line L<sub>2</sub> :-
            </div>
            <MathInput
              setMathfieldRef={(ref) => (mf7.current = ref)}
              setValue={setP}
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
              allowAlphabeticKeyboard={false}
              initialLatex={p}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf8.current = ref)}
              setValue={setQ}
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
              allowAlphabeticKeyboard={false}
              initialLatex={q}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf9.current = ref)}
              setValue={setR}
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
              allowAlphabeticKeyboard={false}
              initialLatex={r}
              style={{
                width: '20%',
              }}
            />
          </div>

          <div className="row mb-2 align-items-center">
            <div className="col-2 text-left"></div>
            <MathInput
              setMathfieldRef={(ref) => (mf10.current = ref)}
              setValue={setD}
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
              allowAlphabeticKeyboard={false}
              initialLatex={d}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf11.current = ref)}
              setValue={setE}
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
              allowAlphabeticKeyboard={false}
              initialLatex={e}
              style={{
                width: '20%',
              }}
            />
            <MathInput
              setMathfieldRef={(ref) => (mf12.current = ref)}
              setValue={setF}
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
              allowAlphabeticKeyboard={false}
              initialLatex={f}
              style={{
                width: '20%',
              }}
            />
          </div>

          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-1">
        <Equation equation={note} />
      </div>
      {hasAllValue &&
        (!isPointSame ? (
          <button
            className="btn default-btn px-5 mr-3 mt-2 rounded-pill btn-blue"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        ) : (
          <div>
            <strong>Note :-</strong> Since initial & final points are the same
            hence points are <strong>Coincident</strong> and distance between
            two coincident points is always <strong>ZERO</strong>.
          </div>
        ))}
      {hasValue && (
        <button
          className="default-btn rounded-pill mt-2 px-5 btn btn-danger"
          onClick={clear}
        >
          clear
        </button>
      )}
      {hasAllValue && showResult && !showSteps && (
        <>
          <Equation className="mt-3" equation={result} />
          {
            <button
              className="default-btn mt-3 rounded-pill px-5 btn-blue"
              onClick={toggleSteps}
            >
              Show Steps
            </button>
          }
        </>
      )}
      {hasAllValue && !isPointSame && showSteps && (
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

export default ShortestDistanceBetTwoLinesIn3D;
