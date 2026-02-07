import DegreeAndLeadingCoefficient from '@/components/calculators/DegreeAndLeadingCoefficient';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Degree and Leading Coefficient Calculator - Polynomial Analyzer | Doubtlet.com',
  description:
    'Determine the degree and leading coefficient of any polynomial with our free online calculator. Simplify polynomial analysis quickly and accurately.',
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
          breadcrumbText5="Degree And Leading Coefficient"
          breadcrumbUrl5="/calculator/degree-and-leading-coefficient-calculator/"
        />
        <h1 className="text-primary">
          {' '}
          Degree and Leading Coefficient Calculator
        </h1>
        <span>
          This calculator will help you to find the degree and leading
          coefficient of given polynomial with the steps shown.
          <br /> Related Calculator:
          <Button
            name="Rational Zeros Theorem Calculator"
            url="/calculator/rational-zeros-theorem-calculator/"
          />
        </span>
        <hr />
        <DegreeAndLeadingCoefficient />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
