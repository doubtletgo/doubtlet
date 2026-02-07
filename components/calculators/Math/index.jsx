import React from 'react';
import { MathConstants } from './MathConstants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const MathList = () => {
  return (
    <CalculatorListContainer
      title="Math calculator"
      subTitle="Apply any operation in mathematics with the steps shown."
      description={`This page will help you to explore various kinds of calculators from
          the domain of Pre-Algebra, Algebra, Pre-Calculus, Calculus, Linear
          Algebra, Probability, Discrete Maths, Statistics, Linear Programming
          with the steps shown.`}
      buttonList={MathConstants}
    />
  );
};
export default MathList;
