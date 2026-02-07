import LineOfIntersectionOfTwoPlanes from '@/components/calculators/LineOfIntersectionOfTwoPlanes';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Line of Intersection of two Planes Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Line of intersection of two Planes with the Steps shown',
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
          breadcrumbText6="Line of Intersection of two Planes"
          breadcrumbUrl6="/calculator/line-of-intersection-of-two-planes-calculator/"
        />
        <h1 className="text-primary">
          Line of Intersection of two Planes Calculator
        </h1>
        <span>
          This calculator will help you to find the Line of intersection of two
          Planes with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Point of Intersection of two Lines in 3d Calculator"
            url="/calculator/point-of-intersection-of-two-lines-in-3d/"
          />
        </span>
        <hr />
        <LineOfIntersectionOfTwoPlanes />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
