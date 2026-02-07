import SurfaceAreaOfCube from '@/components/calculators/SurfaceAreaOfCube';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Surface Area of the Cube Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the surface Area of the Cube if Length of its side is given by Step by Step method',
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
          breadcrumbText5="Surface Area of Cube"
          breadcrumbUrl5="/calculator/surface-area-of-cube-calculator/"
        />
        <h1 className="text-primary">Surface Area of the Cube Calculator</h1>
        <span>
          This calculator will help you to find the surface Area of the Cube if
          Length of its side is given.
        </span>
        <hr />
        <SurfaceAreaOfCube />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
