import PearsonCorrelationCoefficient from '@/components/calculators/PearsonCorrelationCoefficient';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Pearson Correlation Coefficient Calculator | Easy & Accurate Online Tool | Doubtlet.com',
  description:
    'Calculate the Pearson correlation coefficient quickly and accurately with our online calculator. Analyze the strength and direction of relationships between two variables effortlessly.',
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
          breadcrumbUrl5="/calculator/pearson-correlation-coefficient-calculator/"
          breadcrumbText5="Pearson Correlation Coefficient Calculator"
        />
        <h1 className="text-primary">
          Pearson Correlation Coefficient Calculator
        </h1>
        <span>
          This calculator will help you to calculate the Pearson Correlation
          Coefficient for the given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Covariance Calculator"
            url="/calculator/covariance-calculator/"
          />
          <Button
            name="Coefficient of Variation Calculator"
            url="/calculator/coefficient-of-variation-calculator/"
          />
        </span>
        <hr />
        <PearsonCorrelationCoefficient />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
