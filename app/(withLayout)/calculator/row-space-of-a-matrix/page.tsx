import RowSpaceOfAMatrix from '@/components/calculators/RowSpaceOfAMatrix';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Row Space of a Matrix ',
  description:
    'This calculator will help you to find the Row Space of a given matrix at a time with the steps shown.',
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
          breadcrumbText6="Row Space"
          breadcrumbUrl6="/calculator/row-space-of-a-matrix/"
        />
        <h1 className="text-primary">Row Space of a Matrix Calculator</h1>
        <span>
          This calculator will help you to find the Row Space of a given matrix
          at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Column Space Calculator"
            url="/calculator/column-space-of-a-matrix/"
          />
        </span>
        <hr />

        <RowSpaceOfAMatrix />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
