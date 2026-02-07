import RangeOfDataSet from '@/components/calculators/RangeOfDataSet';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Range of Data Set Calculator - Quick & Accurate Tool for Data Analysis | Doubtlet.com',
  description:
    'Calculate the range of any data set instantly with our easy-to-use Range of Data Set Calculator. Perfect for students, researchers, and analysts to find the difference between maximum and minimum values quickly. Try it now!',
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
          breadcrumbUrl5="/calculator/range-of-data-set-calculator/"
          breadcrumbText5="Range of Data Set"
        />
        <h1 className="text-primary">Range of Data Set Calculator</h1>
        <span>
          Calculate the range of any data set instantly with our easy-to-use
          Range of Data Set Calculator.
          <br />
          Related Calculators:
          <Button
            name="Interquartile Range Calculator"
            url="/calculator/interquartile-range-calculator/"
          />
        </span>
        <hr />
        <RangeOfDataSet />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
