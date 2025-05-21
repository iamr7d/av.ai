import React from 'react';
import Hero from './Hero';
import Features from './Features';

const MainContent = () => {
  // Only render Hero and Features
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
};

export default MainContent;
