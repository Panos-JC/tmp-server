import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthData } from './auth.interface';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ user: AuthData }> {
    const user = await this.authService.register(registerDto);

    return { user };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ user: AuthData }> {
    const user = await this.authService.login(loginDto);

    return { user };
  }
}
