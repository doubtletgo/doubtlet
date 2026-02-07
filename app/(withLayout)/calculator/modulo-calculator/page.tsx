import Modulo from '@/components/calculators/Modulo';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Modulo Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate a mod b with the steps shown by Step by Step method',
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
          breadcrumbText4="Pre Algebra"
          breadcrumbUrl4="/calculator/pre-algebra/"
          breadcrumbText5="Modulo"
          breadcrumbUrl5="/calculator/modulo-calculator/"
        />
        <h1 className="text-primary">Modulo calculator</h1>
        <span>
          This calculator will help you to calculate a mod b with the steps
          shown.
          <br />
          Related Calculators:
          <Button
            name="Factorial Calculator"
            url="/calculator/factorial-calculator/"
          />
          <Button name="LCM Calculator" url="/calculator/lcm-calculator/" />
        </span>
        <hr />

        <Modulo />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
