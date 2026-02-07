import ConcurrencyOfStraightLine from '@/components/calculators/ConcurrencyOfStraightLine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Concurrency of Straight lines Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the whether the lines A (a1x+b1y+c1), B (a2x+b2y+c2) and C (a3x+b3y+c3) are concurrent or not by Step by Step method',
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
          breadcrumbText6="Concurrency of Lines"
          breadcrumbUrl6="/calculator/concurrent-lines-calculator/"
        />
        <h1 className="text-primary">
          Concurrency of Straight lines Calculator
        </h1>
        <span>
          This calculator will help you to find the whether the lines A (a
          <sub>1</sub>x+b<sub>1</sub>y+c<sub>1</sub>), B (a<sub>2</sub>x+b
          <sub>2</sub>y+c<sub>2</sub>) and C (a<sub>3</sub>x+b<sub>3</sub>y+c
          <sub>3</sub>) are concurrent or not.
          <br />
          Related Calculators:
          <Button
            name="Line Calculator"
            url="/calculator/equation-of-line-from-two-points/"
          />
        </span>
        <hr />
        <ConcurrencyOfStraightLine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
