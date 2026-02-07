import VolumeOfThePyramid from '@/components/calculators/VolumeOfThePyramid';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Volume of the Pyramid Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Volume of the Pyramid with the steps shown by Step by Step method',
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
          breadcrumbText5="Volume of Pyramid"
          breadcrumbUrl5="/calculator/pyramid-volume-calculator/"
        />
        <h1 className="text-primary">Volume of the Pyramid Calculator</h1>
        <span>
          This calculator will help you to find the Volume of the Pyramid with
          the steps shown.
        </span>
        <hr />
        <VolumeOfThePyramid />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
