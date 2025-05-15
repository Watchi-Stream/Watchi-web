'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAnimes } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Anime } from '@/types';

// Component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setNoResults(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // In a real app, you would have a dedicated search API
        // For now, we'll just filter all animes client-side
        const allAnimes = await getAnimes(24);
        const filtered = allAnimes.filter(anime => 
          anime.title.toLowerCase().includes(query.toLowerCase()) || 
          anime.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase())) ||
          anime.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(filtered);
        setNoResults(filtered.length === 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [query]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the URL with the search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchTerm);
    window.history.pushState({}, '', url.toString());
    
    // Force the useEffect to run
    window.dispatchEvent(new Event('popstate'));
  };
  
  return (
    <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for anime, genres, etc..."
              className="block w-full bg-[#333] border-none rounded-md pl-12 pr-12 py-4 text-white placeholder-white/60 focus:ring-2 focus:ring-[#e50914] focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-white/60 hover:text-white" />
              </button>
            )}
          </div>
        </form>
        
        {/* Search results */}
        <div className="mt-8">
          {query && (
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isLoading 
                ? 'Searching...' 
                : noResults 
                  ? `No results for "${query}"` 
                  : `Results for "${query}"`}
            </h2>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-[#e50914] animate-spin" />
            </div>
          ) : noResults ? (
            <div className="text-center py-12 bg-[#181818] rounded-lg">
              <p className="text-white/70 mb-2">We couldn&apos;t find what you&apos;re looking for</p>
              <p className="text-white/50 text-sm">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {results.map((anime) => (
                <Link 
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#181818] group-hover:ring-2 group-hover:ring-white/50 transition duration-300 shadow-lg">
                    <Image
                      src={anime.cover_image}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-medium text-sm md:text-base truncate">{anime.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {anime.rating && (
                          <span className="text-yellow-500 text-xs">{anime.rating.toFixed(1)}</span>
                        )}
                        {anime.release_year && (
                          <span className="text-white/70 text-xs">{anime.release_year}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!query && (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-3">Find your next favorite anime</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Search by title, genre, or description to discover new anime to watch
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Loading fallback for Suspense
function SearchLoading() {
  return (
    <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-[#e50914] animate-spin" />
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense
export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<SearchLoading />}>
        <SearchContent />
      </Suspense>
    </>
  );
} 