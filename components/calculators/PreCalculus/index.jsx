import React from 'react';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import { PreCalculusConstants } from './PreCalculusConstants';
import BreadCrumbs from '../../common/BreadCrumbs';
const PreCalculusList = () => {
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
      />
      <CalculatorListContainer
        title=" Pre Calculus Calculators"
        subTitle="Apply any operation in Pre-Calculus domain of mathematics with the steps shown."
        description={`This page will help you to explore various kinds of calculators from the domain of Pre-Calculus like trigonometry, Coordinates conversion, operations on Polyomials, Complex numbers and Coordinate geometry with the steps shown.`}
        buttonList={PreCalculusConstants}
      />
    </>
  );
};
export default PreCalculusList;
