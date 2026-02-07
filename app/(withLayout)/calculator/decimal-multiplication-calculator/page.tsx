import DecimalMultiplication from '@/components/calculators/DecimalMultiplication';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Decimal multiplication Calculator | Doubtlet.com',
  description:
    'This calculator will help you to multiply decimal numbers with the steps shown by Step by Step method',
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
          breadcrumbText6="Multiplication"
          breadcrumbUrl6="/calculator/decimal-multiplication-calculator/"
        />
        <h1 className="text-primary">Decimal multiplication Calculator</h1>
        <span>
          This calculator will help you to multiply decimal numbers with the
          steps shown.
          <br />
          Related Calculators:
          <Button
            name="Decimal number subtraction Calculator"
            url="/calculator/decimal-subtraction-calculator/"
          />
          <Button
            name="Decimal number to fraction calculator"
            url="/calculator/decimal-to-fraction-calculator/"
          />
        </span>
        <hr />

        <DecimalMultiplication />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
