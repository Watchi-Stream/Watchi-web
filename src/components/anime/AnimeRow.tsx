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
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="scroll-container">
        {animes.map((anime) => (
          <div key={anime.id} className="flex-shrink-0 w-[180px] md:w-[200px]">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </section>
  );
} 