// API service for handling backend requests
import { supabase } from '../utils/supabaseClient';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Get all opportunities or filtered by simple query
export const getOpportunities = async (query = '') => {
  try {
    const url = query 
      ? `${API_URL}/opportunities?query=${encodeURIComponent(query)}` 
      : `${API_URL}/opportunities`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    throw error;
  }
};

// Get a specific opportunity by ID
export const getOpportunityById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/opportunity/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch opportunity with ID ${id}:`, error);
    throw error;
  }
};

// Advanced search with multiple criteria
export const advancedSearch = async (searchParams) => {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to perform advanced search:", error);
    throw error;
  }
};

// Save an opportunity for the current user
export const saveOpportunity = async (opportunityId, opportunityData) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .insert([
        { 
          user_id: user.id,
          opportunity_id: opportunityId,
          opportunity_data: opportunityData,
          saved_at: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving opportunity:', error);
    throw error;
  }
};

// Remove a saved opportunity
export const unsaveOpportunity = async (opportunityId) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error removing saved opportunity:', error);
    throw error;
  }
};

// Get all saved opportunities for the current user
export const getSavedOpportunities = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching saved opportunities:', error);
    throw error;
  }
};

// Check if an opportunity is saved by the current user
export const isOpportunitySaved = async (opportunityId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false; // Not logged in, so not saved
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('id')
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return false; // No match found
      }
      throw error;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Error checking if opportunity is saved:', error);
    return false;
  }
};

export default {
  getOpportunities,
  getOpportunityById,
  advancedSearch,
  saveOpportunity,
  unsaveOpportunity,
  getSavedOpportunities,
  isOpportunitySaved
};
