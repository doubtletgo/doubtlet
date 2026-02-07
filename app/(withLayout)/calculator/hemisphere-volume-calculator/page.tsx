import VolumeOfHemisphere from '@/components/calculators/VolumeOfHemisphere';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Volume of the Hemisphere Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Volume of the Hemisphere if its Radius is given by Step by Step method',
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
          breadcrumbText5="Volume of Hemisphere"
          breadcrumbUrl5="/calculator/hemisphere-volume-calculator/"
        />
        <h1 className="text-primary">Volume of the Hemisphere Calculator</h1>
        <span>
          This calculator will help you to find the Volume of the Hemisphere if
          its Radius is given.
          <br />
          Related Calculator:
          <Button
            name="Volume of the Sphere Calculator"
            url="/calculator/sphere-volume-calculator/"
          />
        </span>
        <hr />
        <VolumeOfHemisphere />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
