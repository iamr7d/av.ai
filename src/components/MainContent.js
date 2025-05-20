import React from 'react';
import { useAuth } from '../context/AuthContext';
import Hero from './Hero';
import Features from './Features';
import FeaturedOpportunities from './FeaturedOpportunities';
import Profile from './Profile.js';
import SavedOpportunities from './SavedOpportunities';

const MainContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('home');

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(hash);
    };

    // Set initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile />;
      case 'saved':
        return <SavedOpportunities />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <Features />
            <FeaturedOpportunities />
          </>
        );
    }
  };

  return (
    <main>
      {renderContent()}
    </main>
  );
};

export default MainContent;
