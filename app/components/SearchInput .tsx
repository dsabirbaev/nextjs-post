'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce'; // ← импортируй
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Post } from '@/lib/definitions';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300); // ← используй библиотеку
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    searchPosts(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPosts = async (q: string) => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('posts')
        .select('*,users(id, name, avatar_url), comments(count), likes(count)')
        .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(8);

      setResults(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-sm">
      <Field orientation="horizontal" className="w-full">
        <Input
          type="search"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="flex-1"
        />
        {query && (
          <button
            onClick={handleClear}
            className="px-2 hover:text-gray-600"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </Field>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner className="size-4" />
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500">
              No posts found
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.slice(0, 8).map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setIsOpen(false);
                  }}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex gap-3">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt=""
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {post.users?.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {results.length > 8 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="block px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-center font-medium"
                >
                  View all {results.length} results
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
