import DistanceBetweenPointAndLineIn3D from '@/components/calculators/DistanceBetweenPointAndLineIn3D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Distance between a Point and a line in 3d Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the perpendicular distance between a point and a line equation in three-dimension with the steps shown.',
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
          breadcrumbText6="Distance between Point and Line"
          breadcrumbUrl6="/calculator/distance-from-a-point-to-a-line-in-3-dimensional/"
        />
        <h1 className="text-primary">
          Distance between a Point and a line in 3d Calculator
        </h1>
        <span>
          This calculator will help you to find the perpendicular distance
          between a point and a line equation in three-dimension.
          <br />
          Related Calculators:
          <Button
            name="Shortest Distance between two Lines in 3D Calculator"
            url="/calculator/shortest-distance-between-two-lines-calculator/"
          />
        </span>
        <hr />
        <DistanceBetweenPointAndLineIn3D />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
