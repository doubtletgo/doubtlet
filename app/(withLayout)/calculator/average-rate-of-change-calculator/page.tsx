import AverageRateOfChange from '@/components/calculators/AverageRateOfChange';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Average rate of Change Calculator | Doubtlet.com',
  description:
    'This calculator will help you to evaluate the average rate of change of the given function on the given interval, with the steps shown.',
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
          breadcrumbText5="Average rate of Change"
          breadcrumbUrl5="/calculator/average-rate-of-change-calculator/"
        />
        <h1 className="text-primary">Average rate of Change Calculator</h1>
        <span>
          This calculator will help you to evaluate the average rate of change
          of the given function on the given interval, with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Evaluate function value Calculator"
            url="/calculator/evaluate-function-value-calculator/"
          />
        </span>
        <hr />
        <AverageRateOfChange />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
