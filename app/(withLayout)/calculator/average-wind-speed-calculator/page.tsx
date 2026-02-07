import AverageWindSpeed from '@/components/calculators/AverageWindSpeed';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import Button from '@/components/common/button';

export const metadata = {
  title: 'Average Wind Speed Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the average wind speed for certain time frame by Step by Step method',
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
          breadcrumbText3="Other"
          breadcrumbUrl3="/calculator/other/"
          breadcrumbUrl4="/calculator/average-wind-speed-calculator/"
          breadcrumbText4="Average Wind Speed"
        />
        <h1 className="text-primary">Average Wind Speed Calculator</h1>
        <span>
          This calculator will help you to find the average wind speed for
          certain time frame as per IMD standards.
          <br />

          <Button name="Dew Point Calculator" url="/calculator/dew-point-calculator" />
          <Button name="Bar Correction " url="/calculator/barcorrection" />
          <Button name="Synop Calculator" url="/calculator/synop-calculator/" />
        </span>

        <hr />
        <AverageWindSpeed />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
