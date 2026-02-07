import React from 'react';
import { ThreeDContants } from './ThreeDContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import BreadCrumbs from '../../common/BreadCrumbs';
const ThreeDList = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Calculus"
        breadcrumbUrl4="/calculator/calculus/"
        breadcrumbText5="3D"
        breadcrumbUrl5="/calculator/three-dimension-3d/"
      />
      <CalculatorListContainer
        title={`Line and Plane in 3-D Calculator `}
        subTitle={`Apply any operation on a Line and Plane in 3-D with steps`}
        description={`This calculator page will help you to deal with operations of lines
          and planes in 3-d like distance, equation, point of intersection, line
          of intersection, angle etc. with the steps shown.`}
        buttonList={ThreeDContants}
      />
    </>
  );
};

export default ThreeDList;
