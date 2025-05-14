'use client';

import { useState, useEffect } from 'react';
import { getFavoriteAnimes } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Trash2, Info } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/components/auth/AuthProvider';
import { Anime } from '@/types';

export default function MyListPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  
  // Fetch user's favorite animes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await getFavoriteAnimes(user.id);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchFavorites();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  // Handle removing item from list (would need backend implementation)
  const handleRemove = (animeId: string) => {
    // In a real implementation, you would call an API to remove from favorites
    // For now, we'll just filter it out of the local state
    setFavorites(favorites.filter(anime => anime.id !== animeId));
  };
  
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-6">My List</h1>
            <div className="bg-[#181818] rounded-lg p-8 max-w-md mx-auto">
              <p className="text-white/70 mb-4">Please sign in to view your list</p>
              <Link 
                href="/auth/login"
                className="inline-block px-6 py-3 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f40612] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with title and toggle edit mode */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My List</h1>
            
            {favorites.length > 0 && (
              <button
                onClick={() => setDeleteMode(!deleteMode)}
                className="px-4 py-2 text-white bg-transparent border border-white/30 rounded-md flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Trash2 size={18} />
                <span>{deleteMode ? 'Done' : 'Edit'}</span>
              </button>
            )}
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-24 h-24">
                <div className="absolute border-4 border-white/10 rounded-full w-24 h-24"></div>
                <div className="absolute border-4 border-t-[#e50914] rounded-full w-24 h-24 animate-spin"></div>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20 bg-[#181818] rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Your list is empty</h2>
              <p className="text-white/70 mb-6">
                Add anime to your list to keep track of what you want to watch.
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f40612] transition-colors"
              >
                Browse Anime
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {favorites.map((anime) => (
                <div 
                  key={anime.id}
                  className={`group relative ${deleteMode ? 'cursor-default' : ''}`}
                >
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#181818] transition duration-300 shadow-lg">
                    <Image
                      src={anime.cover_image}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Overlay content */}
                    {!deleteMode ? (
                      <Link href={`/anime/${anime.id}`} className="contents">
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
                          
                          <div className="mt-3 flex gap-2">
                            <Link 
                              href={`/anime/${anime.id}`}
                              className="p-2 bg-white rounded-full hover:bg-white/90 transition-colors"
                            >
                              <Play size={16} className="text-black" />
                            </Link>
                            <Link 
                              href={`/anime/${anime.id}`}
                              className="p-2 bg-[#333] rounded-full hover:bg-[#444] transition-colors"
                            >
                              <Info size={16} className="text-white" />
                            </Link>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleRemove(anime.id)}
                          className="p-3 bg-[#e50914] rounded-full hover:bg-[#f40612] transition-colors"
                        >
                          <Trash2 size={24} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Title below image (always visible) */}
                  <h3 className="text-white font-medium mt-2 truncate">{anime.title}</h3>
                  
                  {/* Delete mode indicator */}
                  {deleteMode && (
                    <button
                      onClick={() => handleRemove(anime.id)}
                      className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-[#e50914] transition-colors z-10"
                      aria-label="Remove from my list"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 