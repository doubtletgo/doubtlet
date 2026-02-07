import RelativeHumidity from '@/components/calculators/RelativeHumidity';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Relative Humidity Calculator | Doubtlet.com',
  description:
    'This calculator will help you to find the Relative humidity with the Steps shown.',
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
          breadcrumbText4="Relative Humidity"
          breadcrumbUrl4="/calculator/relative-humidity-calculator/"
        />
        <h1 className="text-primary">Relative Humidity Calculator</h1>
        <span>
          This calculator will help you to find the Relative humidity with the
          steps shown.
          <br />

        </span>
        <hr />
        <RelativeHumidity />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
