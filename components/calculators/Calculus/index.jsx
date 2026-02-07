import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { CalculusConstants } from './CalculusConstants';

const CalculusList = () => {
  return (
    <CalculatorListContainer
      title="Calculus Calculators"
      subTitle="Apply any operation in Calculus domain of mathematics with the steps shown."
      description="This page will help you to explore various kinds of calculators from the domain of Calculus like function, limits, derivatives, integral, series and numerical analysis with the steps shown."
      buttonList={CalculusConstants}
    />
  );
};

export default CalculusList;
