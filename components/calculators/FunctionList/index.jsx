import React from 'react';
import { FunctionContants } from './FunctionContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const FunctionList = () => {
  return (
    <CalculatorListContainer
      metaTitle={`Function Calculator`}
      metaDescription={`This calculator page will help you to perform various function operations
      like Sin, Cos, Tan, Cot, Cosec, Sec, Arcsin, Arccos, Arctan,
      Arccot, Arcsec, Arccosec with the steps shown. It can also
      find the angle, scalar/vector triple product, angle with coordinate
      axes, the volume of a parallelopiped, etc. of a vector.`}
      title={`Function Calculator`}
      subTitle={`Apply any operation on a vector with steps`}
      description={`This calculator page will help you to perform various vector
      operations like Sin, Cos, Tan, Cot, Cosec, Sec, Arcsin, Arccos,
      Arctan, Arccot, Arcsec, Arccosec with the steps shown. It can also
      find the angle, scalar/vector triple product, angle with coordinate
      axes, the volume of a parallelopiped, etc. of a vector.`}
      buttonList={FunctionContants}
    />
  );
};

export default FunctionList;
