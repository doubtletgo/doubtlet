import VolumeOfCone from '@/components/calculators/VolumeOfCone';
import BreadCrumbs from '@/components/common/BreadCrumbs';
// import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Volume of the Cone Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Volume of the Cone if radius and height are given with the Steps shown.',
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
          breadcrumbText5="Volume of Cone"
          breadcrumbUrl5="/calculator/cone-volume-calculator/"
        />
        <h1 className="text-primary">Volume of the Cone Calculator</h1>
        <span>
          This calculator will help you to find the Volume of the Cone if its
          radius and height are given.
        </span>
        <hr />
        <VolumeOfCone />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
