'use client';

import { motion } from 'framer-motion';

export default function HeroBannerSkeleton() {
  return (
    <section className="relative w-full h-[70vh] mb-10 bg-gray-900">
      {/* Gradient overlays for visual effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      
      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-10">
        <div className="max-w-2xl">
          {/* Title skeleton */}
          <motion.div 
            className="h-12 bg-gray-800 rounded-md shimmer-effect w-3/4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          
          {/* Description skeleton */}
          <motion.div 
            className="space-y-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-4 bg-gray-800 rounded shimmer-effect w-full" />
            <div className="h-4 bg-gray-800 rounded shimmer-effect w-5/6" />
            <div className="h-4 bg-gray-800 rounded shimmer-effect w-4/6" />
          </motion.div>
          
          {/* Buttons skeleton */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-3"
          >
            <div className="h-10 bg-gray-800 rounded shimmer-effect w-28" />
            <div className="h-10 bg-gray-800 rounded shimmer-effect w-32" />
            <div className="h-10 bg-gray-800 rounded-full shimmer-effect w-28" />
          </motion.div>

          {/* Details skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center mt-6 space-x-4"
          >
            <div className="h-3 bg-gray-800 rounded shimmer-effect w-16" />
            <div className="h-3 bg-gray-800 rounded shimmer-effect w-10" />
            <div className="h-3 bg-gray-800 rounded shimmer-effect w-14" />
            <div className="h-3 bg-gray-800 rounded shimmer-effect w-12" />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 