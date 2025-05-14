import { getAnimes } from '@/lib/api';
import { Suspense } from 'react';
import { Anime } from '@/types';
import Navbar from '@/components/layout/Navbar';
import AnimeCard from '@/components/anime/AnimeCard';
import HeroBanner from '@/components/anime/HeroBanner';
import { AnimeRowSkeleton } from '@/components/anime/AnimeCardSkeleton';
import HeroBannerSkeleton from '@/components/anime/HeroBannerSkeleton';

export const revalidate = 3600; // Revalidate every hour

// Horizontal row component with proper Netflix-like scrolling
function AnimeRow({ title, animes }: { title: string; animes: Anime[] }) {
  if (!animes || animes.length === 0) return null;
  
  return (
    <section className="netflix-row px-6 mb-6" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', marginBottom: '1.5rem', paddingTop: '1.5rem', paddingBottom: '1.5rem', position: 'relative' }}>
      <h2 className="text-xl font-semibold mb-4 text-white" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>{title}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-8" style={{ display: 'flex', columnGap: '1rem', overflowX: 'auto', paddingBottom: '2rem' }}>
        {animes.map((anime) => (
          <div key={anime.id} className="flex-shrink-0 w-[200px] md:w-[240px] netflix-card" style={{ flexShrink: 0, width: '200px', transition: 'all 0.3s ease-in-out' }}>
            <AnimeCard anime={anime} />
          </div>
        ))}
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
      <div className="mt-6 space-y-8" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', rowGap: '2rem' }}>
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
      <Navbar />
      <main className="bg-black min-h-screen" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}
