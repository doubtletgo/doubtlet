import AreaOfRhombus from '@/components/calculators/AreaOfRhombus';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Area of Rhombus Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Area of the Rhombus if length  of both the diagonals given with the Steps shown.',
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
          breadcrumbText5="Area of Rhombus"
          breadcrumbUrl5="/calculator/area-of-rhombus-calculator/"
        />
        <h1 className="text-primary">Area of Rhombus Calculator</h1>
        <span>
          This calculator will help you to find the Area of the Rhombus if
          length of both the diagonals given with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Area of Parallelogram Calculator"
            url="/calculator/parallelogram-area-calculator/"
          />
        </span>
        <hr />
        <AreaOfRhombus />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
