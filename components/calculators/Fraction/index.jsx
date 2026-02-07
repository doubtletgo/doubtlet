import React from 'react';
import { FractionContants } from './FractionContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const FractionList = () => {
  return (
    <CalculatorListContainer
      title={`Fraction Calculators`}
      subTitle={`Apply any operation on a Fraction with steps`}
      description={` This page will help you to explore various kinds of calculators from the domain 
      of Fractions like Addition, Subtraction, Multiplication, Division, Comparison, 
      Reduction, Mixed to improper, and Improper to mixed with the steps shown.`}
      buttonList={FractionContants}
    />
  );
};

export default FractionList;
