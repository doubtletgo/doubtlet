import NatureOfSolutionForLinearEqn from '@/components/calculators/NatureOfSolutionForLinearEqn';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Nature of Solution for a System of Linear Equations Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the nature of solution for a system of linear equation at a time with the steps shown.',
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
          breadcrumbText6="Nature of Solution"
          breadcrumbUrl6="/calculator/nature-of-solution-for-system-of-linear-equations-calculator/"
        />
        <h1 className="text-primary">
          Nature of Solution for a System of Linear Equations Calculator
        </h1>
        <span>
          This calculator will help you to find the nature of solution for a
          system of linear equation at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Solving system of linear equations Calculator"
            url="/calculator/solving-systm-of-linear-equation-calculator/"
          />
        </span>
        <hr />
        <NatureOfSolutionForLinearEqn />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
