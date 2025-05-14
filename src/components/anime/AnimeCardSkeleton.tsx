'use client';

import { motion } from 'framer-motion';

export default function AnimeCardSkeleton() {
  return (
    <motion.div 
      className="anime-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="block h-full">
        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-gray-800">
          {/* Animated gradient shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shimmer-effect" />
        </div>
        
        {/* Title skeleton */}
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-700 rounded shimmer-effect w-3/4" />
          
          {/* Genre skeletons */}
          <div className="flex gap-1 mt-2">
            <div className="h-3 bg-gray-700 rounded shimmer-effect w-12" />
            <div className="h-3 bg-gray-700 rounded shimmer-effect w-14" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Create a row of skeleton loaders
export function AnimeRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mb-8">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-700 rounded shimmer-effect w-48 mb-4" />
      
      <div className="scroll-container">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[180px] md:w-[200px]">
            <AnimeCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
} 