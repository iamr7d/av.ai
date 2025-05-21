// API route for opportunities
import { supabaseClient } from '../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseClient
        .from('opportunities')
        .select('*');
      
      if (error) throw error;
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
