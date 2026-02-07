import SolvingSystemOfLinearEquation from '@/components/calculators/SolvingSystemOfLinearEquation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Solving System of Linear Equations Calculator | Doubtlet.com',
  description:
    'This calculator will help you to solve any system of linear equation by three methods at a time with the steps shown.',
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
          breadcrumbText6="Solving System of Linear Equations"
          breadcrumbUrl6="/calculator/solving-system-of-linear-equation-calculator/"
        />
        <h1 className="text-primary">
          Solving System of Linear Equations Calculator
        </h1>
        <span>
          This calculator will help you to solve any system of linear equation
          by three methods at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cramer's Rule Calculator"
            url="/calculator/cramers-rule/"
          />
        </span>
        <hr />
        <SolvingSystemOfLinearEquation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
