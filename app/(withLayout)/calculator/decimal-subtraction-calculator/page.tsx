import DecimalNumberSubtraction from '@/components/calculators/DecimalNumberSubtraction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Decimal number Subtraction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to subtract two decimal numbers with the steps shown.by Step by Step method',
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
          breadcrumbText6="Subtraction"
          breadcrumbUrl6="/calculator/decimal-subtraction-calculator/"
        />
        <h1 className="text-primary">Decimal number subtraction Calculator</h1>
        <span>
          This calculator will help you to subtract two decimal numbers with the
          steps shown.
          <br />
          Related Calculators:
          <Button
            name="Decimal number Addition Calculator"
            url="/calculator/decimal-addition-calculator/"
          />
          <Button
            name="Decimal number to fraction calculator"
            url="/calculator/decimal-to-fraction-calculator/"
          />
        </span>
        <hr />
        <DecimalNumberSubtraction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
