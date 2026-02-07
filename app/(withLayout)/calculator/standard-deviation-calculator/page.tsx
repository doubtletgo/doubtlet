import StandardDeviation from '@/components/calculators/StandardDeviation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Standard Deviation Calculator - Step-by-Step Results for Data Analysis | Doubtlet.com',
  description:
    'Easily calculate the standard deviation and variance of your data set with our free online Standard Deviation Calculator. Get step-by-step explanations and instant results for accurate data analysis.',
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
          breadcrumbUrl5="/calculator/standard-deviation-calculator/"
          breadcrumbText5="Standard Deviation Calculator"
        />
        <h1 className="text-primary">Standard Deviation Calculator</h1>
        <span>
          This calculator will help you to calculate the standard deviation for
          the given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Variance Calculator"
            url="/calculator/variance-calculator/"
          />
          <Button name="Mode Calculator" url="/calculator/mode-calculator/" />
        </span>
        <hr />
        <StandardDeviation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
