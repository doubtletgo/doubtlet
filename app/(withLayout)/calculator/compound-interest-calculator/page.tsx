import CompoundInterest from '@/components/calculators/CompoundInterest';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Compound Interest Calculator - Calculate Growth Easily | Doubtlet.com',
  description:
    'Calculate compound interest effortlessly with our free online calculator. Perfect for savings, investments, and financial planning with accurate results.',
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
          breadcrumbUrl4="/calculator/compound-interest-calculator/"
          breadcrumbText4="Compound Interest"
        />
        <h1 className="text-primary">Compound Interest Calculator</h1>
        <span>
          This calculator will help you to calculate compound interest for a
          given set of input values with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Simple Interest Calculator"
            url="/calculator/simple-interest-calculator/"
          />
        </span>
        <hr />
        <CompoundInterest />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
