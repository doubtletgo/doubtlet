import SectionFormula from '@/components/calculators/SectionFormula';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Section formula calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Point which divides the Line joining the Point P1(x1,y1) & Point P 2(x2,y2) in the given ratio Internally or Externally.',
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
          breadcrumbText6="Section Formula"
          breadcrumbUrl6="/calculator/section-formula-calculator/"
        />
        <h1 className="text-primary">Section formula Calculator</h1>
        <span>
          This calculator will help you to find the Point which divides the Line
          joining the Point P<sub>1</sub>(x<sub>1</sub>,y<sub>1</sub>) & Point P
          <sub>2</sub>(x<sub>2</sub>,y<sub>2</sub>) in the given ratio
          Internally or Externally with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Mid-Point of Line Calculator"
            url="/calculator/midpoint-calculator/"
          />
          <Button
            name="Slope of Line Calculator"
            url="/calculator/slope-of-line/"
          />
        </span>
        <hr />
        <SectionFormula />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
