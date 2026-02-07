import RowEchelonForm from '@/components/calculators/RowEchelonForm';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Row Echelon Form Calculator | Convert Matrix to Row Echelon Form | Doubtlet.com',
  description:
    'Use our Row Echelon Form Calculator to convert any matrix into row echelon form. Perfect for solving linear algebra problems with step-by-step solutions and matrix transformations.',
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
          breadcrumbText6="Row Echelon Form"
          breadcrumbUrl6="/calculator/row-echelon-form-of-a-matrix/"
        />
        <h1 className="text-primary">
          Row Echelon Form (REF) of a Matrix Calculator
        </h1>
        <span>
          This calculator will help you to find Row echelon (ref) form of a
          given matrix at a time with the steps shown
          <br /> Related Calculators:
          <Button
            name="Reduced Row Echelon Form Calculator"
            url="/calculator/reduced-row-echelon-form-of-a-matrix/"
          />
        </span>
        <hr />

        <RowEchelonForm />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
