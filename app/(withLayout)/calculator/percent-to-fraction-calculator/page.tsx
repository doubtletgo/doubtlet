import PercentToFraction from '@/components/calculators/PercentToFraction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Percent to Fraction number Calculator | doubtlet.com',
  description:
    'This calculator will help you to convert the percent number to Fraction with the steps shown',
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
          breadcrumbText5="Percentage"
          breadcrumbUrl5="/calculator/percentage/"
          breadcrumbText6="to Fraction"
          breadcrumbUrl6="/calculator/percent-to-fraction-calculator/"
        />
        <h1 className="text-primary">Percent to Fraction calculator</h1>
        <span>
          This calculator will help you to convert Percent to a Fraction number
          with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Fraction to Percent Calculator"
            url="/calculator/fraction-to-percent-calculator/"
          />
          <Button
            name="Percent to Decimal calculator"
            url="/calculator/percent-to-decimal-calculator/"
          />
        </span>
        <hr />
        <PercentToFraction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
