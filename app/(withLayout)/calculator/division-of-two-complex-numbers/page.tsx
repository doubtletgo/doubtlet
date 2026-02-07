import DivisionOfTwoComplexNumbers from '@/components/calculators/DivisionOfTwoComplexNumbers';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Division of two Complex Numbers Calculator | Doubtlet.com',

  description:
    'This calculator will help you to divide two complex numbers at a time with steps shown.',
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
          breadcrumbText4="Pre Calculus"
          breadcrumbUrl4="/calculator/pre-calculus/"
          breadcrumbText5="Complex Numbers"
          breadcrumbUrl5="/calculator/complex-numbers/"
          breadcrumbText6="Division"
          breadcrumbUrl6="/calculator/Division-of-two-complex-numbers-calculator/"
        />
        <h1 className="text-primary">
          Division of two Complex Numbers Calculator
        </h1>
        <span>
          This calculator will help you to divide two complex numbers at a time
          with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Multiplication of Complex Numbers Calculator"
            url="/calculator/multiplication-of-two-complex-numbers/"
          />
          <Button
            name="Inverse of a Complex Number Calculator"
            url="/calculator/inverse-of-a-complex-numbers/"
          />
        </span>
        <hr />
        <DivisionOfTwoComplexNumbers />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
