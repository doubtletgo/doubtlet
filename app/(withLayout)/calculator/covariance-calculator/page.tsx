import Covariance from '@/components/calculators/Covariance';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Covariance Calculator - Fast, Accurate, & Online Tool for Statistics | Doubtlet.com',
  description:
    'Calculate covariance easily with our free online Covariance Calculator. Quickly analyze relationships between datasets and improve your statistical insights. Try it now!',
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
          breadcrumbUrl5="/calculator/covariance-calculator/"
          breadcrumbText5="Covariance Calculator"
        />
        <h1 className="text-primary">Covariance Calculator</h1>
        <span>
          This calculator will help you to calculate the covariance for the
          given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Correlation Coefficient Calculator"
            url="/calculator/pearson-correlation-coefficient-calculator/"
          />
          <Button
            name="Variance Calculator"
            url="/calculator/variance-calculator/"
          />
        </span>
        <hr />
        <Covariance />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
