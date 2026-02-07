import BarCorrection from '@/components/calculators/BarCorrection';
import Button from '@/components/common/button';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Bar Correction Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Pressure or BAR Correction of a particulat station with the Steps shown.',
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
          breadcrumbUrl4="/calculator/barcorrection/"
          breadcrumbText4="Bar Correction"
        />
        <h1 className="text-primary">Bar Correction Calculator</h1>
        <span>
          This calculator will help you to find the Pressure Correction with the
          steps shown.
          <br />
          <Button name="Dew Point Calculator" url="/calculator/dew-point-calculator/" />
          <Button
            name="Average Wind Speed"
            url="/calculator/average-wind-speed-calculator/"
          />
          <Button name="Synop Calculator" url="/calculator/synop-calculator/" />
        </span>

        <hr />
        <BarCorrection />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
