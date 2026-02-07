'use client';
import RenderMarkDown from './markdown/MarkdownRenderer';


export default function CalculatorNotes({
  notes,
  calculatorName,
}: {
  notes: string;
  calculatorName: string;
}) {
  return (
    <>
      {notes && (
        <div className="container mx-auto notes-container notes-card">
          <RenderMarkDown>{notes}</RenderMarkDown>
        </div>
      )}
    </>
  );
}
