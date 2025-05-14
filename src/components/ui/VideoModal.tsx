'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { Episode } from '@/types';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  onNextEpisode?: () => void;
}

export default function VideoModal({ 
  isOpen, 
  onClose, 
  episode,
  onNextEpisode
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [formattedTime, setFormattedTime] = useState('0:00 / 0:00');

  // Function to transform Streamtape URL to direct embed URL
  const getStreamtapeEmbedUrl = (url: string) => {
    // Extract video ID from URL
    let videoId = '';
    
    if (url.includes('/v/')) {
      videoId = url.split('/v/')[1].split('/')[0];
    } else if (url.includes('/e/')) {
      videoId = url.split('/e/')[1].split('/')[0];
    } else {
      // Try to extract ID from any format
      const matches = url.match(/\/(v|e|play)\/([a-zA-Z0-9]+)/);
      if (matches && matches[2]) {
        videoId = matches[2];
      }
    }
    
    // If we found a video ID, return the proper embed URL
    if (videoId) {
      return `https://streamtape.com/e/${videoId}`;
    }
    
    // Fallback to original URL if we couldn't parse it
    return url;
  };

  // Get the proper video URL (with embed URL for Streamtape)
  const getVideoUrl = () => {
    if (!episode?.video_url) return '';
    
    if (episode.video_url.includes('streamtape.com')) {
      return getStreamtapeEmbedUrl(episode.video_url);
    }
    
    return episode.video_url;
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

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
  }, [showControls]);

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Update time display
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setProgress(state.played);
    
    if (episode?.duration) {
      const currentSeconds = Math.floor(state.playedSeconds);
      const totalSeconds = episode.duration;
      
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
      
      setFormattedTime(`${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  if (!isOpen || !episode) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="video-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
        onMouseMove={handleMouseMove}
      >
        {/* Video player */}
        <div className="relative flex-grow flex items-center justify-center bg-black">
          <ReactPlayer
            url={getVideoUrl()}
            width="100%"
            height="100%"
            playing={isPlaying}
            muted={isMuted}
            onProgress={handleProgress}
            onEnded={() => {
              if (onNextEpisode) {
                onNextEpisode();
              } else {
                setIsPlaying(false);
              }
            }}
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
                transition={{ duration: 0.2 }}
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
                  <div className="relative w-full group">
                    <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden group-hover:h-2 transition-all">
                      <div 
                        className="bg-[#e50914] h-full rounded-full" 
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <div className="invisible group-hover:visible absolute -bottom-5 left-0 text-xs text-white/70">
                      {formattedTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
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
                    
                    <div className="flex items-center space-x-3">
                      {/* Fullscreen button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFullscreen}
                        className="text-white"
                      >
                        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                      </motion.button>
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