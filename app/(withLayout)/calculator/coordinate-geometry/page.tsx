import CoordinateGeometry from '@/components/calculators/CoordinateGeometry';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `"Coordinate Geometry Calculators | Doubtlet.com`,
  description: `Explore a comprehensive collection of Coordinate Geometry calculators, 
      including Line equation in 2d, Distance b/w 2 points, Slope of a line, Midpoint of a line, 
      Section Formula, Intersection of Lines, Centroid of Triangle, Incentre of Triangle, 
      Reflection of a point about a line, Foot of Perpendicular, Concurrency of Straight lines.
       Enhance your mathematical understanding and solve complex problems effortlessly. 
       Your one-stop destination for step-by-step solutions.`,
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
        />
        <CoordinateGeometry />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
