import Ncr from '@/components/calculators/Ncr';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'ncr calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the ncr value or number of combinations with Step by Step method',
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
          breadcrumbText6="ncr"
          breadcrumbUrl6="/calculator/ncr/"
        />
        <h1 className="text-primary">ncr calculator</h1>
        <span>
          This calculator will help you to calculate the ncr or number of
          permutation value with the steps shown.
          <br />
          Related Calculator:
          <Button name="npr calculator" url="/calculator/npr/" />
        </span>
        <hr />
        <Ncr />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
