import Slopeofline from '@/components/calculators/Slopeofline';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Slope of Line calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Slope of a line joining two points P_1 (x_1, y_1) and P_2 (x_2, y_2) with the Step by Step method',
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
          breadcrumbText6="Slope of Line"
          breadcrumbUrl6="/calculator/slope-of-line/"
        />
        <h1 className="text-primary">Slope of Line Calculator</h1>
        <span>
          This calculator will help you to find the Slope of a line joining two
          points P<sub>1</sub> (x<sub>1</sub>, y<sub>1</sub>) and P<sub>2</sub>{' '}
          (x<sub>2</sub>, y<sub>2</sub>).
          <br />
          Related Calculators:
          <Button
            name="Section formula Calculator"
            url="/calculator/section-formula-calculator/"
          />
          <Button
            name="Mid-Point of a Line Calculator"
            url="/calculator/midpoint-calculator/"
          />
        </span>
        <hr />
        <Slopeofline />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
