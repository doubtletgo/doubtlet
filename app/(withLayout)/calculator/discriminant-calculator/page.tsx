import Discriminant from '@/components/calculators/Discriminant';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Discriminant Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Discriminant of a Quadratic Equation with the Steps Shown',
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
          breadcrumbText5="Discriminant"
          breadcrumbUrl5="/calculator/discriminant-calculator/"
        />
        <h1 className="text-primary">Discriminant Calculator</h1>
        <span>
          This calculator will help you to find the Discriminant of a Quadratic
          Equation with the steps shown.
          <br /> Related Calculator:
          <Button
            name="Quadratic Equation Calculator"
            url="/calculator/quadratic-equation/"
          />
        </span>
        <hr />
        <Discriminant />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
