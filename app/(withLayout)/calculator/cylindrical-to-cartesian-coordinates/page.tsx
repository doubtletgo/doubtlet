import CylindricalToCartesianCoordinates from '@/components/calculators/CylindricalToCartesianCoordinates';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cylindrical to Cartesian Coordinates calculator | Doubtlet.com',
  description:
    'This calculator will help you to convert the cylindrical coordinates to Cartesian form with the steps shown.',
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
          breadcrumbText5="Coordinates Conversion"
          breadcrumbUrl5="/calculator/cartesian-cylindrical-spherical/"
          breadcrumbText6="Cylindrical to Cartesian"
          breadcrumbUrl6="/calculator/cylindrical-to-cartesian-coordinates/"
        />
        <h1 className="text-primary">
          Cylindrical to Cartesian Coordinates calculator
        </h1>
        <span>
          This calculator will help you to convert the cylindrical coordinates
          to Cartesian form with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cartesian to Cylindrical Coordinates Calculator"
            url="/calculator/cartesian-to-cylindrical-coordinates-calculator/"
          />
        </span>
        <hr />
        <CylindricalToCartesianCoordinates />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
