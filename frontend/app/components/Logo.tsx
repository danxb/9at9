import Tagline from './Tagline';
import React from 'react';

const Logo = () => {
  return (
    <div className="logo">
      <img src="/at9.svg" width="50" height="50" />
      <div className="name-and-tagline">
        <a className="navbar-brand mb-0" href="#">at9.news</a>
        <small className="text-secondary" style={{ marginTop: "-4px" }}>
          <Tagline />
        </small>
      </div>
    </div>
  );
};

export default Logo;
