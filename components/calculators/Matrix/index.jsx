import React from 'react';
import { MatrixContants } from './MatrixContants';
import CalculatorListContainer from '../../common/CalculatorListContainer';

const MatrixList = () => {
  return (
    <CalculatorListContainer
      title={`Matrix Calculators`}
      subTitle={`Apply any operation on a matrix with the steps shown`}
      description={` This calculator page will help you to perform various matrix
      operations like addition, subtraction, multiplication, division, and
      raise to powers, and multiply the matrix by a scalar with the steps
      shown. It can also find the Trace, Transpose, Minor, Cofactor,
      Adjoint, Inverse, determinant, rref (reduced row echelon form), row
      space, null space, basis, diagonalization,rank, characteristic
      polynomial, gaussian elimination, gauss-jordan elimination, LU
      decomposition, QR factorization, Orthogonal complement, eigenvalues &
      eigenvectors, etc. of a matrix.`}
      buttonList={MatrixContants}
    />
  );
};

export default MatrixList;
