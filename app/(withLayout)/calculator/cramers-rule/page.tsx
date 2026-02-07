import CramersRule from '@/components/calculators/CramersRule';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cramers Rule Calculator | doubtlet.com',
  description:
    'Effortlessly solve systems of linear equations using Cramers Rule with our free online calculator. Get accurate results and step-by-step solutions quickly.',
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
          breadcrumbText6="Cramer's Rule"
          breadcrumbUrl6="/calculator/cramers-rule/"
        />
        <h1 className="text-primary">{`Cramer's Rule Calculator`}</h1>
        <span>
          {`This calculator will help you to find the solution of a system of
          linear equation by Cramer's rule with the steps shown.`}
          <br />
          Related Calculators:
          <Button
            name="Solving System of Linear Equations Calculator"
            url="/calculator/solving-system-of-linear-equation-calculator/"
          />
        </span>
        <hr />
        <CramersRule />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
