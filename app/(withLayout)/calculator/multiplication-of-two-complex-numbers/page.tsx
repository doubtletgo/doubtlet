import MultiplicationOfTwoComplexNumbers from '@/components/calculators/MultiplicationOfTwoComplexNumbers';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Multiplication of Complex Numbers Calculator | Doubtlet.com',
  description:
    'This calculator will help you to multiply two complex numbers at a time with steps shown.',
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
          breadcrumbText6="Multiplication"
          breadcrumbUrl6="/calculator/multiplication-of-complex-numbers/"
        />{' '}
        <h1 className="text-primary">
          Multiplication of Complex Numbers Calculator
        </h1>
        <span>
          This calculator will help you to multiply two complex numbers Z
          <sub>1</sub> (a + ib) & Z<sub>2</sub> (c + id) at a time with the
          steps shown.
          <br /> Related Calculators:
          <Button
            name="Inverse of a Complex Number Calculator"
            url="/calculator/inverse-of-a-complex-numbers/"
          />
          <Button
            name="Division of Complex Numbers Calculator"
            url="/calculator/division-of-two-complex-numbers/"
          />
        </span>
        <hr />
        <MultiplicationOfTwoComplexNumbers />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
