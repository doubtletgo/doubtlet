import CentroidOfTriangle from '@/components/calculators/CentroidOfTriangle';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Centroid of a Triangle Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Centroid of the Triangle joining the Point A (x1, y1, z1), Point B (x2, y2, z2) and Point C (x3, y3, z3) by Step by Step method',
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
          breadcrumbText6="Centroid of Triangle"
          breadcrumbUrl6="/calculator/centroid-of-a-triangle-calculator/"
        />
        <h1 className="text-primary">Centroid of a Triangle Calculator</h1>
        <span>
          This calculator will help you to find the Centroid of the Triangle
          joining the Point A (x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>),
          Point B (x<sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) & Point C (x
          <sub>3</sub>, y<sub>3</sub>, z<sub>3</sub>) with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Incenter of a Triangle Calculator"
            url="/calculator/incenter-triangle-calculator/"
          />
        </span>
        <hr />
        <CentroidOfTriangle />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
