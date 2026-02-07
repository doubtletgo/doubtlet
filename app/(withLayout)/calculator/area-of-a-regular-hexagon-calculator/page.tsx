import AreaOfARegularHexagon from '@/components/calculators/AreaOfARegularHexagon';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Area of Regular Hexagon Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Area of a Regular Hexagon with the steps shown.',
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
          breadcrumbText5="Area of Regular Hexagon"
          breadcrumbUrl5="/calculator/area-of-a-regular-hexagon-calculator/"
        />
        <h1 className="text-primary">Area of Regular Hexagon calculator</h1>
        <span>
          This calculator will help you to calculate the Area of a Regular
          Hexagon with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Area of Regular Pentagon Calculator"
            url="/calculator/area-of-regular-pentagon-calculator/"
          />
        </span>
        <hr />
        <AreaOfARegularHexagon />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
