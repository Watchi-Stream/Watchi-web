'use client';

import { useState, useEffect } from 'react';
import { getWatchHistory, getAnimeById } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, Calendar, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/components/auth/AuthProvider';
import { WatchHistory, Anime, Episode } from '@/types';

interface WatchHistoryItem extends WatchHistory {
  episode: Episode & { anime?: Anime };
}

export default function WatchHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user's watch history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await getWatchHistory(user.id);
        
        // Enhance the history items with anime data
        const enhancedData = await Promise.all(
          data.map(async (item) => {
            if (item.episode) {
              const anime = await getAnimeById(item.episode.anime_id);
              return {
                ...item,
                episode: {
                  ...item.episode,
                  anime
                }
              };
            }
            return item;
          })
        );
        
        setHistory(enhancedData as WatchHistoryItem[]);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  // Handle removing from history (would need backend implementation)
  const handleRemove = (historyId: string) => {
    // In a real implementation, you would call an API to remove the history item
    // For now, we'll just filter it out of the local state
    setHistory(history.filter(item => item.id !== historyId));
  };
  
  // Group history by date (today, yesterday, earlier this week, etc.)
  const groupHistoryByDate = () => {
    const groups: Record<string, WatchHistoryItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    history.forEach(item => {
      const watchedDate = new Date(item.watched_at);
      watchedDate.setHours(0, 0, 0, 0);
      
      if (watchedDate.getTime() === today.getTime()) {
        groups.today.push(item);
      } else if (watchedDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(item);
      } else if (watchedDate > oneWeekAgo) {
        groups.thisWeek.push(item);
      } else {
        groups.earlier.push(item);
      }
    });
    
    return groups;
  };
  
  const historyGroups = groupHistoryByDate();
  
  // Helper to format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper to calculate progress percentage
  const getProgressPercentage = (progress: number) => {
    return Math.min(Math.round(progress * 100), 100);
  };
  
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black pt-20 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-6">Watch History</h1>
            <div className="bg-[#181818] rounded-lg p-8 max-w-md mx-auto">
              <p className="text-white/70 mb-4">Please sign in to view your watch history</p>
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
          <h1 className="text-3xl font-bold text-white mb-8">Watch History</h1>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-24 h-24">
                <div className="absolute border-4 border-white/10 rounded-full w-24 h-24"></div>
                <div className="absolute border-4 border-t-[#e50914] rounded-full w-24 h-24 animate-spin"></div>
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-[#181818] rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Your watch history is empty</h2>
              <p className="text-white/70 mb-6">
                Start watching anime to keep track of your viewing activity.
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-[#e50914] text-white rounded-md font-medium hover:bg-[#f40612] transition-colors"
              >
                Browse Anime
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Today */}
              {historyGroups.today.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">Today</h2>
                  <div className="space-y-4">
                    {historyGroups.today.map((item) => (
                      <HistoryCard 
                        key={item.id}
                        item={item}
                        formatTime={formatTime}
                        getProgressPercentage={getProgressPercentage}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {/* Yesterday */}
              {historyGroups.yesterday.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">Yesterday</h2>
                  <div className="space-y-4">
                    {historyGroups.yesterday.map((item) => (
                      <HistoryCard 
                        key={item.id}
                        item={item}
                        formatTime={formatTime}
                        getProgressPercentage={getProgressPercentage}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {/* This Week */}
              {historyGroups.thisWeek.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">Earlier This Week</h2>
                  <div className="space-y-4">
                    {historyGroups.thisWeek.map((item) => (
                      <HistoryCard 
                        key={item.id}
                        item={item}
                        formatTime={formatTime}
                        getProgressPercentage={getProgressPercentage}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {/* Earlier */}
              {historyGroups.earlier.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-6">Earlier</h2>
                  <div className="space-y-4">
                    {historyGroups.earlier.map((item) => (
                      <HistoryCard 
                        key={item.id}
                        item={item}
                        formatTime={formatTime}
                        getProgressPercentage={getProgressPercentage}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// History card component
function HistoryCard({ 
  item, 
  formatTime, 
  getProgressPercentage, 
  onRemove 
}: { 
  item: WatchHistoryItem; 
  formatTime: (date: string) => string;
  getProgressPercentage: (progress: number) => number;
  onRemove: (id: string) => void;
}) {
  const anime = item.episode.anime;
  if (!anime) return null;
  
  const formattedDate = new Date(item.watched_at).toLocaleDateString();
  const formattedTime = formatTime(item.watched_at);
  const progressPercentage = getProgressPercentage(item.progress);
  const isCompleted = item.completed;
  
  return (
    <div className="bg-[#181818] rounded-lg overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Image section */}
        <div className="relative w-full md:w-64 h-40 md:h-auto">
          <Image
            src={anime.cover_image}
            alt={anime.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent md:hidden"></div>
          
          {/* Mobile-only info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
            <h3 className="text-white font-semibold truncate">{anime.title}</h3>
            <p className="text-white/70 text-sm">
              EP {item.episode.episode_num}: {item.episode.title}
            </p>
          </div>
          
          {/* Play button overlay */}
          <Link 
            href={`/anime/${anime.id}`}
            className="absolute inset-0 md:opacity-0 md:hover:opacity-100 flex items-center justify-center bg-black/40 transition-opacity duration-300"
          >
            <button className="bg-white text-black p-3 rounded-full">
              <Play size={24} fill="black" />
            </button>
          </Link>
        </div>
        
        {/* Content section */}
        <div className="flex-grow p-4 md:p-5 flex flex-col">
          {/* Desktop-only title */}
          <div className="hidden md:block mb-2">
            <h3 className="text-white text-lg font-semibold">{anime.title}</h3>
            <p className="text-white/70">
              Episode {item.episode.episode_num}: {item.episode.title}
            </p>
          </div>
          
          {/* Meta info */}
          <div className="flex items-center gap-3 text-white/60 text-sm mt-2 md:mt-0">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 mb-2">
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#e50914]'}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50 mt-1">
              <span>{isCompleted ? 'Completed' : `${progressPercentage}% watched`}</span>
              {item.episode.duration && (
                <span>{Math.floor(item.episode.duration * item.progress / 60)}m / {Math.floor(item.episode.duration / 60)}m</span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-auto pt-3">
            <Link 
              href={`/anime/${anime.id}`}
              className="px-4 py-2 bg-[#e50914] text-white rounded-md hover:bg-[#f40612] transition-colors text-sm"
            >
              {isCompleted ? 'Watch Again' : 'Continue Watching'}
            </Link>
            
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-[#333] transition-colors"
              aria-label="Remove from history"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 