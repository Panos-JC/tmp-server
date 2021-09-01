import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/OptionalJwtAuthGuard';
import { Movie, Person, PersonCredits, Tv } from './tmdb.interface';
import { TmdbService } from './tmdb.service';
import { TvCredits } from './tv/tv.interface';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('movies')
  @UseGuards(OptionalJwtAuthGuard)
  findMovies(
    @Req() req: Request,
    @Query('type') type: string,
    @Query('page') page: number,
  ): Promise<Movie[]> {
    if (req.user) {
      return this.tmdbService.findMoviesAuth(type, page, req.user['userId']);
    }
    return this.tmdbService.findMovies(type, page);
  }

  @Get('movies/:id')
  findOneMovie(@Param('id') id: string) {
    return this.tmdbService.findOneMovie(id);
  }

  @Get('movies/:id/credits')
  findMovieCredits(@Param('id') id: string) {
    return this.tmdbService.findMovieCredits(id);
  }

  @Get('tv')
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Req() req: Request,
    @Query('type') type: string,
    @Query('page') page: number,
  ): Promise<Tv[]> {
    if (req.user) {
      return this.tmdbService.findAllTvAuth(type, page, req.user['userId']);
    }
    return this.tmdbService.findAllTv(type, page);
  }

  @Get('tv/:id')
  findOneTv(@Param('id') id: string): Promise<Tv> {
    return this.tmdbService.findOneTv(id);
  }

  @Get('tv/:id/credits')
  findTvCredits(@Param('id') id: string): Promise<TvCredits> {
    return this.tmdbService.findTvCredits(id);
  }

  @Get('person/:id')
  findOnePerson(@Param('id') id: string): Promise<Person> {
    return this.tmdbService.findOnePerson(id);
  }

  @Get('person/:id/credits')
  findPersonCredits(@Param('id') id: string): Promise<PersonCredits> {
    return this.tmdbService.findPersonCredits(id);
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  async search(@Req() req: Request, @Query('query') query: string) {
    if (req.user) {
      console.log(req.user);
      return await this.tmdbService.searchAuth(query, req.user['userId']);
    }

    return await this.tmdbService.search(query);
  }
}
