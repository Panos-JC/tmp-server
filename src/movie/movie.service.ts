import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { CreateMovieDto } from './dto/createMovie.dto';
import { MovieEntity } from './movie.entity';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieRepository) private movieRepository: MovieRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  /**
   * Marks a movie as seen for a user. If the movie does not exist it is created
   *
   * @param {number} userId User's id
   * @param {CreateMovieDto} dto The necessary movie fields
   * @returns {MovieEntity} The saved movie
   */
  async watchMovie(userId: number, dto: CreateMovieDto): Promise<MovieEntity> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movie = await this.movieRepository.findOne({
      where: { tmdbId: dto.tmdbId },
      relations: ['user'],
    });

    if (!movie) {
      return await this.movieRepository.createMovie(user, dto);
    }

    const seenByUser = await this.movieRepository.seenByUser(
      dto.tmdbId,
      user.id,
    );
    if (seenByUser) {
      throw new BadRequestException('Already seen');
    }
    movie.user.push(user);

    try {
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  /**
   * Unmarks a movie as seen for a user
   *
   * @param {number} userId User's id
   * @param {number} tmdbId Movie TMDB id
   * @returns {MovieEntity} The saved movie entity
   */
  async unwatchMovie(userId: number, tmdbId: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { tmdbId },
      relations: ['user'],
    });

    if (!movie) {
      throw new UnprocessableEntityException('No movie found');
    }

    movie.user = movie.user.filter((user) => user.id !== userId);

    try {
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
