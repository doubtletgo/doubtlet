import LogarithmCalculator from '@/components/calculators/Logarithm';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Logarithm Calculator | Solve Logs Instantly Online | Doubtlet.com',
  description:
    'Use our free logarithm calculator to compute log values for any base quickly and accurately. Ideal for math problems, equations, and learning logarithmic concepts."',
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
          breadcrumbUrl4="/calculator/algebra/"
          breadcrumbText4="Algebra"
          breadcrumbUrl5="/calculator/logarithm-calculator/"
          breadcrumbText5="Logarithm"
        />
        <h1 className="text-primary">Logarithm Calculator</h1>
        <span>
          This calculator will help you to evaluate logarithm value with the
          steps shown.
          <br />
          Related Calculators:
          <Button
            name="Exponential Function Calculator"
            url="/calculator/exponential-function-calculator/"
          />
        </span>
        <hr />
        <LogarithmCalculator />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
