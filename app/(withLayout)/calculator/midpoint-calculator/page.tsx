import MidPointOfLineJoiningTwoPoints from '@/components/calculators/MidPointOfLineJoiningTwoPoints';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Mid-Point of a Line joining two Points Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Mid-Point of a Line joining the points P1 (x1, y1) and P2 (x2, y2) with the Steps shown',
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
          breadcrumbText6="Midpoint"
          breadcrumbUrl6="/calculator/midpoint-calculator/"
        />
        <h1 className="text-primary">
          Mid-Point of a Line joining two Points Calculator
        </h1>
        <span>
          This calculator will help you to find the Mid-Point of a Line joining
          the points P1 (x1, y1) and P2 (x2, y2) with the Steps shown.
          <br />
          Related Calculators:
          <Button
            name="Section formula Calculator"
            url="/calculator/section-formula-calculator/"
          />
          <Button
            name="Slope of Line Calculator"
            url="/calculator/slope-of-line/"
          />
        </span>{' '}
        <hr />
        <MidPointOfLineJoiningTwoPoints />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
