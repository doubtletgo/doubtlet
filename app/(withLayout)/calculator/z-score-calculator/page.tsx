import BreadCrumbs from '@/components/common/BreadCrumbs';
import ZScore from '../../../../components/calculators/ZScore';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Z Score Calculator - Quickly Compute Standard Scores Online | Doubtlet.com',
  description:
    'Use our Z Score Calculator to instantly calculate standard scores for any data set. Input your values to find the Z-score, mean, and standard deviation easily. Perfect for statistics students and professionals!',
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
          breadcrumbUrl5="/calculator/z-score-calculator/"
          breadcrumbText5="Z Score Calculator"
        />
        <h1 className="text-primary">Z Score Calculator</h1>
        <span>
          This calculator will help you to calculate the Z Score for the given
          set of values with steps shown.
          <br />
          Related Calculator:
          <Button
            name="P Value Calculator"
            url="/calculator/p-value-calculator/"
          />
        </span>
        <hr />
        <ZScore />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
