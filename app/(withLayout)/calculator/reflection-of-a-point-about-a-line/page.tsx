import ReflectionOfAPointAboutALine from '@/components/calculators/ReflectionOfAPointAboutALine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Reflection (Image) of a Point about a Line Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Reflection or Image Q of a Point P (a, b) about the line L (ax + by + c = 0) by Step by Step method',
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
          breadcrumbText4="Pre Calculus"
          breadcrumbUrl4="/calculator/pre-calculus/"
          breadcrumbText5="Coordinate Geometry"
          breadcrumbUrl5="/calculator/coordinate-geometry/"
          breadcrumbText6="Reflection of Point about Line"
          breadcrumbUrl6="/calculator/reflection-of-a-point-about-a-line/"
        />
        <h1 className="text-primary">
          Reflection (Image) of a Point about a Line Calculator
        </h1>
        <span>
          This calculator will help you to find the Reflection or Image Q of a
          Point P (a, b) about the line L (ax + by + c = 0) with the steps
          shown.
        </span>
        <hr />
        <ReflectionOfAPointAboutALine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
