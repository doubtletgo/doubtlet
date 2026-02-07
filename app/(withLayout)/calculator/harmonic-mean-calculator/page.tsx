import HarmonicMean from '@/components/calculators/HarmonicMean';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Harmonic Mean Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the Harmonic mean of the given values with steps shown.',
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
          breadcrumbText4="Probability & Statistics"
          breadcrumbUrl4="/calculator/probability-and-statistics/"
          breadcrumbText5="Harmonic Mean"
          breadcrumbUrl5="/calculator/harmonic-mean-calculator/"
        />
        <h1 className="text-primary">Harmonic Mean Calculator</h1>
        <span>
          This calculator will help you to obtain the Harmonic mean of the given
          values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Arithmetic Mean Calculator"
            url="/calculator/arithmetic-mean-calculator/"
          />
          <Button
            name="Geometric Mean Calculator"
            url="/calculator/geometric-mean-calculator/"
          />
        </span>
        <hr />
        <HarmonicMean />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
