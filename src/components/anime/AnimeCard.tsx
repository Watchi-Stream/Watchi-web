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
      className="relative rounded-md overflow-hidden netflix-card bg-[#181818] shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{
        scale: 1.05,
        zIndex: 20,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/anime/${anime.id}`} className="block h-full">
        <div className="relative aspect-[2/3] w-full group">
          <Image
            src={anime.cover_image}
            alt={anime.title}
            fill
            className="object-cover rounded-t-md transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 180px, (max-width: 1200px) 240px, 280px"
            priority={false}
          />
          
          {/* Lighter gradient overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200" />
          
          {/* Info overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <h3 className="font-medium text-white text-sm line-clamp-1">{anime.title}</h3>
            
            <div className="flex items-center mt-1 space-x-1">
              {anime.rating && (
                <span className="text-xs font-medium text-green-400">{anime.rating.toFixed(1)}</span>
              )}
              
              {anime.release_year && (
                <span className="text-xs text-white/80">• {anime.release_year}</span>
              )}
            </div>
            
            {/* Simple genre tags */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {anime.genres.slice(0, 2).map((genre) => (
                  <span 
                    key={genre} 
                    className="text-[10px] text-white/90 px-1 py-0.5 rounded bg-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Simple play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-white/90 text-black p-2 rounded-full flex items-center justify-center"
          >
            <Play size={20} fill="currentColor" />
          </motion.div>
        </div>
        
        {/* Simple metadata footer */}
        <div className="px-2 py-1.5 bg-[#181818]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/90 truncate">
              {anime.episodes_count ? `${anime.episodes_count} Episodes` : ''}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 