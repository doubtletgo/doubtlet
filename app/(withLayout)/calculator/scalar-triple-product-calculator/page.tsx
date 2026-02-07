import ScalarTripleProduct from '@/components/calculators/ScalarTripleProduct';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Scalar Triple Product Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Scalar triple of the given Vectors A (x1, y1, z1), B (x2, y2, z2) & C (x3, y3, z3) by Step by Step method with the steps shown.',
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
          breadcrumbText6="Scalar Triple Product"
          breadcrumbUrl6="/calculator/scalar-triple-product-calculator/"
        />
        <h1 className="text-primary">Scalar Triple Product Calculator</h1>
        <span>
          This calculator will help you to find the Scalar triple of the given
          Vectors A (x<sub>1</sub>, y<sub>1</sub>, z<sub>2</sub>), B (x
          <sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) and C (x<sub>3</sub>, y
          <sub>3</sub>, z<sub>3</sub>) with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Vector Tripple Product Calculator"
            url="/calculator/triple-vector-product-calculator/"
          />
        </span>
        <hr />

        <ScalarTripleProduct />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
