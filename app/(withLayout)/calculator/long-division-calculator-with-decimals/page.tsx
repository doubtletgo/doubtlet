import LongDivisionMethodWithDecimal from '@/components/calculators/LongDivisionMethodWithDecimal';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Long Division Method With Decimal Calculator | Doubtlet.com',
  description:
    'This calculator will help you to perform the long division with the quotient in decimal with the steps shown.',
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
          breadcrumbText5="Long Division Method With Decimal"
          breadcrumbUrl5="/calculator/long-division-calculator-with-decimals/"
        />
        <h1 className="text-primary">
          Long Division Method With Decimal calculator
        </h1>
        <span>
          This calculator will help you to perform the long division with the
          quotient in decimal with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Long division method with remainder Calculator"
            url="/calculator/long-division-calculator-with-remainders/"
          />
        </span>
        <hr />
        <LongDivisionMethodWithDecimal />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
