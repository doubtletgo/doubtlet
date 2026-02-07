import PrimeFactorisation from '@/components/calculators/PrimeFactorisation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Prime Factorisation Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the prime factorisation of any Natural number with steps shown  Step by Step method',
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
          breadcrumbText5="Prime Factorization"
          breadcrumbUrl5="/calculator/prime-factorization-calculator/"
        />
        <h1 className="text-primary">Prime Factorisation Calculator</h1>
        <span>
          This calculator will help you to find the prime factorisation of any
          Natural number with the steps shown.
          <br />
          Related Calculators:
          <Button name="LCM Calculator" url="/calculator/lcm-calculator/" />
          <Button name="GCD Calculator" url="/calculator/hcf-calculator/" />
        </span>
        <hr />
        <PrimeFactorisation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
