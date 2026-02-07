import CalculatorNotes from '@/components/CalculatorNotes';
import PointOfIntersectionOfTwoLinesIn2D from '@/components/calculators/PointOfIntersectionOfTwoLinesIn2D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { getNotesServerSide } from '@/helpers/server';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Point of intersection of two Lines in 2-D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Intersection-Point of two Lines y = m1x+c1 & y = m2x+c2 by Step by Step method',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname?.split('/')?.[2];

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
          breadcrumbText6="Lines Intersection in 2D"
          breadcrumbUrl6="/calculator/2d-line-intersection-calculator/"
        />
        <h1 className="text-primary">
          Point of intersection of two Lines in 2-D Calculator
        </h1>
        <span>
          This calculator will help you to find the Intersection-Point of two
          Lines y = m<sub>1</sub>x+c<sub>1</sub> & y = m<sub>2</sub>x+c
          <sub>2</sub>
          <br /> Related Calculators:
          <Button
            name="Lines Intersection in 3d Calculator"
            url="/calculator/point-of-intersection-of-two-lines-in-3d/"
          />
          <Button
            name="Angle between two Lines Calculator"
            url="/calculator/angle-between-two-lines-calculator/"
          />
        </span>
        <hr />
        <PointOfIntersectionOfTwoLinesIn2D />
      </div>

      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
