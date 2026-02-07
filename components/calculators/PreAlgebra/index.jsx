import React from 'react';
import { PreAlgebraContants } from './PreAlgebraContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import BreadCrumbs from '../../common/BreadCrumbs';
const PreAlgebraList = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Pre Algebra"
        breadcrumbUrl4="/calculator/pre-algebra/"
      />
      <CalculatorListContainer
        title={`Pre Algebra Calculators`}
        subTitle={`Apply any operation in the Pre-Algebra domain of mathematics with the steps shown.`}
        description={`This page will help you to explore various kinds of calculators from the domain of Pre-Algebra 
      like the order of operations, Prime factorization, LCM, GCD, Factors, Modulo, and Factorial along 
      with Operation on Fractions, Decimals, and Percent with the steps shown.`}
        buttonList={PreAlgebraContants}
      />
    </>
  );
};

export default PreAlgebraList;
