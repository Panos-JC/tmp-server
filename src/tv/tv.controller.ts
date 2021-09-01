import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateTvDto } from './dto/createTv.dto';
import { DeleteTvDto } from './dto/deleteTv.dto';
import { TvEntity } from './tv.entity';
import { TvService } from './tv.service';

@Controller('tv')
export class TvController {
  constructor(private readonly tvService: TvService) {}

  @Post('/see')
  @UseGuards(AuthGuard('jwt'))
  async see(@Req() req: Request, @Body() dto: CreateTvDto): Promise<TvEntity> {
    return await this.tvService.watchTv(req.user['userId'], dto);
  }

  @Post('/unsee')
  @UseGuards(AuthGuard('jwt'))
  async unsee(@Req() req: Request, @Body() dto: DeleteTvDto) {
    return await this.tvService.unwatchTv(req.user['userId'], dto.tmdbId);
  }
}
