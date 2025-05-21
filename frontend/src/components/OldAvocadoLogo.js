import React from 'react';

const OldAvocadoLogo = () => {
  return (
    <div className="flex items-center">
      <div className="avocado-icon mr-2">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
            fill="#A3E635" 
            stroke="#84CC16" 
            strokeWidth="1.5"
          />
          <path 
            d="M16 10C16 12.5 14.2091 15 12 15C9.79086 15 8 12.5 8 10C8 7.5 9.79086 6 12 6C14.2091 6 16 7.5 16 10Z" 
            fill="#4D7C0F" 
            stroke="#4D7C0F" 
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <span className="font-heading font-bold text-white text-2xl tracking-tight">Avocado Space</span>
    </div>
  );
};

export default OldAvocadoLogo;
