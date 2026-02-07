import Sec from '@/components/calculators/Sec';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Sec Value Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Sec of any angle in degree or radian with the steps shown',
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
          breadcrumbText6="Sec Value"
          breadcrumbUrl6="/calculator/secant-calculator/"
        />
        <h1 className="text-primary">Sec Calculator</h1>
        <span>
          This calculator will help you to calculate the Sec of any angle with
          the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cosec value Calculator"
            url="/calculator/cosecant-calculator/"
          />
          <Button
            name="Sec Inverse Calculator"
            url="/calculator/secant-inverse-calculator/"
          />
        </span>
        <hr />
        <Sec />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
