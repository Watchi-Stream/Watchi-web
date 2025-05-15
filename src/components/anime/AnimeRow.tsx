'use client';

import { Anime } from '@/types';
import AnimeCard from './AnimeCard';

interface AnimeRowProps {
  title: string;
  animes: Anime[];
}

export default function AnimeRow({ title, animes }: AnimeRowProps) {
  if (!animes || animes.length === 0) return null;
  
  return (
    <section className="netflix-row relative mb-8 px-4 md:px-8">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      
      <div className="relative">
        {/* Scrollable container */}
        <div className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide">
          {animes.map((anime) => (
            <div 
              key={anime.id} 
              className="flex-shrink-0 w-[200px] md:w-[240px] netflix-card"
            >
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 