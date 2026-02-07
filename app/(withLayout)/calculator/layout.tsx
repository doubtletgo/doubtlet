import 'katex/dist/katex.min.css';
import ShapesBackground from '@/components/ShapesBackground';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ShapesBackground />
    </>
  );
}
