import NecklacePermutation from '@/components/calculators/NecklacePermutation';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import Button from '@/components/common/button';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Necklace Permutation Calculator | Doubtlet.com',
  description:
    'This calculator will help you to calculate the number of possible necklace circular permutations or arrangements of n different things taken all at a time with the steps shown.   ',
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
          breadcrumbText6="Necklace"
          breadcrumbUrl6="/calculator/"
        />
        <h1 className="text-primary">Necklace Permutation Calculator</h1>
        <span>
          This calculator will help you to calculate the number of possible
          necklace circular permutations or arrangements of n different things
          taken all at a time with the steps shown.
          <br />
          Related Calculators:
          <Button
            name="Circular Permutation Calculator"
            url="/calculator/circular-permutation-calculator/"
          />
        </span>
        <hr />
        <NecklacePermutation />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
