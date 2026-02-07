import ParallelPerpendicularLine from '@/components/calculators/ParallelPerpendicularLine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Parallel and Perpendicular Line Calculator | Doubtlet.com',
  description:
    'Easily find equations of parallel and perpendicular lines with our Parallel and Perpendicular Line Calculator. Solve geometry problems with step-by-step guidance for slopes and line equations.',
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
          breadcrumbText6="Parallel and Perpendicular Lines"
          breadcrumbUrl6="/calculator/distance-between-two-parallel-lines-calculator/"
        />
        <h1 className="text-primary">Parallel/Perpendicular Line calculator</h1>
        <span>
          This calculator will help you to calculate the parallel or
          perpendicular line to the given line and a point with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Line Calculator"
            url="/calculator/equation-of-line-from-two-points/"
          />
        </span>
        <hr />
        <ParallelPerpendicularLine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
