import RationalZerosTheorem from '@/components/calculators/RationalZerosTheorem';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Rational Zeros Theorem Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find all possible rational roots of the given polynomial with the steps shown.',
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
          breadcrumbText4="Algebra"
          breadcrumbUrl4="/calculator/algebra/"
          breadcrumbText5="Rational Zeros Theorem"
          breadcrumbUrl5="/calculator/rational-zeros-theorem-calculator/"
        />
        <h1 className="text-primary">Rational Zeros Theorem Calculator</h1>
        <span>
          This calculator will help you to find all possible rational roots of
          the given polynomial with the steps shown.
          <br /> Related Calculator:
          <Button
            name="Remainder Theorem Calculator"
            url="/calculator/remainder-theorem-calculator/"
          />
        </span>
        <hr />
        <RationalZerosTheorem />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
