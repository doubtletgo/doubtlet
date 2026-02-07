import NormalToThePlaneContaining3Points from '@/components/calculators/NormalToThePlaneContaining3Points';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Normal to the Plane containing 3-Points Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Normal vector to the plane containing points A (x1, y1, z1), B (x2, y2, z2) & C (x3, y3, z3) with the steps shown.',
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
          breadcrumbText6="Normal to Plane"
          breadcrumbUrl6="/calculator/normal-to-the-plane-containing-3-points-calculator/"
        />
        <h1 className="text-primary">
          Normal to the Plane containing 3-Points Calculator
        </h1>
        <span>
          This calculator will help you to find the Normal vector to the plane
          containing points A (x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>), B
          (x
          <sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) & C (x<sub>3</sub>, y
          <sub>3</sub>, z<sub>3</sub>).
          <br />
          Related Calculators:
          <Button
            name="Plane equation through three Points Calculator"
            url="/calculator/equation-of-a-plane-passing-through-three-points-calculator/"
          />
        </span>
        <hr />

        <NormalToThePlaneContaining3Points />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
