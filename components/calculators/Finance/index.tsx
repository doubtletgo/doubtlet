import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { FinanceConstants } from './FinanceConstants';

const Finance = () => {
  return (
    <>
      <CalculatorListContainer
        title="Finance Calculators"
        subTitle="Explore Finance calculators for diverse purposes, from pay commissions to taxes, with detailed step-by-step guidance."
        description={`Discover our Finance Calculators, including 8th Pay Commission, tax calculators, space travel cost and more. Simplify complex calculations with step-by-step solutions tailored for various needs.`}
        buttonList={FinanceConstants}
      />
    </>
  );
};

export default Finance;
