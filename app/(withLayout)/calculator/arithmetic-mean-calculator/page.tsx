import ArithmeticMean from '@/components/calculators/arithmeticMean';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Arithmetic Mean(Average) Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Arithmetic Mean or Average for given set of numbers with the Steps shown',
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
          breadcrumbText5="Sequence and Series"
          breadcrumbUrl5="/calculator/sequence-and-series/"
          breadcrumbText6="Arithmetic Mean"
          breadcrumbUrl6="/calculator/arithmetic-mean-calculator/"
        />
        <h1 className="text-primary">Arithmetic Mean (Average) Calculator</h1>
        <span>
          This calculator will help you to find the Arithmetic Mean or Average
          for given set of numbers.
          <br />
          Related Calculators:
          <Button
            name="Geometric Mean Calculator"
            url="/calculator/geometric-mean-calculator/"
          />
          <Button
            name="Harmonic Mean Calculator
"
            url="/calculator/harmonic-mean-calculator/"
          />
        </span>
        <hr />
        <ArithmeticMean />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
