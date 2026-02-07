import EvaluateFunctionValue from '@/components/calculators/EvaluateFunctionValue';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Evaluate function value Calculator | Doubtlet.com',
  description:
    'This calculator will help you to evaluate the value of the given function or expression by plugging the values of the given variable with the steps shown.',
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
          breadcrumbText5="Evaluate Function value"
          breadcrumbUrl5="/calculator/evaluate-function-value-calculator/"
        />
        <h1 className="text-primary">Evaluate function value Calculator</h1>
        <span>
          This calculator will help you to evaluate the value of the given
          function or expression by plugging the values of the given variable.
          <br />
          Related Calculator:
          <Button
            name="Average rate of Change Calculator"
            url="/calculator/average-rate-of-change-calculator/"
          />
        </span>
        <hr />
        <EvaluateFunctionValue />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
