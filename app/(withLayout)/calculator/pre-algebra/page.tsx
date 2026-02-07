import PreAlgebra from '@/components/calculators/PreAlgebra';
import ShapesBackground from '@/components/ShapesBackground';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

export const metadata = {
  title: `Pre-Algebra Calculators | Doubtlet.com`,
  description: `Explore a comprehensive collection of pre-algebra calculators, including order of 
      operations, prime factorization, LCM, GCD, factors, modulo, factorial, and operations on fractions, 
      decimals, and percent. Enhance your mathematical understanding and solve complex problems effortlessly. 
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
        <PreAlgebra />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
