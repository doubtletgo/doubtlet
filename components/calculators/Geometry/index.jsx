import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { GeometryConstants } from './GeometryConstants';

const GeometryList = () => {
  return (
    <CalculatorListContainer
      title="Geometry Calculators"
      subTitle="Solve any problem in Geometry domain of mathematics with the steps shown."
      description="This page will help you to explore various kinds of calculators from the domain of Geometry like Area, Perimeter, Volume, Total and Curved surface area with the steps shown."
      buttonList={GeometryConstants}
    />
  );
};

export default GeometryList;
