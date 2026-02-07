import GaussianJordanElimination from '@/components/calculators/GaussianJordanElimination';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Gauss-Jordan Elimination Calculator | Doubtlet.com',
  description:
    'This calculator will help you to perform Gauss-Jordan elimination on a given matrix at a time with the steps shown.',
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
          breadcrumbText6="Gauss Jordan Ellimination"
          breadcrumbUrl6="/calculator/gauss-jordan-elimination-calculator/"
        />{' '}
        <h1 className="text-primary">Gauss-Jordan Elimination Calculator</h1>
        <span>
          This calculator will help you to perform Gauss-Jordan elimination on a
          given matrix at a time with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Reduced Row Echelon Form (RREF) Calculator"
            url="/calculator/reduced-row-echelon-form-of-a-matrix/"
          />
          <Button
            name="Gaussian Ellimination Calculator"
            url="/calculator/gaussian-elimination-calculator/"
          />
        </span>
        <hr />
        <GaussianJordanElimination />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
