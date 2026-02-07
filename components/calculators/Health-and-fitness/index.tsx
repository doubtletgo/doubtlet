import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { FitnessConstants } from './FitnessConstants';

const HealthAndFitness = () => {
  return (
    <>
      <CalculatorListContainer
        title="Health & Fitness Calculators"
        subTitle="Achieve your health and fitness goals with precision using our Fitness Calculators, complete with step-by-step explanations."
        description={`Explore our Health & Fitness Calculators to calculate BMI, Period date, calories burned, target heart rate, and more. Achieve your health and fitness goals with step-by-step guidance tailored to your needs.`}
        buttonList={FitnessConstants}
      />
    </>
  );
};

export default HealthAndFitness;
