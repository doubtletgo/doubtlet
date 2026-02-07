import SineInverse from '@/components/calculators/SineInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Sin Inverse Calculator | Calculate Inverse Sine (Sin⁻¹) Online | Doubtlet.com',
  description:
    'Use our Sin Inverse or arcsin Calculator to quickly find the inverse sine (Sin⁻¹) of any value. Perfect for students and professionals solving trigonometric equations and problems in degrees or radians.',
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
          breadcrumbText6="Sine Inverse"
          breadcrumbUrl6="/calculator/sine-inverse-calculator/"
        />
        <h1 className="text-primary">Sine Inverse Calculator</h1>
        <span>
          This calculator will help you to calculate the arcsin or sin inverse
          of given values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Sine Value Calculator"
            url="/calculator/sine-calculator/"
          />
          <Button
            name="Cos Inverse Calculator"
            url="/calculator/cosine-inverse-calculator/"
          />
        </span>
        <hr /> <SineInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
