import NewCoordinatesByRotationOfPoints from '@/components/calculators/NewCoordinatesByRotationOfPoints';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'New Coordinates By Rotation Of Points Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the new coordinates of a point obtained after rotation of points by an angle either clockwise or counter clockwise with the steps shown. ',
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
          breadcrumbText6="Coordinates by Rotation of Points"
          breadcrumbUrl6="/calculator/new-coordinates-by-rotation-of-points/"
        />
        <h1 className="text-primary">
          New Coordinates By Rotation Of Points Calculator
        </h1>
        <span>
          This calculator will help you to calculate the new coordinates of a
          point obtained after rotation of points by an angle either clockwise
          or counter clockwise with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="New coordinates by Rotation of Axes calculator"
            url="/calculator/new-coordinates-by-rotation-of-axes/"
          />
        </span>
        <hr />
        <NewCoordinatesByRotationOfPoints />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
