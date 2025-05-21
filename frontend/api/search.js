// API route for search functionality
import { supabaseClient } from '../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { query, filters } = req.body;
      
      // Build the search query
      let supabaseQuery = supabaseClient
        .from('opportunities')
        .select('*');
      
      // Apply filters
      if (query) {
        supabaseQuery = supabaseQuery.textSearch('title', query);
      }
      
      if (filters?.university) {
        supabaseQuery = supabaseQuery.eq('university', filters.university);
      }
      
      if (filters?.field) {
        supabaseQuery = supabaseQuery.eq('field', filters.field);
      }
      
      // Execute the query
      const { data, error } = await supabaseQuery;
      
      if (error) throw error;
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
