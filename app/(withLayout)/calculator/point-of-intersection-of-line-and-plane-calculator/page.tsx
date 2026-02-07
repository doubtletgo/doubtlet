import PointOfIntersectionOfLineAndPlane from '@/components/calculators/PointOfIntersectionOfLineAndPlane';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Point of Intersection of Line and Plane Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the point of intersection of Line in 3D and Plane  by Step by Step method',
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
          breadcrumbText4="Calculus"
          breadcrumbUrl4="/calculator/calculus/"
          breadcrumbText5="3D"
          breadcrumbUrl5="/calculator/three-dimension-3d/"
          breadcrumbText6="Intersection of Line and Plane"
          breadcrumbUrl6="/calculator/point-of-intersection-of-line-and-plane-calculator/"
        />
        <h1 className="text-primary">
          Point of Intersection of Line & Plane Calculator
        </h1>
        <span>
          This calculator will help you to find the point of intersection of
          Line in 3D & Plane.
          <br />
          Related Calculator:
          <Button
            name="Point of Intersection of two Lines in 3d Calculator"
            url="/calculator/point-of-intersection-of-two-lines-in-3d/"
          />
        </span>
        <hr />
        <PointOfIntersectionOfLineAndPlane />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
