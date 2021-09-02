// NestJS
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrendingModule } from './tmdb/trending/trending.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { entities } from './entities';
import { MovieModule } from './movie/movie.module';
import { TvModule } from './tv/tv.module';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TmdbModule,
    MovieModule,
    TvModule,
    TrendingModule,
    HttpModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
