import GeometricMean from '@/components/calculators/geometricMean';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Geometric Mean Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Geometric Mean for given set of numbers with the Steps shown.',
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
          breadcrumbText6="Geometric Mean"
          breadcrumbUrl6="/calculator/geometric-mean-calculator/"
        />
        <h1 className="text-primary">Geometric Mean Calculator</h1>
        <span>
          This calculator will help you to find the Geometric Mean for given set
          of numbers.
          <br />
          Related Calculators:
          <Button
            name="Arithmetic Mean Calculator"
            url="/calculator/arithmetic-mean-calculator/"
          />
          <Button
            name="Harmonic Mean Calculator
"
            url="/calculator/harmonic-mean-calculator/"
          />
        </span>
        <hr />
        <GeometricMean />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
