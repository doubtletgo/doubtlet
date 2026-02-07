import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { PermutationAndCombinationConstants } from './PermutationAndCombinationConstants';
import BreadCrumbs from '../../common/BreadCrumbs';
const PermutationAndCombinationList = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Algebra"
        breadcrumbUrl4="/calculator/algebra/"
        breadcrumbText5="Permutation And Combination"
        breadcrumbUrl5="/calculator/permutation-and-combination/"
      />
      <CalculatorListContainer
        title="Permutation and Combination Calculator"
        subTitle="Effortlessly Calculate Permutations and Combinations for Any Scenario"
        description="Use our free Permutation and Combination Calculator to quickly compute the total number of arrangements or selections. Perfect for solving probability, statistics, and combinatorics problems with step-by-step explanations."
        buttonList={PermutationAndCombinationConstants}
      />
    </>
  );
};

export default PermutationAndCombinationList;
