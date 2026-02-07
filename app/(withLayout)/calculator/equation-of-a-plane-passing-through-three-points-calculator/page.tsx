import EquationOfPlanePassingThroughThreePoint from '@/components/calculators/EquationOfPlanePassingThroughThreePoint';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: ' Plane equation through three Points Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Equation of a Plane passing through three Point P1(x1, y1, z1), Point P2(x2, y2, z2) & P3(x3, y3, z3) by Step by Step method',
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
          breadcrumbText6="Equation of Plane through 3 Points"
          breadcrumbUrl6="/calculator/equation-of-a-plane-passing-through-three-points-calculator/"
        />
        <h1 className="text-primary">
          Plane equation through three Points Calculator
        </h1>
        <span>
          This calculator will help you to find the Equation of a Plane passing
          through three Point P<sub>1</sub>(x<sub>1</sub>, y<sub>1</sub>, z
          <sub>1</sub>), Point P<sub>2</sub>(x<sub>2</sub>, y<sub>2</sub>, z
          <sub>2</sub>) & P<sub>3</sub>(x<sub>3</sub>, y<sub>3</sub>, z
          <sub>3</sub>)
          <br />
          Related Calculators:
          <Button
            name="Plane Equation through a Point and Normal Vector Calculator"
            url="/calculator/eq-of-plane-through-a-point-having-a-normal-vector-calculator/"
          />
        </span>
        <hr />
        <EquationOfPlanePassingThroughThreePoint />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
