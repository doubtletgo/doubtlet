import FractionReduction from '@/components/calculators/FractionReduction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Fraction Reduction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to reduce any fraction to its lowest form with the steps shown.',
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
          breadcrumbText6="Reduction"
          breadcrumbUrl6="/calculator/fraction-reduction-calculator/"
        />
        <h1 className="text-primary">Fraction Reduction Calculator</h1>
        <span>
          This calculator will help you to reduce any fraction to its lowest
          form with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Fraction Multiplication Calculator"
            url="/calculator/fraction-multiplication-calculator/"
          />
          <Button
            name="Fraction Comparison Calculator"
            url="/calculator/comparing-fractions-calculator/"
          />
        </span>
        <hr />

        <FractionReduction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
