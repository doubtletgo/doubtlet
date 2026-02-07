import PermutationAndCombination from '@/components/calculators/PermutationAndCombination';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: 'Permutation and Combination calculator | Doubtlet.com',
  description:
    'Use our free Permutation and Combination Calculator to quickly compute the total number of arrangements or selections. Perfect for solving probability, statistics, and combinatorics problems with step-by-step explanations.',
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <PermutationAndCombination />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
