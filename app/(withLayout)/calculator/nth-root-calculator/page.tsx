import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import NthRootFunction from '@/components/calculators/NthRootFunction';
import { getNotesServerSide } from '@/helpers/server';
import Button from '@/components/common/button';

export const metadata = {
  title: 'Nth Root calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the nth root of a number for different input values with the steps shown.',
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
          breadcrumbText5="Nth Root"
          breadcrumbUrl5="/calculator/nth-root-calculator/"
        />
        <h1 className="text-primary">
          N<sup>th</sup> Root calculator
        </h1>
        <span>
          This calculator will help you to calculate the nth root of a number
          for different input values with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cube Root Calculator"
            url="/calculator/cube-root-calculator/"
          />
          <Button
            name="Square Root with steps calculator"
            url="/calculator/square-calculator/"
          />
        </span>
        <hr />
        <NthRootFunction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
