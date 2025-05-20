import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getOpportunities, advancedSearch } from '../services/api';

const SearchInput = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [funding, setFunding] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      // Use simple search if only query is provided
      if (!isAdvancedOpen) {
        const results = await getOpportunities(query);
        if (onSearchResults) {
          onSearchResults(results);
        } else {
          console.log('Search results:', results);
        }
      } else {
        // Use advanced search
        const searchParams = {
          keywords: query,
          university,
          department,
          funding
        };
        
        const results = await advancedSearch(searchParams);
        if (onSearchResults) {
          onSearchResults(results);
        } else {
          console.log('Advanced search results:', results);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      // You could add error handling UI here
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="w-full">
      {/* Main search form */}      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card flex items-center p-2 w-full shadow-lg hover:shadow-xl transition-shadow border-2 border-indigo-400 dark:border-indigo-300 rounded-full">
          <div className="flex-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for PhD opportunities, universities, or research areas..."
              className="w-full py-3 px-2 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full"
            />
          </div><button
            type="submit"
            className="bg-primary hover:bg-primary-dark transition-colors text-white px-8 py-3 rounded-full font-medium ml-2 flex items-center shadow-lg"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
