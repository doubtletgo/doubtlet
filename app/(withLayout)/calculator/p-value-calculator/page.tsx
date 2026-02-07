import BreadCrumbs from '@/components/common/BreadCrumbs';
import PValue from '../../../../components/calculators/PValue';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'P-Value Calculator | Doubtlet.com',
  description:
    'Quickly calculate p-values for hypothesis testing with our free P-Value Calculator. Ideal for statisticians, researchers, and students. Easy-to-use, accurate, and fast results!',
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
          breadcrumbUrl5="/calculator/p-value-calculator/"
          breadcrumbText5="P Value Calculator"
        />
        <h1 className="text-primary">P Value Calculator</h1>
        <span>
          This calculator will help you to calculate the P value for the given
          set of values with steps shown.
          <br />
          Related Calculator:
          <Button
            name="Z Score Calculator"
            url="/calculator/z-score-calculator/"
          />
        </span>
        <hr />
        <PValue />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
