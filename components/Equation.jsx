import React, { useCallback } from 'react';

export const Equation = ({
  className = '',
  equation,
  print = false,
  ...rest
}) => {
  const handlePrint = useCallback(() => {
    const container = document.querySelector('.no-print');
    container?.classList.remove('no-print');
    window.print();
    container?.classList.add('no-print');
  }, []);
  return (
    <div
      className={`card bg-transparent equation-container overflow-auto ${className}`}
      {...rest}
    >
      {!!print && (
        <div className="export-actions">
          <i
            className="fas fa-print d-flex justify-content-end m-3"
            onClick={handlePrint}
          />
        </div>
      )}
      <div
        className="card-body"
        dangerouslySetInnerHTML={{ __html: equation }}
      />
    </div>
  );
};
