import RemainderTheorem from '@/components/calculators/RemainderTheorem';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Remainder Theorem Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the remainder while dividing two polynomials with the steps shown.',
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
          breadcrumbText5="Remainder Theorem Calculator"
          breadcrumbUrl5="/calculator/remainder-theorem-calculator/"
        />
        <h1 className="text-primary">Remainder Theorem Calculator</h1>
        <span>
          This calculator will help you to calculate the remainder while
          dividing two polynomials with the steps shown.
          <br /> Related Calculator:
          <Button
            name="Rational Zeros Theorem Calculator"
            url="/calculator/rational-zeros-theorem-calculator/"
          />
        </span>
        <hr />
        <RemainderTheorem />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
