import FactorsOfANumber from '@/components/calculators/FactorsOfANumber';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Factors of a Number Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the factors of an Integer with steps shown.',
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
          breadcrumbText5="Factors of a Number"
          breadcrumbUrl5="/calculator/factor-calculator/"
        />
        <h1 className="text-primary">Factors of a Number Calculator</h1>
        <span>
          This calculator will help you to find the factors of an Integer with
          the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Prime Factorisation Calculator"
            url="/calculator/prime-factorization-calculator/"
          />
          <Button
            name="Lowest common multiple (LCM) Calculator"
            url="/calculator/lcm-calculator/"
          />
        </span>
        <hr />
        <FactorsOfANumber />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
