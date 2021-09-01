import { UnprocessableEntityException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreateMovieDto } from './dto/createMovie.dto';
import { MovieEntity } from './movie.entity';

@EntityRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity> {
  /**
   * Creates a movie
   *
   * @param {UserEntity} user The user entity
   * @param {CreateMovieDto} dto The necessary movie fields
   * @returns {MovieEntity} The saved movie entity
   */
  async createMovie(
    user: UserEntity,
    dto: CreateMovieDto,
  ): Promise<MovieEntity> {
    const movie = new MovieEntity({
      tmdbId: dto.tmdbId,
      title: dto.title,
      posterPath: dto.posterPath,
      user: [user],
    });

    try {
      return await this.save(movie);
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  /**
   * Checks if a movie is seen by a user
   *
   * @param {string} tmdbId The TMDB id of the movie
   * @param {string} userId User's id
   * @returns {Boolean}
   */
  async seenByUser(tmdbId: string, userId: number): Promise<Boolean> {
    const movie = await this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.user', 'user')
      .where('movie.tmdbId = :id', { id: tmdbId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return Boolean(movie);
  }
}
