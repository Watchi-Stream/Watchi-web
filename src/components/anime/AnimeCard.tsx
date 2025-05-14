'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Anime } from '@/types';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <motion.div 
      className="relative rounded-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
    >
      <Link href={`/anime/${anime.id}`} className="block h-full">
        <div className="relative aspect-[2/3] w-full group">
          <Image
            src={anime.cover_image}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          
          {/* Shadow overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content overlay on hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-semibold text-white line-clamp-1">{anime.title}</h3>
            
            <div className="flex items-center mt-2 space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-black p-1 rounded-full flex items-center justify-center"
              >
                <Play size={16} fill="currentColor" />
              </motion.button>
              
              {anime.rating && (
                <span className="text-xs font-semibold text-green-500">{anime.rating.toFixed(1)}</span>
              )}
              
              {anime.release_year && (
                <span className="text-xs text-white/80">{anime.release_year}</span>
              )}
            </div>
            
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {anime.genres.slice(0, 2).map((genre) => (
                  <span 
                    key={genre} 
                    className="text-[10px] text-white/80 px-1.5 py-0.5 rounded bg-white/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 