import Percentile from '@/components/calculators/Percentile';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Percentile Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the Percentile of the given values with steps shown.',
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
          breadcrumbUrl5="/calculator/percentile-calculator/"
          breadcrumbText5="Percentile"
        />
        <h1 className="text-primary">Percentile Calculator</h1>
        <span>
          This calculator will help you to obtain the Percentile of the given
          values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Percentile Rank Calculator"
            url="/calculator/percentile-rank-calculator/"
          />
          <Button
            name="Margin of Error Calculator"
            url="/calculator/margin-of-error-calculator/"
          />
        </span>
        <hr />
        <Percentile />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
