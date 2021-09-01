import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { Profile } from 'passport-google-oauth20';
import { MovieEntity } from '../movie/movie.entity';
import { TvEntity } from '../tv/tv.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  /**
   * Creates a new user
   *
   * @param {CreateUserDto} dto The user's fields
   * @returns The created user entity without the password field
   */
  async createUser(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const user = new UserEntity({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    try {
      const newUser = await this.usersRepository.save(user);
      return omit(newUser, ['password']);
    } catch (error) {
      throw new UnprocessableEntityException('User was not created');
    }
  }

  /**
   * Gets a user by email
   *
   * @param {string} email The email address of a user
   * @returns A user
   */
  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Gets a user by username
   *
   * @param {string} username The username of a user
   * @returns A user
   */
  async findUserByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * Gets a user by id
   *
   * @param {number} id The id of a user
   * @returns A user
   */
  async findUserById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  /**
   * Gets the user credentials as well as the count of the movies and tv shows he has watched
   *
   * @param {number} id The id of a user
   * @returns A user
   */
  async me(id: number): Promise<Omit<UserEntity, 'password'>> {
    return await this.usersRepository.getUserWithCount(id);
  }

  /**
   * Gets the movies seen by a user
   *
   * @param {number} id The id of a user
   * @returns A list of movies
   */
  async findUserMovies(id: number): Promise<MovieEntity[]> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    return user.movies;
  }

  /**
   * Gets the tc shows seen by a user
   *
   * @param {number} id The id of a user id
   * @returns A list of tv shows
   */
  async findUserTv(id: number): Promise<TvEntity[]> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tv'],
    });

    return user.tv;
  }
}
