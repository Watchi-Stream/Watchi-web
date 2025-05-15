import { getAnimes } from '@/lib/api';
import { Suspense } from 'react';
import { Anime } from '@/types';
import Navbar from '@/components/layout/Navbar';
import AnimeCard from '@/components/anime/AnimeCard';
import HeroBanner from '@/components/anime/HeroBanner';
import { AnimeRowSkeleton } from '@/components/anime/AnimeCardSkeleton';
import HeroBannerSkeleton from '@/components/anime/HeroBannerSkeleton';
import Head from 'next/head';

export const revalidate = 3600; // Revalidate every hour

// Horizontal row component with proper Netflix-like scrolling
function AnimeRow({ title, animes }: { title: string; animes: Anime[] }) {
  if (!animes || animes.length === 0) return null;
  
  return (
    <section className="netflix-row relative mb-8 px-4 md:px-8" style={{ position: 'relative' }}>
      <h2 className="text-xl font-semibold mb-4 text-white" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>{title}</h2>
      
      <div className="relative">
        {/* Scrollable container with inline style for hiding scrollbar */}
        <div className="flex space-x-4 overflow-x-auto pb-8" style={{ 
          display: 'flex', 
          columnGap: '1rem', 
          overflowX: 'auto', 
          paddingBottom: '2rem',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {animes.map((anime) => (
            <div key={anime.id} className="flex-shrink-0 w-[200px] md:w-[240px]" style={{ 
              flexShrink: 0, 
              width: '200px', 
              transition: 'transform 0.2s ease-in-out'
            }}>
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading component with skeleton loaders
function HomeLoading() {
  return (
    <div className="bg-black min-h-screen" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <HeroBannerSkeleton />
      <div className="mt-6 space-y-8" style={{ marginTop: '1.5rem', rowGap: '2rem' }}>
        <AnimeRowSkeleton />
        <AnimeRowSkeleton />
        <AnimeRowSkeleton />
      </div>
    </div>
  );
}

// Main content with actual data
async function HomeContent() {
  const allAnimes = await getAnimes(24);
  
  // Split animes into different categories
  const trendingAnime = allAnimes.slice(0, 8);
  const actionAnime = allAnimes.slice(8, 16);
  const newReleases = allAnimes.slice(16, 24);
  
  // Pick featured anime for hero banner
  const featuredAnime = allAnimes[0];

  return (
    <div className="bg-black min-h-screen pb-20" style={{ backgroundColor: '#000000', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Banner */}
      {featuredAnime && <HeroBanner anime={featuredAnime} />}
      
      {/* Anime Rows */}
      <div className="mt-6 space-y-4" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <AnimeRow title="Trending Now" animes={trendingAnime} />
        <AnimeRow title="Action & Adventure" animes={actionAnime} />
        <AnimeRow title="New Releases" animes={newReleases} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <style>{`
          .shimmer-effect {
            background: linear-gradient(
              to right,
              #333 0%,
              #444 20%,
              #333 40%,
              #333 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </Head>
      <Navbar />
      <main className="bg-black min-h-screen" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}
