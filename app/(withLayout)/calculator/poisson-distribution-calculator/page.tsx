import PoissonDistributionCalculator from '@/components/calculators/PoissonDistributionCalculator';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Poisson Distribution Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the Poisson distribution with steps for given input values.',
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
          breadcrumbUrl5="/calculator/poisson-distrubution-calculator/"
          breadcrumbText5="Poisson Distribution"
        />
        <h1 className="text-primary">Poisson Distribution Calculator </h1>
        <span>
          This calculator will help you to obtain the Poisson distribution with
          steps for given input values.
          <br />
          Related Calculators:
          <Button
            name="Exponential Distribution Calculator"
            url="/calculator/exponential-distribution-calculator/"
          />
          <Button
            name="Geometric Distribution Calculator"
            url="/calculator/geometric-distribution-calculator/"
          />
        </span>
        <hr />
        <PoissonDistributionCalculator />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
