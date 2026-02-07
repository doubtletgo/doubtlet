import XAndYIntercepts from '@/components/calculators/XAndYIntercepts';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'X and Y Intercepts Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the x and y intercepts of the function, expression or any equation with the steps shown',
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
          breadcrumbText4="Calculus"
          breadcrumbUrl4="/calculator/calculus/"
          breadcrumbText5="X & Y Intercept"
          breadcrumbUrl5="/calculator/intercept-calculator/"
        />
        <h1 className="text-primary">X and Y Intercepts Calculator</h1>
        <span>
          This calculator will help you to find the x and y intercepts of the
          function, expression or any equation with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Difference Quotient Calculator"
            url="/calculator/difference-quotient-calculator/"
          />
        </span>
        <hr />
        <XAndYIntercepts />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
