import AreaOfParallelogramFormedByTwoCoincidentVectors from '@/components/calculators/AreaOfParallelogramFormedByTwoCoincidentVectors';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Area of a parallelogram formed by two coincident Vectors Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the area of a parallelogram formed by two given  coincident Vectors A = ai+bj+ck & B = pi+qj+rk with the steps shown.',
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
          breadcrumbText4="Linear Algebra"
          breadcrumbUrl4="/calculator/linear-algebra/"
          breadcrumbText5="Vectors"
          breadcrumbUrl5="/calculator/vector-operations/"
          breadcrumbText6="Area of Parallleogram"
          breadcrumbUrl6="/calculator/area-of-parallelogram-formed-by-two-coincident-vectors-calculator/"
        />
        <h1 className="text-primary">
          Area of a parallelogram formed by two coincident Vectors Calculator
        </h1>
        <span>
          This calculator will help you to find the area of a parallelogram
          formed by two given coincident Vectors A = ai+bj+ck & B = pi+qj+rk
          with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Area of a triangle formed by two coincident Vectors Calculator"
            url="/calculator/area-of-triangle-formed-by-two-coincident-vectors/"
          />
        </span>
        <hr />
        <AreaOfParallelogramFormedByTwoCoincidentVectors />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
