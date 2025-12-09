// Knowledge Base Types and Utilities for Saba AI
// 
// NOTE: Knowledge entries are now stored in Supabase.
// Use the useKnowledgeBase hook to interact with the database.
// See hooks/useKnowledgeBase.ts for details.

export interface KnowledgeEntry {
  id: string;
  location?: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// Function to create context string from knowledge entries
export function createContextString(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return '';
  
  return entries
    .map((entry) => {
      let context = entry.content;
      if (entry.location) {
        context = `[Location: ${entry.location}] ${context}`;
      }
      return context;
    })
    .join('\n\n');
}

