import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    let user: UserEntity;

    user = await this.userService.findUserByUsername(registerDto.username);
    if (user) {
      throw new BadRequestException('Username already exists');
    }

    user = await this.userService.findUserByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = await this.userService.createUser(registerDto);
    const token = this.generateToken(newUser.id, newUser.email);

    return { ...newUser, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const token = this.generateToken(user.id, user.email);
    return { ...user, token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      throw new BadRequestException('Incrrect password');
    }

    return omit(user, 'password');
  }

  generateToken(userId: number, email: string) {
    return this.jwtService.sign({ userId, email });
  }
}
