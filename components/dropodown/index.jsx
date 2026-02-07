'use client';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dropdown = ({ items }) => {
  const [inputVal, setInputVal] = useState('');
  const [calculators, setCalculators] = useState(items);
  const router = useRouter();

  const handleChange = (e) => {
    setInputVal(e.target.value);
    let searchValue = e.target.value.toUpperCase();
    let filter = items.filter((item) => {
      let value = item.value.toUpperCase();
      return value.includes(searchValue);
    });
    setCalculators(filter);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (!e.key || ['Enter', 'Space'].includes(e.key)) {
        e.stopPropagation();
        router.push(calculators[0].href);
      }
    },
    [handleChange]
  );

  return (
    <div className="dropdown mb-4">
      <input
        type="text"
        className="form-control rounded-pill p-4 shadow mb-0"
        placeholder="Type your calculator name..."
        name="calculator"
        value={inputVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <ul className="dropdown-menu dropdown-menu-width">
        {calculators.map((item) => (
          <li data-value={item.value} key={item.value}>
            {item.href ? (
              <Link className="nav-link" href={item.href}>
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
