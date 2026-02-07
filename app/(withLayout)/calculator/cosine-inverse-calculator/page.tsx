import CosInverse from '@/components/calculators/CosInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cosine Inverse Calculator | Calculate Cos⁻¹ (Arccos) Online',
  description:
    'Use our Cosine Inverse Calculator to find the inverse cosine (Cos⁻¹) of any value. Solve trigonometric equations in degrees or radians with fast, accurate results for students and professionals.',
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
          breadcrumbText6="Cos Inverse"
          breadcrumbUrl6="/calculator/cosine-inverse-calculator/"
        />
        <h1 className="text-primary">Cos Inverse Calculator</h1>
        <span>
          This calculator will help you to calculate the cos inverse of given
          values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cosine Value Calculator"
            url="/calculator/cosine-calculator/"
          />
          <Button
            name="Sine Inverse Calculator"
            url="/calculator/sine-inverse-calculator/"
          />
        </span>
        <hr />
        <CosInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
