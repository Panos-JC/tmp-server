import { Controller, Get, Param, Query } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { TrendingService } from './trending.service';

@Controller('trending')
export class TrendingController {
  constructor(private readonly movieService: TrendingService) {}

  @Get()
  findAll(
    @Query('mediaType') mediaType: string,
    @Query('timeWindow') timeWindow: string,
  ): Observable<AxiosResponse> {
    return this.movieService.findAll(mediaType, timeWindow);
  }
}
