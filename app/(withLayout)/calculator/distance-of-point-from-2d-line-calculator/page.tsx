import DistanceOfPointFrom2DLine from '@/components/calculators/DistanceOfPointFrom2DLine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Distance of a Point from a Line in 2-D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the distance (d) of a Point (x1, y1) from the line ax + by + c = 0 with the Steps  shown.',
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
          breadcrumbText6="Distance of a Point from a Line"
          breadcrumbUrl6="/calculator/distance-of-point-from-2d-line-calculator/"
        />
        <h1 className="text-primary">
          Distance of a Point from a Line in 2-D Calculator
        </h1>
        <span>
          This calculator will help you to find the distance (d) of a Point (x1,
          y1) from the line ax + by + c = 0 with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Distance between a Point and a line in 3d Calculator"
            url="/calculator/distance-from-a-point-to-a-line-in-3-dimensional/"
          />
        </span>
        <hr />
        <DistanceOfPointFrom2DLine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
