import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { CreateTvDto } from './dto/createTv.dto';
import { TvEntity } from './tv.entity';
import { TvRepository } from './tv.repository';

@Injectable()
export class TvService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(TvRepository) private tvRepository: TvRepository,
  ) {}

  /**
   * Marks a tv show as seen for a user. If the tv show does not exist it is created
   *
   * @param {number} userId User's id
   * @param {CreateTvDto} dto The necessary tv fields
   * @returns {TvEntity} The saved tv show
   */
  async watchTv(userId: number, dto: CreateTvDto): Promise<TvEntity> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tv = await this.tvRepository.findOne({
      where: { tmdbId: dto.tmdbId },
      relations: ['user'],
    });

    if (!tv) {
      return await this.tvRepository.createTv(user, dto);
    }

    const seenByUser = await this.tvRepository.seenByUser(dto.tmdbId, user.id);

    if (seenByUser) {
      throw new BadRequestException('Already seen');
    }

    tv.user.push(user);

    try {
      return await this.tvRepository.save(tv);
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  /**
   * Unmarks a tv show as seen for a user
   *
   * @param {number} userId User's id
   * @param {number} tmdbId Tv TMDB id
   * @returns {TvEntity} The saved tv entity
   */
  async unwatchTv(userId: number, tmdbId: string): Promise<TvEntity> {
    const tv = await this.tvRepository.findOne({
      where: { tmdbId },
      relations: ['user'],
    });

    if (!tv) {
      throw new UnprocessableEntityException('No tv show found');
    }

    tv.user = tv.user.filter((user) => user.id !== userId);

    try {
      return await this.tvRepository.save(tv);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
