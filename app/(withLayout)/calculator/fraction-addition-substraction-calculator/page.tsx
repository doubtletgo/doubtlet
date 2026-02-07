import FractionAdditionSubstraction from '@/components/calculators/FractionAdditionSubstraction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Fraction Addition or Subtraction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to add/subtract all the fractions with the steps shown.',
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
          breadcrumbText4="Pre Algebra"
          breadcrumbUrl4="/calculator/pre-algebra/"
          breadcrumbText5="Fraction"
          breadcrumbUrl5="/calculator/fraction-operations/"
          breadcrumbText6="Add and Subtract"
          breadcrumbUrl6="/calculator/fraction-addition-substraction-calculator/"
        />
        <h1 className="text-primary">
          Fraction Addition or Subtraction Calculator
        </h1>
        <span>
          This calculator will help you to add/subtract all the fractions with
          the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Fraction Multiplication Calculator"
            url="/calculator/fraction-multiplication-calculator/"
          />
          <Button
            name="Fraction Reduction Calculator"
            url="/calculator/fraction-reduction-calculator/"
          />
        </span>
        <hr />

        <FractionAdditionSubstraction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
