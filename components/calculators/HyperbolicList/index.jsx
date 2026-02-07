import React from 'react';
import { HyperbolicContants } from './HyperbolicContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const HyperbolicList = () => {
  return (
    <CalculatorListContainer
      metaTitle="Hyperbolic Calculator"
      metaDescription={`This calculator page will help you to perform various hyperbolic operations
      like Sinh, Cosh, Tanh, Coth, Sech, Cosech, Arcsinh, Arccosh,
      Arctanh, Arccoth, Arccosech, Arcsech with the steps shown. It can also
      find the angle, scalar/vector triple product, angle with coordinate
      axes, the volume of a parallelopiped, etc. of a vector.`}
      title="Hyperbolic Calculator"
      subTitle="Apply any operation on a hyperbolic with steps"
      description={` This calculator page will help you to perform various hyperbolic
      operations like Sinh, Cosh, Tanh, Coth, Sech, Cosech, Arcsinh,
      Arccosh, Arctanh, Arccoth, Arccosech, Arcsech with the steps shown. It
      can also find the angle, scalar/vector triple product, angle with
      coordinate axes, the volume of a parallelopiped, etc. of a vector.`}
      buttonList={HyperbolicContants}
    />
  );
};

export default HyperbolicList;
