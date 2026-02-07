import HighestCommonFactor from '@/components/calculators/HighestCommonFactor';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Highest common factor (HCF) or Greatest Common Divisior (GCD) Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Greatest Common Divisior or Highest common factor of given numbers with steps shown by Step by Step method',
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
          breadcrumbText5="Greatest Common Divisior GCD"
          breadcrumbUrl5="/calculator/hcf-calculator/"
        />
        <h1 className="text-primary">
          Greatest Common Divisior (GCD) Calculator
        </h1>
        <span>
          This calculator will help you to find the Greatest Common Divisior of
          given numbers with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Prime Factorisation Calculator"
            url="/calculator/prime-factorization-calculator/"
          />
          <Button name="LCM Calculator" url="/calculator/lcm-calculator/" />
        </span>
        <hr />
        <HighestCommonFactor />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
