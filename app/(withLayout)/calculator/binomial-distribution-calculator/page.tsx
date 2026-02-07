import BinomialDistribution from '@/components/calculators/BinomialDistribution';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Binomial Distribution Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the probability distribution with steps for given values of trials, successes and probability of success.',
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
          breadcrumbUrl5="/calculator/binomial-distribution-calculator/"
          breadcrumbText5="Binomial Distribution"
        />
        <h1 className="text-primary">Binomial Distribution Calculator</h1>
        <span>
          This calculator will help you to obtain the binomial distribution with
          steps for given values of trials, successes and probability of
          success.
          <br /> Related Calculator:
          <Button
            name="Beta Distribution Calculator"
            url="/calculator/beta-distribution-calculator/"
          />
        </span>
        <hr />
        <BinomialDistribution />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
