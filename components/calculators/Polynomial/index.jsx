import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { PolynomialsConstants } from './PolynomialsConstants';

const PolynomialsList = () => {
  return (
    <CalculatorListContainer
      title="Polynomial Calculators"
      subTitle="Apply any operation in the Pre-Calculus's Polynomial domain with the steps shown."
      description="This page will help you to explore various kinds of calculators from the Polynomial 
      domain of Pre-Calculus, like finding addition, subtraction, multiplication, division, and factorization, 
      with the steps shown."
      buttonList={PolynomialsConstants}
    />
  );
};

export default PolynomialsList;
