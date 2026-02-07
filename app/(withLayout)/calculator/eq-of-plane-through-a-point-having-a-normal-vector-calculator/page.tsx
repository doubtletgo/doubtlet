import EqOfPlaneThroughAPointHavingANormalVector from '@/components/calculators/EqOfPlaneThroughAPointHavingANormalVector';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Plane Equation Through A Point and Normal Vector Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the equation of plane passing through and having a normal vector with the steps shown.',
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
          breadcrumbText6="Equation of Plane through a Point and Normal vector"
          breadcrumbUrl6="/calculator/eq-of-plane-through-a-point-having-a-normal-vector-calculator/"
        />
        <h1 className="text-primary">
          Plane Equation through a Point and Normal Vector Calculator
        </h1>
        <span>
          This calculator will help you to find the equation of plane passing
          through a point and a normal vector with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Plane Equation Through through three Points Calculator"
            url="/calculator/equation-of-a-plane-passing-through-three-points-calculator/"
          />
        </span>
        <hr />

        <EqOfPlaneThroughAPointHavingANormalVector />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
