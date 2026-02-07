import VectoScalarMultiplication from '@/components/calculators/VectoScalarMultiplication';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Vector Scalar multiplication Calculator | Doubtlet.com',
  description:
    'This calculator will help you to multiply any scalar quantity with any vector by Step by Step method with the shown',
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
          breadcrumbText5="Vectors"
          breadcrumbUrl5="/calculator/vector-operations/"
          breadcrumbText6="Scalar Multiplication"
          breadcrumbUrl6="/calculator/vector-scalar-multiplication-calculator/"
        />
        <h1 className="text-primary">
          Vector Scalar multiplication Calculator
        </h1>
        <span>
          This calculator will help you to multiply any scalar quantity with any
          vector with the steps shown.
        </span>
        <hr />
        <VectoScalarMultiplication />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
