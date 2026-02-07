import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { LinearAlgebraConstants } from './LinearAlgebraConstants';

const LinearAlgebraList = () => {
  return (
    <CalculatorListContainer
      title="Linear Algebra Calculators"
      subTitle="Apply any operation in Linear algebra domain of mathematics with the steps shown."
      description="This page will help you to explore various kinds of calculators from the domain of Linear algebra like Operation on Matrices and Vectors with the steps shown."
      buttonList={LinearAlgebraConstants}
    />
  );
};

export default LinearAlgebraList;
