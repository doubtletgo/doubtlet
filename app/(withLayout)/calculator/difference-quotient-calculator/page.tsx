import BreadCrumbs from '@/components/common/BreadCrumbs';
import DifferenceQuotient from '../../../../components/calculators/DifferenceQuotient';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Difference Quotient Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Difference Quotient for a given Function with the steps shown.',
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
          breadcrumbText5="Difference Quotient Calculator"
          breadcrumbUrl5="/calculator/difference-quotient-calculator/"
        />
        <h1 className="text-primary">Difference Quotient Calculator</h1>
        <span>
          This calculator will help you to find the Difference Quotient for a
          given Function with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Average rate of Change Calculator"
            url="/calculator/average-rate-of-change-calculator/"
          />
          <Button
            name="Evaluate function value Calculator"
            url="/calculator/evaluate-function-value-calculator/"
          />
        </span>
        <hr />
        <DifferenceQuotient />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
