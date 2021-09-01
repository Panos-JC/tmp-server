import { UnprocessableEntityException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreateTvDto } from './dto/createTv.dto';
import { TvEntity } from './tv.entity';

@EntityRepository(TvEntity)
export class TvRepository extends Repository<TvEntity> {
  /**
   * Creates a tv show
   *
   * @param {UserEntity} user  The user entity
   * @param {CreateTvDto} dto The necessary movie fields
   * @returns {TvEntity} The saved movie entity
   */
  async createTv(user: UserEntity, dto: CreateTvDto): Promise<TvEntity> {
    const tv = new TvEntity({
      tmdbId: dto.tmdbId,
      title: dto.title,
      posterPath: dto.posterPath,
      user: [user],
    });

    try {
      return await this.save(tv);
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  /**
   * Checks if a tv show is seen by a user
   *
   * @param {string} tmdbId The TMDB id of the movie
   * @param {string} userId User's id
   * @returns {Boolean}
   */
  async seenByUser(tmdbId: string, userId: number): Promise<Boolean> {
    const tv = await this.createQueryBuilder('tv')
      .leftJoinAndSelect('tv.user', 'user')
      .where('tv.tmdbId = :id', { id: tmdbId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    return Boolean(tv);
  }
}
