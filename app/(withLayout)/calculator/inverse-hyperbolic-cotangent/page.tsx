import InverseHyperbolicCotangent from '@/components/calculators/InverseHyperbolicCotangent';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Inverse Hyperbolic Cotangent or atcCoth Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Inverse Hyperbolic Cotangent of the given value with Step by Step method',
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
          breadcrumbText6="arcCoth"
          breadcrumbUrl6="/calculator/inverse-hyperbolic-cotangent/"
        />
        <h1 className="text-primary">
          Inverse Hyperbolic Cotangent or Coth<sup>-1</sup>(X) Calculator
        </h1>
        <span>
          This calculator will help you to calculate the Inverse Hyperbolic
          Cotangent of the given value with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Inverse Hyperbolic Tan Calculator"
            url="/calculator/inverse-hyperbolic-tangent/"
          />
        </span>
        <hr />

        <InverseHyperbolicCotangent />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
