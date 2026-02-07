import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { PercentConstants } from './PercentConstants';

const PercentList = () => {
  return (
    <CalculatorListContainer
      title="Percentage Calculators"
      subTitle="Apply any operation for applying Percentage with the steps shown."
      description="This page will help you to explore various kinds of calculators from the domain 
      of Percentages like A percent of B, A is B percent of what, A is what percentage of B, 
      and Percentage difference with the steps shown."
      buttonList={PercentConstants}
    />
  );
};

export default PercentList;
