import Matrix from '@/components/calculators/Matrix';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Operation on Matrix Calculators | Doubtlet.com',
  description: `This calculator page will help you to perform various matrix operations 
      like addition, subtraction, multiplication, division, and raise to powers, 
      and multiply the matrix by a scalar with the steps shown. 
      It can also find the Trace, Transpose, Minor, Cofactor, 
      Adjoint, Inverse, determinant, rref (reduced row echelon form), 
      row space, null space, basis, diagonalization,rank, characteristic polynomial, 
      gaussian elimination, gauss-jordan elimination, LU decomposition, QR factorization, 
      Orthogonal complement, eigenvalues & eigenvectors, etc. of a matrix.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <BreadCrumbs
          breadcrumbUrl1="/"
          breadcrumbText1="Home"
          breadcrumbUrl2="/subjects/"
          breadcrumbText2="Subjects"
          breadcrumbText3="Maths"
          breadcrumbUrl3="/calculator/math/"
          breadcrumbText4="Linear Algebra"
          breadcrumbUrl4="/calculator/linear-algebra/"
          breadcrumbText5="Matrices"
          breadcrumbUrl5="/calculator/matrix-operations/"
        />
        <Matrix />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
