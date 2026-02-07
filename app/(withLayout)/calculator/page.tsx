import Banner from '@/components/banners/Banner';
import MathCalculators from '@/components/Subjects/MathCalculatorsList';

export const metadata = {
  title: 'Online Math Solver - Free step-by-step Calculators | Doubtlet',
  description:
    'Our free calculators help you to solve algebra, geometry, linear algebra, calculus, linear programming and statistics by step-by-step-approach',
};

export default function Page() {
  return (
    <>
      <Banner />
      <MathCalculators />
    </>
  );
}
