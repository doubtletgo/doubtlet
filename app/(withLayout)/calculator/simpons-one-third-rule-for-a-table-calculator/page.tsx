import SimpsonOneThirdRuleForATable from '@/components/calculators/SimpsonOneThirdRuleForATable';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Simpson’s one third Rule for a Table Calculator | Doubtlet.com',
  description:
    'This calculator will help you to approximate the definite integral using the Simpson’s one third rule for the given table of values within the range of upper and lower limits.',
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
          breadcrumbText5="Simpson’s one third Rule for a Table"
          breadcrumbUrl5="/calculator/simpons-one-third-rule-for-a-table-calculator/"
        />
        <h1 className="text-primary">
          Simpson’s one third Rule for a Table Calculator
        </h1>
        <span>
          This calculator will help you to approximate the definite integral
          using the Simpson’s one third rule for the given table of values
          within the range of upper and lower limits.
          <br />
          Related Calculator:
          <Button
            name="Simpson’s one third rule for a function Calculator"
            url="/calculator/simpons-one-third-rule-for-a-function-calculator/"
          />
        </span>
        <hr />
        <SimpsonOneThirdRuleForATable />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
