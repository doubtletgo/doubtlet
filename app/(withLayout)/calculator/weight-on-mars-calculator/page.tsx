import WeightOnMars from '@/components/calculators/WeightOnMars';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Weight on Mars Calculator - Find Your Weight on Mars | Doubtlet.com',
  description:
    'Use our free Weight on Mars Calculator to find out how much you would weigh on Mars. Simply enter your Earth weight, and get instant results based on Martian gravity!',
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
          breadcrumbText3="Others"
          breadcrumbUrl3="/calculator/other/"
          breadcrumbUrl4="/calculator/weight-on-mars-calculator/"
          breadcrumbText4="Weight On Mars"
        />
        <h1 className="text-primary">Weight on Mars Calculator</h1>
        <span>
          This calculator will help you to convert the weight on earth to the
          weight on mars for a given set of input values with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Space Travel Cost Calculator"
            url="/calculator/space-travel-cost-calculator/"
          />
        </span>
        <hr />
        <WeightOnMars />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
