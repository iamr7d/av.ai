import React from 'react';
import { motion } from 'framer-motion';
import SearchInput from './SearchInput';

// 3D elements for the hero section - animations removed
const FloatingElement = ({ className, children }) => {
  return (
    <div className={`absolute z-10 ${className}`}>
      {children}
    </div>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen pt-28 overflow-hidden">
      {/* Floating 3D elements */}
      <FloatingElement className="top-1/4 left-20 animate-float-slow hidden lg:block">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 blur-sm opacity-70"></div>
      </FloatingElement>
      
      <FloatingElement className="bottom-1/3 right-20 animate-float hidden lg:block">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 blur-sm opacity-70"></div>
      </FloatingElement>
      
      <FloatingElement className="top-1/3 right-1/4 animate-float-slower hidden lg:block">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 blur-sm opacity-70"></div>
      </FloatingElement>
      
      {/* Graduation cap icon - represents PhD */}
      <FloatingElement className="top-1/5 right-1/3 animate-float">
        <img 
          src="/graduation-cap.png" 
          alt="PhD" 
          className="w-16 h-16 opacity-80"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      </FloatingElement>      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="flex flex-col max-w-5xl mx-auto p-8 md:p-12">          {/* Main Headline - animations removed */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-center text-white text-with-border">
            Unlock the <span className="enhanced-gradient-text">future</span><br />
            of <span className="enhanced-gradient-text">academia</span>
          </h1>          {/* Subtitle - animations removed */}
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto text-center text-with-thin-border">
            Find your perfect PhD opportunity with our AI-driven search platform. Discover programs tailored to your research interests and academic goals.
          </p>{/* Search Input */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="rounded-full overflow-hidden">
              <SearchInput onSearchResults={(results) => {
                // Scroll to opportunities section
                const opportunitiesSection = document.getElementById('opportunities');
                if (opportunitiesSection) {
                  opportunitiesSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Pass results to the FeaturedOpportunities component
                window.searchResults = results;
                
                // Dispatch a custom event that FeaturedOpportunities can listen for
                const searchResultsEvent = new CustomEvent('searchResultsUpdated', { detail: results });
                window.dispatchEvent(searchResultsEvent);
              }} />
            </div>
          </div>          {/* Stats - animations removed and borders removed */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-md">10,000+</p>
              <p className="text-white/80">PhD Opportunities</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-md">500+</p>
              <p className="text-white/80">Universities</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-md">95%</p>
              <p className="text-white/80">Success Rate</p>
            </div>
          </div>
        </div>
      </div>      {/* Scroll indicator removed as requested */}
    </section>
  );
};

export default Hero;
