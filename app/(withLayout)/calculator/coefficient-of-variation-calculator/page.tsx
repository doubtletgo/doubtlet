import CoefficientOfVariation from '@/components/calculators/CoefficientOfVariation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Coefficient of Variation Calculator - Easy & Accurate Online Tool | Doubtlet.com',
  description:
    'Calculate the coefficient of variation (CV) instantly with our online calculator. Analyze data variability with ease—simple, accurate, and free to use. Perfect for statistics and data analysis!',
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
          breadcrumbUrl5="/calculator/coefficient-of-variation-calculator/"
          breadcrumbText5="Coefficient Of Variation Calculator"
        />
        <h1 className="text-primary">Coefficient of Variation Calculator</h1>
        <span>
          This calculator will help you to calculate the coefficient of
          variation for the given set of values with steps shown.
          <br /> Related Calculator:
          <Button
            name="Pearson Correlation Coefficient Calculator"
            url="/calculator/pearson-correlation-coefficient-calculator/"
          />
        </span>
        <hr />
        <CoefficientOfVariation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
