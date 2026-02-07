import React from 'react';
import CalculatorListContainer from '@/components/common/CalculatorListContainer';
import { CartesianConstants } from './CartesianConstants';

const CartesianList = () => {
  return (
    <>
      <CalculatorListContainer
        title="Coordinates Conversion Calculators"
        subTitle="Apply any operation in the Pre-Calculus's Coordinates Conversion domain with the steps shown."
        description="This page will help you to explore various kinds of calculators from the Coordinates 
      Conversion domain of Pre-Calculus, like Polar to Cartesian, Cartesian to Polar, Cartesian to Cylindrical, 
      Cartesian to Spherical, Cylindrical to Cartesian, Cylindrical to Spherical, Spherical to Cartesian, 
      and Spherical to Cylindrical with the steps shown."
        buttonList={CartesianConstants}
      />
    </>
  );
};

export default CartesianList;
