import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from '../movie/movie.repository';
import { TvRepository } from '../tv/tv.repository';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MovieRepository, TvRepository]),
  ],
  providers: [TmdbService],
  controllers: [TmdbController],
})
export class TmdbModule {}
