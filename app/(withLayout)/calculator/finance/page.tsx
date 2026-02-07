import Finance from '@/components/calculators/Finance';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Finance Calculators | Doubtlet.com',
  description:
    'Discover our Finance Calculators, including 8th Pay Commission, tax calculators, and more. Simplify complex calculations with step-by-step solutions tailored for various needs.',
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
          breadcrumbText4="Finance"
          breadcrumbUrl4="/calculator/finance/"
        />
        <Finance />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
