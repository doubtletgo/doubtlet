import React from 'react';
import { VectorContants } from './VectorContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';
import BreadCrumbs from '../../common/BreadCrumbs';
const VectorLists = () => {
  return (
    <>
      <BreadCrumbs
        breadcrumbUrl1="/"
        breadcrumbText1="Home"
        breadcrumbUrl2="/subjects/"
        breadcrumbText2="Subjects"
        breadcrumbText3="Maths"
        breadcrumbUrl3="/calculator/math/"
        breadcrumbText4="Linear Algebra"
        breadcrumbUrl4="/calculator/linear-algebra/"
        breadcrumbText5="Vectors"
        breadcrumbUrl5="/calculator/vector-operations/"
      />
      <CalculatorListContainer
        title={`Vector Calculators`}
        subTitle={`Apply any operation on a vector with the steps shown`}
        description={`This calculator page will help you to perform various vector
          operations like addition, subtraction, scalar multiplication, dot
          product, cross product, magnitude, unit, projection with the steps
          shown. It can also find the angle, scalar/vector triple product, angle
          with coordinate axes, the volume of a parallelopiped, etc. of a
          vector.`}
        buttonList={VectorContants}
      />
    </>
  );
};

export default VectorLists;
