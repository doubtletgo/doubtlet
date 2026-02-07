import SurfaceAreaOfCuboid from '@/components/calculators/SurfaceAreaOfCuboid';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Surface Area of the Cuboid Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Surface Area of the Cuboid if its Length, Width and Height are given by Step by Step method',
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
          breadcrumbText5="Surface Area of Cuboid"
          breadcrumbUrl5="/calculator/surface-area-of-cuboid-calculator/"
        />
        <h1 className="text-primary">Surface Area of the Cuboid Calculator</h1>
        <span>
          This calculator will help you to find the Surface Area of the Cuboid
          if its Length, Width and Height are given.
        </span>
        <hr />
        <SurfaceAreaOfCuboid />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
