import React from 'react';

const SpaceLogo = () => {
  return (
    <div className="relative">
      {/* Star particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(20).fill().map((_, index) => (
          <div 
            key={index}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
        {/* The logo text */}
      <span className="space-logo-text relative">Avocado Space</span>
        {/* Inline styles for animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
        `
      }} />
    </div>
  );
};

export default SpaceLogo;
