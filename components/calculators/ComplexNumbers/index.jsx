import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { ComplexConstants } from './ComplexConstants';

const ComplexList = () => {
  return (
    <CalculatorListContainer
      title="Complex Number Calculators"
      subTitle="Apply any operation in the Pre-Calculus's Complex Number domain with the steps shown."
      description="This page will help you to explore various kinds of calculators from the Complex Number's 
      domain of Pre-Calculus, like Addition, Subtraction, Multiplication, Division, Imaginary Part, 
      Polar Form, Real Part, Modulus, Inverse, Conjugate, Argument, and Roots with the steps shown."
      buttonList={ComplexConstants}
    />
  );
};

export default ComplexList;
