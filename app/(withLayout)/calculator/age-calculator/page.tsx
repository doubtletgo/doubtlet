import Age from '@/components/calculators/Age';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Age Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the age of of any person on any date with the steps shown.',
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
          breadcrumbUrl4="/calculator/age-calculator/"
          breadcrumbText4="Age"
        />
        <h1 className="text-primary">Age Calculator</h1>
        <span>
          This calculator will help you to find your Age on a given date with
          the steps shown.
        </span>
        <hr />
        <Age />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
