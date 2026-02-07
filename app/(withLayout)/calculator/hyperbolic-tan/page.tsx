import HyperbolicTan from '@/components/calculators/HyperbolicTan';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Hyperbolic Tan or Tanh Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Hyperbolic Tan of the given value with Step by Step method',
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
          breadcrumbText4="Pre Calculus"
          breadcrumbUrl4="/calculator/pre-calculus/"
          breadcrumbText5="Trignometry"
          breadcrumbUrl5="/calculator/trignometry/"
          breadcrumbText6="Tanh"
          breadcrumbUrl6="/calculator/hyperbolic-tan/"
        />
        <h1 className="text-primary">Hyperbolic Tan or Tanh Calculator</h1>
        <span>
          This calculator will help you to calculate the Hyperbolic tan of the
          given value with the steps shown.
          <br /> Related Calculators:
          <Button
            name="Hyperbolic Cot or Coth Calculator"
            url="/calculator/hyperbolic-cot/"
          />
        </span>
        <hr />
        <HyperbolicTan />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
