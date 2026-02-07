import TotalSurfaceAreaOfCone from '@/components/calculators/TotalSurfaceAreaOfCone';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Total Surface Area of the Cone Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Total Surface Area of the Right circular Cone if its Base Radius and Slant Height is given by Step by Step method',
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
          breadcrumbText5="TSA of Cone"
          breadcrumbUrl5="/calculator/total-surface-area-of-cone-calculator/"
        />
        <h1 className="text-primary">
          Total Surface Area of the Cone Calculator
        </h1>
        <span>
          This calculator will help you to find the Total Surface Area of the
          Right circular Cone if its Base Radius and Slant Height is given.
        </span>
        <hr />
        <TotalSurfaceAreaOfCone />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
