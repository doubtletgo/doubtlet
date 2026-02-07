import BMI from '@/components/calculators/BMI';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'BMI Calculator - Calculate Your Body Mass Index Online | Doubtlet.com',
  description:
    'Check your Body Mass Index (BMI) easily with our free online calculator. Determine your health status based on weight and height in seconds.',
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
          breadcrumbUrl3="/calculator/health-and-fitness/"
          breadcrumbText3="Health & Fitness"
          breadcrumbUrl4="/calculator/bmi-calculator/"
          breadcrumbText4="BMI"
        />
        <h1 className="text-primary">BMI Calculator</h1>
        <span>
          This calculator will help you to calculate Body Mass Index (BMI) with
          the steps shown.
          <br />
          Related Calculators:
          <Button name="Age Calculator" url="/calculator/age-calculator/" />
        </span>
        <hr />
        <BMI />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
