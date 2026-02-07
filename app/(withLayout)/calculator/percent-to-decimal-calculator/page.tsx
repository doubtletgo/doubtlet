import PercentToDecimal from '@/components/calculators/PercentToDecimal';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Percent to Decimal number Calculator | doubtlet.com',
  description:
    'This calculator will help you to convert the percent number to decimal with the steps shown',
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
          breadcrumbText6="to Decimal"
          breadcrumbUrl6="/calculator/percent-to-decimal-calculator/"
        />
        <h1 className="text-primary">Percent to Decimal calculator</h1>
        <span>
          This calculator will help you to convert Percent to a Decimal number
          with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Decimal to Percent calculator"
            url="/calculator/decimal-to-percent-calculator/"
          />
          <Button
            name="Percent to Fraction calculator"
            url="/calculator/percent-to-fraction-calculator/"
          />
        </span>
        <hr />
        <PercentToDecimal />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
