import TransposeOfAMatrix from '@/components/calculators/TransposeOfAMatrix';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Matrix Transpose Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the transpose of a matrix at a time.',
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
          breadcrumbText6="Transpose"
          breadcrumbUrl6="/calculator/transpose-of-a-matrix/"
        />
        <h1 className="text-primary"> Transpose of a Matrix Calculator</h1>
        <span>
          This calculator will help you to find the transpose of a matrix at a
          time with the steps shown. <br />
          Related Calculator:
          <Button
            name="Matrix Trace Calculator"
            url="/calculator/trace-of-a-matrix/"
          />
        </span>
        <hr />
        <TransposeOfAMatrix />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
