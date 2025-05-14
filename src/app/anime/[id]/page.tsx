import { Suspense } from 'react';
import { getAnimeById, getEpisodesByAnimeId } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Calendar, Star, Info, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import EpisodeList from '@/components/anime/EpisodeList';
import VideoModalButton from './VideoModalButton';

export const revalidate = 3600; // Revalidate every hour

interface AnimePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  const id = await params.id;
  const anime = await getAnimeById(id);
  
  return {
    title: anime?.title || 'Anime Details',
    description: anime?.description || 'Watch anime on Watchi',
  };
}

// Loading component for the anime detail page
function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section skeleton */}
      <div className="relative h-[70vh] w-full bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent shimmer-effect" />
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="relative z-10 -mt-60 px-4 md:px-8 lg:px-12 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-1/3 bg-gray-800 rounded shimmer-effect mb-4" />
          <div className="h-4 w-1/4 bg-gray-800 rounded shimmer-effect mb-6" />
          <div className="h-20 w-2/3 bg-gray-800 rounded shimmer-effect mb-6" />
          
          <div className="flex gap-4 mb-12">
            <div className="h-12 w-32 bg-gray-800 rounded shimmer-effect" />
            <div className="h-12 w-32 bg-gray-800 rounded shimmer-effect" />
          </div>
        </div>
      </div>
      
      {/* Episodes skeleton */}
      <div className="px-4 md:px-8 lg:px-12 py-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-800 rounded shimmer-effect mb-8" />
          <div className="grid grid-cols-1 bg-gray-900 rounded-lg h-96 shimmer-effect"></div>
        </div>
      </div>
    </div>
  );
}

// Main content component with actual data
async function AnimeContent({ id }: { id: string }) {
  const anime = await getAnimeById(id);
  const episodes = await getEpisodesByAnimeId(id);
  
  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-[#181818] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Anime Not Found</h2>
          <p className="text-white/70 mb-6">The anime you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#e50914] text-white">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with backdrop - full height on mobile, 70vh on desktop */}
      <div className="relative h-screen md:h-[70vh] w-full">
        <Image
          src={anime.cover_image}
          alt={anime.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-black to-transparent" />
        
        {/* Hero content - positioned over the backdrop */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-md">
              {anime.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90 mb-6">
              {anime.release_year && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{anime.release_year}</span>
                </div>
              )}
              {anime.rating && (
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>{anime.rating.toFixed(1)}</span>
                </div>
              )}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span 
                      key={genre} 
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-white/80 mb-8 max-w-3xl text-base md:text-lg">
              {anime.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {episodes && episodes.length > 0 && (
                <VideoModalButton episode={episodes[0]} />
              )}
              
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors"
              >
                <Plus size={20} />
                <span>My List</span>
              </button>
              
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-transparent border border-white/30 hover:border-white/60 text-white transition-colors"
              >
                <Info size={20} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Episodes section */}
      {episodes && episodes.length > 0 && (
        <div className="py-12 px-4 md:px-8 lg:px-12 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-white">Episodes</h2>
            <EpisodeList episodes={episodes} animeId={id} />
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AnimePage({ params }: AnimePageProps) {
  const id = await params.id;
  
  return (
    <>
      <Navbar />
      <Suspense fallback={<AnimeDetailSkeleton />}>
        <AnimeContent id={id} />
      </Suspense>
    </>
  );
} 