import Geometry from '@/components/calculators/Geometry';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Geometry Calculators | Doubtlet.com',
  description:
    'Explore a comprehensive collection of geometry calculators including Area, Perimeter, Volume, Total and Curved surface area of various geometric figures. Enhance your mathematical understanding and solve complex problems effortlessly. Your one-stop destination for step-by-step solution.',
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
        />
        <Geometry />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
