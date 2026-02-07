import SpaceTravelCost from '@/components/calculators/SpaceTravelCost';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';

import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title:
    'Space Travel Cost Calculator – Estimate Your Ticket to Space! | Doubtlet.com',
  description:
    'Find out how much it costs to travel to space with our Space Travel Cost Calculator. Compare ticket prices for space tourism, Mars missions, and more!',
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
          breadcrumbText3="Finance"
          breadcrumbUrl3="/calculator/finance/"
          breadcrumbUrl4="/calculator/space-travel-cost-calculator/"
          breadcrumbText4="Space Travel Cost"
        />
        <h1 className="text-primary">Space Travel Cost Calculator</h1>
        <span>
          This calculator will help you to calculate the space travel cost for a
          given set of input values with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Weight on Mars Calculator"
            url="/calculator/weight-on-mars-calculator/"
          />
        </span>
        <hr />
        <SpaceTravelCost />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
