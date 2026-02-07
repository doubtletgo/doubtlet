import SquareRootToItsLowestForm from '@/components/calculators/SquareRootToItsLowestForm';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Square root to its lowest form calculator | Doubtlet.com',
  description:
    'This calculator will help you to reduce the square root of a number to its lowest form with the steps shown.',
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
          breadcrumbText4="Pre Algebra"
          breadcrumbUrl4="/calculator/pre-algebra/"
          breadcrumbText5="Square Root to its Lowest form"
          breadcrumbUrl5="/calculator/square-root-calculator/"
        />
        <h1 className="text-primary">
          Square root to its lowest form calculator
        </h1>
        <span>
          This calculator will help you to reduce the square root of a number to
          its lowest form with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Square Root with steps calculator"
            url="/calculator/square-calculator/"
          />
          <Button
            name="Cube Root Calculator"
            url="/calculator/cube-root-calculator/"
          />
        </span>
        <hr />
        <SquareRootToItsLowestForm />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
