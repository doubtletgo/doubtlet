import AreaOfTriangle from '@/components/calculators/AreaOfTriangle';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Area of the Triangle Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Area of the triangle if its length of base and Height is given by Step by Step method',
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
          breadcrumbText5="Area of Triangle"
          breadcrumbUrl5="/calculator/triangle-area-calculator/"
        />
        <h1 className="text-primary">Area of the Triangle Calculator</h1>
        <span>
          This calculator will help you to find the Area of the triangle if its
          length of base and Height is given.
        </span>
        <hr />
        <AreaOfTriangle />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
