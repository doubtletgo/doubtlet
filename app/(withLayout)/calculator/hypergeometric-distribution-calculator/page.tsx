import HypergeometricDistribution from '@/components/calculators/HypergeometricDistribution';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Hypergeometric Distribution Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the hypergeometric distribution with steps for given input values.',
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
          breadcrumbUrl5="/calculator/hypergeometric-distribution-calculator/"
          breadcrumbText5="Hypergeometric Distribution"
        />
        <h1 className="text-primary">Hypergeometric Distribution Calculator</h1>
        <span>
          This calculator will help you to obtain the hypergeometric
          distribution with steps for given input values.
          <br /> Related Calculators:
          <Button
            name="Poisson Distribution Calculator"
            url="/calculator/poisson-distribution-calculator/"
          />
        </span>
        <hr />
        <HypergeometricDistribution />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
