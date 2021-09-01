import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  getHello(@Req() req: Request): string {
    console.log(req.user);
    return this.appService.getHello();
  }
}
