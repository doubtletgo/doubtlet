import SumOfFirstNTermsOfAPByL from '@/components/calculators/SumOfFirstNTermsOfAPByL';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Sum Of First ‘n’ Terms Of An Arithmetic Progression Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the sum of first n terms of a given arithmetic progression. by Step by Step method',
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
          breadcrumbText5="Sequence and Series"
          breadcrumbUrl5="/calculator/sequence-and-series/"
          breadcrumbText6="Sum of AP by First and Last term"
          breadcrumbUrl6="/calculator/sum-of-arithmetic-progression-calculator-by-first-and-last-term-calculator/"
        />
        <h1 className="text-primary">
          Sum Of First ‘n’ Terms Of An Arithmetic Progression Calculator
        </h1>
        <span>
          This calculator will help you to find the sum of first n terms of a
          given arithmetic progression with the steps shown.
          <br />
          Related Calculator:
          <Button
            name="Nth term of an A.P. Calculator"
            url="/calculator/nth-term-of-arithmetic-sequence-calculator/"
          />
        </span>
        <hr />
        <SumOfFirstNTermsOfAPByL />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
