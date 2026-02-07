import FractionNumberToDecimal from '@/components/calculators/FractionNumberToDecimal';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Fraction number to decimal Calculator | Doubtlet.com',
  description:
    'This calculator will help you to convert the fractional number to the decimal with the steps shown.',
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
          breadcrumbText6="To Decimal"
          breadcrumbUrl6="/calculator/fraction-to-decimal-calculator/"
        />
        <h1 className="text-primary">Fraction number to decimal Calculator</h1>
        <span>
          This calculator will help you to convert the fraction number to the
          decimal with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Decimal number to fraction calculator"
            url="/calculator/decimal-to-fraction-calculator/"
          />
          <Button
            name="Fraction Reduction Calculator"
            url="/calculator/fraction-reduction-calculator/"
          />
        </span>
        <hr />

        <FractionNumberToDecimal />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
