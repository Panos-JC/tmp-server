import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { TvController } from './tv.controller';
import { TvRepository } from './tv.repository';
import { TvService } from './tv.service';

@Module({
  imports: [TypeOrmModule.forFeature([TvRepository, UserRepository])],
  providers: [TvService],
  controllers: [TvController],
})
export class TvModule {}
