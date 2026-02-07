import LongDivisionWithRemainder from '@/components/calculators/LongDivisionWithRemainder';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Long division method with remainder Calculator | Doubtlet.com',
  description:
    'This calculator will help you to perform the long division with remainder with the steps shown by Step by Step method',
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
          breadcrumbText5="Long Division Method With Remainder"
          breadcrumbUrl5="/calculator/long-division-calculator-with-remainders/"
        />
        <h1 className="text-primary">
          Long division method with remainder Calculator
        </h1>
        <span>
          This calculator will help you to perform the long division with
          remainder with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Long division method with decimal Calculator"
            url="/calculator/long-division-calculator-with-decimals/"
          />
        </span>
        <hr />
        <LongDivisionWithRemainder />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
