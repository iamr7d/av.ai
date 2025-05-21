import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOpportunityById, saveOpportunity, unsaveOpportunity, isOpportunitySaved } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OpportunityDetail = ({ opportunityId, onClose }) => {
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState('idle'); // 'idle', 'saving', 'success', 'error'

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      try {
        setLoading(true);
        const data = await getOpportunityById(opportunityId);
        setOpportunity(data);
        setError(null);
        
        // Check if the opportunity is saved by the current user
        if (user) {
          const saved = await isOpportunitySaved(opportunityId);
          setIsSaved(saved);
        }
      } catch (error) {
        console.error('Error fetching opportunity details:', error);
        setError('Failed to load opportunity details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunityDetails();
    }
  }, [opportunityId, user]);
  
  const handleSaveToggle = async () => {
    if (!user) {
      // If user is not logged in, show a message or redirect to login
      alert('Please sign in to save opportunities');
      return;
    }
    
    try {
      setSavingState('saving');
      
      if (isSaved) {
        // Unsave the opportunity
        await unsaveOpportunity(opportunityId);
        setIsSaved(false);
        setSavingState('success');
        setTimeout(() => setSavingState('idle'), 2000);
      } else {
        // Save the opportunity
        await saveOpportunity(opportunityId, opportunity);
        setIsSaved(true);
        setSavingState('success');
        setTimeout(() => setSavingState('idle'), 2000);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      setSavingState('error');
      setTimeout(() => setSavingState('idle'), 3000);
    }
  };

  if (!opportunityId) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6"
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-6 md:p-8"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : opportunity ? (
          <>
            <div className="mb-6">
              <span className="text-sm text-primary-500 font-medium uppercase tracking-wide">PhD Opportunity</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-2">{opportunity.title}</h2>
              <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{opportunity.university}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Department</h3>
                <p className="text-gray-700 dark:text-gray-300">{opportunity.department}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{opportunity.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 dark:text-gray-300">{opportunity.requirements}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Funding</h3>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {opportunity.funding}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <a 
                  href={`mailto:${opportunity.contact}`} 
                  className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {opportunity.contact}
                </a>
              </div>
            </div>            <div className="mt-8 flex justify-between items-center">
              {/* Save button */}
              <button
                onClick={handleSaveToggle}
                disabled={savingState === 'saving'}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
                  isSaved 
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-transparent text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {savingState === 'saving' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {isSaved ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>Save</span>
                      </>
                    )}
                  </>
                )}
              </button>
              
              {/* Success/Error Messages */}
              {savingState === 'success' && (
                <span className="text-green-500 text-sm flex items-center ml-2 animation-fadeout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {isSaved ? 'Opportunity saved!' : 'Opportunity removed!'}
                </span>
              )}
              
              {savingState === 'error' && (
                <span className="text-red-500 text-sm flex items-center ml-2 animation-fadeout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Failed to update
                </span>
              )}
              
              <div className="flex">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-3"
                >
                  Close
                </button>
                <a 
                  href={`mailto:${opportunity.contact}?subject=Inquiry about PhD Opportunity: ${opportunity.title}`}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default OpportunityDetail;
