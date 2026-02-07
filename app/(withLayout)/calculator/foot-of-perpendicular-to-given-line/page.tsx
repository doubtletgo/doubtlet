import FootOfPerpendicularToGivenLine from '@/components/calculators/FootOfPerpendicularToGivenLine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Foot of perpendicular to a given Line Calculato | Doubtlet.com',
  description:
    'This calculator will help you to find the coordinates of the Foot of perpendicular from a Point P (a, b) to line L (ax + by + c = 0) with the Steps shown.',
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
          breadcrumbText6="Foot of Perpendicualr"
          breadcrumbUrl6="/calculator/foot-of-perpendicular-to-given-line/"
        />
        <h1 className="text-primary">
          Foot of perpendicular to a given Line Calculator
        </h1>
        <span>
          This calculator will help you to find the coordinates of the Foot of
          perpendicular from a Point P (a, b) to line L (ax + by + c = 0) with
          the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Parallel and Perpendicular Line calculator"
            url="/calculator/parallel-perpendicular-line/"
          />
        </span>
        <hr />
        <FootOfPerpendicularToGivenLine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
