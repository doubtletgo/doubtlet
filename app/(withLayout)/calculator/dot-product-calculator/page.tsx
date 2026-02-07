import DotProductOfTwoVectors from '@/components/calculators/DotProductOfTwoVectors';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Dot product Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the dot product of two vectors with the steps shown.',
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
          breadcrumbText6="Dot Product"
          breadcrumbUrl6="/calculator/dot-product-calculator/"
        />
        <h1 className="text-primary">Dot product Calculator</h1>
        <span>
          This calculator will help you to find the dot product of two vectors
          with the steps shown.
          <br /> Related Calculator:
          <Button
            name="Cross Product Calculator"
            url="/calculator/cross-product-of-two-vectors-calculator/"
          />
        </span>
        <hr />
        <DotProductOfTwoVectors />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
