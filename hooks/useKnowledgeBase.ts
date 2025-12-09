import { useOptimistic, useEffect, useState, startTransition } from 'react';
import { KnowledgeEntry } from '../data/knowledgeBase';
import {
  fetchKnowledgeEntries,
  addKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  searchKnowledgeEntries,
} from '../lib/knowledgeEntries';

/**
 * Hook to manage knowledge entries with optimistic updates
 * Uses useOptimistic for instant UI updates while async operations complete
 */
export function useKnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Optimistic state management
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    entries,
    (currentEntries: KnowledgeEntry[], optimisticValue: { action: string; entry: KnowledgeEntry }) => {
      const { action, entry } = optimisticValue;

      switch (action) {
        case 'add':
          return [entry, ...currentEntries];
        case 'update':
          return currentEntries.map((e) => (e.id === entry.id ? entry : e));
        case 'delete':
          return currentEntries.filter((e) => e.id !== entry.id);
        default:
          return currentEntries;
      }
    }
  );

  // Fetch entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchKnowledgeEntries();
      setEntries(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load knowledge entries');
      setError(error);
      console.error('Error loading knowledge entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new knowledge entry with optimistic update
   */
  const addEntry = async (entry: Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>) => {
    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticEntry: KnowledgeEntry = {
      ...entry,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistically add to UI
    addOptimisticEntry({ action: 'add', entry: optimisticEntry });

    // Perform actual database operation
    startTransition(async () => {
      try {
        const newEntry = await addKnowledgeEntry(entry);
        // Replace optimistic entry with real one
        setEntries((prev) => {
          const filtered = prev.filter((e) => e.id !== tempId);
          return [newEntry, ...filtered];
        });
      } catch (err) {
        // Revert optimistic update on error
        setEntries((prev) => prev.filter((e) => e.id !== tempId));
        const error = err instanceof Error ? err : new Error('Failed to add entry');
        setError(error);
        throw error;
      }
    });
  };

  /**
   * Update an existing knowledge entry with optimistic update
   */
  const updateEntry = async (
    id: string,
    updates: Partial<Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    // Find current entry
    const currentEntry = entries.find((e) => e.id === id);
    if (!currentEntry) {
      throw new Error('Entry not found');
    }

    // Create optimistic entry
    const optimisticEntry: KnowledgeEntry = {
      ...currentEntry,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Optimistically update UI
    addOptimisticEntry({ action: 'update', entry: optimisticEntry });

    // Perform actual database operation
    startTransition(async () => {
      try {
        const updatedEntry = await updateKnowledgeEntry(id, updates);
        setEntries((prev) => prev.map((e) => (e.id === id ? updatedEntry : e)));
      } catch (err) {
        // Revert optimistic update on error
        setEntries((prev) => prev.map((e) => (e.id === id ? currentEntry : e)));
        const error = err instanceof Error ? err : new Error('Failed to update entry');
        setError(error);
        throw error;
      }
    });
  };

  /**
   * Delete a knowledge entry with optimistic update
   */
  const removeEntry = async (id: string) => {
    // Find current entry for potential revert
    const currentEntry = entries.find((e) => e.id === id);
    if (!currentEntry) {
      throw new Error('Entry not found');
    }

    // Optimistically remove from UI
    addOptimisticEntry({ action: 'delete', entry: currentEntry });

    // Perform actual database operation
    startTransition(async () => {
      try {
        await deleteKnowledgeEntry(id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        // Revert optimistic update on error
        setEntries((prev) => [...prev, currentEntry].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        const error = err instanceof Error ? err : new Error('Failed to delete entry');
        setError(error);
        throw error;
      }
    });
  };

  /**
   * Search knowledge entries (replaces getRelevantKnowledge)
   */
  const searchEntries = async (query: string, limit: number = 3): Promise<KnowledgeEntry[]> => {
    try {
      return await searchKnowledgeEntries(query, limit);
    } catch (err) {
      console.error('Error searching entries:', err);
      return [];
    }
  };

  return {
    entries: optimisticEntries, // Use optimistic entries for UI
    isLoading,
    error,
    addEntry,
    updateEntry,
    removeEntry,
    searchEntries,
    refresh: loadEntries,
  };
}

