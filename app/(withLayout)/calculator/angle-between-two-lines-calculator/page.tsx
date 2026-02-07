import AngleBetweenTwoLines from '@/components/calculators/AngleBetweenTwoLines';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Angle between two Lines in 2D Calculator | Doubtlet.com',
  description: `This calculator will help you to find the acute angle between two Lines y = m
1x+c1 & y = m2x+c2 with the Steps shown`,
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
          breadcrumbText6="Angle between two lines"
          breadcrumbUrl6="/calculator/angle-between-two-lines-calculator/"
        />
        <h1 className="text-primary">
          Angle between two Lines in 2D Calculator
        </h1>
        <span>
          This calculator will help you to find the acute angle between two
          Lines y = m<sub>1</sub>x+c<sub>1</sub> & y = m<sub>2</sub>x+c
          <sub>2</sub> with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Angle between two Lines in 3D Calculator"
            url="/calculator/angles-between-two-lines-calculator/"
          />
        </span>
        <hr />
        <AngleBetweenTwoLines />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
