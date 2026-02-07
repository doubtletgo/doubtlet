import Sequence from '@/components/calculators/Sequence';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `Sequence and Series Calculators | Doubtlet.com`,
  description: `Explore a comprehensive collection of Sequence and Series calculators, 
      including nth term, sum, mean of terms of arithmetic, geometric, and harmonic series. 
      Enhance your mathematical understanding and solve complex problems effortlessly. 
      Your one-stop destination for step-by-step solutions.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <Sequence />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
    </>
  );
}
