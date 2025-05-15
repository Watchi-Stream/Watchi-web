'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, ArrowLeft } from 'lucide-react';
import { Episode } from '@/types';

interface VideoPlayerModalProps {
  episode: Episode | null;
  onClose: () => void;
  onNextEpisode?: () => void;
}

export default function VideoPlayerModal({ 
  episode, 
  onClose,
  onNextEpisode
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      if (controlsTimeout) clearTimeout(controlsTimeout);
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    }
    
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [showControls, controlsTimeout]);

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (!episode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
        onMouseMove={handleMouseMove}
      >
        {/* Video player */}
        <div className="relative flex-grow flex items-center justify-center bg-black">
          <ReactPlayer
            url={episode.video_url}
            width="100%"
            height="100%"
            playing={isPlaying}
            muted={isMuted}
            onProgress={(state) => setProgress(state.played)}
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  style: { width: '100%', height: '100%', objectFit: 'contain' }
                }
              }
            }}
          />
          
          {/* Click to play/pause */}
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={() => setIsPlaying(!isPlaying)}
          />
          
          {/* Overlay controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-between z-20 bg-gradient-to-b from-black/60 via-transparent to-black/60"
              >
                {/* Top bar */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="bg-black/30 p-2 rounded-full text-white/90 hover:text-white backdrop-blur-sm"
                    >
                      <ArrowLeft size={20} />
                    </motion.button>
                    <div className="ml-2">
                      <h3 className="text-white font-semibold">{episode.title}</h3>
                      <p className="text-white/70 text-sm">
                        Season {episode.season_num || 1} • Episode {episode.episode_num}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="bg-black/30 p-2 rounded-full text-white/90 hover:text-white backdrop-blur-sm"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                {/* Center play/pause button */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(true)}
                      className="bg-white/10 backdrop-blur-sm p-5 rounded-full text-white border border-white/20"
                    >
                      <Play size={32} fill="white" />
                    </motion.button>
                  </div>
                )}
                
                {/* Bottom controls */}
                <div className="p-4 space-y-2">
                  {/* Progress bar */}
                  <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#e50914] h-full rounded-full" 
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Play/Pause */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </motion.button>
                      
                      {/* Volume */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white"
                      >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </motion.button>
                      
                      {/* Next episode button */}
                      {onNextEpisode && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onNextEpisode}
                          className="text-white flex items-center"
                        >
                          <SkipForward size={24} />
                          <span className="ml-1 text-sm hidden sm:inline">Next</span>
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Episode title (mobile hidden) */}
                    <div className="hidden sm:block">
                      <p className="text-white/80 text-sm">{episode.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 