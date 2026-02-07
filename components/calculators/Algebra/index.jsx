import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { AlgebraConstants } from './AlgebraConstants';

const ALgebraList = () => {
  return (
    <>
      <CalculatorListContainer
        title="Algebra Calculators"
        subTitle="Apply any operation in the Algebra domain of mathematics with the steps shown."
        description={`This page will help you to explore various kinds of calculators from
       the domain of Algebra like Quadratic equation, Binomial expansion,
          Solving algebraic equations, Sequence and series, Permutation and
          Combination with the steps shown.`}
        buttonList={AlgebraConstants}
      />
    </>
  );
};

export default ALgebraList;
