import InterQuartile from '@/components/calculators/InterQuartile';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'InterQuartile Range Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the InterQuartile Range of the given values with steps shown.',
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
          breadcrumbUrl5="/calculator/interquartile-range-calculator/"
          breadcrumbText5="InterQuartile Range"
        />
        <h1 className="text-primary">InterQuartile Range Calculator</h1>
        <span>
          This calculator will help you to obtain the InterQuartile Range of the
          given values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Five Number Summary Calculator"
            url="/calculator/five-number-summary-calculator/"
          />
          <Button
            name="Box and Whisker Plot Calculator"
            url="/calculator/box-and-whisker-plot-calculator/"
          />
        </span>
        <hr />
        <InterQuartile />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
