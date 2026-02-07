import Statistics from '@/components/calculators/Probability&Statistics';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `Probability & Statistics Calculators Online | Doubtlet.com`,
  description: `Discover a wide range of Probability & Statistics calculators designed to simplify data analysis, probability distributions, hypothesis testing, and more. Free and easy-to-use tools for students, researchers, and professionals.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <Statistics />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
