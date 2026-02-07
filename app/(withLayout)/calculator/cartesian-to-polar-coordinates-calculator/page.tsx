import CartesianToPolarCoordinates from '@/components/calculators/CartesianToPolarCoordinates';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cartesian to Polar Coordinates Calculator | Doubtlet.com',
  description:
    'Easily convert Cartesian coordinates to polar coordinates with our Cartesian to Polar Calculator. Get accurate conversions and step-by-step solutions for geometry, physics, and engineering problems.',
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
          breadcrumbText6="Cartesian to Polar"
          breadcrumbUrl6="/calculator/cartesian-to-polar-coordinates-calculator/"
        />
        <h1 className="text-primary">
          Cartesian to Polar Coordinates Calculator
        </h1>
        <span>
          This calculator will help you to convert the Cartesian coordinates to
          Polar form with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Polar to Cartesian Coordinates Calculator"
            url="/calculator/polar-to-cartesian-coordinates-calculator/"
          />
        </span>
        <hr />
        <CartesianToPolarCoordinates />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
