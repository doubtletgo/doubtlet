import ShortestDistanceBetTwoLinesIn3D from '@/components/calculators/ShortestDistanceBetTwoLinesIn3D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Shortest Distance between two Lines in 3D Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the shortest distance between two lines in 3D by Step by Step method',
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
          breadcrumbText6="Shortest Distance"
          breadcrumbUrl6="/calculator/shortest-distance-between-two-lines-calculator/"
        />
        <h1 className="text-primary">
          Shortest Distance between two Lines in 3D Calculator
        </h1>
        <span>
          This calculator will help you to find the shortest distance between
          two lines in 3D with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Point of Intersection of Line & Plane Calculator"
            url="/calculator/point-of-intersection-of-line-and-plane-calculator/"
          />
        </span>
        <hr />
        <ShortestDistanceBetTwoLinesIn3D />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
