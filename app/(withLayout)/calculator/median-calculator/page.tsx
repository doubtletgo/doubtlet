import Median from '@/components/calculators/Median';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Median Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the Median of the given values with steps shown.',
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
          breadcrumbUrl4="/calculator/probability-and-statistics/"
          breadcrumbText4="Probability & Statistics"
          breadcrumbUrl5="/calculator/median-calculator/"
          breadcrumbText5="Median"
        />
        <h1 className="text-primary">Median Calculator</h1>
        <span>
          This calculator will help you to obtain the Median of the given values
          with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Mean Calculator"
            url="/calculatorarithmetic-mean-calculator/"
          />
          <Button name="Mode Calculator" url="/calculator/mode-calculator/" />
        </span>
        <hr />
        <Median />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
