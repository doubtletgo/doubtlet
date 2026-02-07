import EquationOfLineFromTwoPoints from '@/components/calculators/EquationOfLineFromTwoPoints';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Line Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Equation of a line joining two points P_1 (x_1, y_1) and P_2 (x_2, y_2) in intercept, general standard, point slope, and slope intercept form with the Steps shown.',
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
          breadcrumbText4="Pre Calculus"
          breadcrumbUrl4="/calculator/pre-calculus/"
          breadcrumbText5="Coordinate Geometry"
          breadcrumbUrl5="/calculator/coordinate-geometry/"
          breadcrumbText6="Line Calculator"
          breadcrumbUrl6="/calculator/equation-of-line-from-two-points/"
        />
        <h1 className="text-primary">Line Calculator</h1>
        <span>
          This calculator will help you to find Equation of a line joining two
          points P_1 (x_1, y_1) and P_2 (x_2, y_2) with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Line intersection in 2-D Calculator"
            url="/calculator/2d-line-intersection-calculator/"
          />
        </span>
        <hr />
        <EquationOfLineFromTwoPoints />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
