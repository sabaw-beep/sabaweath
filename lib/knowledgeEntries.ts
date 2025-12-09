import { supabase } from './supabase';
import { KnowledgeEntry } from '../data/knowledgeBase';
import { Platform } from 'react-native';

// Database table name
const TABLE_NAME = 'knowledge_entries';

// Lazy load Supabase on web to avoid import.meta issues
async function getSupabaseClient() {
  if (Platform.OS === 'web' && !supabase) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const Constants = await import('expo-constants');
      
      const supabaseUrl =
        Constants.default?.expoConfig?.extra?.supabaseUrl ||
        process.env.EXPO_PUBLIC_SUPABASE_URL ||
        '';

      const supabaseAnonKey =
        Constants.default?.expoConfig?.extra?.supabaseAnonKey ||
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
        '';

      if (supabaseUrl && supabaseAnonKey) {
        return createClient(supabaseUrl, supabaseAnonKey);
      }
    } catch (error) {
      console.warn('Failed to load Supabase on web:', error);
    }
    return null;
  }
  return supabase;
}

/**
 * Fetch all knowledge entries from Supabase
 */
export async function fetchKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  try {
    const client = await getSupabaseClient();
    if (!client) {
      console.warn('Supabase client not available, returning empty array');
      return [];
    }

    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching knowledge entries:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch knowledge entries:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

/**
 * Search knowledge entries by query (simple keyword matching)
 * This replaces the getRelevantKnowledge function
 */
export async function searchKnowledgeEntries(
  query: string,
  limit: number = 3
): Promise<KnowledgeEntry[]> {
  try {
    const client = await getSupabaseClient();
    if (!client) {
      console.warn('Supabase client not available, returning empty array');
      return [];
    }

    const lowerQuery = query.toLowerCase();

    // Fetch all entries (for now - can be optimized with full-text search later)
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching knowledge entries:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Simple keyword matching (same logic as before)
    const scored = data.map((entry) => {
      let score = 0;
      const entryText = `${entry.content} ${entry.location || ''}`.toLowerCase();

      // Score based on keyword matches
      const queryWords = lowerQuery.split(/\s+/);
      queryWords.forEach((word) => {
        if (entryText.includes(word)) {
          score += 1;
        }
      });

      // Boost score if location matches
      if (entry.location && lowerQuery.includes(entry.location.toLowerCase())) {
        score += 5;
      }

      return { entry, score };
    });

    // Sort by score and return top results
    return scored
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, limit)
      .map((item) => item.entry);
  } catch (error) {
    console.error('Failed to search knowledge entries:', error);
    return [];
  }
}

/**
 * Add a new knowledge entry
 */
export async function addKnowledgeEntry(
  entry: Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<KnowledgeEntry> {
  try {
    const client = await getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await client
      .from(TABLE_NAME)
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error adding knowledge entry:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add knowledge entry:', error);
    throw error;
  }
}

/**
 * Update an existing knowledge entry
 */
export async function updateKnowledgeEntry(
  id: string,
  updates: Partial<Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>>
): Promise<KnowledgeEntry> {
  try {
    const client = await getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await client
      .from(TABLE_NAME)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating knowledge entry:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update knowledge entry:', error);
    throw error;
  }
}

/**
 * Delete a knowledge entry
 */
export async function deleteKnowledgeEntry(id: string): Promise<void> {
  try {
    const client = await getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not available');
    }

    const { error } = await client.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
      console.error('Error deleting knowledge entry:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete knowledge entry:', error);
    throw error;
  }
}

