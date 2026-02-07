import SolvingAlgebraicEquations from '@/components/calculators/SolvingAlgebraicEquations';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Solving Algebraic Equations Calculator | Doubtlet.com',
  description:
    'This calculator will help you to solve any algebraic equation of one variable with the steps shown.',
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
          breadcrumbText4="Algebra"
          breadcrumbUrl4="/calculator/algebra/"
          breadcrumbText5="Solving Algebraic Equations"
          breadcrumbUrl5="/calculator/solving-algebraic-equations-calculator/"
        />
        <h1 className="text-primary">Solving Algebraic Equations Calculator</h1>
        <span>
          This calculator will help you to solve any algebraic equation of one
          variable with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Solving System of Linear Equations Calculator"
            url="/calculator/solving-system-of-linear-equation-calculator/"
          />
        </span>
        <hr />
        <SolvingAlgebraicEquations />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
