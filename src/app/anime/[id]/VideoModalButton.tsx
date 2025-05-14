'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Episode } from '@/types';
import VideoModal from '@/components/ui/VideoModal';

interface VideoModalButtonProps {
  episode: Episode;
  buttonText?: string;
}

export default function VideoModalButton({ episode, buttonText = 'Play' }: VideoModalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-6 py-2 rounded bg-[#e50914] hover:bg-[#f40612] text-white font-medium"
      >
        <Play size={20} fill="white" />
        <span>{buttonText}</span>
      </button>

      <VideoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        episode={episode}
      />
    </>
  );
} 