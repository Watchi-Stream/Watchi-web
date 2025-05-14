import { Anime } from '@/types';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
  title?: string;
}

export default function AnimeGrid({ animes, title }: AnimeGridProps) {
  if (animes.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">{title || 'No anime found'}</h2>
        <p className="text-gray-600">No anime titles are available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
} 