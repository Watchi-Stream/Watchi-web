'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Anime } from '@/types';

interface HeroBannerProps {
  anime: Anime;
}

export default function HeroBanner({ anime }: HeroBannerProps) {
  return (
    <section className="relative w-full h-[70vh] mb-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={anime.cover_image}
          alt={anime.title}
          fill
          className="object-cover"
          priority
        />
        {/* Enhanced Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-10">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg"
          >
            {anime.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg mb-6 text-white/90 line-clamp-2 md:line-clamp-3 drop-shadow-md"
          >
            {anime.description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-3"
          >
            <Link href={`/anime/${anime.id}/watch`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#e50914] hover:bg-[#f40612] text-white font-medium px-6 py-2 rounded flex items-center space-x-2"
              >
                <Play size={18} fill="white" />
                <span>Watch</span>
              </motion.button>
            </Link>
            
            <Link href={`/anime/${anime.id}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600/60 hover:bg-gray-500/80 text-white font-medium px-6 py-2 rounded flex items-center space-x-2"
              >
                <Info size={18} />
                <span>More Info</span>
              </motion.button>
            </Link>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-white/50 hover:border-white text-white font-medium px-4 py-2 rounded-full flex items-center justify-center"
            >
              <Plus size={18} />
              <span className="ml-1">My List</span>
            </motion.button>
          </motion.div>

          {/* Anime details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center mt-6 text-sm text-white/70 space-x-4"
          >
            {anime.rating && (
              <div className="flex items-center">
                <span className="text-[#e50914] font-semibold mr-1">{anime.rating.toFixed(1)}</span>
                <span>Rating</span>
              </div>
            )}
            {anime.release_year && (
              <span>{anime.release_year}</span>
            )}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 3).map((genre) => (
                  <span 
                    key={genre} 
                    className="text-white/80"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 