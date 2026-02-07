import ArgumentofComplex from '@/components/calculators/ArgumentofComplex';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Argument of a Complex number Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the argument of a complex number  Z(a + ib) with the steps shown.',
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
          breadcrumbText6="Argument of a Complex Number"
          breadcrumbUrl6="/calculator/calculator/argument-of-a-complex-number-calculator"
        />
        <h1 className="text-primary">
          Argument of a Complex number Calculator
        </h1>
        <span>
          This calculator will help you to calculate the argument of a complex
          number Z(a + ib) with steps shown.
          <br /> Related Calculators:
          <Button
            name="Polar form of a Complex number Calculator"
            url="/calculator/polar-form-of-a-complex-number/"
          />
        </span>
        <hr />
        <ArgumentofComplex />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
