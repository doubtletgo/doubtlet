import CotInverse from '@/components/calculators/CotInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Cot Inverse Calculator | Easy Cotangent Inverse Calculation | Doubtlet.com',
  description:
    'Use our step-by-step Cot Inverse Calculator for quick and accurate cotangent inverse calculations. Perfect for solving trigonometry problems with detailed solutions and explanations.',
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
          breadcrumbText6="Cot Inverse"
          breadcrumbUrl6="/calculator/cotangent-inverse/"
        />
        <h1 className="text-primary">Cot Inverse Calculator</h1>
        <span>
          This calculator will help you to calculate the cot inverse of given
          values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cot Value Calculator"
            url="/calculator/cotangent-calculator/"
          />
          <Button
            name="Tan Inverse Calculator"
            url="/calculator/tan-inverse-calculator/"
          />
        </span>
        <hr />
        <CotInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
