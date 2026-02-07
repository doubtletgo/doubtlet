import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { StatisticsConstants } from './StatisticsConstants';
import BreadCrumbs from '../../common/BreadCrumbs';

const SequenceList = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Probability & Statistics"
        breadcrumbUrl4="/calculator/probability-and-statistics/"
      />
      <CalculatorListContainer
        title="Probability & Statistics Calculators"
        subTitle="Perform Probability and Statistical Calculations with Detailed Steps."
        description="Discover a wide range of Probability & Statistics calculators designed to simplify data analysis, probability distributions, hypothesis testing, and more. Free and easy-to-use tools for students, researchers, and professionals."
        buttonList={StatisticsConstants}
      />
    </>
  );
};

export default SequenceList;
