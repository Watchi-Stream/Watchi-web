'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Anime } from '@/types';

interface HeroBannerProps {
  anime: Anime;
}

export default function HeroBanner({ anime }: HeroBannerProps) {
  return (
    <section className="relative w-full h-[70vh] mb-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={anime.cover_image}
          alt={anime.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Simpler gradient overlays for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-10">
        <div className="max-w-2xl">
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-3 text-white"
          >
            {anime.title}
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg mb-4 text-white/90 line-clamp-2 md:line-clamp-3"
          >
            {anime.description}
          </motion.p>
          
          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Link href={`/anime/${anime.id}/watch`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded flex items-center gap-2 transition-colors duration-300"
              >
                <Play size={18} fill="white" />
                <span>Play</span>
              </motion.button>
            </Link>
            
            <Link href={`/anime/${anime.id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700/50 hover:bg-gray-600/70 text-white font-medium px-6 py-2 rounded flex items-center gap-2 transition-colors duration-300"
              >
                <Info size={18} />
                <span>More Info</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Simple metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center mt-4 text-sm text-white/70 space-x-3"
          >
            {anime.rating && (
              <span className="text-green-400 font-medium">{anime.rating.toFixed(1)}</span>
            )}
            {anime.release_year && (
              <span>{anime.release_year}</span>
            )}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <div className="flex gap-2">
                  {anime.genres.slice(0, 3).map((genre) => (
                    <span key={genre}>{genre}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 