'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchResult } from '@/lib/supabase';

export function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setResults(data.results || []);
        } catch (err) {
            setError(err as Error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                search(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, search]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
    }, []);

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        clearSearch,
    };
}

// Format match type for display
export function formatMatchType(type: string): string {
    switch (type) {
        case 'wallet':
            return 'Wallet';
        case 'basename':
            return 'Basename';
        case 'farcaster':
            return 'Farcaster';
        default:
            return type;
    }
}
