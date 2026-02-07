import React, { useCallback, useEffect, useState } from 'react';

const Input = ({
  className,
  placeholder,
  setVal,
  value = '',
  type = 'text',
  inputClass = '',
  min = 0,
  max = 10000,
  pattern = /^-?(\d)*(\.\d*)?$/,
  prohibited = [],
  disabled = false,
}) => {
  const [internalVal, setInternalVal] = useState(value);
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    if (value !== internalVal) setInternalVal(value);
  }, [value]);

  const validate = useCallback(
    (value) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let [_, q] = internalVal.toString().split('/');

      let isValid = true;

      if (q && Number(q) === 0) {
        return false;
      }
      if (value.toString() === '' || isNaN(value)) {
        return true;
      }
      if (typeof min === 'number') {
        isValid = isValid && value > min;
      }
      if (typeof max === 'number') {
        isValid = isValid && value < max;
      }
      return isValid;
    },
    [min, max, internalVal]
  );

  useEffect(() => {
    const isValid = validate(+internalVal);

    if (isValid && value !== internalVal) {
      if (setVal) setVal(internalVal);
    }

    setIsValid(isValid);
  }, [internalVal]);

  const handleChange = useCallback(
    (e) => {
      let newValue = e.target.value;
      if (
        pattern &&
        pattern.test(newValue) &&
        !prohibited.includes(parseFloat(newValue))
      ) {
        setInternalVal(newValue);
      } else {
        e.target.value = internalVal;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [setInternalVal, internalVal, validate, internalVal, pattern]
  );

  return (
    <div
      className={`col-4 d-flex justify-content-end position-relative ${className}`}
    >
      <input
        placeholder={placeholder}
        value={internalVal}
        type={type}
        className={`form-control ${
          isValid ? 'border-primary' : 'is-invalid'
        } ${inputClass}`}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
