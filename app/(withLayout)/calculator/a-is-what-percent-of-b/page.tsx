import AIsWhatPercentOfB from '@/components/calculators/AIsWhatPercentOfB';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'A is what percent (%) of B Calculator | Doubtlet.com',
  description: `This calculator will help you to calculate the number of which B percent is A with the steps shown`,
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
          breadcrumbText4="Pre Algebra"
          breadcrumbUrl4="/calculator/pre-algebra/"
          breadcrumbText5="Percent"
          breadcrumbUrl5="/calculator/percentage/"
          breadcrumbText6="A is what Percent of B"
          breadcrumbUrl6="/calculator/a-is-what-percent-of-b/"
        />
        <h1 className="text-primary">A is what percent (%) of B Calculator</h1>
        <span>
          This calculator will help you to calculate the number of which B
          percent is A with the steps shown.
          <br /> Related Calculators:
          <Button
            name="A is B percent (%) of what Calculator"
            url="/calculator/a-is-b-percent-of-what/"
          />
          <Button
            name="A percent (%) of B Calculator"
            url="/calculator/percentage-calculator/"
          />
        </span>
        <hr />
        <AIsWhatPercentOfB />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
