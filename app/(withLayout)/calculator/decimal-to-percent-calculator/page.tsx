import DecimalToPercent from '@/components/calculators/DecimalToPercent';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Decimal number to Percent Calculator | doubtlet.com',
  description:
    'This calculator will help you to convert decimal numbers into Percentage value with the steps shown',
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
          breadcrumbText5="Decimal"
          breadcrumbUrl5="/calculator/decimal-operations/"
          breadcrumbText6="to Percent"
          breadcrumbUrl6="/calculator/decimal-to-percent-calculator/"
        />
        <h1 className="text-primary">Decimal to Percent calculator</h1>
        <span>
          This calculator will help you to convert Decimal number to a Percent
          value with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Percent to Decimal calculator"
            url="/calculator/percent-to-decimal-calculator/"
          />
          <Button
            name="Decimal number to fraction calculator"
            url="/calculator/decimal-to-fraction-calculator/"
          />
        </span>
        <hr />
        <DecimalToPercent />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
