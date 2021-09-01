export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  // Extra fields
  seen: boolean;
}

export interface Tv {
  poster_path: string | null;
  popularity: number;
  id: number;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
  seen: boolean;
}

export interface Credits {
  id: number;
  cast: [];
  crew: [];
}

export interface Person {
  birthday: string | null;
  known_for_department: string;
  deathday: null | string;
  id: number;
  name: string;
  also_known_as: string[];
  gender: number;
  biography: string;
  popularity: number;
  place_of_birth: string | null;
  profile_path: string | null;
  adult: boolean;
  imdb_id: string;
  homepage: string | null;
}

interface Cast {
  id: number;
  original_language: string;
  episode_count: number;
  overview: string;
  origin_country: string[];
  original_name: string;
  genre_ids: number[];
  name: string;
  media_type: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  character: string;
  backdrop_path: string | null;
  popularity: number;
  credit_id: string;
  original_title: string;
  video: boolean;
  release_date: string;
  title: string;
  adult: boolean;
}

interface Crew {
  id: number;
  department: string;
  original_language: string;
  episode_count: number;
  job: string;
  overview: string;
  original_name: string[];
  vote_count: number;
  name: string;
  media_type: string;
  popularity: number;
  credit_id: string;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
  original_title: string;
  video: boolean;
  title: string;
  adult: boolean;
  release_date: string;
}

export interface PersonCredits {
  id: number;
  cast: Partial<Cast>[];
  crew: Partial<Crew>[];
}

export interface MovieSearch {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  seen: boolean;
}

export interface TvSearch {
  poster_path: string | null;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  media_type: string;
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}
