'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from "@/hooks/useLocalStorage";
import { renderSteps } from '../../helpers/katex';
import MathInput from 'react-math-keyboard';
import { Equation } from '../Equation';
import { addSymbol, parseNumber } from '../../helpers/decimal';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import {
  getSearchParams,
  putSpace,
  simplifyKatex,
} from '../../helpers/general';
import {
  evalExpression,
  showVal,
  evalInDecimals,
  valueToKatex,
  removeSymbol,
  withSign,
  convertIntoLatex,
  convertFromLatex,
} from '../../helpers/matrixHelper';
import { convertToKatex } from '../../helpers/SolveRoot';

const EquationOfLineFromTwoPoints = () => {
  const [x1, setx1] = useLocalStorage('EquationOfLineFromTwoPoints_x1', '1.4');
  const [x2, setx2] = useLocalStorage('EquationOfLineFromTwoPoints_x2', '7');
  const [y1, sety1] = useLocalStorage('EquationOfLineFromTwoPoints_y1', '5');
  const [y2, sety2] = useLocalStorage('EquationOfLineFromTwoPoints_y2', '2');
  const [equation, setEquation] = useLocalStorage('EquationOfLineFromTwoPoints_equation', '');
  const [solution, setSolution] = useLocalStorage('EquationOfLineFromTwoPoints_solution', '');
  const [showResult, setShowResult] = useLocalStorage('EquationOfLineFromTwoPoints_showResult', true);
  const [showSteps, setShowSteps] = useLocalStorage('EquationOfLineFromTwoPoints_showSteps', true);
  const [isPointSame, setIsPointSame] = useLocalStorage('EquationOfLineFromTwoPoints_isPointSame', false);
  const [result, setResult] = useLocalStorage('EquationOfLineFromTwoPoints_result', '');
  const [calcType, setCalcType] = useLocalStorage('EquationOfLineFromTwoPoints_calcType', 'intercept');
  const mf1 = useRef();
  const mf2 = useRef();
  const mf3 = useRef();
  const mf4 = useRef();

  //to get values from other calculator
  useEffect(() => {
    const vals = getSearchParams();
    if (vals.x1) setx1(vals.x1);
    if (vals.y1) sety1(vals.y1);
    if (vals.x2) setx2(vals.x2);
    if (vals.y2) sety2(vals.y2);
  }, []);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`
          (x_1, y_1) = \\bold{({${x1 || '0'}}, {${y1 || '0'}})}
        `),
          type: 'equation',
        },
        {
          value: putSpace(`
          (x_2, y_2) = \\bold{({${x2 || '0'}}, {${y2 || '0'}})}
        `),
          type: 'equation',
        },
      ])
    );
    const isInvalid = [x1, x2, y1, y2].some((x) => !x);
    setIsPointSame(x1 == x2 && y1 == y2);

    const tempX1 = convertFromLatex(x1);
    const tempX2 = convertFromLatex(x2);
    const tempY1 = convertFromLatex(y1);
    const tempY2 = convertFromLatex(y2);
    const x1Value = evalExpression(tempX1);
    const x2Value = evalExpression(tempX2);
    const y1Value = evalExpression(tempY1);
    const y2Value = evalExpression(tempY2);

    if (isInvalid) return;
    const y2MinusY1 = evalExpression(`${y2Value} - (${y1Value})`);
    const x2MinusX1 = evalExpression(`${x2Value} - (${x1Value})`);
    const yByX = convertToKatex(
      valueToKatex(y2MinusY1),
      valueToKatex(x2MinusX1),
      true
    );
    const valueA = evalExpression(`${y1Value} - ${y2Value}`);
    const valueB = evalExpression(`${x2Value} - ${x1Value}`);
    const valueC = evalExpression(
      `${x2Value} * ${y1Value} - ${x1Value} * ${y2Value}`
    );
    const M = simplifyKatex(yByX);
    const y1ByM = evalExpression(`${y1Value} / (${M})`);
    const y2ByM = evalExpression(`${y2Value} / (${M})`);
    const mx1 = evalExpression(`${x1Value} * ${M}`);
    const mx2 = evalExpression(`${x2Value} * ${M}`);
    const xMinusYm = evalExpression(`${x1Value} - (${y1ByM})`);
    const xMinusYmDash = evalExpression(`${x2Value} - (${y2ByM})`);
    const yMinusMx = evalExpression(`${y1Value} - (${mx1})`);
    const yMinusMxDash = evalExpression(`${y2Value} - (${mx2})`);
    const xmMinusY1 = evalExpression(`${mx1}-(${y1Value})`);
    const xnMinusY2 = evalExpression(`${mx2}-(${y2Value})`);
    const sub = valueToKatex(yMinusMx);
    const operator = (val) => {
      let op = evalInDecimals(val) > 0 ? '+' : '-';
      return op;
    };

    const answerPointSlope = [
      {
        value: putSpace(
          `The \\bold{Point Slope form} of a line  joining the points`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `P_1 \\bold{({${x1}}, {${y1}})} and P_2 \\bold{({${x2}}, {${y2}})} is given by:`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Point slope form equation of line using point `),
        type: 'equation',
      },
      {
        value: putSpace(
          `P_1 is : \\bold{y  = {${yByX}}x ${operator(
            evalExpression(`${y1Value} - (${mx1})`)
          )} ${removeSymbol(
            valueToKatex(evalExpression(`${mx1} - (${y1Value})`))
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Point slope form equation of line using point `),
        type: 'equation',
      },
      {
        value: putSpace(
          `P_2 is : \\bold{y = {${yByX}}x ${operator(
            y2Value - valueToKatex(mx2)
          )} ${removeSymbol(
            valueToKatex(evalExpression(`${mx2} - (${y2Value})`))
          )}}`
        ),
        type: 'equation',
      },
    ];
    const answerGeneral = [
      {
        type: 'equation',
        value: putSpace(
          `The  General  equation  of  a  line  passing  through two  points  P=\\bold{(${parseNumber(
            x1
          )}, ${parseNumber(y1)})}  and  Q=\\bold{(${parseNumber(
            x2
          )},${parseNumber(y2)})}  is :`
        ),
      },
      {
        value: `\\bold{(${withSign(valueToKatex(valueA), `{x}`)} ${addSymbol(
          evalInDecimals(valueB)
        )} ${withSign(
          removeSymbol(valueToKatex(valueB)),
          '{y}'
        )}) = ${valueToKatex(valueC)}}`,
        type: 'equation',
      },
    ];
    const answerIntercept = [
      {
        value: putSpace(
          `The  Intercept  form  of  a  line  passing  through two  points  P=\\bold{(${parseNumber(
            x1
          )}, ${parseNumber(y1)})}  and  Q=\\bold{(${parseNumber(
            x2
          )},${parseNumber(y2)})}  is : `
        ),
        type: 'equation',
      },
      {
        value: `\\bold{{x\\above{1pt}${valueToKatex(
          xMinusYm
        )}} + {y\\above{1pt}${valueToKatex(yMinusMx)}} = 1}`,
        type: 'equation',
      },
    ];
    const answerSlopeIntercept = [
      {
        value: `The  slope  intercept  form  of  line  through  the  points 
      `,
        type: 'span',
      },
      {
        value: putSpace(
          `\\bold{(${parseNumber(x1)}, ${parseNumber(
            y1
          )})} and \\bold{(${parseNumber(x2)}, ${parseNumber(y2)})} is give by:`
        ),
        type: 'equation',
      },
      {
        value: `\\bold {y = {${yByX}}x ${
          evalInDecimals(yMinusMx) < 0 ? '-' : '+'
        } ${removeSymbol(sub)} }`,
        type: 'equation',
      },
    ];
    const ansObj = {
      'point-slope': answerPointSlope,
      'general-standard': answerGeneral,
      intercept: answerIntercept,
      'slope-intercept': answerSlopeIntercept,
    };
    const finalAnswer = [
      ...Object.entries(ansObj).find((itm) => itm[0] == calcType)[1],
    ];
    const equations = [
      {
        type: 'span',
        value: '<b>Answer</b>',
      },
      'br',
      ...finalAnswer,
    ];
    const eqRender = renderSteps(equations);
    setResult(eqRender);
    if (!showSteps) return;

    const pointSlopeSteps = [
      {
        value: putSpace(`The equation of a line passing through two points`),
        type: 'equation',
      },
      {
        value: putSpace(`P= \\bold{(x_1, y_1)} and Q = \\bold{(x_2, y_2)} `),
        type: 'equation',
      },
      {
        value: putSpace(`in point slope form is given by the formula:`),
        type: 'equation',
      },
      {
        value: putSpace(`Point P is \\coloneq {(y -y_1) = m(x-x_1)}`),
        type: 'equation',
      },
      {
        value: putSpace(`Where m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`),
        type: 'equation',
      },
      {
        value: putSpace(`Given the values  of the variables :`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 = \\bold{${convertIntoLatex(
            x1Value
          )}}, y_1 = \\bold{${convertIntoLatex(
            y1Value
          )}}, x_2 = \\bold{${convertIntoLatex(
            x2Value
          )}}, y_2 = \\bold{${convertIntoLatex(y2Value)}}`
        ),
        type: 'equation',
      },

      {
        value: putSpace('sdfkljhk  After putting the values in the formula'),
        type: 'equation',
      },
      {
        value: putSpace('Lets calculate the value of m'),
        type: 'equation',
      },
      {
        value: putSpace(`m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`),
        type: 'equation',
      },
      {
        value: `m = {(${valueToKatex(
          y2Value
        )} - {{0}})\\above{1pt}(${valueToKatex(x2Value)} - {{1}})}`,
        args: [valueToKatex(y1Value), valueToKatex(x1Value)],
        type: 'equation',
      },
      {
        value: `m = {{{0}}\\above{1pt}{{1}}} ={${yByX}}`,
        args: [valueToKatex(y2MinusY1), valueToKatex(x2MinusX1)],
        type: 'equation',
      },
      {
        value: `Point \\enspace P_1 \\enspace is \\coloneq {(y -y_1) = m(x-x_1)}`,
        type: 'equation',
      },
      {
        value: `y - {{0}} = {${yByX}}(x - {{1}})`,
        args: [valueToKatex(y1Value), valueToKatex(x1Value)],
        type: 'equation',
      },
      {
        type: 'equation',
        value: `y ${operator(
          evalExpression(`-1 * (${y1Value})`)
        )} ${removeSymbol(valueToKatex(y1Value))} = {${yByX}}x  ${operator(
          evalExpression(`-1 * (${mx1})`)
        )} ${removeSymbol(valueToKatex(mx1))}`,
      },
      {
        type: 'equation',
        value: `y = {${yByX}}x ${operator(
          evalExpression(`-1 * (${mx1})`)
        )} ${removeSymbol(valueToKatex(mx1))} ${operator(
          tempY1
        )} ${removeSymbol(valueToKatex(y1Value))}`,
      },
      {
        value: `y = {${yByX}}x ${operator(`-1 *${xmMinusY1}`)} ${removeSymbol(
          valueToKatex(xmMinusY1)
        )}`,
        type: 'equation',
      },
      {
        value: `Point \\enspace P_2 \\enspace is \\coloneq {(y -y_2) = m(x-x_2)}`,
        type: 'equation',
      },
      {
        value: `y - {{0}} = {${yByX}}(x - {{1}})`,
        args: [valueToKatex(y2Value), valueToKatex(x2Value)],

        type: 'equation',
      },
      {
        type: 'equation',
        value: `y ${operator(
          evalInDecimals(`-1 * (${y2Value})`)
        )} ${removeSymbol(valueToKatex(y2Value))} = {${yByX}}x  ${operator(
          -1 * mx2
        )} ${removeSymbol(valueToKatex(mx2))}`,
      },
      {
        value: `y = {${yByX}}x ${operator(
          evalExpression(`-1 * (${mx2})`)
        )} ${removeSymbol(valueToKatex(mx2))} ${operator(
          y2Value
        )} ${removeSymbol(valueToKatex(y2Value))}`,

        type: 'equation',
      },
      {
        value: `y = {${yByX}}x ${operator(
          `-1 * (${xnMinusY2})`
        )} ${removeSymbol(valueToKatex(xnMinusY2))}`,
        type: 'equation',
      },
    ];
    const generalSteps = [
      {
        value: putSpace(
          `The  general  equation  of  a  line  passing  through two  points  P= \\bold{(x_1,  y_1)}  and  Q = \\bold{(x_2,  y_2)}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is  given  by  the  following  formula  (ax + by = c)`
        ),
        type: 'equation',
      },
      {
        value: `where \\enspace a = y_1 - y_2,  b = x_2 - x_1,  c = x_2y_1 - x_1y_2`,
        type: 'equation',
      },
      {
        value: putSpace(`Given  the  values  of  the  variables :`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 =  \\bold {${convertIntoLatex(
            x1Value
          )}},  y_1 =  \\bold{ ${convertIntoLatex(
            y1Value
          )}},  x_2 =  \\bold{ ${convertIntoLatex(
            x2Value
          )}},  y_2 =  \\bold{ ${convertIntoLatex(y2Value)}}`
        ),
        type: 'equation',
      },
      {
        value: 'Lets calculate the value of a, b and c',
        type: 'span',
      },
      {
        value: `a = y_1 - y_2 \\implies a = ${valueToKatex(valueA)}`,
        type: 'equation',
      },
      {
        value: `b = x_2 - x_1 \\implies b = ${valueToKatex(valueB)}`,
        type: 'equation',
      },
      {
        value: `c = x_2 y_1 - x_1 y_2 \\implies c = ${valueToKatex(valueC)}`,
        type: 'equation',
      },
      {
        value: `Now we can write the equation of Line in General standard form as
        given below :-`,
        type: 'span',
      },
      {
        value: `${withSign(valueToKatex(valueA), '{x}')} ${addSymbol(
          evalInDecimals(valueB)
        )} ${withSign(
          removeSymbol(valueToKatex(valueB)),
          '{y}'
        )} = ${valueToKatex(valueC)}`,
        type: 'equation',
      },
    ];
    const interceptSteps = [
      {
        value: putSpace(
          `The  Intercept  form  of  a  line  passing  through two  points  P= \\bold{(${parseNumber(
            x1
          )}, ${parseNumber(y1)})}  and  Q = \\bold{(${parseNumber(
            x2
          )}, ${parseNumber(y2)})}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `is  given  by  the  following  formula : {x\\above{1pt}a} + {y\\above{1pt}b} = 1`
        ),
        type: 'equation',
      },
      {
        value:
          putSpace(`where \\boldsymbol{a} is the intercept on \\boldsymbol{x} - axis \\enspace and  \\boldsymbol{b}  is  the  intercept 
       on  \\boldsymbol{y} - axis`),
        type: 'equation',
      },
      {
        value: putSpace(
          `so  a = (x_1 - {y_1\\above{1pt}m})  and  b = (y_1 - mx_1 )`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`Given the values of the variables :`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 = \\bold{${showVal(x1, x1Value)}}, y_1 = \\bold{${showVal(
            y1,
            y1Value
          )}}, x_2 = \\bold{${showVal(x2, x2Value)}}, y_2 = \\bold{${showVal(
            y2,
            y2Value
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace('After  putting  the  values  in  the  formula'),
        type: 'equation',
      },
      {
        value: 'Lets calculate the value of m',
        type: 'span',
      },
      {
        value: `m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`,
        type: 'equation',
      },
      {
        type: 'equation',
        value: `m = {(${y2} - {{0}})\\above{1pt}(${x2} - {{1}})}`,
        args: [parseNumber(y1), parseNumber(x1)],
      },
      {
        type: 'equation',
        value: `m = {{{0}}\\above{1pt}{{1}}} \\implies m = {${yByX}}`,
        args: [valueToKatex(y2MinusY1), valueToKatex(x2MinusX1)],
      },
      {
        value: `Now we have to calculate the value of a`,
        type: 'span',
      },
      {
        value: `a = (x_1 - {y_1\\above{1pt}m}) \\space or \\space a' = (x_2 - {y_2\\above{1pt}m})`,
        type: 'equation',
      },
      {
        value: putSpace(`result  will  be  same  in  both  cases`),
        type: 'equation',
      },
      {
        value: `After putting the values in formula`,
        type: 'span',
      },
      {
        type: 'equation',
        value: `a = (${parseNumber(x1)} - {${parseNumber(
          y1
        )}\\above{1pt}{${yByX}}}) \\implies a = ${valueToKatex(xMinusYm)}`,
      },
      {
        type: 'equation',
        value: `a' = (${parseNumber(x2)} - {${parseNumber(
          y2
        )}\\above{1pt}{${yByX}}}) \\implies a' = ${valueToKatex(xMinusYmDash)}`,
      },
      {
        type: 'equation',
        value: `Hence \\space value \\space of \\space a = ${valueToKatex(
          xMinusYm
        )}`,
      },
      {
        value: `Now we have to calculate the value of b`,
        type: 'span',
      },
      {
        value: `b = (y_1 - mx_1) \\space or \\space b' = (y_2 - mx_2)`,
        type: 'equation',
      },
      {
        value: putSpace(`result  will  be  same  in  both  cases`),
        type: 'equation',
      },
      {
        value: `After putting the values in formula`,
        type: 'span',
      },
      {
        type: 'equation',
        value: `b = (${valueToKatex(y1Value)} - ({${yByX}}*${parseNumber(
          x1
        )})) \\implies b = ${valueToKatex(yMinusMx)}`,
      },
      {
        type: 'equation',
        value: `b' = (${parseNumber(y2)} - ({${yByX}}*${valueToKatex(
          x2Value
        )})) \\implies b' = ${valueToKatex(yMinusMxDash)}`,
      },
      {
        type: 'equation',
        value: `Hence \\space value \\space of \\space b = ${valueToKatex(
          yMinusMx
        )}`,
      },
      {
        value: `Now we can write the intercept form equation of line as
      given below :-`,
        type: 'span',
      },
      {
        value: `{x\\above{1pt}${valueToKatex(
          xMinusYm
        )}} + {y\\above{1pt}${valueToKatex(yMinusMx)}} = 1`,
        type: 'equation',
      },
    ];
    const slopeInterceptSteps = [
      {
        value: putSpace(
          `The slope of line through the points (${parseNumber(
            x1
          )},${parseNumber(y1)}) and (${parseNumber(x2)},${parseNumber(y2)})`
        ),
        type: 'equation',
      },
      {
        value: putSpace(`is given by the formula : y = mx1 + c`),
        type: 'equation',
      },
      {
        value: `Where \\enspace m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`,
        type: 'equation',
      },
      {
        value: putSpace(`and  \\boldsymbol{c}  is  the  intercept  on 
              the  \\boldsymbol{y} - axis.`),
        type: 'equation',
      },
      {
        value: `so \\enspace c = (y_1 - mx_1 ) `,
        type: 'equation',
      },
      {
        value: putSpace(`Given  the  values  of  the  variables :`),
        type: 'equation',
      },
      {
        value: putSpace(
          `x_1 = \\bold{${showVal(x1, x1Value)}}, y_1 = \\bold{${showVal(
            y1,
            y1Value
          )}}, x_2 = \\bold{${showVal(x2, x2Value)}}, y_2 = \\bold{${showVal(
            y2,
            y2Value
          )}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace('After  putting  the  values  in  the  formula'),
        type: 'equation',
      },
      {
        value: 'Lets calculate the value of m',
        type: 'span',
      },
      {
        value: `m = {(y_2 - y_1)\\above{1pt}(x_2 - x_1)}`,
        type: 'equation',
      },
      {
        type: 'equation',
        value: `m = {(${valueToKatex(
          y2Value
        )} - {{0}})\\above{1pt}(${valueToKatex(x2)} - {{1}})}`,
        args: [y1, x1],
      },
      {
        type: 'equation',
        value: `m = {{{0}}\\above{1pt}{{1}}} \\implies m ={ ${yByX}}`,
        args: [valueToKatex(y2MinusY1), valueToKatex(x2MinusX1)],
      },
      {
        value: `Now we have to calculate the value of c`,
        type: 'span',
      },
      'br',
      {
        type: 'equation',
        value: `c = (y_1 - mx_1 )`,
      },
      {
        value: `After putting the values in formula`,
        type: 'span',
      },
      {
        type: 'equation',
        value: `c = (${parseNumber(y1)} - ({${yByX}} * ${parseNumber(
          x1
        )})) \\implies c = ${sub}`,
      },
      {
        type: 'equation',
        value: `Hence \\enspace value \\enspace of \\enspace c = ${sub}`,
      },
      {
        value: `Now we can write the slope intercept form <br>equation of line
        as given below :-`,
        type: 'span',
      },
      {
        type: 'equation',
        value: `Slope \\enspace intercept \\enspace form \\enspace y = mx1 + c`,
      },
      {
        value: `y = {${yByX}}x {${
          evalInDecimals(yMinusMx) < 0 ? '-' : '+'
        } ${removeSymbol(sub)}}`,
        type: 'equation',
      },
    ];
    const stepsObj = {
      'point-slope': pointSlopeSteps,
      'general-standard': generalSteps,
      intercept: interceptSteps,
      'slope-intercept': slopeInterceptSteps,
    };
    const steps = [
      {
        value: `<b>Step By Step Solution :-</b>`,
        type: 'span',
      },
      'br',
      ...Object.entries(stepsObj).find((itm) => itm[0] == calcType)[1],
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
  }, [x1, x2, y1, y2, showSteps, calcType]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );
  const onCalcChange = (event) => {
    setCalcType(event.target.value);
  };
  const clear = useCallback(() => {
    mf1?.current.latex('');
    mf2?.current.latex('');
    mf3?.current.latex('');
    mf4?.current.latex('');
    setx1('');
    setx2('');
    sety1('');
    sety2('');
    setShowResult(false);
    setCalcType('intercept');
    setShowSteps(false);
  }, [setShowResult]);

  const hasValue = [x1, x2, y1, y2].some((v) => !!v || v == 0);
  const hasAllValue = [x1, x2, y1, y2].every((v) => !!v || v == 0);
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
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Line Type :</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={calcType}
                onChange={onCalcChange}
              >
                <option value="intercept">Intercept</option>
                <option value="general-standard">General Standard</option>
                <option value="point-slope">Point Slope</option>
                <option value="slope-intercept">Slope Intercept</option>
              </select>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P1:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf1.current = ref)}
              setValue={setx1}
              allowAlphabeticKeyboard={false}
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
              initialLatex={x1}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf3.current = ref)}
              setValue={sety1}
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
              initialLatex={y1}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">Point P2:</div>
            <MathInput
              setMathfieldRef={(ref) => (mf2.current = ref)}
              setValue={setx2}
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
              initialLatex={x2}
              style={{
                width: '33.33%',
              }}
            />{' '}
            <MathInput
              setMathfieldRef={(ref) => (mf4.current = ref)}
              setValue={sety2}
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
              initialLatex={y2}
              style={{
                width: '33.33%',
              }}
            />
          </div>
          <Equation equation={equation} className="border-primary" />
        </div>
      </div>
      <hr />

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

export default EquationOfLineFromTwoPoints;
