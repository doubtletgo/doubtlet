import DistanceBetweenTwoPoints from '@/components/calculators/DistanceBetweenTwoPoints';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Distance between two points or Distance Formula calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the distance between two points in 2-D and 3-D with the Steps shown',
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
          breadcrumbText6="Distance between two Points"
          breadcrumbUrl6="/calculator/distance-between-two-points/"
        />
        <h1 className="text-primary">Distance between two points Calculator</h1>
        <span>
          This calculator will help you to find the distance between two points
          in 2-D and 3-D by distance formula with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Slope of Line Calculator"
            url="/calculator/slope-of-line/"
          />
          <Button
            name="Mid-Point of a Line Calculator"
            url="/calculator/midpoint-calculator/"
          />
        </span>
        <hr />
        <DistanceBetweenTwoPoints />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
