import EquationOfLineJoiningTwoPointsIn3D from '@/components/calculators/EquationOfLineJoiningTwoPointsIn3D';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Equation of a Line joining two Points in 3-D | Doubtlet.com',
  description: `This calculator will help you to find the Equation of a Line joining the
Point P1 (x1, y1, z1) & Point P2 (x2, y2, z2) with the Steps shown`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname?.split('/')?.[2];
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
          breadcrumbText6="Line Equation in 3D"
          breadcrumbUrl6="/calculator/3d-line-equation-from-two-points-calculator/"
        />
        <h1 className="text-primary">
          Equation of a Line joining two Points in 3-D Calculator
        </h1>
        <span>
          This calculator will help you to find the Equation of a Line joining
          the Point P<sub>1</sub> (x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>)
          & Point P<sub>2</sub> (x<sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>)
          <br /> Related Calculators:
          <Button
            name="Lines Equation in 2d Calculator"
            url="/calculator/equation-of-line-from-two-points/"
          />
          <Button
            name="Plane by three points Calculator"
            url="/calculator/equation-of-a-plane-passing-through-three-points-calculator/"
          />
        </span>
        <hr />
        <EquationOfLineJoiningTwoPointsIn3D />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
