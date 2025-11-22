import Tagline from './Tagline';
import React from 'react';

const Logo = () => {
  return (
    <div className="logo">
      <a className="navbar-brand mb-0" href="#">9at9.news</a>
      <small className="text-secondary" style={{ marginTop: "-4px" }}>
        <Tagline />
      </small>
    </div>
  );
};

export default Logo;
