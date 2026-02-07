import QuadraticEquation from '@/components/calculators/QuadraticEquation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Quadratic Equation Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Roots of a Quadratic Equation with the Step by Step method',
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
          breadcrumbText5="Quadratic Equation"
          breadcrumbUrl5="/calculator/quadratic-equation/"
        />
        <h1 className="text-primary">Quadratic Equation Calculator</h1>
        <span>
          This calculator will help you to find the Roots of a Quadratic
          Equation.
          <br /> Related Calculator:
          <Button
            name="Discriminant Calculator"
            url="/calculator/discriminant-calculator/"
          />
        </span>
        <hr />
        <QuadraticEquation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
