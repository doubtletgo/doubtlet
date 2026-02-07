import Trigno from '@/components/calculators/Trigno';
import { headers } from 'next/headers';
import CalculatorNotes from '@/components/CalculatorNotes';
import { getNotesServerSide } from '@/helpers/server';

import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title: `Trigonometry Calculators | Doubtlet.com`,
  description: `Explore a comprehensive collection of Trigonometry calculators, including sin, cos, tan, 
      cot, cosec, sec, arcsin, arccos, arctan, arccot, arccosec, arcsec, sinh, cosh, tanh, coth, cosech, 
      sech, arcsinh, arccosh, arctanh, arccoth, arccosech, arcsech. Enhance your mathematical understanding 
      and solve complex problems effortlessly. Your one-stop destination for step-by-step solutions.`,
};

export default async function Page() {
  const headerList = headers();
  const pathname = headerList.get('x-current-path');
  const name = pathname.split('/')?.[2];

  const respNotes = await getNotesServerSide(name);

  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <Trigno />
      </div>
      <CalculatorNotes notes={respNotes} calculatorName={name} />
      <ShapesBackground />
    </>
  );
}
