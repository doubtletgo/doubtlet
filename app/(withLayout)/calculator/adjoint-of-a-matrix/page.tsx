import AdjointOfAMatrix from '@/components/calculators/AdjointOfAMatrix';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Matrix Adjoint Calculator | Doubtlet.com',
  description:
    'Find the adjoint of any matrix with our Adjoint of a Matrix Calculator. Get step-by-step solutions for matrix adjoints, perfect for solving linear algebra problems in seconds.',
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
          breadcrumbText6="Adjoint"
          breadcrumbUrl6="/calculator/adjoint-of-a-matrix/"
        />
        <h1 className="text-primary">Adjoint of a Matrix Calculator</h1>
        <span>
          This calculator will help you to calculate the Adjoint of a square
          matrix at a time with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Matrix Determinant Calculator"
            url="/calculator/determinant-of-a-matrix/"
          />
          <Button
            name="Matrix Inverse Calculator"
            url="/calculator/inverse-of-a-matrix/"
          />
        </span>
        <hr />
        <AdjointOfAMatrix />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
