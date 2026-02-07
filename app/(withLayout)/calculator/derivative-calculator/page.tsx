import Derivative from '@/components/calculators/Derivative';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import Button from '@/components/common/button';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Derivative Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the derivative with steps for any function with respect to any variable.',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname?.split('/')?.[2];
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
          breadcrumbText4="Calculus"
          breadcrumbUrl4="/calculator/calculus/"
          breadcrumbText5="Derivative"
          breadcrumbUrl5="/calculator/derivative-calculator/"
        />
        <h1 className="text-primary">Derivative Calculator</h1>
        <span>
          This calculator will help you to obtain the derivative with steps for
          any function with respect to any variable.
        </span>
        <Button
          name="Derivative Calculator with Steps"
          url="https://derivativecalc.com/"
        />
        <hr />

        <Derivative />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
