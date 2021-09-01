import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MovieEntity } from '../movie/movie.entity';
import { TvEntity } from '../tv/tv.entity';

@Entity({ name: 'user' })
export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => MovieEntity, (movies) => movies.user)
  movies: MovieEntity[];

  @ManyToMany(() => TvEntity, (tv) => tv.user)
  tv: TvEntity[];

  // created at, updated at
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @BeforeUpdate()
  @BeforeInsert()
  async hasshPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
