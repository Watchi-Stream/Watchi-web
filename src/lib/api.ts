import { supabase } from './supabase';
import { Anime, Episode, WatchHistory } from '../types';

/**
 * Fetches all anime with optional limit and pagination
 */
export async function getAnimes(limit = 10, page = 0) {
  const { data, error } = await supabase
    .from('animes')
    .select('*')
    .range(page * limit, (page + 1) * limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching animes:', error);
    return [];
  }

  return data as Anime[];
}

/**
 * Fetches a single anime by ID
 */
export async function getAnimeById(id: string) {
  const { data, error } = await supabase
    .from('animes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching anime:', error);
    return null;
  }

  return data as Anime;
}

/**
 * Fetches episodes for a specific anime
 */
export async function getEpisodesByAnimeId(animeId: string) {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', animeId)
    .order('episode_num', { ascending: true });

  if (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }

  return data as Episode[];
}

/**
 * Fetches a single episode by ID
 */
export async function getEpisodeById(id: string) {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching episode:', error);
    return null;
  }

  return data as Episode;
}

/**
 * Toggles favorite status for an anime
 */
export async function toggleFavorite(animeId: string, userId: string) {
  // Check if already favorited
  const { data: existingFavorite } = await supabase
    .from('favorites')
    .select('*')
    .eq('anime_id', animeId)
    .eq('user_id', userId)
    .single();

  if (existingFavorite) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
    return false; // Indicating not favorited anymore
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert([{ anime_id: animeId, user_id: userId }]);

    if (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
    return true; // Indicating favorited
  }
}

/**
 * Gets user's favorite animes
 */
export async function getFavoriteAnimes(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, animes(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data.map(fav => fav.animes) as Anime[];
}

/**
 * Updates watch history for an episode
 */
export async function updateWatchHistory(
  userId: string,
  episodeId: string,
  progress: number,
  completed: boolean
) {
  // Check if entry exists
  const { data: existingHistory } = await supabase
    .from('watch_history')
    .select('*')
    .eq('episode_id', episodeId)
    .eq('user_id', userId)
    .single();

  const watchData = {
    user_id: userId,
    episode_id: episodeId,
    progress,
    completed,
    watched_at: new Date().toISOString()
  };

  if (existingHistory) {
    // Update existing record
    const { error } = await supabase
      .from('watch_history')
      .update(watchData)
      .eq('id', existingHistory.id);

    if (error) {
      console.error('Error updating watch history:', error);
      return false;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('watch_history')
      .insert([watchData]);

    if (error) {
      console.error('Error creating watch history:', error);
      return false;
    }
  }

  return true;
}

/**
 * Gets user's watch history
 */
export async function getWatchHistory(userId: string) {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*, episodes(*)')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false });

  if (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }

  return data as WatchHistory[];
} 