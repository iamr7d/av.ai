import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSavedOpportunities, unsaveOpportunity } from '../services/api';

const SavedOpportunities = () => {
  const { user } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await getSavedOpportunities();
        setSavedOpportunities(data);
      } catch (err) {
        console.error('Failed to fetch saved opportunities:', err);
        setError('Failed to fetch your saved opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, [user]);

  const handleUnsave = async (opportunityId) => {
    try {
      await unsaveOpportunity(opportunityId);
      // Update the UI by filtering out the removed opportunity
      setSavedOpportunities(savedOpportunities.filter(
        item => item.opportunity_id !== opportunityId
      ));
    } catch (err) {
      console.error('Failed to unsave opportunity:', err);
      setError('Failed to remove the saved opportunity. Please try again later.');
    }
  };

  if (!user) {
    return (
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Please sign in to view your saved opportunities</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="glass-morphism rounded-3xl p-8 shadow-xl border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold enhanced-gradient-text">Your Saved Opportunities</h2>
            <span className="text-white bg-white/10 px-4 py-1 rounded-full">
              {savedOpportunities.length} {savedOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 text-white rounded-lg p-4">
              {error}
            </div>
          ) : savedOpportunities.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-10 border border-white/10 text-center">
              <div className="text-6xl mb-4 opacity-30">📚</div>
              <h3 className="text-xl font-medium text-white mb-2">No Saved Opportunities Yet</h3>
              <p className="text-gray-400 mb-6">Start exploring PhD opportunities and save your favorites for later.</p>
              <a href="#search" className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white transition-colors rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Find Opportunities
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedOpportunities.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-black/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="max-w-[80%]">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {item.opportunity_data.title || "PhD Opportunity"}
                        </h3>
                        <p className="text-primary mb-1 flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          {item.opportunity_data.university || "University"}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {item.opportunity_data.location || "Location not specified"}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handleUnsave(item.opportunity_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Unsave opportunity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {item.opportunity_data.description || "No description provided."}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.opportunity_data.tags && item.opportunity_data.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 bg-primary/20 text-primary/90 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-white/5 flex justify-between items-center border-t border-white/10">
                    <span className="text-sm text-gray-400">
                      Saved on {new Date(item.saved_at).toLocaleDateString()}
                    </span>
                    <a 
                      href={`#opportunity/${item.opportunity_id}`} 
                      className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedOpportunities;
