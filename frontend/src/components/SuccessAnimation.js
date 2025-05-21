import React, { useEffect, useState } from 'react';

const SuccessAnimation = ({ message }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className={`relative w-20 h-20 mb-4 transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <svg 
          className="w-full h-full text-green-500" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
        
        {/* Circular animation */}
        <div className={`absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-500 
                         transition-all duration-700 ${animate ? 'scale-100 opacity-0' : 'scale-50 opacity-50'}`}
             style={{ animation: animate ? 'success-pulse 1.2s ease-out' : 'none' }}></div>
      </div>
      
      <h3 className={`text-xl font-bold text-white mb-2 transition-all duration-700 delay-300 
                      ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        Success!
      </h3>
      
      <p className={`text-gray-300 transition-all duration-700 delay-500 
                     ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {message}
      </p>
    </div>
  );
};

export default SuccessAnimation;
