import PerimeterOfRhombus from '@/components/calculators/PerimeterOfRhombus';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Perimeter of a Rhombus Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the perimeter of a Rhombus with the steps shown by Step by Step method',
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
          breadcrumbText4="Geometry"
          breadcrumbUrl4="/calculator/geometry/"
          breadcrumbText5="Perimeter of Rhombus"
          breadcrumbUrl5="/calculator/perimeter-of-rhombus-calculator/"
        />
        <h1 className="text-primary">Perimeter of a Rhombus Calculator</h1>
        <span>
          This calculator will help you to calculate the perimeter of a Rhombus
          with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Perimeter of a Trapezium Calculator"
            url="/calculator/perimeter-of-trapezium-calculator/"
          />
          <Button
            name="Perimeter of a triangle Calculator"
            url="/calculator/perimeter-of-triangle-calculator/"
          />
        </span>
        <hr />
        <PerimeterOfRhombus />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
