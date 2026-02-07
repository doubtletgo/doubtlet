import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { SequenceConstants } from './SequenceConstants';
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
        breadcrumbText4="Algebra"
        breadcrumbUrl4="/calculator/algebra/"
        breadcrumbText5="Sequence and Series"
        breadcrumbUrl5="/calculator/sequence-and-series/"
      />
      <CalculatorListContainer
        title="Sequence and Series Calculators"
        subTitle="Apply any operation in Algebra's Sequence and Series domain with the steps shown."
        description="This page will help you to explore various kinds of calculators from the Sequence 
      and Series domain of Algebra, like finding the nth term, sum, and mean of terms of arithmetic, 
      geometric, and harmonic series with the steps shown."
        buttonList={SequenceConstants}
      />
    </>
  );
};

export default SequenceList;
