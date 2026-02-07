import MatrixDivision from '@/components/calculators/MatrixDivision';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Matrix Division Calculator | Doubtlet.com',
  description:
    'This calculator will help you to divide two matrices at a time with the steps shown.',
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
          breadcrumbText6="Division"
          breadcrumbUrl6="/calculator/matrix-division/"
        />
        <h1 className="text-primary">Matrix Division Calculator</h1>
        <span>
          This calculator will help you to divide two matrices at a time with
          the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Matrix Multiplication Calculator"
            url="/calculator/matrix-multiplication/"
          />
          <Button
            name="Matrix Addition/Subtraction Calculator"
            url="/calculator/matrices-addition-or-subtraction/"
          />
        </span>
        <hr />
        <MatrixDivision />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
