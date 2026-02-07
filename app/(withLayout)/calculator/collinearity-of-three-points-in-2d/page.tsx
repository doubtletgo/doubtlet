import TestOfCollinearityOfThree2DPoints from '@/components/calculators/TestOfCollinearityOfThree2DPoints';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Test of collinearity of three points in 2D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the whether the points A (x1, y1), B (x2, y2) and C (x3, y3) are collinear or not by Step by Step method',
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
          breadcrumbText6="Test of Collinearity of three Points"
          breadcrumbUrl6="/calculator/collinearity-of-three-points-in-2d/"
        />
        <h1 className="text-primary">
          Test of collinearity of three points in 2D Calculator
        </h1>
        <span>
          This calculator will help you to find the whether the points A (x
          <sub>1</sub>, y<sub>1</sub>), B (x<sub>2</sub>, y<sub>2</sub>) and C
          (x
          <sub>3</sub>, y<sub>3</sub>) are collinear or not.
          <br />
          Related Calculators:
          <Button
            name="Area of triangle with given vertices in 2D Calculator"
            url="/calculator/area-of-triangle-with-coordinates-calculator-in-2d/"
          />
        </span>
        <hr />
        <TestOfCollinearityOfThree2DPoints />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
