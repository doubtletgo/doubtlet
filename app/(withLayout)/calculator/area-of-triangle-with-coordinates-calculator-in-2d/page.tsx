import AreaOfTriangleWithGivenVerticesIn2D from '@/components/calculators/AreaOfTriangleWithGivenVerticesIn2D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Area of triangle with given vertices in 2D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Area of triangle with given vertices in 2D as A (x1, y1), B (x2, y2) & C (x3, y3) with the Steps shown',
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
          breadcrumbText6="Triangle area with Vertices"
          breadcrumbUrl6="/calculator/area-of-triangle-with-coordinates-calculator-in-2d/"
        />
        <h1 className="text-primary">
          {' '}
          Area of triangle with given vertices in 2D Calculator
        </h1>
        <span>
          This calculator will help you to find the Area of triangle with given
          vertices in 2D as A (x<sub>1</sub>, y<sub>1</sub>), B (x<sub>2</sub>,
          y<sub>2</sub>) & C (x<sub>3</sub>, y<sub>3</sub>) with the steps
          shown.
          <br /> Related Calculators:
          <Button
            name="Area of a triangle formed by two coincident Vectors"
            url="/calculator/area-of-triangle-formed-by-two-coincident-vectors/"
          />
        </span>
        <hr />
        <AreaOfTriangleWithGivenVerticesIn2D />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
