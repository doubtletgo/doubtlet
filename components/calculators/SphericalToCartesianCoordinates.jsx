'use client';
import AdComponent from '../AdSense';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { renderSteps } from '../../helpers/katex';
import { Equation } from '../Equation';
import { parseNumber } from '../../helpers/decimal';
import {
  FindCosineData,
  FindSineData,
} from '../../utils/constants/Angle-table';
import { putSpace } from '../../helpers/general';
import MathInput from 'react-math-keyboard';
import { create, all } from 'mathjs';
import { convertToKatex } from '../../helpers/SolveRoot';

const config = {};
const math = create(all, config);
const SphericalToCartesianCoordinates = () => {
  const [rho, setRho] = useState('1');
  const [theta, setTheta] = useState('45');
  const [phai, setPhai] = useState('45');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [note, setNote] = useState();
  const [rhoInvalid, setRhoInvalid] = useState(false);
  const [thetaInvalid, setThetaInvalid] = useState(false);
  const [phaiInvalid, setPhaiInvalid] = useState(false);

  useEffect(() => {
    setNote(
      renderSteps([
        {
          value: `<b>Question</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(`Convert the Spherical coordinates`),
          type: 'equation',
        },
        {
          value: putSpace(
            `(ρ, θ, φ)=(\\bold{{${rho || 'ρ'}}, {${theta || 'θ'}}, {${
              phai || 'φ'
            }}}) to cartesian Coordiantes`
          ),
          type: 'equation',
        },
      ])
    );
  }, [rho, phai, theta]);

  const degOrRad = (val, isDeg) => {
    let num = Number(val);
    return isDeg ? (3.14 * num) / 180 : num;
  };

  useEffect(() => {
    setEquation(
      renderSteps([
        {
          value: `<b>Formatted User Input Display</b>`,
          type: 'span',
        },
        'br',
        {
          value: putSpace(
            `Point P (ρ, θ, φ): - \\bigg<\\bold{{${rho || 'ρ'}}, {${
              theta || 'θ'
            }}, {${phai || 'φ'}}}\\bigg>`
          ),
          type: 'equation',
        },
      ])
    );

    function evalLatex(expression) {
      try {
        const parsedExpression = math.parse(expression);
        const evaluatedResult = parsedExpression.evaluate();
        return evaluatedResult;
      } catch {
        return null;
      }
    }

    const hasPI = theta.indexOf('pi') != -1;
    const isDegree = theta.indexOf('°') != -1;
    const simplifyLatex = (latexValue) => {
      return latexValue
        ?.toString()
        ?.replaceAll('\\frac', '')
        .replaceAll('}{', ')/(')
        .replaceAll('}', ')')
        .replaceAll('{', '(')
        .replaceAll('\\sqrt', 'sqrt')
        .replaceAll('\\left(', '')
        .replaceAll('\\right)', '');
    };
    const simplifyKatex = (latexValue) => {
      return latexValue
        ?.toString()
        .replaceAll('\\sqrt', 'sqrt')
        .replace('\\above{1pt}', '/')
        .replaceAll('{', '(')
        .replaceAll('}', ')');
    };
    const isInvalid = [rho, theta, phai].some((a) => !a || a == '-');
    const regSqr = new RegExp(/(sqrt)/);
    const regNum = new RegExp(/\d/);
    const isThetaDegree = theta.indexOf('°') > 0;
    const isThetaPi = theta.indexOf('pi') > 0;
    const isPhaiDegree = phai.indexOf('°') > 0;
    const isPhaiPi = phai.indexOf('pi') > 0;
    if ((isThetaDegree && isThetaPi) || (isPhaiDegree && isPhaiPi)) return;

    //Simplify Latex to Calculation
    let simpleRho = simplifyLatex(rho);
    let simpleTheta = simplifyLatex(theta).replace('°', '');
    let simplePhai = simplifyLatex(phai).replace('°', '');
    //Check if Pi does not have any other value
    const latTheta = theta.split('\\pi');
    let noNumTheta = !regNum.test(latTheta[0]);
    simpleTheta = noNumTheta
      ? simpleTheta.replace('\\pi', '1\\pi')
      : simpleTheta;
    const latPhai = phai.split('\\pi');
    let noNumPhai = !regNum.test(latPhai[0]);
    simplePhai = noNumPhai ? simplePhai.replace('\\pi', '1\\pi') : simplePhai;
    //Check if Values are Valid
    if (simpleRho.split('/').some((x) => x.match(regSqr)?.length > 1))
      setRhoInvalid(true);
    else setRhoInvalid(false);
    if (simpleTheta.split('/').some((x) => x.match(regSqr)?.length > 1))
      setThetaInvalid(true);
    else setThetaInvalid(false);
    if (simplePhai.split('/').some((x) => x.match(regSqr)?.length > 1))
      setPhaiInvalid(true);
    else setPhaiInvalid(false);
    if (isInvalid || rhoInvalid || thetaInvalid || phaiInvalid) return;
    //Calculated Simplified Latex results
    let valueOfPhai = isPhaiPi
      ? evalLatex(simplePhai.replace('\\pi', '*180'))?.toString()
      : evalLatex(simplePhai)?.toString();
    let valueOfTheta = isThetaPi
      ? evalLatex(simpleTheta.replace('\\pi', '*180'))?.toString()
      : evalLatex(simpleTheta)?.toString();

    let valueOfRho = parseNumber(evalLatex(simpleRho)?.toString(), {}, 2);
    if (!valueOfRho) return;
    //Check if Value for Angle Exists in Angle-Table
    const isValueTheta = !!FindCosineData(valueOfTheta);
    const isValuePhai = !!FindCosineData(valueOfPhai);

    //Sin & Cos Values
    let sinTheta;
    let sinPhai;
    let cosTheta;
    let cosPhai;
    //Multiplication of Sin & Cos Values
    let cosPhaiIntoRho;
    let cosThetaIntoSinPhai;
    let sinThetaIntoSinPhai;
    //Simplifed Katex values
    let xToCalculate;
    let yToCalculate;
    let zToCalculate;
    //Final Results for X,Y,Z
    let xFinal;
    let yFinal;
    let zFinal;
    //Values based on whether the theta and Phai value exists in Angle-Table
    if (isValueTheta && isValuePhai) {
      sinTheta = FindSineData(valueOfTheta);
      sinPhai = FindSineData(valueOfPhai);
      cosTheta = FindCosineData(valueOfTheta);
      cosPhai = FindCosineData(valueOfPhai);
      cosThetaIntoSinPhai = convertToKatex(cosTheta, sinPhai, false);
      sinThetaIntoSinPhai = convertToKatex(sinTheta, sinPhai, false);
      cosPhaiIntoRho = convertToKatex(valueOfRho, cosPhai, false);
      xToCalculate = simplifyKatex(cosThetaIntoSinPhai);
      yToCalculate = simplifyKatex(sinThetaIntoSinPhai);
      zToCalculate = simplifyKatex(cosPhaiIntoRho);
      xFinal = evalLatex(xToCalculate)?.toString() * valueOfRho;
      yFinal = evalLatex(yToCalculate)?.toString() * valueOfRho;
      zFinal = evalLatex(zToCalculate)?.toString();
    } else if (isValueTheta && !isValuePhai) {
      sinTheta = FindSineData(valueOfTheta);
      sinPhai = parseNumber(
        Math.sin(degOrRad(valueOfPhai, isPhaiDegree)),
        {},
        3
      );
      cosTheta = FindCosineData(valueOfTheta);
      cosPhai = parseNumber(
        Math.cos(degOrRad(valueOfPhai, isPhaiDegree)),
        {},
        3
      );
      cosThetaIntoSinPhai = convertToKatex(valueOfRho, cosTheta, false);
      sinThetaIntoSinPhai = convertToKatex(valueOfRho, sinTheta, false);
      cosPhaiIntoRho = parseNumber(valueOfRho * cosPhai, {}, 4);
      xToCalculate = simplifyKatex(cosThetaIntoSinPhai);
      yToCalculate = simplifyKatex(sinThetaIntoSinPhai);
      xFinal = evalLatex(xToCalculate)?.toString() * sinPhai;
      yFinal = evalLatex(yToCalculate)?.toString() * sinPhai;
      zFinal = cosPhaiIntoRho;
      cosThetaIntoSinPhai = parseNumber(xFinal, {}, 3);
      sinThetaIntoSinPhai = parseNumber(yFinal, {}, 3);
    } else if (!isValueTheta && isValuePhai) {
      sinTheta = parseNumber(
        Math.sin(degOrRad(valueOfTheta, isThetaDegree)),
        {},
        3
      );
      sinPhai = FindCosineData(valueOfPhai);
      cosTheta = parseNumber(
        Math.cos(degOrRad(valueOfTheta, isThetaDegree)),
        {},
        3
      );
      cosPhai = FindCosineData(valueOfPhai);
      cosThetaIntoSinPhai = convertToKatex(valueOfRho, sinPhai, false);
      sinThetaIntoSinPhai = convertToKatex(valueOfRho, sinPhai, false);
      cosPhaiIntoRho = convertToKatex(valueOfRho, cosPhai, false);
      xToCalculate = simplifyKatex(cosThetaIntoSinPhai);
      yToCalculate = simplifyKatex(sinThetaIntoSinPhai);
      zToCalculate = simplifyKatex(cosPhaiIntoRho);
      xFinal = evalLatex(xToCalculate)?.toString() * cosTheta;
      yFinal = evalLatex(yToCalculate)?.toString() * sinTheta;
      zFinal = evalLatex(zToCalculate)?.toString();
      cosThetaIntoSinPhai = parseNumber(xFinal, {}, 3);
      sinThetaIntoSinPhai = parseNumber(yFinal, {}, 3);
    } else if (!isValueTheta && !isValuePhai) {
      sinTheta = parseNumber(
        Math.sin(degOrRad(valueOfTheta, isThetaDegree)),
        {},
        3
      );
      sinPhai = parseNumber(
        Math.sin(degOrRad(valueOfPhai, isPhaiDegree)),
        {},
        3
      );
      cosTheta = parseNumber(
        Math.cos(degOrRad(valueOfPhai, isPhaiDegree)),
        {},
        3
      );
      cosPhai = parseNumber(
        Math.cos(degOrRad(valueOfTheta, isThetaDegree)),
        {},
        3
      );
      cosThetaIntoSinPhai = valueOfRho * cosTheta * sinPhai;
      sinThetaIntoSinPhai = valueOfRho * sinTheta * sinPhai;
      cosPhaiIntoRho = valueOfRho * cosPhai;
      xFinal = cosThetaIntoSinPhai;
      yFinal = sinThetaIntoSinPhai;
      zFinal = cosPhaiIntoRho;
    }
    xFinal = parseNumber(xFinal, {}, 3);
    yFinal = parseNumber(yFinal, {}, 3);
    zFinal = parseNumber(zFinal, {}, 3);
    cosThetaIntoSinPhai = cosThetaIntoSinPhai
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');

    sinThetaIntoSinPhai = sinThetaIntoSinPhai
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');
    cosPhaiIntoRho = cosPhaiIntoRho
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');
    let xvariable = convertToKatex(rho, cosThetaIntoSinPhai)
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');
    let yvariable = convertToKatex(rho, sinThetaIntoSinPhai)
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');
    let zvariable = convertToKatex(rho, cosPhai)
      ?.toString()
      .replaceAll('(', '')
      .replaceAll(')', '');

    const finalAnswer = [
      {
        value: putSpace(`The Value of the Spherical coordinates (ρ,θ,φ) `),
        type: 'equation',
      },
      {
        value: putSpace(
          `=\\bigg({${rho || 'ρ'}},{${theta || 'θ'}},{${
            phai || 'φ'
          }}\\bigg)to Cartesian coordinate is  `
        ),
        type: 'equation',
      },
      {
        value: `\\bold{(x, y, z)=\\bigg(
          {${parseNumber(xvariable)}}, {${parseNumber(
          yvariable
        )}}, {${parseNumber(
          zvariable
        )}}\\bigg)or \\bigg({${xFinal}}, {${yFinal}}, {${zFinal}}\\bigg)}`,
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
        value: `The position of any point in 3-D in the Cartesian coordinate system can be<br> represented as (x, y, z) where x, y, z represents
        the distance of points from<br> rho, theta, z coordinate axes respectively.`,
        type: 'span',
      },
      'br',
      {
        value: `<b>Step-1</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(`Given Inputs`),
        type: 'equation',
      },
      {
        value: `ρ=\\bold{ {${rho || 'ρ'}} }`,
        type: 'equation',
      },
      {
        value: `θ= \\bold{{${theta || 'θ'}} } `,
        type: 'equation',
      },
      {
        value: `φ= \\bold{{${phai || 'φ'}}  } `,
        type: 'equation',
      },
      'br',
      {
        value: `To convert the above given Spherical coordinate to cartesian we will use the formula`,
        type: 'span',
      },
      {
        value: putSpace(`\\bold{x = ρ cos \\theta sin φ}`),
        type: 'equation',
      },
      {
        value: putSpace(`\\bold{y = ρ sin \\theta sin φ}`),
        type: 'equation',
      },
      {
        value: putSpace(`z= ρ cos φ`),
        type: 'equation',
      },
      {
        value: `<b>Step-2</b>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      {
        value: putSpace(
          `Now, by putting the above values in the above-given formula`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `x= {${rho}} cos({${theta}}) sin({${phai}}) ={${rho}}({${cosTheta}})({${sinPhai}}) ={${parseNumber(
            xvariable
          )}}= {${xFinal}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `y= {${rho}} sin({${theta}}) sin({${phai}}) ={${rho}}({${sinTheta}})({${sinPhai}}) ={${parseNumber(
            yvariable
          )}} = {${yFinal}}`
        ),
        type: 'equation',
      },
      {
        value: putSpace(
          `z= {${rho}} cos({${phai}}) ={${rho}}({${cosPhai}}) = {${parseNumber(
            zvariable
          )}} = {${zFinal}}`
        ),
        type: 'equation',
      },
      {
        value: `<a href = "/calculator/sine-calculator/?a=${simpleTheta
          .replace('\\pi', '')
          .replace('°', '')
          .replaceAll('(', '')
          .replaceAll(')', '')}&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${hasPI ? 1 : 0}`
        }" target="_blank">to see Steps for Sine Theta click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
      'br',
      {
        value: `<a href = "/calculator/cosine-calculator/?a=${simpleTheta
          .replace('\\pi', '')
          .replace('°', '')
          .replaceAll('(', '')
          .replaceAll(')', '')}&order=${isDegree ? `Degree` : `Radian`}${
          isDegree ? `` : `&usePI=${hasPI ? 1 : 0}`
        }" target="_blank">to see Steps for Cos Theta click here</a>`,
        type: 'span',
        className: 'text-decoration-underline',
      },
      'br',
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
  }, [rho, theta, showSteps, phai, setSolution]);

  const handleCalculate = useCallback(() => {
    setShowResult(true);
  }, [setShowResult]);

  const toggleSteps = useCallback(
    () => setShowSteps((prev) => !prev),
    [setShowSteps]
  );

  const clear = useCallback(() => {
    setRho('');
    setTheta('');
    setShowResult(false);
  }, [setShowResult]);

  const hasAllValue = [rho, phai, theta].every((v) => !!v);
  const bothVals = phai.indexOf('\\pi') > 0 && phai.indexOf('°') > 0;
  const hasValue = phai && rho && !bothVals && !rhoInvalid && !phaiInvalid;

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
          <div className="dropdown row mb-2 align-items-center">
            <div className="col-4 text-left">ρ:</div>
            <div className={`col-8 ${rhoInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setRho}
                allowAlphabeticKeyboard={false}
                initialLatex={rho}
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
            <div className="col-4 text-left"> θ:</div>

            <div className={`col-8 ${thetaInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setTheta}
                allowAlphabeticKeyboard={false}
                initialLatex={theta}
                numericToolbarKeys={['pi', '°']}
              />
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-4 text-left">φ:</div>
            <div className={`col-8 ${phaiInvalid ? 'invalid' : ''}`}>
              <MathInput
                setValue={setPhai}
                allowAlphabeticKeyboard={false}
                initialLatex={phai}
                numericToolbarKeys={['pi', '°']}
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
          className="btn default-btn px-5 rounded-pill mr-3 btn-blue mt-2"
          onClick={handleCalculate}
        >
          Calculate
        </button>
      )}
      {hasValue && (
        <button
          className="default-btn rounded-pill px-5 btn btn-danger mt-2"
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
      {hasAllValue && showSteps && (
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
export default SphericalToCartesianCoordinates;
