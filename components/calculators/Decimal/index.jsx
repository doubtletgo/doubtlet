import React from 'react';
import { DecimalContants } from './DecimalContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const DecimalList = () => {
  return (
    <CalculatorListContainer
      title={`Decimal Number Calculators`}
      subTitle={`Apply any operation on a Decimal number with the steps shown`}
      description={`This page will help you explore various calculators from the domain of Decimal 
    numbers like Addition, Subtraction, Multiplication, Division, Decimal to Fraction, 
    and Fraction to Decimal with the steps shown.`}
      buttonList={DecimalContants}
    />
  );
};

export default DecimalList;
