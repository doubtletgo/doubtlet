import PolarFormOfAComplexNumber from '@/components/calculators/PolarFormOfAComplexNumber';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Polar form of a Complex number Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Polar form of a complex number Z(a+ib) with steps shown.',
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
          breadcrumbText6="Polar Form"
          breadcrumbUrl6="/calculator/polar-form-of-a-complex-number/"
        />
        <h1 className="text-primary">
          Polar form of a Complex number Calculator
        </h1>
        <span>
          This calculator will help you to calculate the Polar form of a complex
          number Z(a+ib) with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Complex Number Roots Calculator"
            url="/calculator/root-of-a-complex-numbers-calculator/"
          />
          <Button
            name="Complex Number Argument Calculator"
            url="/calculator/argument-of-a-complex-number-calculator/"
          />
        </span>
        <hr />
        <PolarFormOfAComplexNumber />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
