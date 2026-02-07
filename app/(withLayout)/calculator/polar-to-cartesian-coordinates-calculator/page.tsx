import PolartoCartesianCoordinates from '@/components/calculators/PolartoCartesianCoordinates';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Polar to Cartesian Coordinates Calculator | Doubtlet.com ',
  description:
    'This calculator will help you to convert the Polar coordinates to Cartesian form with the steps shown.',
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
          breadcrumbText6="Polar to Cartesian"
          breadcrumbUrl6="/calculator/polar-to-cartesian-coordinates-calculator/"
        />
        <h1 className="text-primary">
          Polar to Cartesian Coordinates Calculator
        </h1>
        <span>
          This calculator will help you to convert the Polar coordinates to
          Cartesian form with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Cartesian to Polar Coordinates Calculator"
            url="/calculator/cartesian-to-polar-coordinates-calculator/"
          />
        </span>
        <hr />
        <PolartoCartesianCoordinates />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
