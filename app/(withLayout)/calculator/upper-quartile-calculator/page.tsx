import UpperQuartile from '@/components/calculators/UpperQuartile';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Upper Quartile Calculator | Doubtlet.com',
  description:
    'This calculator will help you to obtain the Upper Quartile of the given values with steps shown.',
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
          breadcrumbUrl5="/calculator/upper-quartile-calculator/"
          breadcrumbText5="Upper Quartile"
        />
        <h1 className="text-primary">Upper Quartile Calculator</h1>
        <span>
          This calculator will help you to obtain the Upper Quartile of the
          given values with steps shown.
          <br />
          Related Calculators:
          <Button
            name="Lower Quartile Calculator"
            url="/calculator/lower-quartile-calculator/"
          />
        </span>
        <hr />
        <UpperQuartile />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
