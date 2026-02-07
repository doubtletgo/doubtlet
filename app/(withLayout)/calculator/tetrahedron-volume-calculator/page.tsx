import VolumeOfTetrahedron from '@/components/calculators/VolumeOfTetrahedron';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'volume of the Tetrahedron Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Volume of the Tetrahedron with steps shown by Step by Step method',
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
          breadcrumbText5="Volume of Tetraherdon"
          breadcrumbUrl5="/calculator/tetrahedron-volume-calculator/"
        />
        <h1 className="text-primary">Volume of the Tetrahedron Calculator</h1>
        <span>
          This calculator will help you to find the Volume of the Tetrahedron
          with steps shown.
        </span>
        <hr />
        <VolumeOfTetrahedron />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
