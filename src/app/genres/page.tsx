'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAnimes } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Anime } from '@/types';

// Define common anime genres
const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 
  'Supernatural', 'Thriller'
];

export default function GenresPage() {
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('genre') || '';
  
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  
  // Fetch all animes
  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true);
      try {
        const data = await getAnimes(50); // Get more animes for filtering
        setAnimes(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching animes:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnimes();
  }, []);
  
  // Filter by selected genre
  useEffect(() => {
    if (selectedGenre) {
      const filtered = animes.filter(anime => 
        anime.genres.some(genre => 
          genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
      setFilteredAnimes(filtered);
    } else {
      setFilteredAnimes(animes);
    }
  }, [selectedGenre, animes]);
  
  // Navigate to a genre
  const selectGenre = (genre: string) => {
    const url = new URL(window.location.href);
    if (genre) {
      url.searchParams.set('genre', genre);
    } else {
      url.searchParams.delete('genre');
    }
    window.history.pushState({}, '', url.toString());
    setShowGenreDropdown(false);
    
    // Force re-render to update the filtered list
    window.dispatchEvent(new Event('popstate'));
  };
  
  // Group animes by genre if no genre is selected
  const getAnimesByGenre = () => {
    const genreMap: Record<string, Anime[]> = {};
    
    // Identify unique genres from our anime collection
    const uniqueGenres = Array.from(
      new Set(animes.flatMap(anime => anime.genres))
    ).filter(genre => GENRES.includes(genre)); // Only include common genres
    
    // Populate genre map
    uniqueGenres.forEach(genre => {
      genreMap[genre] = animes.filter(anime => 
        anime.genres.includes(genre)
      );
    });
    
    return genreMap;
  };
  
  const animesByGenre = getAnimesByGenre();
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Genre selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h1 className="text-3xl font-bold text-white">
              {selectedGenre ? `${selectedGenre} Anime` : 'Browse by Genre'}
            </h1>
            
            <div className="relative">
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[#333] rounded-md text-white hover:bg-[#444] transition-colors"
              >
                <span>{selectedGenre || 'All Genres'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showGenreDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#222] z-50 py-1 max-h-[80vh] overflow-y-auto">
                  <button
                    onClick={() => selectGenre('')}
                    className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333] ${!selectedGenre ? 'bg-[#e50914] text-white' : ''}`}
                  >
                    All Genres
                  </button>
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => selectGenre(genre)}
                      className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333] ${selectedGenre === genre ? 'bg-[#e50914] text-white' : ''}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-24 h-24">
                <div className="absolute border-4 border-white/10 rounded-full w-24 h-24"></div>
                <div className="absolute border-4 border-t-[#e50914] rounded-full w-24 h-24 animate-spin"></div>
              </div>
            </div>
          )}
          
          {/* Selected genre view */}
          {!isLoading && selectedGenre && (
            <>
              {filteredAnimes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredAnimes.map((anime) => (
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
              ) : (
                <div className="text-center py-20 bg-[#181818] rounded-lg">
                  <p className="text-white/70 text-lg mb-2">No anime found in this genre</p>
                  <p className="text-white/50 text-sm">Try selecting a different genre</p>
                </div>
              )}
            </>
          )}
          
          {/* Browse all genres view */}
          {!isLoading && !selectedGenre && (
            <div className="space-y-12">
              {Object.entries(animesByGenre).map(([genre, animeList]) => (
                <section key={genre} className="genre-row">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">{genre}</h2>
                    <Link 
                      href={`/genres?genre=${encodeURIComponent(genre)}`}
                      className="text-sm text-white/70 hover:text-white"
                    >
                      View All
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                    {animeList.slice(0, 6).map((anime) => (
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
                          
                          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white font-medium text-sm truncate">{anime.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 