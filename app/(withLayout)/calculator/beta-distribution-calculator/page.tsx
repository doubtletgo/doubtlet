import BetaDistribution from '@/components/calculators/BetaDistribution';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Beta Distribution Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the beta distribution of the given values with steps shown.',
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
          breadcrumbUrl5="/calculator/beta-distribution-calculator/"
          breadcrumbText5="Beta Distribution"
        />
        <h1 className="text-primary">Beta Distribution Calculator</h1>
        <span>
          This calculator will help you to find the Beta Distribution of the
          given values with steps shown.
          <br /> Related Calculator:
          <Button
            name="Binomial Distribution Calculator"
            url="/calculator/binomial-distribution-calculator/"
          />
        </span>
        <hr />
        <BetaDistribution />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
