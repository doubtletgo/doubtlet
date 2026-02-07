import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { OtherConstants } from './OtherConstants';

const Other = () => {
  return (
    <>
      <CalculatorListContainer
        title="Other Calculators"
        subTitle="Achieve your health and fitness goals with precision using our Fitness Calculators, complete with step-by-step explanations."
        description={`Explore our Health & Fitness Calculators to calculate BMI, calories burned, target heart rate, weight on mars and more. Achieve your health and fitness goals with step-by-step guidance tailored to your needs.`}
        buttonList={OtherConstants}
      />
    </>
  );
};

export default Other;
