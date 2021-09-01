import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'tv' })
export class TvEntity {
  constructor(partial: Partial<TvEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tmdb_id', unique: true })
  tmdbId: string;

  @Column()
  title: string;

  @Column({ name: 'poster_path', nullable: true })
  posterPath: string;

  @ManyToMany(() => UserEntity, (users) => users.tv)
  @JoinTable({
    name: 'user_tv',
    joinColumn: { name: 'tv', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user', referencedColumnName: 'id' },
  })
  user: UserEntity[];

  // created at, updated at
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
