'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Episode } from '@/types';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { Play, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface EpisodeListProps {
  animeId: string;
  episodes: Episode[];
}

export default function EpisodeList({ animeId, episodes }: EpisodeListProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(
    episodes.length > 0 ? episodes[0] : null
  );
  
  // For improved episode navigation
  const currentIndex = selectedEpisode 
    ? episodes.findIndex(ep => ep.id === selectedEpisode.id) 
    : 0;
    
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;
  
  const goToNextEpisode = () => {
    if (hasNext) {
      setSelectedEpisode(episodes[currentIndex + 1]);
    }
  };
  
  const goToPreviousEpisode = () => {
    if (hasPrevious) {
      setSelectedEpisode(episodes[currentIndex - 1]);
    }
  };

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 bg-[#181818] rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-white">No Episodes Available</h2>
        <p className="text-gray-400">This anime doesn't have any episodes yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left side - Video player and controls */}
      <div className="w-full lg:w-8/12">
        {selectedEpisode && (
          <div className="mb-6 bg-[#181818] rounded-lg overflow-hidden shadow-lg">
            {/* Video player */}
            <div className="w-full">
              <VideoPlayer 
                videoUrl={selectedEpisode.video_url} 
                episodeId={selectedEpisode.id} 
              />
            </div>
            
            {/* Episode info and controls */}
            <div className="p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-white flex-grow">
                  Episode {selectedEpisode.episode_num}: {selectedEpisode.title}
                </h2>
                
                {/* Quick episode navigation */}
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={goToPreviousEpisode}
                    disabled={!hasPrevious}
                    className={`p-2 rounded-full ${hasPrevious ? 'bg-[#333] hover:bg-[#444]' : 'bg-[#222] cursor-not-allowed opacity-50'}`}
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <span className="text-white/70 text-sm px-2">
                    {currentIndex + 1} / {episodes.length}
                  </span>
                  <button 
                    onClick={goToNextEpisode}
                    disabled={!hasNext}
                    className={`p-2 rounded-full ${hasNext ? 'bg-[#333] hover:bg-[#444]' : 'bg-[#222] cursor-not-allowed opacity-50'}`}
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Episode duration */}
              {selectedEpisode.duration && (
                <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                  <Clock size={16} />
                  <span>{Math.floor(selectedEpisode.duration / 60)}m {selectedEpisode.duration % 60}s</span>
                </div>
              )}
              
              {/* Episode description */}
              {selectedEpisode.description && (
                <p className="text-white/80 text-base leading-relaxed">
                  {selectedEpisode.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Right side - Episodes list */}
      <div className="w-full lg:w-4/12">
        <div className="bg-[#181818] rounded-xl shadow-md overflow-hidden sticky top-6">
          <div className="p-4 border-b border-[#333]">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span>Episodes</span>
              <span className="text-sm font-normal text-white/60">{episodes.length} Episodes</span>
            </h3>
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
            {episodes.map((episode) => (
              <button
                key={episode.id}
                onClick={() => setSelectedEpisode(episode)}
                className={`w-full text-left p-4 transition duration-200 border-b border-[#333] last:border-0 hover:bg-[#232323] ${
                  selectedEpisode?.id === episode.id
                    ? 'bg-[#232323]'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-12 bg-[#333] rounded overflow-hidden shrink-0">
                    {/* Episode thumbnail */}
                    {episode.thumbnail ? (
                      <Image
                        src={episode.thumbnail}
                        alt={`Thumbnail for ${episode.title}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm text-white/60">{episode.episode_num}</span>
                      </div>
                    )}
                    
                    {/* Play icon overlay for selected episode */}
                    {selectedEpisode?.id === episode.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play size={18} className="text-white" fill="white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow overflow-hidden">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white/60 mr-2">
                        {episode.episode_num}.
                      </span>
                      <span className={`font-medium truncate ${
                        selectedEpisode?.id === episode.id
                          ? 'text-[#e50914]'
                          : 'text-white'
                      }`}>
                        {episode.title}
                      </span>
                    </div>
                    
                    {episode.duration && (
                      <div className="text-xs text-white/50 mt-1">
                        {Math.floor(episode.duration / 60)}m {episode.duration % 60}s
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 