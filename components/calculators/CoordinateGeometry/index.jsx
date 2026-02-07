import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { CoordinateConstants } from './CoordinateConstants';

const CoordinateList = () => {
  return (
    <CalculatorListContainer
      title="Coordinate Geometry Calculators"
      subTitle="Apply any operation in the Pre-Calculus's Coordinate Geometry domain with the steps shown."
      description="This page will help you to explore various kinds of calculators from the Coordinate 
      Geometry domain of Pre-Calculus, like Line equation in 2d, Distance b/w 2 points, Slope of a line, 
      Midpoint of a line, Section Formula, Intersection of Lines, Centroid of Triangle, Incentre of Triangle, 
      Reflection of a point about a line, Foot of Perpendicular, Concurrency of Straight lines with the steps shown."
      buttonList={CoordinateConstants}
    />
  );
};

export default CoordinateList;
