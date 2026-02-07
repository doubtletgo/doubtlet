import DistanceBetweenTwoParallelPlanes from '@/components/calculators/DistanceBetweenTwoParallelPlanes';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Distance between two Parallel Planes Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the distance (d) between two parallel Planes ax+by+cz+d1 = 0 & ax + by + cz + d<sub>2</sub> = 0  by Step by Step method',
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
          breadcrumbText6="Distance between Parallel Planes"
          breadcrumbUrl6="/calculator/distance-between-two-parallel-planes-calculator/"
        />
        <h1 className="text-primary">
          Distance between two Parallel Planes Calculator{' '}
        </h1>
        <span>
          This calculator will help you to find the distance (d) between two
          parallel Planes ax + by + cz + d<sub>1</sub> = 0 & ax + by + cz + d
          <sub>2</sub> = 0 with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Angle between two Planes Calculator"
            url="/calculator/angle-between-two-planes-calculator/"
          />
        </span>
        <hr />
        <DistanceBetweenTwoParallelPlanes />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
