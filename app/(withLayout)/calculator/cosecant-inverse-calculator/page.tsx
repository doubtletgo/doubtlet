import CosecInverse from '@/components/calculators/CosecInverse';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cosec inverse Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the cosec inverse of given values in radians or degrees with the steps shown. by Step by Step method',
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
          breadcrumbText4="Trignometry"
          breadcrumbUrl4="/calculator/trignometry/"
          breadcrumbText5="Cosec inverse Calculator"
          breadcrumbUrl5="/calculator/cosecant-inverse-calculator/"
        />
        <h1 className="text-primary">Cosec inverse calculator</h1>
        <span>
          This calculator will help you to calculate the cosec inverse of given
          values in radians or degrees with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Cosec Value Calculator"
            url="/calculator/cosecant-calculator/"
          />
          <Button
            name="Sec Inverse Calculator"
            url="/calculator/secant-inverse-calculator/"
          />
        </span>
        <hr />
        <CosecInverse />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
