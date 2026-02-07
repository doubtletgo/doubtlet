import DewPoint from '@/components/calculators/DewPoint';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import Button from '@/components/common/button';

export const metadata = {
  title: 'Dew Point Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Dew Point, Vapour Pressure, Relative Humidity Step by Step.',
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
          breadcrumbUrl4="/calculator/dew-point-calculator/"
          breadcrumbText4="Dew Point"
        />
        <h1 className="text-primary">Dew Point Calculator</h1>
        <span>
          This calculator will help you to find the Dew Point, Vapour Pressure,
          Relative Humidity as per IMD standards.
          <br />
          Other Calculators:
          <Button name="Bar correction" url="/calculator/barcorrection/" />
          <Button
            name="Average Wind Speed"
            url="/calculator/average-wind-speed-calculator/"
          />
          <Button name="Synop Calculator" url="/calculator/synop-calculator/" />
        </span>

        <hr />
        <DewPoint />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
