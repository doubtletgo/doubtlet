import VolumeOfCylinder from '@/components/calculators/VolumeOfCylinder';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Volume of the Cylinder Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Volume of the Cylinder if its Radius and Height is given by Step by Step method',
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
          breadcrumbText5="Volume of Cylinder"
          breadcrumbUrl5="/calculator/volume-of-cylinder-calculator/"
        />
        <h1 className="text-primary">Volume of the Cylinder Calculator</h1>
        <span>
          This calculator will help you to find the Volume of the Cylinder if
          its Radius and Height is given.
        </span>
        <hr />
        <VolumeOfCylinder />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
