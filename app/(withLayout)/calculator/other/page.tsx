import Other from '@/components/calculators/Other';
import BreadCrumbs from '@/components/common/BreadCrumbs';
import ShapesBackground from '@/components/ShapesBackground';

export const metadata = {
  title:
    'Other Calculators: Versatile Online Calculators - Tools Beyond Mathematics | Doubtlet',
  description:
    'Explore a wide range of online calculators for health, finance, fitness, and more. Simplify everyday tasks with our accurate and easy-to-use tools.',
};

export default async function Page() {
  return (
    <>
      <div className="container calculator-content text-center mb-5">
        <BreadCrumbs
          breadcrumbUrl1="/"
          breadcrumbText1="Home"
          breadcrumbUrl2="/subjects/"
          breadcrumbText2="Subjects"
          breadcrumbText3="Other"
          breadcrumbUrl3="/calculator/other/"
        />
        <Other />
      </div>
      <ShapesBackground />
    </>
  );
}
