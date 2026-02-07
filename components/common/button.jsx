import Link from 'next/link';
import React from 'react';

const Button = ({ name, url }) => {
  return (
    <Link className="btn btn-link" href={url}>
      {name}
    </Link>
  );
};

export default Button;
