import Cosec from '@/components/calculators/Cosec';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Cosec value Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the Cosec of any angle in degree or radian with the steps shown',
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
          breadcrumbText5="Cosec Value"
          breadcrumbUrl5="/calculator/cosecant-calculator/"
        />
        <h1 className="text-primary">Cosec Calculator</h1>
        <span>
          This calculator will help you to calculate the Cosec of any angle in
          degree or radian with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Sec value Calculator"
            url="/calculator/secant-calculator/"
          />
          <Button
            name="Cosec Inverse Calculator"
            url="/calculator/cosecant-inverse-calculator/"
          />
        </span>
        <hr />
        <Cosec />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
