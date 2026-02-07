import ExponentialDistribution from '@/components/calculators/ExponentialDistribution';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Exponential Distribution Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the exponential distribution with steps for given values of lambda and random variable X.',
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
          breadcrumbUrl5="/calculator/exponential-distribution-calculator/"
          breadcrumbText5="Exponential Distribution"
        />
        <h1 className="text-primary">Exponential Distribution Calculator</h1>
        <span>
          This calculator will help you to obtain the exponential distribution
          with steps for given values of lambda and random variable X.
          <br />
          Related Calculators:
          <Button
            name="Geometric Distribution Calculator"
            url="/calculator/geometric-distribution-calculator/"
          />
        </span>
        <hr />
        <ExponentialDistribution />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
