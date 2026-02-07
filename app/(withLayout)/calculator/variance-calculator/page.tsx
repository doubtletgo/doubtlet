import Variance from '@/components/calculators/Variance';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Variance Calculator - Quickly Compute Variance Online | Doubtlet.com',
  description:
    'Use our free Variance Calculator to compute variance and standard deviation for data sets. Easy-to-use tool for statistics, data analysis, and probability calculations. Try it now!',
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
          breadcrumbUrl4="/calculator/probability-and-statistics/"
          breadcrumbText4="Probability & Statistics"
          breadcrumbUrl5="/calculator/variance-calculator/"
          breadcrumbText5="Variance Calculator"
        />
        <h1 className="text-primary">Variance Calculator</h1>
        <span>
          This calculator will help you to calculate the variance for the given
          set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Standard Deviation Calculator"
            url="/calculator/standard-deviation-calculator/"
          />
          <Button name="Mode Calculator" url="/calculator/mode-calculator/" />
        </span>
        <hr />
        <Variance />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
