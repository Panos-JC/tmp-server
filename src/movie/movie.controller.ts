import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/OptionalJwtAuthGuard';
import { CreateMovieDto } from './dto/createMovie.dto';
import { DeleteMovieDto } from './dto/deleteMovieDto';
import { MovieEntity } from './movie.entity';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('/see')
  @UseGuards(AuthGuard('jwt'))
  async see(
    @Req() req: Request,
    @Body() dto: CreateMovieDto,
  ): Promise<MovieEntity> {
    return await this.movieService.watchMovie(req.user['userId'], dto);
  }

  @Post('/unsee')
  @UseGuards(AuthGuard('jwt'))
  async unsee(@Req() req: Request, @Body() dto: DeleteMovieDto) {
    return await this.movieService.unwatchMovie(req.user['userId'], dto.tmdbId);
  }
}
