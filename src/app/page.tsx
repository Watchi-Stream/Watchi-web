import { getAnimes } from '@/lib/api';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import { AnimeRowSkeleton } from '@/components/anime/AnimeCardSkeleton';
import HeroBannerSkeleton from '@/components/anime/HeroBannerSkeleton';
import AnimeRow from '@/components/anime/AnimeRow';
import HeroBanner from '@/components/anime/HeroBanner';

// Enable revalidation every hour
export const revalidate = 3600;

// Loading component with skeleton loaders
function HomeLoading() {
  return (
    <div className="bg-black min-h-screen">
      <HeroBannerSkeleton />
      <div className="mt-6 space-y-8">
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
    <div className="bg-black min-h-screen pb-20">
      {/* Hero Banner */}
      {featuredAnime && <HeroBanner anime={featuredAnime} />}
      
      {/* Anime Rows */}
      <div className="mt-6 space-y-4 flex flex-col gap-4">
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
      <main className="bg-black min-h-screen">
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}
