import DistanceBetweenTwoParallelLines from '@/components/calculators/DistanceBetweenTwoParallelLines';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Distance between two Parallel Lines Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the distance (d) between two parallel Lines y = mx + c1 & y = mx + c2 with the Steps shown',
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
          breadcrumbText6="Distance between Parallel Lines"
          breadcrumbUrl6="/calculator/distance-between-two-parallel-planes-calculator/"
        />
        <h1 className="text-primary">
          Distance between two Parallel Lines Calculator
        </h1>
        <span>
          This calculator will help you to find the distance (d) between two
          parallel Lines y = mx + c<sub>1</sub> & y = mx + c<sub>2</sub>
          <br />
          Related Calculators:
          <Button
            name="Distance between two points Calculator"
            url="/calculator/distance-between-two-points/"
          />
        </span>
        <hr />
        <DistanceBetweenTwoParallelLines />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
