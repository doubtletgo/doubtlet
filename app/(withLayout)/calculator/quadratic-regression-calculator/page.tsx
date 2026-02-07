import QuadraticRegression from '@/components/calculators/QuadraticRegression';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Quadratic Regression Calculator - Parabola of Best Fit Online | Doubtlet.com',
  description:
    'Use our free Quadratic Regression Calculator to find the parabola of best fit for your data. Quickly calculate the quadratic equation, graph, and key values to analyse trends. Perfect for students, researchers, and professionals!',
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
          breadcrumbUrl5="/calculator/quadratic-regression-calculator/"
          breadcrumbText5="Quadratic Regression"
        />
        <h1 className="text-primary">
          Quadratic Regression (Parabola of best fit) Calculator
        </h1>
        <span>
          This calculator will help you to calculate the best parabola fit
          equation for the given set of values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Linear Regression Calculator"
            url="/calculator/linear-regression-calculator/"
          />
        </span>
        <hr />
        <QuadraticRegression />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
