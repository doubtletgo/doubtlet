import SecInverse from '@/components/calculators/SecInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Sec Inverse or arcSec Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the sec inverse of given values in radians or degrees with the steps shown.by Step by Step method ',
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
          breadcrumbText6="Sec Inverse"
          breadcrumbUrl6="/calculator/secant-inverse-calculator/"
        />
        <h1 className="text-primary">Sec Inverse Calculator</h1>
        <span>
          This calculator will help you to calculate the sec inverse of given
          values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Sec Value Calculator"
            url="/calculator/secant-calculator/"
          />
          <Button
            name="Cosec Inverse Calculator"
            url="/calculator/cosecant-inverse-calculator/"
          />
        </span>
        <hr />

        <SecInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
