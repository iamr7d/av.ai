import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOpportunities } from '../services/api';
import OpportunityDetail from './OpportunityDetail';

// Default images for opportunities without images
const defaultImages = [
  "https://images.unsplash.com/photo-1569396116180-210c182bedb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1581093199642-4042a2483454?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const FeaturedOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
    // Fetch opportunities from the backend API
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const data = await getOpportunities();
        // Add images to opportunities that don't have one
        const dataWithImages = data.map((opp, index) => ({
          ...opp,
          image: opp.image || defaultImages[index % defaultImages.length]
        }));
        setOpportunities(dataWithImages);
        setError(null);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpportunities();
    
    // Listen for search results updates from Hero component
    const handleSearchResults = (event) => {
      const results = event.detail;
      // Add images to search results
      const resultsWithImages = results.map((opp, index) => ({
        ...opp,
        image: opp.image || defaultImages[index % defaultImages.length]
      }));
      setOpportunities(resultsWithImages);
      setIsLoading(false);
      setError(null);
    };
    
    window.addEventListener('searchResultsUpdated', handleSearchResults);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('searchResultsUpdated', handleSearchResults);
    };
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <section id="opportunities" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-indigo-200 dark:text-indigo-300 drop-shadow-md">
            Featured Opportunities
          </h2>
          <p className="text-lg text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
            Discover top PhD programs from leading universities worldwide. These featured opportunities represent cutting-edge research across various disciplines.
          </p>
        </div>
        
        {/* Opportunities grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {opportunities.map((opportunity) => (              <motion.div 
                key={opportunity.id}
                variants={itemVariants}
                className="glass-card overflow-hidden rounded-xl hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => setSelectedOpportunityId(opportunity.id)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={opportunity.image} 
                    alt={opportunity.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-white text-sm font-medium">
                      {opportunity.funding}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{opportunity.university}</span>
                    <h3 className="text-lg font-bold line-clamp-2 hover:text-primary dark:hover:text-primary-light transition-colors">
                      {opportunity.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{opportunity.department}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Deadline: {formatDate(opportunity.deadline)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOpportunityId(opportunity.id);
                    }}
                    className="w-full text-center py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-light font-medium rounded-md transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
          {/* View more button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-primary hover:bg-primary-dark transition-colors text-white font-medium rounded-md">
            Explore All Opportunities
          </button>
        </div>
      </div>
      
      {/* Opportunity detail modal */}
      {selectedOpportunityId && (
        <OpportunityDetail 
          opportunityId={selectedOpportunityId} 
          onClose={() => setSelectedOpportunityId(null)} 
        />
      )}
    </section>
  );
};

export default FeaturedOpportunities;
