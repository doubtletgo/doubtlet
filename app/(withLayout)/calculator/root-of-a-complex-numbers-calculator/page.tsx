import RootOfAComplexNumbers from '@/components/calculators/RootOfAComplexNumbers';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Roots of a Complex number Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the nth-roots of a given complex number Z(a + ib) using de Moivre’s formula with steps shown.',
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
          breadcrumbText6="Roots"
          breadcrumbUrl6="/calculator/root-of-a-complex-numbers-calculator/"
        />
        <h1 className="text-primary">Root of a Complex Numbers Calculator</h1>
        <span>
          This calculator will help you to calculate the nth-roots of a given
          complex number Z(a + ib) using de Moivre’s formula with the steps
          shown.
          <br />
          Related Calculators:
          <Button
            name="Complex Number Polar Form Calculator"
            url="/calculator/polar-form-of-a-complex-number/"
          />
          <Button
            name="Complex Number Argument Calculator"
            url="/calculator/argument-of-a-complex-number-calculator/"
          />
        </span>
        <hr />
        <RootOfAComplexNumbers />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
