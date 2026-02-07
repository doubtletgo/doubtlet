import React, { useState, useEffect, useRef } from 'react';
import MathInput from 'react-math-keyboard';
import { Equation } from './Equation';
import { renderSteps } from '../helpers/katex';

const MatrixInput = ({ rows, columns, onUpdate, value, customClass }) => {
  const matrixDataRef = useRef([]);
  const [rowToPass, setRowToPass] = useState();
  const [clmToPass, setClmToPass] = useState();
  const mf = useRef(null);

  useEffect(() => {
    if (!!rows && !!columns) {
      if (value.length < rows || value[0].length < columns) {
        value = Array.from({ length: rows }, () =>
          Array.from({ length: columns }, () => ' ')
        );
      } else if (value.length > rows || value[0].length > columns)
        value = value.slice(0, rows).map((i) => i.slice(0, columns));
      matrixDataRef.current = value;
      onUpdate(matrixDataRef.current);
    }
  }, [rows, value, columns, onUpdate]);

  const updateCellValue = (rowIndex, columnIndex, value) => {
    if (!value && value != '0') value = '';
    const updatedMatrix = [...matrixDataRef.current];
    if (!updatedMatrix[rowIndex]) updatedMatrix.push([]);
    updatedMatrix[rowIndex][columnIndex] = value;
    matrixDataRef.current = updatedMatrix;
    onUpdate(updatedMatrix);
  };

  const onFocus = (rowIndex, columnIndex) => {
    setRowToPass(rowIndex);
    setClmToPass(columnIndex);
  };
  const isKeyboardActiveForCell = (rowIndex, columnIndex) => {
    return clmToPass == columnIndex && rowToPass == rowIndex;
  };

  const cellData = (r, c) => {
    let data = matrixDataRef.current?.[r][c];
    let cell = [
      {
        value: !data && data != '0' ? '' : data,
        type: 'equation',
        className: 'border-dark-1',
      },
    ];
    return renderSteps(cell);
  };

  return (
    <>
      <table className={customClass || `w-100 mb-4`}>
        <tbody>
          {matrixDataRef.current.map((row, rowIndex) => (
            <tr key={rowIndex} className="border">
              {row.map((val, columnIndex) => (
                <td key={columnIndex} className="matrixCell">
                  {isKeyboardActiveForCell(rowIndex, columnIndex) ? (
                    <MathInput
                      tabShouldSkipKeys
                      setMathfieldRef={(ref) => (mf.current = ref)}
                      setValue={(e) =>
                        updateCellValue(rowIndex, columnIndex, e)
                      }
                      allowAlphabeticKeyboard={false}
                      numericToolbarKeys={[
                        'epower',
                        'pi',
                        'ln',
                        'log',
                        'dot',
                        'sin',
                        'cos',
                        'tan',
                      ]}
                      initialLatex={val?.toString() || ''}
                    />
                  ) : (
                    <Equation
                      tabIndex={0}
                      onClick={() => onFocus(rowIndex, columnIndex)}
                      onFocus={() => onFocus(rowIndex, columnIndex)}
                      equation={cellData(rowIndex, columnIndex)}
                      className="paddingZero overflow-hidden"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MatrixInput;
