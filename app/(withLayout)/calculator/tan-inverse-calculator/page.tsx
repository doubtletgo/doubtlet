import TanInverse from '@/components/calculators/TanInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Tan Inverse Calculator | Calculate tan⁻¹ Easily Online | Doubtlet.com',
  description:
    'Use our Tan Inverse Calculator to quickly and accurately find tan⁻¹ values for any number. Perfect for students and professionals, this tool offers step-by-step solutions in degrees or radians. Simplify trigonometry with precise calculations.',
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
          breadcrumbText6="Tan Inverse"
          breadcrumbUrl6="/calculator/tan-inverse-calculator/"
        />
        <h1 className="text-primary">Tan Inverse Calculator</h1>
        <span>
          This calculator will help you to calculate the tan inverse of given
          values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Tan Value Calculator"
            url="/calculator/tangent-calculator/"
          />
          <Button
            name="Cot Inverse Calculator"
            url="/calculator/cotangent-inverse/"
          />
        </span>
        <hr />
        <TanInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
