import EighthPayCommission from '@/components/calculators/8thPayCommission';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    '8th Pay Commission Salary Calculator - Estimate Your Revised Pay | Doubtlet.com',
  description:
    'Calculate your revised salary under the 8th Pay Commission with our free online calculator. Get accurate estimates for basic pay, allowances, and total salary updates.',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname?.split('/')?.[2];
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
          breadcrumbUrl4="/calculator/8th-pay-commission-salary-calculator/"
          breadcrumbText4="8th Pay Commission Salary"
        />
        <h1 className="text-primary">8th Pay Commission Salary Calculator</h1>
        <span>
          This calculator will help you to calculate your salary according to
          8th pay commission with the steps shown.
        </span>
        <hr />
        <EighthPayCommission />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
