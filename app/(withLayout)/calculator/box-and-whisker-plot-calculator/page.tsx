import BoxAndWhiskerPlot from '@/components/calculators/BoxAndWhiskerPlot';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Box and Whisker Plot Calculator | Doubtlet.com ',
  description:
    'This calculator will help you to box and create a whisker plot for the given set of values with steps shown.',
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
          breadcrumbUrl5="/calculator/box-and-whisker-plot-calculator/"
          breadcrumbText5="Box and Whisker Plot Calculator"
        />
        <h1 className="text-primary">Box and Whisker Plot Calculator</h1>
        <span>
          This calculator will help you to box and create a whisker plot for the
          given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Five Number Summary Calculator"
            url="/calculator/five-number-summary-calculator/"
          />
        </span>
        <hr />
        <BoxAndWhiskerPlot />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
