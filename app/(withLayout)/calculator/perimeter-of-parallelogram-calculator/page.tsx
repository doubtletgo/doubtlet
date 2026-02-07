import PerimeterOfParallelogram from '@/components/calculators/PerimeterOfParallelogram';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Perimeter of a Parallelogram Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the perimeter of a Parallelogram with the steps shown by Step by Step method',
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
          breadcrumbText5="Perimeter of Parallelogram"
          breadcrumbUrl5="/calculator/perimeter-of-parallelogram-calculator/"
        />
        <h1 className="text-primary">
          Perimeter of a Parallelogram Calculator
        </h1>
        <span>
          This calculator will help you to calculate the perimeter of a
          Parallelogram with the steps shown.
          <br />
          Related Calculators:
          <br />
          Related Calculators:
          <Button
            name="Perimeter of a Semicircle Calculator"
            url="/calculator/perimeter-of-semicircle-calculator/"
          />
          <Button
            name="Perimeter of a triangle Calculator"
            url="/calculator/perimeter-of-triangle-calculator/"
          />
        </span>
        <hr />
        <PerimeterOfParallelogram />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
