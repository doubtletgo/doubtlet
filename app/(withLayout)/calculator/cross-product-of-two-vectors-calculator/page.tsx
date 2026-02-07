import CrossProductOfTwoVectors from '@/components/calculators/CrossProductOfTwoVectors';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cross product Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Cross product of two vectors with the steps shown.',
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
          breadcrumbText6="Cross Product"
          breadcrumbUrl6="/calculator/cross-product-of-two-vectors-calculator/"
        />
        <h1 className="text-primary">Cross product Calculator</h1>
        <span>
          This calculator will help you to find the Cross product of two vectors
          with the shown.
          <br /> Related Calculators:
          <Button
            name="Dot Product Calculator"
            url="/calculator/dot-product-calculator/"
          />
        </span>
        <hr />
        <CrossProductOfTwoVectors />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
