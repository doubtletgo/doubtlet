import React, { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import styles from './styles.module.scss';

import { MathField } from '@/types/mathfield.types';
import MathInput from 'react-math-keyboard';

interface ExpressionInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  setMathfieldRef?: (ref: MathField) => void;
  validate?: (value: string) => boolean;
  allowAlphabeticKeyboard?: boolean;
  numericToolbarKeys?: string[];
  placeholder?: string;
  disabled?: boolean;
  labelCol?: string;
  inputCol?: string;
  labelClassName?: string;
  inputContainerClassName?: string;
  errorIconStyle?: React.CSSProperties;
  errorMessageStyle?: React.CSSProperties;
  errorMessage?: string;
}

const defaultValidate = (value: string) => {
  if (value.trim() === '') {
    return false;
  }
  return true;
};

const ExpressionInput: React.FC<ExpressionInputProps> = ({
  label,
  value,
  setValue,
  setMathfieldRef,
  validate = defaultValidate,
  allowAlphabeticKeyboard = false,
  numericToolbarKeys = [],
  placeholder,
  disabled = false,
  labelCol = 'col-3',
  inputCol = 'col-8',
  labelClassName = styles.label,
  inputContainerClassName = styles.inputContainer,
  errorIconStyle,
  errorMessageStyle,
  errorMessage = null,
}) => {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    const isValid = !!value && validate(value);
    setIsInvalid(!isValid);
  }, [value, validate]);

  return (
    <div className={`dropdown row mb-2 d-flex align-items-center`}>
      <div className={`${labelClassName} ${labelCol}`}>{label}</div>
      <div
        className={`${inputContainerClassName} ${inputCol} ${
          isInvalid ? 'invalid' : ''
        }`}
      >
        <MathInput
          setValue={setValue}
          numericToolbarKeys={numericToolbarKeys}
          setMathfieldRef={setMathfieldRef}
          allowAlphabeticKeyboard={allowAlphabeticKeyboard}
          initialLatex={value}
          placeholder={placeholder}
          disabled={disabled}
          tabShouldSkipKeys
        />
        {isInvalid && (
          <div className={styles.errorIcon} style={errorIconStyle}>
            <MdErrorOutline size="1.5rem" color="#dc3545" />
          </div>
        )}
        {isInvalid && errorMessage && (
          <div className={styles.errorMessage} style={errorMessageStyle}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpressionInput;
