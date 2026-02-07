import Cot from '@/components/calculators/Cot';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Cotangent Calculator | Calculate Cotangent (Cot) Online | Doubtlet.com',
  description:
    'Use our Cotangent Calculator to quickly find the cotangent (Cot) of any angle in degrees or radians. Perfect for trigonometry students and professionals needing accurate results.',
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
          breadcrumbText6="Cot"
          breadcrumbUrl6="/calculator/cotangent-calculator/"
        />
        <h1 className="text-primary">Cot value Calculator</h1>
        <span>
          This calculator will help you to calculate the Cotangent of any angle
          in degree or radian with the steps shown
          <br />
          Related Calculators:
          <Button
            name="Tan value Calculator"
            url="/calculator/tangent-calculator/"
          />
          <Button
            name="cot Inverse Calculator"
            url="/calculator/cotangent-inverse/"
          />
        </span>
        <hr />
        <Cot />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
