import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { omit } from 'lodash';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * Gets the user credentials as well as the count of the movies and tv shows he has watched
   *
   * @param {number} id The id of a user
   * @returns A user
   */
  async getUserWithCount(id: number): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.movieCount', 'user.movies')
      .loadRelationCountAndMap('user.tvCount', 'user.tv')
      .where('user.id = :id', { id })
      .getOne();

    return omit(user, 'password');
  }
}
