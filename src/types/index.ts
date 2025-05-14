export interface Anime {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  genres: string[];
  rating?: number;
  release_year?: number;
  created_at: string;
  updated_at?: string;
}

export interface Episode {
  id: string;
  anime_id: string;
  title: string;
  description?: string;
  episode_num: number;
  season_num?: number;
  video_url: string;
  thumbnail?: string;
  duration?: number;
  created_at: string;
  updated_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  anime_id: string;
  created_at: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  episode_id: string;
  watched_at: string;
  progress: number;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
} 