import InverseHyperbolicCosine from '@/components/calculators/InverseHyperbolicCosine';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Inverse Hyperbolic Cosine or arcCosh Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Inverse Hyperbolic Cosine of the given value with the Steps shown.',
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
          breadcrumbText6="arcCosh"
          breadcrumbUrl6="/calculator/inverse-hyperbolic-cosine/"
        />
        <h1 className="text-primary">
          Inverse Hyperbolic Cosine or arcCosh Calculator
        </h1>
        <span>
          This calculator will help you to calculate the Hyperbolic Cosine of
          the given value with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Inverse Hyperbolic Sin Calculator"
            url="/calculator/inverse-hyperbolic-sine/"
          />
        </span>
        <hr />

        <InverseHyperbolicCosine />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
