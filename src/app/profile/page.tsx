'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getFavoriteAnimes, getWatchHistory } from '@/lib/api';
import { Anime, WatchHistory } from '@/types';
import AnimeGrid from '@/components/anime/AnimeGrid';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // Fetch data if logged in
    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetch favorites
          const favoritesData = await getFavoriteAnimes(user.id);
          setFavorites(favoritesData);
          
          // Fetch watch history
          const watchHistoryData = await getWatchHistory(user.id);
          setWatchHistory(watchHistoryData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsPageLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || isPageLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading your profile...</h2>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // If we reach here, user should be logged in
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Email:</span> {user?.email}
        </div>
        <div className="mb-4">
          <span className="font-medium text-gray-700">Account created:</span>{' '}
          {new Date(user?.created_at || '').toLocaleDateString()}
        </div>
      </div>

      <div className="mb-8">
        <AnimeGrid animes={favorites} title="Your Favorites" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Watch History</h2>
        
        {watchHistory.length === 0 ? (
          <p className="text-gray-600 text-center py-4">You haven't watched any episodes yet.</p>
        ) : (
          <div className="space-y-4">
            {watchHistory.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {item.episodes?.title || 'Episode'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Watched on {new Date(item.watched_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {Math.round(item.progress * 100)}% completed
                    </div>
                    <div className="mt-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: `${item.progress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 