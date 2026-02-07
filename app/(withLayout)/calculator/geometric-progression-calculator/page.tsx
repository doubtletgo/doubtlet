import SumOfFirstNTermsOfGP from '@/components/calculators/SumOfFirstNTermsOfGP';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Sum Of First ‘n’ Terms Of An Geometric Progression(G.P) Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the sum of first n terms of a given geometric progression by Step by Step method',
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
          breadcrumbText6="Sum of n terms of GP"
          breadcrumbUrl6="/calculator/geometric-progression-calculator/"
        />
        <h1 className="text-primary">
          Sum Of First ‘n’ Terms Of An Geometric Progression(G.P) Calculator
        </h1>
        <span>
          This calculator will help you to find the sum of first n terms of a
          given geometric progression with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Sum Of First ‘n’ Terms Of An Arithmetic Progression Calculator"
            url="/calculator/arithmetic-progression-calculator/"
          />
        </span>
        <hr />
        <SumOfFirstNTermsOfGP />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
