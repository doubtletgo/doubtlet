import ExponentialFunction from '@/components/calculators/ExponentialFunction';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Exponential Function Calculator - Solve Exponents Easily | Doubtlet.com',
  description:
    'Calculate exponential functions and solve equations effortlessly with our free online calculator. Perfect for math problems, graphing, and learning exponential concepts.',
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
          breadcrumbText5="Exponential Function"
          breadcrumbUrl5="/calculator/exponential-function-calculator/"
        />

        <h1 className="text-primary">{`Exponential Function Calculator`}</h1>
        <span>
          {`This calculator will help you to evaluate any exponential expression with the steps shown.`}
          <br />
          Related Calculators:
          <Button
            name="Logarithm Calculator"
            url="/calculator/logarithm-calculator/"
          />
        </span>
        <hr />

        <ExponentialFunction />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
