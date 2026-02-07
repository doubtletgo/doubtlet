import Npr from '@/components/calculators/Npr';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'npr calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the npr or permutation value with the steps shown by Step by Step method',
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
          breadcrumbText4="Algebra"
          breadcrumbUrl4="/calculator/algebra/"
          breadcrumbText5="Permutation and Combination"
          breadcrumbUrl5="/calculator/permutation-and-combination/"
          breadcrumbText6="npr"
          breadcrumbUrl6="/calculator/npr/"
        />
        <h1 className="text-primary">npr calculator</h1>
        <span>
          This calculator will help you to calculate the npr or permutation
          value with the steps shown.
          <br />
          Related Calculator:
          <Button name="ncr calculator" url="/calculator/ncr/" />
        </span>
        <hr />
        <Npr />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
