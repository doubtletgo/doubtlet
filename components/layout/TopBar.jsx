import React from 'react';
import { SOCIAL_LINKS } from '../../helpers/constants';

export default function TopBar() {
  return (
    <div
      style={{ backgroundColor: '#E24F44' }}
      className="d-none  d-md-flex justify-content-between align-items-center p-2 px-3"
    >
      <a href="/" target="_blank" className="col-4">
        <span className="text-white">Chat on Discord : Doubtlet#7087</span>
      </a>
      <span className="col-4 text-center text-white text-shimmer">
        Website available for sale!
      </span>
      <a
        className="reddit text-white me-2 col-4 text-end"
        target="_blank"
        href={SOCIAL_LINKS.reddit}
      >
        Visit our Reddit Profile
      </a>
    </div>
  );
}
