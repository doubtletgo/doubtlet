import PercentileRank from '@/components/calculators/PercentileRank';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Percentile Rank Calculator - A Quick & Accurate Percentile Finder | Doubtlet.com',
  description:
    'Easily calculate percentile ranks with our user-friendly Percentile Rank Calculator. Perfect for students and professionals to analyse scores accurately in just a few clicks.',
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
        <h1 className="text-primary">Percentile Rank Calculator</h1>
        <span>
          This calculator will help you to calculate the percentile rank for the
          given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Percentile Calculator"
            url="/calculator/percentile-calculator/"
          />
          <Button
            name="Margin of Error Calculator"
            url="/calculator/margin-of-error-calculator/"
          />
        </span>
        <hr />
        <PercentileRank />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
