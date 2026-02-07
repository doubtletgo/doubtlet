import InverseHyperbolicCosecant from '@/components/calculators/InverseHyperbolicCosecant';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Inverse Hyperbolic Cosecant or arcCosech Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Inverse Hyperbolic Cosecant of the given value with Step by Step method',
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
          breadcrumbText6="arcCosech"
          breadcrumbUrl6="/calculator/inverse-hyperbolic-cosecant/"
        />
        <h1 className="text-primary">
          Inverse Hyperbolic Cosecant or Cosech<sup>-1</sup>(X) Calculator
        </h1>
        <span>
          This calculator will help you to calculate the Inverse Hyperbolic
          Cotangent of the given value with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Inverse Hyperbolic Secant Calculator"
            url="/calculator/inverse-hyperbolic-secant/"
          />
        </span>
        <hr />
        <InverseHyperbolicCosecant />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
