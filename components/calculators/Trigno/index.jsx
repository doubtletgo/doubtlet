import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { TrignoConstants } from './TrignoConstants';
import BreadCrumbs from '../../common/BreadCrumbs';
const TrignoList = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Pre Calculus"
        breadcrumbUrl4="/calculator/pre-calculus/"
        breadcrumbText5="Trignometry"
        breadcrumbUrl5="/calculator/trignometry/"
      />
      <CalculatorListContainer
        title="Trigonometry Calculators"
        subTitle="Apply any operation in the Pre-Calculus's Trigonometry domain with the steps shown."
        description="This page will help you to explore various kinds of calculators from the Trigonometry 
      domain of Pre-Calculus, like sin, cos, tan, cot, cosec, sec, arcsin, arccos, arctan, arccot, 
      arccosec, arcsec, sinh, cosh, tanh, coth, cosech, sech, arcsinh, arccosh, arctanh, arccoth, 
      arccosech, arcsech with the steps shown."
        buttonList={TrignoConstants}
      />
    </>
  );
};

export default TrignoList;
