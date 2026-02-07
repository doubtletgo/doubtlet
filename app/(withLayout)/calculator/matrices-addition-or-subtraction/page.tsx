import MatricesAdditionOrSubtraction from '@/components/calculators/MatricesAdditionOrSubtraction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Matrices Addition or Subtraction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to add or subtract two matrices at a time with the steps shown.',
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
          breadcrumbText6="Add and Subtract"
          breadcrumbUrl6="/calculator/matrices-addition-or-subtraction/"
        />
        <h1 className="text-primary">
          Matrices Addition or Subtraction Calculator
        </h1>
        <span>
          This calculator will help you to add or subtract two matrices at a
          time.
          <br />
          Related Calculators:
          <Button
            name="Matrix Multiplication Calculator"
            url="/calculator/matrix-multiplication/"
          />
          <Button
            name="Matrix Division Calculator"
            url="/calculator/matrix-division/"
          />
        </span>
        <hr />
        <MatricesAdditionOrSubtraction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
