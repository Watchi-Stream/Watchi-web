'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useAuth } from '@/components/auth/AuthProvider';
import { updateWatchHistory } from '@/lib/api';
import { Loader2, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  episodeId: string;
}

export default function VideoPlayer({ videoUrl, episodeId }: VideoPlayerProps) {
  const { user } = useAuth();
  const [playerReady, setPlayerReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Update watch history when progress changes significantly or video completes
  useEffect(() => {
    const updateProgressDebounced = setTimeout(() => {
      if (user && episodeId && progress > 0) {
        updateWatchHistory(user.id, episodeId, progress, isCompleted);
      }
    }, 2000);

    return () => clearTimeout(updateProgressDebounced);
  }, [progress, isCompleted, user, episodeId]);

  // Determine if we should use Streamtape embed or ReactPlayer
  const isStreamtapeEmbed = videoUrl.includes('streamtape.com');
  
  // Function to transform Streamtape URL to direct embed URL
  const getStreamtapeEmbedUrl = (url: string) => {
    // Extract video ID from URL - Streamtape URLs typically have formats like:
    // https://streamtape.com/v/XXXXXXXX/video.mp4
    // https://streamtape.com/e/XXXXXXXX/video.mp4
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

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
    
    // Mark as completed if 90% watched
    if (state.played > 0.9 && !isCompleted) {
      setIsCompleted(true);
    }
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playerElement = document.getElementById('video-player-container');
    
    if (!document.fullscreenElement && playerElement) {
      playerElement.requestFullscreen().then(() => {
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
      }).catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  if (isStreamtapeEmbed) {
    // Use the proper embed URL for Streamtape
    const embedUrl = getStreamtapeEmbedUrl(videoUrl);
    
    return (
      <div id="video-player-container" className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition-colors"
          >
            <Maximize size={16} />
          </button>
        </div>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
          title="Video Player"
        />
      </div>
    );
  }

  return (
    <div id="video-player-container" className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
      {!playerReady && (
        <div className="absolute inset-0 flex justify-center items-center bg-[#111]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-2 text-white/80 text-sm">Loading player...</span>
        </div>
      )}
      
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition-colors"
        >
          <Maximize size={16} />
        </button>
      </div>
      
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        playing
        onReady={() => setPlayerReady(true)}
        onProgress={handleProgress}
        onEnded={() => setIsCompleted(true)}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload'
            }
          }
        }}
        className={`absolute top-0 left-0 ${!playerReady ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
} 