import SimpleInterest from '@/components/calculators/SimpleInterest';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Simple Interest Calculator - Fast & Accurate Interest Calculation | Doubtlet.com',
  description:
    'Calculate simple interest quickly with our free online calculator. Ideal for loans, investments, and financial planning with easy-to-use features and accurate results.',
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
          breadcrumbText3="Finance"
          breadcrumbUrl3="/calculator/finance/"
          breadcrumbUrl4="/calculator/simple-interest-calculator/"
          breadcrumbText4="Simple Interest"
        />
        <h1 className="text-primary">Simple Interest Calculator</h1>
        <span>
          This calculator will help you to calculate simple interest for a given
          set of values with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Compound Interest Calculator"
            url="/calculator/compound-interest-calculator/"
          />
        </span>
        <hr />
        <SimpleInterest />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
