import BreadCrumbs from '@/components/common/BreadCrumbs';
import MarginOfError from '../../../../components/calculators/MarginOfError';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Margin of Error Calculator | Accurate & Easy-to-Use Tool | Doubtlet.com',
  description:
    'Calculate the margin of error for surveys, polls, and statistical data with our free online calculator. Quick, accurate results for confidence levels and sample sizes.',
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
          breadcrumbUrl5="/calculator/margin-of-error-calculator/"
          breadcrumbText5="Margin Of Calculator"
        />
        <h1 className="text-primary">Margin of Error Calculator</h1>
        <span>
          This calculator will help you to calculate the margin of error for the
          given sample size and distribution with steps shown.
          <br /> Related Calculators:
          <Button
            name="Box and Whisker Plot Calculator"
            url="/calculator/box-and-whisker-plot-calculator/"
          />
        </span>
        <hr />
        <MarginOfError />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
