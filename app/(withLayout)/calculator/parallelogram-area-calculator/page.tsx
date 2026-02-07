import AreaOfParallelogram from '@/components/calculators/AreaOfParallelogram';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Area of the Parallelogram Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Area of the Parallelogram if length of its Base and Height is given by Step by Step method',
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
          breadcrumbText5="Area of Parallelogram"
          breadcrumbUrl5="/calculator/parallelogram-area-calculator/"
        />
        <h1 className="text-primary">Area of the Parallelogram Calculator</h1>
        <span>
          This calculator will help you to find the Area of the Parallelogram if
          length of its Base and Height is given.
          <br />
          Related Calculators:
          <Button
            name="Area of Trapezium Calculator"
            url="/calculator/area-of-trapezoid-calculator/"
          />
        </span>
        <hr />
        <AreaOfParallelogram />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
