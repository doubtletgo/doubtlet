'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { putSpace } from '../../helpers/general';
import {
  convertFromLatex,
  convertIntoLatex,
  evalInDecimals,
} from '../../helpers/matrixHelper';
import MathInput from 'react-math-keyboard';
import NotesHelpButton from '../common/Notes/NotesHelpButton';
import { addSymbol, minusSymbol } from '../../helpers/decimal';
import { removeSymbol } from '../../helpers/RootSolver';
import { isMatValid } from '../../helpers/Validations';

import algebrite from 'algebrite';

const ParallelPerpendicularLine = () => {
  const [p1, setP1] = useState('3');
  const [p2, setP2] = useState('2');
  const [y1, setY1] = useState('1');
  const [y2, setY2] = useState('5');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [order, setOrder] = useState('Parallel');
  const isParallel = order === 'Parallel';

  const tempP2 = convertFromLatex(p2);
  const tempY1 = convertFromLatex(y1);
  const tempY2 = convertFromLatex(y2);
  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        {
          value: putSpace(`Find a line \\bold{${
            isParallel ? 'Parallel' : 'Perpendicular'
          }} to the line y = ( {${y1 || '0'}}x ${addSymbol(
            evalInDecimals(tempY2)
          )} {${removeSymbol(y2 || '0')}}) and passing through the point P (${
            p1 || '0'
          },${p2 || '0'}).
          `),
          type: 'equation',
        },
      ])
    );
  }, [y1, y2, p2, p1, isParallel]);

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b> Formatted User input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Line Equation: \\bigg< (y=  {${y1 || '0'}}x ${addSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || '0')}}) or (y ${minusSymbol(
              evalInDecimals(tempY1)
            )} {${removeSymbol(y1 || '0')}}x ${minusSymbol(
              evalInDecimals(tempY2)
            )} {${removeSymbol(y2 || '0')}}) \\bigg>`
          ),
          type: 'equation',
        },
        {
          value: `Point (P): \\bigg<{${p1 || '0'}},{${p2 || '0'}} \\bigg>`,
          type: 'equation',
        },
        {
          value: `Line Type:
          \\bigg<\\bold{${isParallel ? 'Parallel' : 'Perpendicular '}}\\bigg>`,
          type: 'equation',
        },
      ])
    );
    const isInvalid = !isMatValid([[y1, y2, p1, p2]]);
    if (isInvalid) return;

    const parallelR = convertIntoLatex(
      algebrite?.expand(
        convertFromLatex(
          `(${convertFromLatex(p2)})-(${convertFromLatex(
            y1
          )})*(${convertFromLatex(p1)})`
        )
      )
    ).replace('*', '');
    const perpendicularR = convertIntoLatex(
      algebrite?.expand(
        convertFromLatex(
          `(-1/${convertFromLatex(y1)})*(${convertFromLatex(p1)})`
        )
      )
    );

    const perpendicularR2 = convertIntoLatex(
      algebrite?.expand(
        convertFromLatex(
          `(${convertFromLatex(p2)})-(${convertFromLatex(perpendicularR)})`
        )
      )
    );
    const finalAnswer = [
      {
        value: putSpace(
          `The equation of a line Parallel to the line y = ({${y1}}x ${addSymbol(
            evalInDecimals(tempP2)
          )}  {${removeSymbol(p2)}}) and passing through  `
        ),
        type: 'equation',
      },

      {
        value: putSpace(
          `the point P (${p1 || '0'}, {${p2 || '0'}}) is  ${
            isParallel
              ? `\\bold{y = (${y1}x)+ (${parallelR})}`
              : `\\bold{Y= ({-1\\above{1pt}${y1}}x ) + (${perpendicularR2}}) `
          }`
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
        value: isParallel
          ? `All parallel lines have same slope but they all passes through the different points.
        `
          : putSpace(
              ` If a line has slope m, then slope of the line perpendicular to it is {-1\\above{1pt}m}.`
            ),
        type: isParallel ? 'span' : 'equation',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Given line in slope intercept form: y= (${y1 || '0'}x ${addSymbol(
            evalInDecimals(tempY2)
          )} ${removeSymbol(y2 || '0')})`
        ),
        type: 'equation',
      },
      {
        value: `${
          isParallel
            ? putSpace(`The slope of the parallel line is: m =  ${y1 || '0'}`)
            : putSpace(
                `The slope of the parallel line is: m^, =  {-1 \\above{1pt} ${y1}}+c`
              )
        }
        `,
        type: `equation`,
      },
      {
        value: isParallel
          ? putSpace(
              `So, the equation of the parallel line is  y= ( ${
                y1 || '0'
              } + c) `
            )
          : `So, the equation of the parallel line is  y= {-1 \\above{1pt} ${y1}} + c`,
        type: `equation`,
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value:
          putSpace(`Now, to find c, we will use the fact that given line should pass through the
        point P (${p1 || '0'},${p2 || '0'}).`),
        type: 'euqaiton',
      },
      {
        value: isParallel
          ? `${p2 || '0'}=${y1}(${p1})+c `
          : `${p2 || '0'}=({-1 \\above{1pt} ${y1}})(${p1})+ c`,
        type: 'equation',
      },
      {
        value: isParallel
          ? `Then, c = ${p2 || '0'} - ${y1}(${p1}) = ${parallelR}`
          : `Then, c = ${p2 || '0'} -({-1 \\above{1pt} ${y1}})(${p1}) =(${
              p2 || '0'
            }) -(${perpendicularR})=${perpendicularR2}`,
        type: 'equation',
      },
      {
        value: isParallel
          ? ''
          : putSpace(
              `Therefore, the equation of the perpendicular line is: \\bold{Y= {-1\\above{1pt}${y1}} +${addSymbol(
                evalInDecimals(perpendicularR2)
              )} ${removeSymbol(perpendicularR2)}}`
            ),
        type: isParallel ? 'span' : 'equation',
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
  }, [y1, y2, p2, p1, showSteps, isParallel]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((s) => !s),
    [setShowSteps]
  );

  const onChangeOrder = (event) => {
    setOrder(event.target.value);
  };

  const clear = useCallback(() => {
    setP1('');
    setP2('');
    setY1('');
    setY2('');
    setShowResult(false);
    setShowSteps(false);
  }, [setShowResult, setShowSteps]);

  const hasValue = [1].some((v) => (!!v && !isNaN(v)) || v === 0);

  return (
    <>
      <div className="row image-input-container">
        <div className="col-sm-12 col-md-6 order-md-2 mb-4 mb-md-0">
          <AdComponent />
        </div>
        <div className="col-sm-12 col-md-6 order-md-1 user-inputs">
          <div className="text-left mb-2">
            <strong>Your Input :-</strong>
            <NotesHelpButton />
          </div>
          <div className="text-left mb-2">
            Your input can be in form of Integer, Fraction or any Real Numbers
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Line Type: -</div>
            <div className="col-8">
              <select
                className="form-select border-primary"
                aria-label="Default select example"
                value={order}
                onChange={onChangeOrder}
              >
                <option value="Parallel">Parallel </option>
                <option value="Perpendicular">Perpendicular</option>
              </select>
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Y : - </div>
            <div className="col-3">
              <MathInput
                setValue={setY1}
                className="col-12"
                initialLatex={y1}
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
            </div>
            +
            <div className="col-3">
              <MathInput
                setValue={setY2}
                initialLatex={y2}
                className="col-12"
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
            </div>
          </div>
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">Point (P): - </div>
            <div className="col-4">
              <MathInput
                setValue={setP1}
                initialLatex={p1}
                className="col-12"
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
            </div>
            <div className="col-4">
              <MathInput
                initialLatex={p2}
                setValue={setP2}
                className="col-12"
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
          className="default-btn rounded-pill px-5 btn btn-danger  mt-3"
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

export default ParallelPerpendicularLine;
