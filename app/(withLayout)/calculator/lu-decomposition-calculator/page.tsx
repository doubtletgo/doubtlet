import LUDecompositionCalculator from '@/components/calculators/LUDecompositionCalculator';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'LU Decomposition Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the LU decomposition of a matrix of any order at a time with the steps shown.',
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
          breadcrumbText6="LU Decomposition"
          breadcrumbUrl6="/calculator/lu-decomposition-calculator/"
        />
        <h1 className="text-primary">LU Decomposition Calculator</h1>
        <span>
          This calculator will help you to calculate the LU decomposition of a
          matrix of any order at a time with the steps shown.
          <br /> Related Calculators:
          <Button
            name="QR Factorization Calculator"
            url="/calculator/qr-factorization-calculator/"
          />
        </span>
        <hr />
        <LUDecompositionCalculator />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
