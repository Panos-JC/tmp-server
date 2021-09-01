import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Credits,
  Movie,
  MovieSearch,
  Person,
  PersonCredits,
  Tv,
  TvSearch,
} from './tmdb.interface';
import { MovieRepository } from '../movie/movie.repository';
import { TvRepository } from '../tv/tv.repository';
import { TvCredits } from './tv/tv.interface';

type MediaSearch = MovieSearch | TvSearch;

@Injectable()
export class TmdbService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(MovieRepository) private movieRepository: MovieRepository,
    @InjectRepository(TvRepository) private tvRepository: TvRepository,
  ) {}

  /**
   * Calls the TMDB api and returns a list of movies
   *
   * @param {string} type The type of the list of movies (popular, top rated, etc.)
   * @param {number} page The number of the page of the results
   * @returns {Movie[]} A list of movies
   */
  async findMovies(type: string, page: number): Promise<Movie[]> {
    const URL = `${process.env.TMDB_API_URL}/movie/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;

    const movieData = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const movies: Movie[] = movieData.results.map((data: Movie) => {
      return { ...data, seen: false };
    });

    return Promise.all(movies);
  }

  /**
   * Calls the TMDB api and returns a list of movies. For every movie it checks if it is seen by a user
   *
   * @param {string} type The type of the list of movies (popular, top rated, etc.)
   * @param {number} page The number of the page of the results
   * @param {number} userId A user's id
   * @returns {Movie[]} A list of movies
   */
  async findMoviesAuth(
    type: string,
    page: number,
    userId: number,
  ): Promise<Movie[]> {
    const URL = `${process.env.TMDB_API_URL}/movie/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;

    const movieData = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const movies: Movie[] = movieData.results.map(async (data: Movie) => {
      const seen = await this.movieRepository.seenByUser(
        data.id.toString(),
        userId,
      );

      return { ...data, seen };
    });

    return Promise.all(movies);
  }

  /**
   * Retrieves the information of a movie from TMDB api
   *
   * @param {number} id The TMDB id of a movie
   * @returns {Movie} A movie object
   */
  findOneMovie(id: string): Promise<Movie> {
    const URL = `${process.env.TMDB_API_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}`;

    const movie = this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    return movie;
  }

  /**
   * Retrieves the credits of a movie from TMDB api
   *
   * @param {number} id The TMDB id of a movie
   * @returns {Credits} The credits of a movie
   */
  findMovieCredits(id: string): Promise<Credits> {
    const URL = `${process.env.TMDB_API_URL}/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`;

    const movieCredits = this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    return movieCredits;
  }

  /**
   * Calls the TMDB api and returns a list of tv shows
   *
   * @param {string} type The type of the list of tv shows (popular, top rated, etc.)
   * @param {number} page The number of the page of the results
   * @returns {Tv[]} A list of tv shows
   */
  async findAllTv(type: string, page: number): Promise<Tv[]> {
    const URL = `${process.env.TMDB_API_URL}/tv/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const tvShows = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const tv: Tv[] = tvShows.results.map((data: Tv) => {
      return { ...data, seen: false };
    });

    return tv;
  }

  /**
   * Calls the TMDB api and returns a list of tv shows. For every tv show, it checks if it is seen by a user
   *
   * @param {string} type The type of the list of tv shows (popular, top rated, etc.)
   * @param {number} page The number of the page of the results
   * @param {number} userId A user's id
   * @returns {Tv[]} A list of tv shows
   */
  async findAllTvAuth(
    type: string,
    page: number,
    userId: number,
  ): Promise<Tv[]> {
    const URL = `${process.env.TMDB_API_URL}/tv/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const tvShows = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const tv: Tv[] = tvShows.results.map(async (data: Tv) => {
      const seen = await this.tvRepository.seenByUser(
        data.id.toString(),
        userId,
      );

      return { ...data, seen };
    });

    return Promise.all(tv);
  }

  /**
   * Calls the TMDB api and returns a tv show.
   *
   * @param {string} id The TMDB id of a tv show
   * @returns {Tv} The TV object
   */
  findOneTv(id: string): Promise<Tv> {
    const URL = `${process.env.TMDB_API_URL}/tv/${id}?api_key=${process.env.TMDB_API_KEY}`;

    return this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();
  }

  /**
   * Calls the TMDB api and returns the credist of a tv show
   *
   * @param {string} id The TMDB id of a tv show
   * @returns {TvCredits} The credits of the tv show
   */
  findTvCredits(id: string): Promise<TvCredits> {
    const URL = `${process.env.TMDB_API_URL}/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}`;

    return this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();
  }

  /**
   * Calls the TMDB api and returns a person.
   *
   * @param {string} id The TMDB id of a person
   * @returns {Person} The person details
   */
  findOnePerson(id: string): Promise<Person> {
    const URL = `${process.env.TMDB_API_URL}/person/${id}?api_key=${process.env.TMDB_API_KEY}`;

    return this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();
  }

  /**
   * Calls the TMDB api and returns a person's credits.
   *
   * @param {string} id The TMDB id of a person
   * @returns {PersonCredits} The person credits
   */
  findPersonCredits(id: string): Promise<PersonCredits> {
    const URL = `${process.env.TMDB_API_URL}/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}`;

    return this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();
  }

  /**
   * Retrieves search results from TMDB
   *
   * @param {string} query
   * @returns An array of media objects (movies, tv shows, people)
   */
  async search(query: string): Promise<MediaSearch> {
    const URL = `${process.env.TMDB_API_URL}/search/multi?query=${query}&page=1&include_adult=false&api_key=${process.env.TMDB_API_KEY}`;

    const searchData = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const enhancedSearchData = searchData.results
      .filter((item: MediaSearch) => item.media_type !== 'person')
      .map((searchItem: MediaSearch) => {
        return { ...searchItem, seen: false };
      });

    return enhancedSearchData;
  }

  /**
   * Retrieves search results from TMDB for an authenticated user
   *
   * @param {string} query The search query
   * @param {number} userId A user's id
   * @returns {MediaSearch} A list of movies or tv shows
   */
  async searchAuth(query: string, userId: number): Promise<MediaSearch[]> {
    const URL = `${process.env.TMDB_API_URL}/search/multi?query=${query}&page=1&include_adult=false&api_key=${process.env.TMDB_API_KEY}`;

    const searchData = await this.httpService
      .get(URL)
      .pipe(map((response) => response.data))
      .toPromise();

    const enhancedSearchData: MediaSearch[] = searchData.results
      .filter((item: MediaSearch) => item.media_type !== 'person')
      .map(async (searchItem: MediaSearch) => {
        if (searchItem.media_type === 'movie') {
          const seen = await this.movieRepository.seenByUser(
            searchItem.id.toString(),
            userId,
          );

          return { ...searchItem, seen };
        }

        if (searchItem.media_type === 'tv') {
          const seen = await this.tvRepository.seenByUser(
            searchItem.id.toString(),
            userId,
          );

          return { ...searchItem, seen };
        }

        return { ...searchItem, seen: false };
      });

    return Promise.all(enhancedSearchData);
  }
}
