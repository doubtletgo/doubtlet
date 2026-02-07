import LinearIndependenceOfVectors from '@/components/calculators/LinearIndependenceOfVectors';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Linear independence of vectors Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate whether the set of vectors are linearly dependent or not at a time with the steps shown.',
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
          breadcrumbText5="Matrices"
          breadcrumbUrl5="/calculator/matrix-operations/"
          breadcrumbText6="Linear Independence"
          breadcrumbUrl6="/calculator/linear-independence-of-a-matrix-calculator/"
        />
        <h1 className="text-primary">
          Linear independence of vectors Calculator
        </h1>
        <span>
          This calculator will help you to calculate whether the set of vectors
          are linearly dependent or not at a time with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Matrix Rank Calculator"
            url="/calculator/rank-of-a-matrix/"
          />
          <Button
            name="Matrix Basis Calculator"
            url="/calculator/basis-of-a-matrix-calculator/"
          />
        </span>
        <hr />
        <LinearIndependenceOfVectors />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
