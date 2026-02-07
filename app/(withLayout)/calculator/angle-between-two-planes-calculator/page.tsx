import AngleBetweenTwoPlanes from '@/components/calculators/AngleBetweenTwoPlanes';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Angle between two parallel Planes Calculator | Doubtlet.com',
  description: `This calculator will help you to find the acute angle between two parallel planes A1x + B1y + C1z + D1 = 0 & A 2x + B2y + C2z + D2 = 0 with the Steps shown`,
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
          breadcrumbText6="Angle between two Planes"
          breadcrumbUrl6="/calculator/angle-between-two-planes-calculator/"
        />
        <h1 className="text-primary">Angle between two Planes Calculator</h1>
        <span>
          This calculator will help you to find the acute angle between two
          parallel planes A<sub>1</sub>x + B<sub>1</sub>y + C<sub>1</sub>z + D
          <sub>1</sub> = 0 & A<sub>2</sub>x + B<sub>2</sub>y + C<sub>2</sub>z +
          D<sub>2</sub> = 0 with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Angle between two Lines in 3D Calculator"
            url="/calculator/angles-between-two-lines-calculator/"
          />
        </span>
        <hr />
        <AngleBetweenTwoPlanes />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
