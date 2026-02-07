import Period from '@/components/calculators/Period';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';

import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Period Calculator - Track Your Menstrual Cycle Accurately | Doubtlet.com',
  description:
    'Use our free Period Calculator to predict your next period, ovulation, and fertile days. Easily track your menstrual cycle for better health and pregnancy planning.',
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
          breadcrumbText3="Health & Fitness"
          breadcrumbUrl3="/calculator/health-and-fitness/"
          breadcrumbUrl4="/calculator/period-calculator/"
          breadcrumbText4="Period"
        />
        <h1 className="text-primary">Period Calculator</h1>
        <span>
          This calculator will help you to calculate the next Period cycle for a
          given set of input values with the steps shown.
          <br />
          Related Calculators:
          <Button name="BMI Calcualtor" url="/calculator/bmi-calculator/" />
        </span>
        <hr />
        <Period />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
