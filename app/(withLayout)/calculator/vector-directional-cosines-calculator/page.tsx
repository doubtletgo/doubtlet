import DirectionCosinsOfVector from '@/components/calculators/DirectionCosinsOfVector';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Direction cosines of a Vector Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the direction cosines of a Vector  A = ai+bj+ck with steps shown',
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
          breadcrumbText4="Calculus"
          breadcrumbUrl4="/calculator/calculus/"
          breadcrumbText5="3D"
          breadcrumbUrl5="/calculator/three-dimension-3d/"
          breadcrumbText6="Direction Cosines"
          breadcrumbUrl6="/calculator/vector-directional-cosines-calculator/"
        />
        <h1 className="text-primary">
          Direction cosines of a Vector Calculator
        </h1>
        <span>
          This calculator will help you to find the direction cosines of a
          Vector A = ai+bj+ck with steps shown.
          <br />
          Related Calculator:
          <Button
            name="Plane equation through three Points Calculator"
            url="/calculator/equation-of-a-plane-passing-through-three-points-calculator/"
          />
        </span>
        <hr />
        <DirectionCosinsOfVector />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
