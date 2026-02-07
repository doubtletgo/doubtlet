import NthTermOfHP from '@/components/calculators/NthTermOfHP';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Nth Term Of A Harmonic Progression (H.P) Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the N<sup>th</sup> term of a given Harmonic progression by Step by Step method',
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
          breadcrumbText6="nth term of HP"
          breadcrumbUrl6="/calculator/nth-term-of-harmonic-progression-calculator/"
        />
        <h1 className="text-primary">
          N<sup>th </sup> Term Of A Harmonic Progression (H.P) Calculator
        </h1>
        <span>
          This calculator will help you to find the N<sup>th</sup> term of a
          given Harmonic progression.
          <br />
          Related Calculators:
          <Button
            name="Nth term of an A.P. Calculator"
            url="/calculator/nth-term-of-arithmetic-sequence-calculator/"
          />
        </span>
        <hr />
        <NthTermOfHP />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
