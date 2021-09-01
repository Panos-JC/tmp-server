import { Get, Controller, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: Request): Promise<Omit<UserEntity, 'password'>> {
    return this.userService.me(req.user['userId']);
  }

  @Get('/movies')
  @UseGuards(AuthGuard('jwt'))
  getUserMovies(@Req() req: Request) {
    return this.userService.findUserMovies(req.user['userId']);
  }

  @Get('/tv')
  @UseGuards(AuthGuard('jwt'))
  getUserTv(@Req() req: Request) {
    return this.userService.findUserTv(req.user['userId']);
  }
}
