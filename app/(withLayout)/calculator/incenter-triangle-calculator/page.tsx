import IncenterOfTriangle from '@/components/calculators/IncenterOfTriangle';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Incenter of a Triangle Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Incenter of the Triangle joining the Point A (x1, y1), Point B (x2, y2) and Point C (x3, y3) by Step by Step method',
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
          breadcrumbText6="Incenter of Triangle"
          breadcrumbUrl6="/calculator/incenter-triangle-calculator/"
        />
        <h1 className="text-primary"> Incenter of a Triangle Calculator</h1>
        <span>
          This calculator will help you to find the Incenter of the Triangle
          joining the Point A (x<sub>1</sub>, y<sub>1</sub>), Point B (x
          <sub>2</sub>, y<sub>2</sub>) & Point C (x<sub>3</sub>, y<sub>3</sub>)
          <br />
          Related Calculators:
          <Button
            name="Centroid of a Triangle Calculator"
            url="/calculator/centroid-of-a-triangle-calculator/"
          />
        </span>
        <hr />
        <IncenterOfTriangle />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
