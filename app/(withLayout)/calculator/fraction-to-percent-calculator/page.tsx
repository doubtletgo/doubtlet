import FractionNumberToPercentage from '@/components/calculators/FractionNumberToPercentage';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Fraction to Percent Calculator - Convert Fractions Easily | Doubtlet.com',
  description:
    'Quickly convert fractions to percentages with our free online calculator. Simple, accurate, and perfect for math problems and everyday calculations."',
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
          breadcrumbText6="To Percent"
          breadcrumbUrl6="/calculator/fraction-to-percent-calculator/"
        />
        <h1 className="text-primary">Fraction to Percent Calculator</h1>
        <span>
          This calculator will help you to convert Fraction into Percent value
          with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Percent to Fraction calculator"
            url="/calculator/percent-to-fraction-calculator/"
          />
          <Button
            name="Fraction Reduction Calculator"
            url="/calculator/fraction-reduction-calculator/"
          />
        </span>
        <hr />

        <FractionNumberToPercentage />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
