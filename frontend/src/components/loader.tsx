import React from 'react';

const Loader = () => {
  return (
    <div className="w-full h-64 flex justify-center items-center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
